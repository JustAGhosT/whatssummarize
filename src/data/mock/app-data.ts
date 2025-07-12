import type { Summary, Group, CrossPlatformGroup, PersonalSummary, TopGroup } from '@/types/contexts';

export const mockSummaries: Summary[] = [
  {
    id: '1',
    title: 'Weekly Family Update',
    content: 'Discussed vacation plans and shared family news.',
    date: new Date('2023-05-15T10:30:00Z'),
    type: 'weekly',
    platform: 'whatsapp',
    groupId: 'family-1',
    groupName: 'Family Group',
    messageCount: 42,
    participants: ['Mom', 'Dad', 'Sister', 'Brother'],
    tags: ['family', 'vacation'],
    isRead: false,
    isArchived: false,
    dateRange: {
      start: '2023-05-08T00:00:00Z',
      end: '2023-05-15T23:59:59Z'
    },
    createdAt: '2023-05-15T10:30:00Z'
  },
];

export const mockGroups: Group[] = [
  {
    id: 'family-1',
    name: 'Family Group',
    platform: 'whatsapp',
    participants: ['Mom', 'Dad', 'Sister', 'Brother'],
    lastActivity: new Date('2023-05-15T10:30:00Z'),
    unreadCount: 3,
    isActive: true,
    avatar: '/avatars/family.png'
  }
];

export const mockCrossPlatformGroups: CrossPlatformGroup[] = [
  {
    id: 'cp-1',
    name: 'Close Friends',
    description: 'My closest friends across platforms',
    groups: [
      { groupId: 'whatsapp-1', platform: 'whatsapp' },
      { groupId: 'telegram-1', platform: 'telegram' }
    ],
    createdAt: new Date('2023-01-01T00:00:00Z'),
    lastUpdated: new Date('2023-05-15T10:30:00Z'),
    totalUnread: 5,
    isActive: true
  }
];

export const mockPersonalSummaries: PersonalSummary[] = [
  {
    id: 'ps-1',
    title: 'Weekly Summary',
    content: 'Your weekly summary of conversations',
    contact: 'John Doe',
    date: '2023-05-15',
    keyPoints: ['Discussed vacation plans', 'Shared family news'],
    archived: false,
    messageCount: 42,
    dateRange: {
      start: '2023-05-08',
      end: '2023-05-15'
    },
    createdAt: '2023-05-15T10:30:00Z',
    status: 'generated',
    stats: {
      totalMessages: 150,
      activeGroups: 5,
      topGroup: 'Family Group',
      messagesByDay: [10, 15, 20, 25, 30, 25, 25]
    },
    insights: ['You were most active on Wednesday'],
    topGroups: [
      { name: 'Family Group', messageCount: 42 },
      { name: 'Work Team', messageCount: 35 },
      { name: 'Gaming Buddies', messageCount: 28 }
    ]
  }
];

export const mockTopGroups: TopGroup[] = [
  { name: 'Family Group', messageCount: 42 },
  { name: 'Work Team', messageCount: 35 },
  { name: 'Gaming Buddies', messageCount: 28 }
]; 