import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface LogMealTextProps {
  onLogMeal: (mealDetails: { meal_name: string; calories: number; nutrients: { name: string; amount: number; unit: string }[]; insights: string; quantity: string }) => void;
}

export function LogMealText({ onLogMeal }: LogMealTextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogMeal = async () => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to log a meal.');
        return;
      }

      const response = await fetch('/api/log_meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: mealInput, loggedBy: 'AI' }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogMeal(data.meal_details);
        setIsOpen(false);
        setMealInput('');
        setError(null);
      } else {
        setError(data.message || 'Failed to log meal. Please try again.');
      }
    } catch (error) {
      console.error("API Error:", error);
      setError('Failed to log meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // The rest of the component remains the same
  return (
    <>
      <Button size="lg" className="rounded-full text-black" variant="outline" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4 text-black" />
        Log Meal (Text) ✍️
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white rounded-lg shadow-lg p-6 text-black">
          <DialogHeader>
            <DialogTitle>Log Meal</DialogTitle>
            <DialogDescription>Enter the details of your meal below.</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          <div className="space-y-4">
            <Input value={mealInput} onChange={(e) => setMealInput(e.target.value)} placeholder="What did you eat?" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button onClick={handleLogMeal} className="w-full text-white" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Submit
              </Button>
            </motion.div>
            <DialogClose asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="ghost" className="w-full text-black" disabled={isLoading}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </motion.div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}