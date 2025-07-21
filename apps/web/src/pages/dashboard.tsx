import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../contexts/GroupContext';
import { Layout } from '../components/Layout';
import { GroupManager } from '../components/GroupManager';
import { Card, Row, Col, Statistic, Typography, Spin, Button } from 'antd';
import { 
  TeamOutlined, 
  MessageOutlined, 
  UserOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { groups, isLoading: groupsLoading } = useGroups();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: 'Total Groups',
      value: groups.length,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Active Groups',
      value: groups.filter(g => g.isActive).length,
      icon: <MessageOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Total Messages',
      value: groups.reduce((sum, group) => sum + (group.messageCount || 0), 0),
      icon: <MessageOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1',
    },
  ];

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <Title level={2} style={{ margin: 0 }}>Welcome back, {user?.name || 'User'}</Title>
            <Text type="secondary">Here's what's happening with your groups</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => router.push('/groups/new')}
          >
            Add Group
          </Button>
        </div>

        <Row gutter={[16, 16]} className="stats-row">
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card className="stat-card">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Recent Activity</span>
              <Button type="link" onClick={() => router.push('/groups')}>
                View All
              </Button>
            </div>
          }
          className="activity-card"
        >
          {groupsLoading ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin />
            </div>
          ) : groups.length > 0 ? (
            <GroupManager />
          ) : (
            <div className="empty-state">
              <TeamOutlined style={{ fontSize: '48px', color: '#bfbfbf', marginBottom: '16px' }} />
              <Title level={4} style={{ color: '#8c8c8c' }}>No groups yet</Title>
              <Text type="secondary">Get started by adding your first WhatsApp group</Text>
              <div style={{ marginTop: '16px' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => router.push('/groups/new')}
                >
                  Add Group
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .stats-row {
          margin-bottom: 24px;
        }
        
        .stat-card {
          height: 100%;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
        }
        
        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .activity-card {
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }
        
        .empty-state {
          padding: 48px 0;
          text-align: center;
          background-color: #fafafa;
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .dashboard-header button {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default DashboardPage;
