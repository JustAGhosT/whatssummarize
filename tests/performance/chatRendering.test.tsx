import { render } from '@testing-library/react';
import { ChatContainer } from '../../frontend/src/components/chat/ChatContainer';
import { measurePerformance } from 'reassure';

// Generate a large number of test messages
const generateTestMessages = (count: number, offset: number = 0) => {
  const messages = [];
  const timestamp = Date.now();
  for (let i = 0; i < count; i++) {
    const isFromMe = i % 2 === 0;
    messages.push({
      id: `msg-${offset + i}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      content: `Test message ${i + 1}`,
      sender: isFromMe ? 'current-user' : `user-${i % 5 + 1}`,
      timestamp: new Date(timestamp - i * 60000).toISOString(),
      status: 'delivered',
      isFromMe
    });
  }
  
  return messages;
};

describe('Chat Performance', () => {
  it('should render 50 messages efficiently', async () => {
    const testMessages = generateTestMessages(50);
    
    await measurePerformance(
      <ChatContainer messages={testMessages} currentUserId="current-user" />,
      { runs: 3 }
    );
  });

  it('should render 200 messages efficiently', async () => {
    const testMessages = generateTestMessages(200);
    
    await measurePerformance(
      <ChatContainer messages={testMessages} currentUserId="current-user" />,
      { runs: 3 }
    );
  });

  it('should handle rapid updates efficiently', async () => {
    const initialMessages = generateTestMessages(50);
    // Generate additional messages with an offset to ensure unique IDs
    const additionalMessages = generateTestMessages(10, 50);
    
    // Initial render
    const { rerender } = render(
      <ChatContainer messages={initialMessages} currentUserId="current-user" />
    );
    
    // Measure time to add 10 more messages
    await measurePerformance(
      <ChatContainer 
        messages={[...initialMessages, ...additionalMessages]} 
        currentUserId="current-user" 
      />,
      { runs: 3 }
    );
  });
});
