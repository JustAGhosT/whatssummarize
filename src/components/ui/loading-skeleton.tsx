import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  header?: boolean;
  className?: string;
}

export function LoadingSkeleton({ rows = 3, header = true, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-4 p-6 ${className}`}>
      {header && (
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i} 
            className="h-24 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            style={{ 
              animationDelay: `${i * 100}ms`,
              opacity: 1 - (i * 0.1)
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}