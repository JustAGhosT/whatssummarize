import React, { useEffect, useRef } from 'react';
import { Message } from '../../../contexts/GroupContext';
import { Avatar, List, Typography, Image, Spin } from 'antd';
import { format } from 'date-fns';

const { Text } = Typography;

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onLoadMore: () => void;
  currentUserId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onLoadMore,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const shouldAutoScroll = useRef(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle scroll events for infinite loading
  const handleScroll = () => {
    if (!listRef.current) return;
    
    const { scrollTop } = listRef.current;
    
    // If scrolled up, don't auto-scroll to bottom
    shouldAutoScroll.current = scrollTop === 0 && messages.length > 0;
    
    // Load more messages when scrolling to the top
    if (scrollTop === 0 && !isLoading && messages.length > 0) {
      onLoadMore();
    }
  };

  // Track if we should auto-scroll when new messages arrive
  useEffect(() => {
    if (prevMessagesLength.current < messages.length) {
      // New message received
      shouldAutoScroll.current = true;
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  const renderMessageContent = (message: Message) => {
    if (message.isMedia && message.mediaUrl) {
      return (
        <Image
          src={message.mediaUrl}
          alt="Media content"
          style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
          preview={{
            src: message.mediaUrl,
          }}
        />
      );
    }
    return <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>;
  };

  return (
    <div 
      className="message-list" 
      ref={listRef}
      onScroll={handleScroll}
    >
      {isLoading && messages.length === 0 ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={[...messages].reverse()} // Show newest at bottom
          renderItem={(message) => {
            const isCurrentUser = message.sender === currentUserId;
            
            return (
              <List.Item
                className={`message-item ${isCurrentUser ? 'current-user' : ''}`}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: isCurrentUser ? '#1890ff' : '#f56a00' }}
                      icon={
                        <span role="img" aria-label="user">
                          {isCurrentUser ? '👤' : '👥'}
                        </span>
                      }
                    />
                  }
                  title={
                    <div className="message-header">
                      <Text strong>{message.sender || 'Unknown'}</Text>
                      <Text type="secondary" className="message-time">
                        {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
                      </Text>
                    </div>
                  }
                  description={renderMessageContent(message)}
                />
              </List.Item>
            );
          }}
        />
      )}
      <div ref={messagesEndRef} />
      
      <style jsx>{`
        .message-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background-color: #f5f5f5;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .message-item {
          margin-bottom: 16px;
          transition: all 0.2s;
          padding: 8px 16px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .message-item.current-user {
          background-color: #e6f7ff;
          margin-left: 40px;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .message-time {
          font-size: 0.8em;
          margin-left: 8px;
        }
        .ant-list-item-meta-description {
          word-break: break-word;
        }
      `}</style>
    </div>
  );
};
