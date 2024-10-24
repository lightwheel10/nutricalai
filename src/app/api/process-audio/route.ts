import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabaseClient';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { audioPath, session_id } = await req.json();

    if (!audioPath) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'No audio path provided' 
      }, { status: 400 });
    }

    // Store audio processing record
    const { error: logError } = await supabase
      .from('meal_voice_logs')
      .insert({
        session_id,
        audio_path: audioPath,
        status: 'processing',
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.error("Error logging voice input:", logError);
      throw logError;
    }

    const { data, error } = await supabase.storage
      .from('meal-audio')
      .download(audioPath);

    if (error || !data) {
      console.error("Error downloading audio:", error);
      throw error || new Error('No data received');
    }

    const buffer = await data.arrayBuffer();
    const transcription = await groq.audio.transcriptions.create({
      file: new File([buffer], 'audio.webm', { type: 'audio/webm' }),
      model: "whisper-large-v3-turbo",
      response_format: "json",
      prompt: "Transcribe the audio of a person describing their meal",
      temperature: 0.0,
    });

    if (!transcription.text) {
      throw new Error('Transcription failed');
    }

    const aiResponse = await fetch(new URL('/api/landing_ai', req.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input_text: transcription.text,
        session_id
      })
    });

    const aiData = await aiResponse.json();

    // Update log with results
    await supabase
      .from('meal_voice_logs')
      .update({
        transcription: transcription.text,
        meal_details: aiData.meal_details,
        status: aiData.status === 'success' ? 'completed' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', session_id);

    return NextResponse.json(aiData);

  } catch (error) {
    console.error("Process audio error:", error);
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Failed to process audio' 
    }, { status: 500 });
  }
}
