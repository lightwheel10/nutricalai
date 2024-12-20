import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

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
  console.log("POST request received in landing_ai route");
  const { input_text, input_audio, session_id } = await req.json();
  console.log("Received request in landing_ai:", { 
    input_text, 
    input_audio: input_audio ? 'Audio data received' : 'No audio data',
    session_id 
  });

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    console.error("GROQ_API_KEY environment variable is not set");
    return NextResponse.json({ status: 'error', message: 'GROQ_API_KEY environment variable is not set' }, { status: 500 });
  }

  const groq = new Groq({
    apiKey: groqApiKey,
  });

  try {
    const userContent = input_text;

    console.log("User content before processing:", userContent);

    if (!userContent) {
      console.error("No input text provided");
      return NextResponse.json({ status: 'error', message: 'No input text provided' }, { status: 400 });
    }

    if (input_audio) {
      console.warn("Audio input detected but not processed in this route");
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a meal logging assistant that outputs meal details in JSON. The JSON object must strictly adhere to the following schema, with no additional properties:
          ${JSON.stringify(schema, null, 2)}
          Ensure that the 'nutrients' array includes entries for protein, carbs, and fat, as these are used to generate a pie chart. Additionally, always include micronutrients (such as fiber, vitamin C, iron,calcium etc) in the nutrients array, even if you have to estimate their values based on typical content for the given meal.`,
        },
        {
          role: "user",
          content: `Parse the following meal input and provide nutritional information in JSON format, strictly adhering to the given schema: ${userContent}`,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" },
    });

    console.log("Groq API raw response:", chatCompletion.choices[0]?.message?.content);
    const mealDetails = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    console.log("Parsed Groq API response:", mealDetails);

    if (mealDetails && Object.keys(mealDetails).length > 0) {
      return NextResponse.json({ status: 'success', meal_details: mealDetails });
    } else {
      console.error("Unexpected or empty response structure:", chatCompletion);
      return NextResponse.json({ status: 'error', message: 'Unexpected or empty response structure' }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error in landing_ai:", error);
    return NextResponse.json({ status: 'error', message: 'Failed to process meal input.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
