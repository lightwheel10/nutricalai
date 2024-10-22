import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return NextResponse.json({ status: 'error', message: 'No audio file provided' }, { status: 400 });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    // Transcribe audio using Groq API
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      response_format: "text",
    });

    // Use the landing_ai route to analyze the transcribed text
    const landingAiResponse = await fetch(new URL('/api/landing_ai', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_text: transcription.text }),
    });

    const landingAiData = await landingAiResponse.json();

    if (landingAiData.status === 'success') {
      return NextResponse.json(landingAiData);
    } else {
      return NextResponse.json({ status: 'error', message: landingAiData.message }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error in process-audio:", error);
    return NextResponse.json({ status: 'error', message: 'Failed to process audio.' }, { status: 500 });
  }
}

