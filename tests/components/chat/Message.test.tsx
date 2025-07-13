import React from 'react';
import { render, screen } from '@/tests/test-utils';
import { Message } from '@/components/chat/Message';

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Message Component', () => {
  const defaultProps = {
    id: '1',
    content: 'Hello, this is a test message',
    sender: 'Test User',
    timestamp: '2025-07-13T12:00:00Z',
    isFromMe: false,
  };

  it('renders message content correctly', () => {
    render(<Message {...defaultProps} />);
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
  });

  it('shows sender name when not from me and showHeader is true', () => {
    render(<Message {...defaultProps} isFromMe={false} showHeader={true} />);
    expect(screen.getByText(defaultProps.sender)).toBeInTheDocument();
  });

  it('does not show sender name when isFromMe is true', () => {
    render(<Message {...defaultProps} isFromMe={true} showHeader={true} />);
    expect(screen.queryByText(defaultProps.sender)).not.toBeInTheDocument();
  });

  it('does not show sender name when isConsecutive is true', () => {
    render(<Message {...defaultProps} isConsecutive={true} showHeader={true} />);
    expect(screen.queryByText(defaultProps.sender)).not.toBeInTheDocument();
  });

  it('applies correct styling for messages from me', () => {
    const { container } = render(
      <Message {...defaultProps} isFromMe={true} />
    );
    const messageElement = container.firstChild as HTMLElement;
    expect(messageElement).toHaveClass('items-end');
  });

  it('applies correct styling for messages from others', () => {
    const { container } = render(
      <Message {...defaultProps} isFromMe={false} />
    );
    const messageElement = container.firstChild as HTMLElement;
    expect(messageElement).toHaveClass('items-start');
  });

  it('displays formatted time correctly', () => {
    render(<Message {...defaultProps} />);
    expect(screen.getByText('8:00 PM')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    const { container } = render(
      <Message {...defaultProps} className={customClass} />
    );
    const messageElement = container.firstChild as HTMLElement;
    expect(messageElement).toHaveClass(customClass);
  });
});
