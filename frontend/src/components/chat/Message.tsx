import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface MessageProps {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isFromMe: boolean;
  isConsecutive?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function Message({
  id,
  content,
  sender,
  timestamp,
  isFromMe,
  isConsecutive = false,
  showHeader = true,
  className,
}: MessageProps) {
  const formattedTime = format(new Date(timestamp), 'h:mm a');

  return (
    <div
      className={cn(
        'group flex flex-col',
        isFromMe ? 'items-end' : 'items-start',
        !isConsecutive && 'mt-2',
        className
      )}
      data-testid={`message-${id}`}
    >
      {showHeader && !isFromMe && !isConsecutive && (
        <span className="text-xs text-muted-foreground mb-1">{sender}</span>
      )}
      
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isFromMe
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted rounded-bl-none',
          isConsecutive && (isFromMe ? 'rounded-tr-none' : 'rounded-tl-none')
        )}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        <div
          className={cn(
            'text-xs mt-1 flex justify-end',
            isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

// Helper function that we'll mock in tests
export const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
