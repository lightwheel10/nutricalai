import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import Groq from 'groq-sdk';

let db: Firestore | undefined;

console.log('Starting Firebase initialization...');

if (process.env.SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase app initialized successfully');
    } else {
      console.log('Firebase app already initialized');
    }
    db = getFirestore();
    console.log('Firestore instance created');
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
} else {
  console.warn('SERVICE_ACCOUNT_KEY not set. Firebase Admin SDK not initialized.');
}

console.log('Firebase initialization process completed');

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
  console.log("POST request received in log_meal route");
  const { input_text, loggedBy } = await req.json();
  console.log("Received request in log_meal:", { input_text, loggedBy });

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.error("Authorization header missing");
    return NextResponse.json({ status: 'error', message: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!db) {
      console.error('Firestore instance not available');
      throw new Error('Firebase Admin SDK not initialized');
    }

    console.log("Verifying Firebase ID token...");
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