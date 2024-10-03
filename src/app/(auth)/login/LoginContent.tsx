'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider, Auth } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth as Auth, provider);
      console.log('User signed in:', result.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // TODO: Implement user-facing error handling
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
          <Lock className="w-12 h-12 text-blue-500" />
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900"
        >
          Sign In
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2 px-4 flex justify-center items-center bg-white hover:bg-gray-100 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </>
            )}
          </Button>
        </motion.div>
        <div className="text-center">
          <Link href="/contact" className="text-sm text-blue-600 hover:text-blue-800">
            Having trouble? Contact us
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
