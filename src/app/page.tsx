'use client';

import { LoginModal } from '@/components/auth/login-modal';
import { SignupModal } from '@/components/auth/signup-modal';
import Dashboard from '@/components/features/dashboard/dashboard';
import { useAuth } from '@/contexts/auth-context';
import React from 'react';
import LandingPage from './landing-page';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showSignupModal, setShowSignupModal] = React.useState(false);

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // If user is not authenticated, show landing page with auth modals
  return (
    <>
      <LandingPage 
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
      />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}
