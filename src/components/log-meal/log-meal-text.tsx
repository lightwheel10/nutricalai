import React, { useState } from 'react';
import { auth } from '@/lib/firebase'; // Updated import path
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogMealTextProps {
  onLogMeal: (mealDetails: { meal_name: string; calories: number; nutrients: { name: string; amount: number; unit: string }[]; insights: string; quantity: string }) => void;
}

export function LogMealText({ onLogMeal }: LogMealTextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogMeal = async () => {
    if (!auth) {
      setError('Authentication is not initialized.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to log a meal.');
      return;
    }

    setIsLoading(true);

    try {
      const token = await user.getIdToken();

      // Use the Next.js API route
      const response = await axios.post('/api/log_meal', 
        { input_text: mealInput, loggedBy: 'AI' }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        onLogMeal(response.data.meal_details);
        setIsOpen(false);
        setMealInput('');
        setError(null);
      } else {
        setError(response.data.message || 'Failed to log meal. Please try again.');
      }
    } catch (error) {
      console.error("API Error:", error);
      setError('Failed to log meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the component
  return (
    <>
      {/* Button to open the meal logging dialog */}
      <Button size="lg" className="rounded-full text-black" variant="outline" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4 text-black" />
        Log Meal (Text) ✍️
      </Button>
      {/* Dialog component for meal logging */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white rounded-lg shadow-lg p-6 text-black">
          <DialogHeader>
            <DialogTitle>Log Meal</DialogTitle>
            <DialogDescription>Enter the details of your meal below.</DialogDescription>
          </DialogHeader>
          {/* Display error message if there is one */}
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          <div className="space-y-4">
            {/* Input field for meal details */}
            <Input value={mealInput} onChange={(e) => setMealInput(e.target.value)} placeholder="What did you eat?" />
            {/* Submit button with animation */}
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
            {/* Cancel button with animation */}
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