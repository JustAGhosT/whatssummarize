import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../contexts/GroupContext';
import { Layout } from '../components/Layout';
import { GroupManager } from '../components/GroupManager';
import { Button } from '@whatssummarize/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@whatssummarize/ui';
import { TeamIcon, MessageSquareIcon, PlusIcon, Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { groups, isLoading: groupsLoading } = useGroups();
  const router = useRouter();

  if (authLoading || !isAuthenticated) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: 'Total Groups',
      value: groups.length,
      icon: <TeamIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Active Groups',
      value: groups.filter(g => g.isActive).length,
      icon: <MessageSquareIcon className="h-6 w-6 text-green-500" />,
    },
    {
      title: 'Total Messages',
      value: groups.reduce((sum, group) => sum + (group.messageCount || 0), 0),
      icon: <MessageSquareIcon className="h-6 w-6 text-purple-500" />,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}</h1>
            <p className="text-muted-foreground">Here's what's happening with your groups</p>
          </div>
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => router.push('/groups/new')}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Group
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="link" onClick={() => router.push('/groups')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {groupsLoading ? (
              <div className="flex justify-center py-5">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : groups.length > 0 ? (
              <GroupManager />
            ) : (
              <div className="text-center py-12">
                <TeamIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first WhatsApp group.</p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/groups/new')}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Group
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
