import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react'
import axios from 'axios'
import { auth } from '@/lib/firebase'

interface LogMealVoiceProps {
  onLogMeal: (input: string) => void
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function LogMealVoice({ onLogMeal }: LogMealVoiceProps) {
  const [isListening, setIsListening] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-hwu2aew3cq-uc.a.run.app';

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios.post(`${apiUrl}/log_and_analyze_meal`, 
          { input_text: transcript, loggedBy: 'AI' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.status === 'success') {
          console.log("Parsed Meal Details:", response.data.meal_details);
          onLogMeal(response.data.meal_details);
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    setIsListening(true)
    recognition.start()
  }

  return (
    <Button size="lg" className="rounded-full" onClick={handleVoiceInput} disabled={isListening}>
      <Mic className="mr-2 h-4 w-4" />
      {isListening ? 'Listening...' : 'Log Meal (Voice) 🎙️'}
    </Button>
  )
}