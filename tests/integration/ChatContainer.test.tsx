import { render, screen } from '@/tests/test-utils';
import { ChatContainer } from 'frontend/src/components/chat/ChatContainer';

describe('ChatContainer Integration', () => {
  const currentUserId = 'user-1';
  
  const mockMessages = [
    {
      id: '1',
      sender: 'User 1',
      content: 'First message',
      timestamp: '2025-07-13T10:00:00Z',
      isFromMe: false,
    },
    {
      id: '2',
      sender: currentUserId,
      content: 'Second message',
      timestamp: '2025-07-13T10:01:00Z',
      isFromMe: true,
    },
    {
      id: '3',
      sender: currentUserId,
      content: 'Third message',
      timestamp: '2025-07-13T10:01:30Z',
      isFromMe: true,
    },
    {
      id: '4',
      sender: 'User 2',
      content: 'Fourth message',
      timestamp: '2025-07-14T09:00:00Z', // Next day
      isFromMe: false,
    },
  ];

  it('renders all messages', () => {
    render(<ChatContainer messages={mockMessages} currentUserId={currentUserId} />);
    
    mockMessages.forEach((message) => {
      expect(screen.getByText(message.content)).toBeInTheDocument();
    });
  });

  it('groups consecutive messages from the same sender', () => {
    render(<ChatContainer messages={mockMessages} currentUserId={currentUserId} />);
    
    // The second message from the same user should have the consecutive class
    const secondMessage = screen.getByText('Second message').closest('[data-testid^="message-"]');
    const thirdMessage = screen.getByText('Third message').closest('[data-testid^="message-"]');
    
    // Check that the messages are properly grouped
    expect(secondMessage).toHaveClass('rounded-br-none');
    expect(thirdMessage).toHaveClass('rounded-tr-none');
  });

  it('shows sender name for new message groups', () => {
    render(<ChatContainer messages={mockMessages} currentUserId={currentUserId} />);
    
    // First message from User 1 should show sender name
    expect(screen.getByText('User 1')).toBeInTheDocument();
    
    // First message from User 2 (after a day break) should show sender name
    expect(screen.getByText('User 2')).toBeInTheDocument();
    
    // Our own messages shouldn't show sender name
    expect(screen.queryByText(currentUserId)).not.toBeInTheDocument();
  });

  it('displays messages in correct order', () => {
    render(<ChatContainer messages={mockMessages} currentUserId={currentUserId} />);
    
    const messages = screen.getAllByTestId(/^message-/, { exact: false });
    
    // Check that messages are in the correct order
    expect(messages[0]).toHaveTextContent('First message');
    expect(messages[1]).toHaveTextContent('Second message');
    expect(messages[2]).toHaveTextContent('Third message');
    expect(messages[3]).toHaveTextContent('Fourth message');
  });

  it('applies correct alignment based on message sender', () => {
    render(<ChatContainer messages={mockMessages} currentUserId={currentUserId} />);
    
    const messageElements = screen.getAllByTestId(/^message-/, { exact: false });
    
    // First message is from another user (left aligned)
    expect(messageElements[0]).toHaveClass('items-start');
    
    // Second and third messages are from current user (right aligned)
    expect(messageElements[1]).toHaveClass('items-end');
    expect(messageElements[2]).toHaveClass('items-end');
    
    // Fourth message is from another user (left aligned)
    expect(messageElements[3]).toHaveClass('items-start');
  });
});
