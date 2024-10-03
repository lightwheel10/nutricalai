'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";

export default function SignUpContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signUp(email, password);

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to confirm your account.",
          variant: "default",
        });
        router.push('/login');
      } else {
        throw new Error('Sign up failed. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg relative"
      >
        <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex justify-center">
          <UserPlus className="w-12 h-12 text-blue-500" />
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900"
        >
          Sign Up
        </motion.h2>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleSignUp}
          className="space-y-6"
        >
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </motion.form>
        <div className="text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}