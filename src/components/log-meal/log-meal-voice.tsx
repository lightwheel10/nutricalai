// This component allows users to log meals using voice input.
// It uses the Web Speech API for speech recognition and sends the transcribed text to an API for meal analysis.
// The component is designed for both technical and non-technical users.

// For non-technical readers:
// This code creates a function that processes audio of your meal description.
// You can speak about the meal you've had, and the system will try to understand and log it.
// The process involves:
// 1. Converting your speech to text
// 2. Extracting relevant meal information from the text
// 3. Sending this information to a smart system that understands meal details
// 4. Logging the meal details in your account
// This makes it easier and quicker to keep track of your meals without typing!

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Mic } from 'lucide-react';
import { getUploadUrl } from '@/lib/supabase';

interface LogMealVoiceProps {
  onLogMeal: (mealDetails: { meal_name: string; calories: number; nutrients: { name: string; amount: number; unit: string }[]; insights: string; quantity: string; mealType: string }) => void;
  onError: (error: string) => void;
  audioBlob?: Blob;
}

export function LogMealVoice({ onLogMeal, onError, audioBlob: initialAudioBlob }: LogMealVoiceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(initialAudioBlob || null);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    try {
      console.log("Starting audio processing");
      const { data: urlData, error: urlError } = await getUploadUrl();
      if (urlError) {
        console.error("Error getting upload URL:", urlError);
        throw urlError;
      }

      console.log("Uploading audio to signed URL");
      const uploadResponse = await fetch(urlData.signedUrl, {
        method: 'PUT',
        body: audioBlob,
        headers: { 'Content-Type': 'audio/webm' },
      });

      if (!uploadResponse.ok) {
        console.error("Upload response not OK:", uploadResponse.status, uploadResponse.statusText);
        throw new Error('Failed to upload audio');
      }

      console.log("Audio uploaded successfully. Processing audio...");
      const response = await fetch('/api/process-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioPath: urlData.path }),
      });

      if (!response.ok) {
        console.error("Process audio response not OK:", response.status, response.statusText);
        throw new Error('Failed to process audio');
      }

      const responseData = await response.json();
      console.log("Process audio response:", responseData);

      if (responseData.status === 'success' && responseData.meal_details) {
        onLogMeal(responseData.meal_details);
      } else {
        console.error("Invalid response data:", responseData);
        throw new Error(responseData.message || 'Failed to analyze meal');
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      onError("Failed to process audio. Please try again. Error: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [onLogMeal, onError]);

  useEffect(() => {
    if (audioBlob) {
      processAudio(audioBlob);
    }
  }, [audioBlob, processAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const newAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(newAudioBlob);
      });

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 10000); // Stop after 10 seconds
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError('Failed to access microphone');
    }
  };

  return (
    <Button onClick={startRecording} disabled={isRecording}>
      <Mic className="mr-2 h-4 w-4" /> {isRecording ? 'Recording...' : 'Record Meal'}
    </Button>
  );
}
