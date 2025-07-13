import React from 'react';
import { Message, MessageProps } from './Message';
import { formatChatMessages } from '@/utils/chatUtils';

export interface ChatMessage extends Omit<MessageProps, 'isConsecutive' | 'showHeader'> {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  currentUserId?: string;
  className?: string;
}

export function ChatContainer({ messages, currentUserId, className }: ChatContainerProps) {
  const processedMessages = formatChatMessages(messages);

  return (
    <div className={className} data-testid="chat-container">
      {processedMessages.map((message) => (
        <Message
          key={message.id}
          {...message}
          isFromMe={message.isFromMe}
          isConsecutive={message.isConsecutive}
          showHeader={message.showHeader}
        />
      ))}
    </div>
  );
}
