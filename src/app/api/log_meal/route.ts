import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import Groq from 'groq-sdk';

const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.error('SERVICE_ACCOUNT_KEY environment variable is not set');
  throw new Error('SERVICE_ACCOUNT_KEY environment variable is not set');
}

if (!getApps().length) {
  try {
    const parsedServiceAccount = JSON.parse(serviceAccountKey);
    
    if (!parsedServiceAccount.project_id || !parsedServiceAccount.private_key || !parsedServiceAccount.client_email) {
      console.error('Invalid SERVICE_ACCOUNT_KEY format: missing required fields');
      throw new Error('Invalid SERVICE_ACCOUNT_KEY format: missing required fields');
    }

    initializeApp({
      credential: cert(parsedServiceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
}

const db = getFirestore();

const schema = {
  type: "object",
  properties: {
    meal_name: { type: "string" },
    calories: { type: "number" },
    nutrients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          amount: { type: "number" },
          unit: { type: "string" }
        },
        required: ["name", "amount", "unit"]
      }
    },
    insights: { type: "string" },
    quantity: { type: "string" }
  },
  required: ["meal_name", "calories", "nutrients", "insights", "quantity"]
};

export async function POST(req: NextRequest) {
  const { input_text, loggedBy } = await req.json();
  console.log("Received request in log_meal:", { input_text, loggedBy });

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.error("Authorization header missing");
    return NextResponse.json({ status: 'error', message: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log("Authenticated user:", userId);

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error("GROQ_API_KEY environment variable is not set");
      return NextResponse.json({ status: 'error', message: 'GROQ_API_KEY environment variable is not set' }, { status: 500 });
    }

    const groq = new Groq({
      apiKey: groqApiKey,
    });

    let chatCompletion;
    try {
      chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a meal logging assistant that outputs meal details in JSON.\nThe JSON object must use the schema: ${JSON.stringify(schema, null, 4)}`,
          },
          {
            role: "user",
            content: `Parse the following meal input and provide nutritional information in JSON format: ${input_text}`,
          },
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 0,
        response_format: { type: "json_object" },
      });
    } catch (error) {
      console.error("Error calling Groq API:", error);
      return NextResponse.json({ status: 'error', message: 'Failed to call Groq API' }, { status: 500 });
    }

    console.log("Groq API raw response:", chatCompletion.choices[0]?.message?.content);
    let mealDetails;
    try {
      mealDetails = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error("Error parsing Groq API response:", error);
      return NextResponse.json({ status: 'error', message: 'Failed to parse Groq API response' }, { status: 500 });
    }
    console.log("Parsed Groq API response:", mealDetails);

    if (mealDetails && Object.keys(mealDetails).length > 0) {
      const loggedAt = new Date().toISOString();
      const userDocRef = db.collection('users').doc(userId).collection('meals').doc();
      const dataToStore = {
        input_text,
        loggedBy,
        loggedAt,
        quantity: mealDetails.quantity,
        insights: mealDetails.insights,
        mealDetails: {
          meal_name: mealDetails.meal_name,
          calories: mealDetails.calories,
          nutrients: mealDetails.nutrients,
          insights: mealDetails.insights,
        }
      };
      console.log("Data being stored in Firestore:", dataToStore);
      try {
        await userDocRef.set(dataToStore);
        console.log("Meal details saved to Firestore");
      } catch (error) {
        console.error("Error saving meal details to Firestore:", error);
        return NextResponse.json({ status: 'error', message: 'Failed to save meal details to database' }, { status: 500 });
      }
      return NextResponse.json({ status: 'success', meal_details: mealDetails, mealId: userDocRef.id });
    } else {
      console.error("Unexpected or empty response structure:", chatCompletion);
      return NextResponse.json({ status: 'error', message: 'Unexpected or empty response structure' }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error in log_meal:", error);
    return NextResponse.json({ status: 'error', message: 'Failed to log meal.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}