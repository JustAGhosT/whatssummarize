import React, { useState, useEffect } from 'react';
import { useGroups } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import { GroupList } from './GroupList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const GroupManager: React.FC = () => {
  const { 
    groups, 
    currentGroup, 
    messages, 
    isLoading, 
    selectGroup, 
    createGroup, 
    sendMessage, 
    loadMoreMessages 
  } = useGroups();
  
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Select first group on initial load if none selected
  useEffect(() => {
    if (groups.length > 0 && !currentGroup) {
      selectGroup(groups[0].id);
    }
  }, [groups, currentGroup, selectGroup]);

  const handleCreateGroup = async (values: { name: string; description?: string }) => {
    try {
      await createGroup(values.name, values.description);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleSendMessage = (content: string) => {
    if (currentGroup) {
      sendMessage(content);
    }
  };

  return (
    <div className="group-manager">
      <div className="sidebar">
        <GroupList
          groups={groups}
          currentGroupId={currentGroup?.id}
          onSelectGroup={selectGroup}
          onCreateGroup={() => setIsModalVisible(true)}
        />
      </div>
      
      <div className="chat-container">
        {currentGroup ? (
          <>
            <div className="chat-header">
              <Title level={4} style={{ margin: 0 }}>{currentGroup.name}</Title>
              {currentGroup.description && (
                <div className="group-description">{currentGroup.description}</div>
              )}
            </div>
            
            <MessageList
              messages={messages}
              isLoading={isLoading}
              onLoadMore={loadMoreMessages}
              currentUserId={user?.id}
            />
            
            <MessageInput
              onSend={handleSendMessage}
              disabled={!currentGroup}
              placeholder={`Message ${currentGroup.name}...`}
            />
          </>
        ) : (
          <div className="no-group-selected">
            <Title level={4}>Select a group to start chatting</Title>
            <p>Or create a new one to get started</p>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalVisible(true)}
            >
              Create Group
            </Button>
          </div>
        )}
      </div>
      
      <Modal
        title="Create New Group"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateGroup}
        >
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter a group name' }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <Input.TextArea rows={3} placeholder="Enter a brief description" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Group
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      <style jsx>{`
        .group-manager {
          display: flex;
          height: calc(100vh - 64px); // Adjust based on your header height
          background-color: #fff;
        }
        
        .sidebar {
          width: 300px;
          border-right: 1px solid #f0f0f0;
          background-color: #fff;
          display: flex;
          flex-direction: column;
        }
        
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #f5f5f5;
        }
        
        .chat-header {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          background-color: #fff;
        }
        
        .group-description {
          color: #666;
          font-size: 0.9em;
          margin-top: 4px;
        }
        
        .no-group-selected {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          padding: 20px;
        }
        
        @media (max-width: 768px) {
          .group-manager {
            flex-direction: column;
            height: auto;
          }
          
          .sidebar,
          .chat-container {
            width: 100%;
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
};

export default GroupManager;
