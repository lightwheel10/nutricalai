import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log('Supabase client initialized');

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
    console.log("Verifying Supabase token...");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ status: 'error', message: 'Invalid token' }, { status: 401 });
    }
    
    const userId = user.id;
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
      const dataToStore = {
        user_id: userId,
        input_text,
        logged_by: loggedBy,
        logged_at: loggedAt, // Ensure this is always set
        quantity: mealDetails.quantity,
        meal_details: {
          meal_name: mealDetails.meal_name,
          calories: mealDetails.calories,
          nutrients: mealDetails.nutrients,
          insights: mealDetails.insights,
          quantity: mealDetails.quantity,
          mealType: mealDetails.mealType || 'unspecified'
        }
      };
      console.log("Data being stored in Supabase:", dataToStore);
      try {
        const { data, error } = await supabase
          .from('meals')
          .insert(dataToStore)
          .select();
        
        if (error) throw error;
        console.log("Meal details saved to Supabase");
        return NextResponse.json({ status: 'success', meal_details: dataToStore.meal_details, mealId: data[0].id });
      } catch (error) {
        console.error("Error saving meal details to Supabase:", error);
        return NextResponse.json({ status: 'error', message: 'Failed to save meal details to database' }, { status: 500 });
      }
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