"use client"

import {
  mockCrossPlatformGroups,
  mockGroups,
  mockPersonalSummaries,
  mockSummaries,
  mockTopGroups
} from '@/data/mock/app-data';
import {
  AppContextType,
  CrossPlatformGroup,
  Group,
  PersonalSummary,
  Platform,
  Summary,
  TopGroup
} from '@/types/contexts';
import * as React from 'react';

// Extract React hooks and types for easier use
const { createContext, useContext, useState, useEffect, useCallback } = React;
type ReactNode = React.ReactNode;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // State for the app context
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [crossPlatformGroups, setCrossPlatformGroups] = useState<CrossPlatformGroup[]>([]);
  const [personalSummaries, setPersonalSummaries] = useState<PersonalSummary[]>([]);
  const [selectedPlatform, setSelectedPlatformState] = useState<Platform | 'all'>('all');
  const [topGroups, setTopGroups] = useState<TopGroup[]>([]);

  // Load data function
  const loadData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Simulate API calls
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      setSummaries(mockSummaries);
      setGroups(mockGroups);
      setCrossPlatformGroups(mockCrossPlatformGroups);
      setPersonalSummaries(mockPersonalSummaries);
      setTopGroups(mockTopGroups);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      setErrorState('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [loadData]);

  const addSummary = useCallback((summary: Omit<Summary, 'id' | 'isRead' | 'date'>): void => {
    const newSummary: Summary = {
      ...summary,
      id: `sum-${Date.now()}`,
      isRead: false,
      date: new Date()
    };
    setSummaries((prev: Summary[]) => [...prev, newSummary]);
  }, []);

  const deleteSummary = useCallback((summaryId: string): void => {
    setSummaries((prev: Summary[]) => prev.filter(summary => summary.id !== summaryId));
  }, []);

  const markSummaryAsRead = useCallback((summaryId: string): void => {
    setSummaries((prev: Summary[]) =>
      prev.map((summary: Summary) =>
        summary.id === summaryId ? { ...summary, isRead: true } : summary
      )
    );
  }, []);

  const generateSummary = useCallback(async (groupId: string, type: 'weekly' | 'since-last-read' = 'weekly'): Promise<Summary> => {
    // In a real app, this would call an API
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    const group = groups.find((g: Group) => g.id === groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    
    const newSummary: Summary = {
      id: `sum-${Date.now()}`,
      title: `${type === 'weekly' ? 'Weekly' : 'Recent'} Summary - ${group.name}`,
      content: `This is a ${type} summary of the ${group.name} group. ` +
               `There were ${Math.floor(Math.random() * 50) + 10} messages this period.`,
      date: new Date(),
      type: type === 'weekly' ? 'weekly' : 'custom',
      platform: group.platform,
      groupId: group.id,
      groupName: group.name,
      messageCount: Math.floor(Math.random() * 50) + 10,
      participants: group.participants,
      tags: ['generated', type],
      isRead: false,
      isArchived: false,
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };
    
    setSummaries((prev: Summary[]) => [...prev, newSummary]);
    return newSummary;
  }, [groups]);

  const getFilteredSummaries = useCallback((): Summary[] => {
    if (selectedPlatform === 'all') {
      return summaries;
    }
    return summaries.filter((summary: Summary) => summary.platform === selectedPlatform);
  }, [summaries, selectedPlatform]);

  const getUnreadCount = useCallback((): number => {
    return summaries.filter((summary: Summary) => !summary.isRead).length;
  }, [summaries]);

  const createCrossPlatformGroup = useCallback((name: string, description: string, groupIds: Array<{ groupId: string; platform: Platform }>): CrossPlatformGroup => {
    const newGroup: CrossPlatformGroup = {
      id: `cpg-${Date.now()}`,
      name,
      description,
      groups: groupIds,
      createdAt: new Date(),
      lastUpdated: new Date(),
      totalUnread: 0,
      isActive: true
    };
    
    setCrossPlatformGroups((prev: CrossPlatformGroup[]) => [...prev, newGroup]);
    return newGroup;
  }, []);

  const updateCrossPlatformGroup = useCallback((groupId: string, updates: Partial<CrossPlatformGroup>): void => {
    setCrossPlatformGroups((prev: CrossPlatformGroup[]) =>
      prev.map((group: CrossPlatformGroup) =>
        group.id === groupId ? { ...group, ...updates, lastUpdated: new Date() } : group
      )
    );
  }, []);

  const deleteCrossPlatformGroup = useCallback((groupId: string): void => {
    setCrossPlatformGroups((prev: CrossPlatformGroup[]) => 
      prev.filter((group: CrossPlatformGroup) => group.id !== groupId)
    );
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string): void => {
    // In a real app, this would update the notification status in the backend
    console.log('Marking notification as read:', notificationId);
  }, []);

  // Memoized error setter
  const setError = useCallback((error: string | null): void => {
    setErrorState(error);
  }, []);

  // Memoized platform setter
  const setSelectedPlatform = useCallback((platform: Platform | 'all'): void => {
    setSelectedPlatformState(platform);
  }, []);

  const contextValue: AppContextType = {
    isLoading,
    error,
    summaries: getFilteredSummaries(),
    groups,
    crossPlatformGroups,
    personalSummaries,
    topGroups,
    selectedPlatform,
    setSelectedPlatform,
    generateSummary,
    generateCrossPlatformSummary: async (crossGroupId: string, type: 'weekly' | 'since-last-read' = 'weekly'): Promise<Summary> => {
      // Simplified implementation for cross-platform summaries
      return generateSummary(crossGroupId, type === 'since-last-read' ? 'since-last-read' : type);
    },
    markSummaryAsRead,
    markNotificationAsRead,
    deleteSummary,
    createCrossPlatformGroup,
    updateCrossPlatformGroup,
    deleteCrossPlatformGroup,
    getFilteredSummaries,
    getUnreadCount,
    setError,
    createPersonalSummary: async (summary: Omit<PersonalSummary, 'id' | 'createdAt' | 'status'>): Promise<PersonalSummary | null> => {
      // Mock implementation
      const newSummary: PersonalSummary = {
        ...summary,
        id: `ps-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'generated'
      };
      setPersonalSummaries(prev => [...prev, newSummary]);
      return newSummary;
    },
    updatePersonalSummary: async (id: string, updates: Partial<PersonalSummary>): Promise<boolean> => {
      setPersonalSummaries(prev => 
        prev.map(summary => 
          summary.id === id ? { ...summary, ...updates } : summary
        )
      );
      return true;
    },
    deletePersonalSummary: async (id: string): Promise<boolean> => {
      setPersonalSummaries(prev => prev.filter(summary => summary.id !== id));
      return true;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
