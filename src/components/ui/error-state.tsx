import React from 'react';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  retryAction?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  retryAction,
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {retryAction && (
        <Button onClick={retryAction} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}