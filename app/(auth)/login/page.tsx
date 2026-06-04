'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/auth/google/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="text-4xl mb-4">📊</div>
            <CardTitle className="text-3xl">Life Dashboard</CardTitle>
            <CardDescription>
              Track your goals, habits, and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600 text-center">
              Sign in with Google to get started. Your data is stored securely in your Google Drive.
            </p>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Signing in...' : '🔐 Sign in with Google'}
            </Button>

            <div className="space-y-3 text-xs text-gray-600">
              <p>✓ No database needed - your data stays with you</p>
              <p>✓ Stored in Google Drive AppData folder</p>
              <p>✓ Full offline support with auto-sync</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Track. Reflect. Grow.</p>
        </div>
      </motion.div>
    </div>
  );
}
