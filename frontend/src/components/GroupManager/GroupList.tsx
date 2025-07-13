import React from 'react';
import { Group } from '../../contexts/GroupContext';
import { formatRelative } from 'date-fns';
import { Avatar, List, Typography, Badge, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface GroupListProps {
  groups: Group[];
  currentGroupId?: string;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  currentGroupId,
  onSelectGroup,
  onCreateGroup,
}) => {
  return (
    <div className="group-list">
      <div className="group-list-header">
        <h2>Groups</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateGroup}
          size="small"
        >
          New Group
        </Button>
      </div>
      
      <List
        itemLayout="horizontal"
        dataSource={groups}
        renderItem={(group) => (
          <List.Item
            onClick={() => onSelectGroup(group.id)}
            className={`group-item ${currentGroupId === group.id ? 'active' : ''}`}
          >
            <List.Item.Meta
              avatar={
                <Badge count={group.unreadCount} size="small">
                  <Avatar
                    shape="square"
                    style={{ backgroundColor: '#25D366' }}
                    icon={
                      <span role="img" aria-label="group">
                        👥
                      </span>
                    }
                  />
                </Badge>
              }
              title={group.name}
              description={
                group.lastMessage && (
                  <div className="group-preview">
                    <Text ellipsis style={{ maxWidth: '100%', display: 'block' }}>
                      {group.lastMessage.sender && (
                        <strong>{group.lastMessage.sender}: </strong>
                      )}
                      {group.lastMessage.content}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '0.8em' }}>
                      {formatRelative(new Date(group.lastMessage.timestamp), new Date())}
                    </Text>
                  </div>
                )
              }
            />
          </List.Item>
        )}
      />
      
      <style jsx>{`
        .group-list {
          border-right: 1px solid #f0f0f0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .group-list-header {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
        .group-item {
          padding: 12px 16px;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }
        .group-item:hover {
          background-color: #f9f9f9;
        }
        .group-item.active {
          background-color: #e6f7ff;
          border-left-color: #1890ff;
        }
        .group-preview {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};
