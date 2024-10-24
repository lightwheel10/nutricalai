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

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Loader2 } from 'lucide-react';
import { uploadAudio } from '@/lib/supabase';

interface LogMealVoiceProps {
  onLogMeal: (mealDetails: {
    meal_name: string;
    calories: number;
    nutrients: Array<{ name: string; amount: number; unit: string }>;
    insights: string;
    quantity: string;
    mealType: string;
  }) => void;
  onError: (error: string) => void;
  // Optional props for phone preview
  audioBlob?: Blob;
  sessionId?: string;
  // Optional prop to hide recording UI
  hideUI?: boolean;
}

export function LogMealVoice({ 
  onLogMeal, 
  onError, 
  audioBlob: externalBlob, 
  sessionId: externalSessionId,
  hideUI 
}: LogMealVoiceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const processAudio = useCallback(async (blob: Blob, sid: string) => {
    try {
      setIsProcessing(true);
      const { data: uploadData, error: uploadError } = await uploadAudio(
        new File([blob], `audio_${sid}.webm`, { type: 'audio/webm' })
      );

      if (uploadError || !uploadData) {
        console.error("Upload error:", uploadError);
        throw new Error('Failed to upload audio');
      }

      const response = await fetch('/api/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioPath: uploadData.path,
          session_id: sid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process audio');
      }

      const data = await response.json();
      if (data.status === 'success' && data.meal_details) {
        onLogMeal(data.meal_details);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Process audio error:", error);
      onError(error instanceof Error ? error.message : 'Failed to process audio');
    } finally {
      setIsProcessing(false);
    }
  }, [onLogMeal, onError]);

  useEffect(() => {
    if (externalBlob && externalSessionId) {
      processAudio(externalBlob, externalSessionId);
    }
  }, [externalBlob, externalSessionId, processAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
        processAudio(blob, sid);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      onError('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (hideUI) return null;

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className="flex items-center gap-2"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isRecording ? (
        <>
          <Mic className="h-4 w-4 text-red-500 animate-pulse" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Record Meal
        </>
      )}
    </Button>
  );
}
