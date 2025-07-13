import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Space, Tooltip, Upload, message } from 'antd';
import { SendOutlined, PaperClipOutlined, SmileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textAreaRef = useRef<any>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage('');
      // Focus the input after sending
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key (but not when Shift+Enter or when IME is composing)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file upload
  const beforeUpload = (file: File) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File must be smaller than 10MB!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleFileUpload = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      // Here you would typically handle the uploaded file
      // For example: onSend(`[File: ${info.file.name}]`, info.file.response.url);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="message-input">
      <div className="input-container">
        <Space.Compact style={{ width: '100%' }}>
          <Upload
            action="/api/upload" // Replace with your upload endpoint
            beforeUpload={beforeUpload}
            onChange={handleFileUpload}
            showUploadList={false}
            disabled={disabled}
          >
            <Button 
              type="text" 
              icon={<PaperClipOutlined />} 
              disabled={disabled}
              className="action-button"
            />
          </Upload>
          
          <TextArea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={placeholder}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={disabled}
            className="message-textarea"
          />
          
          <Button 
            type="text" 
            icon={<SmileOutlined />} 
            disabled={disabled}
            className="action-button"
          />
          
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="send-button"
          />
        </Space.Compact>
      </div>
      
      <style jsx>{`
        .message-input {
          border-top: 1px solid #f0f0f0;
          padding: 12px 16px;
          background-color: #fff;
        }
        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .message-textarea {
          flex: 1;
          border-radius: 20px;
          padding: 8px 12px;
          resize: none;
          border-color: #d9d9d9;
        }
        .message-textarea:hover {
          border-color: #40a9ff;
        }
        .message-textarea:focus {
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        .action-button {
          color: #8c8c8c;
          transition: color 0.3s;
        }
        .action-button:hover {
          color: #1890ff;
          background-color: transparent;
        }
        .send-button {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .send-button[disabled] {
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};
