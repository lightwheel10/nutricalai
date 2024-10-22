import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabaseClient';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { audioPath } = await req.json();

  if (!audioPath) {
    return NextResponse.json({ status: 'error', message: 'No audio path provided' }, { status: 400 });
  }

  try {
    console.log("Attempting to download file from Supabase:", audioPath);
    const { data, error } = await supabase.storage
      .from('meal-audio')
      .download(audioPath);

    if (error) {
      console.error("Error downloading file from Supabase:", error);
      throw error;
    }

    if (!data) {
      console.error("No data received from Supabase");
      throw new Error("No data received from Supabase");
    }

    console.log("File downloaded successfully. Size:", data.size);

    const buffer = await data.arrayBuffer();
    console.log("Buffer created. Size:", buffer.byteLength);

    console.log("Attempting to transcribe audio with Groq API");
    const transcription = await groq.audio.transcriptions.create({
      file: new File([buffer], 'audio.webm', { type: 'audio/webm' }),
      model: "whisper-large-v3-turbo",
      response_format: "json",
      prompt: "Transcribe the audio of a person describing their meal",
      temperature: 0.0,
    });

    console.log("Transcription result:", transcription);

    if (!transcription.text || transcription.text.trim() === '') {
      throw new Error("Transcription failed: Empty or invalid result");
    }

    const transcribedText = transcription.text;

    // Use the landing_ai route to analyze the transcribed text
    const landingAiResponse = await fetch(new URL('/api/landing_ai', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_text: transcribedText }),
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
