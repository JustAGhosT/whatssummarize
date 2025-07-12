"use client";

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleSuccess = () => {
    const redirectTo = searchParams.get('redirectTo') || '/';
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-lg overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 animate-gradient-x"></div>
        
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <div className="h-8 w-8 text-primary font-bold flex items-center justify-center text-xl">WS</div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 px-6 pb-6">
          <LoginForm 
            onSuccess={handleSuccess}
            showHeader={false}
            showSocialLogins={true}
            showSignupLink={true}
            className="space-y-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
