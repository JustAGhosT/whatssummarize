import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../api/client';
import { socketService } from '../services/socket.service';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isMedia: boolean;
  mediaUrl?: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  lastMessage?: Message;
  unreadCount: number;
}

interface GroupContextType {
  groups: Group[];
  currentGroup: Group | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  createGroup: (name: string, description?: string) => Promise<void>;
  selectGroup: (groupId: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  refreshGroups: () => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const MESSAGES_PER_PAGE = 50;

export const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load groups on mount
  useEffect(() => {
    loadGroups();
    setupSocketListeners();

    return () => {
      // Clean up socket listeners
      socketService.disconnect();
    };
  }, []);

  const setupSocketListeners = () => {
    // Listen for new messages
    const cleanupMessage = socketService.onMessage('new_message', (data: any) => {
      if (data.groupId === currentGroup?.id) {
        setMessages(prev => [data.message, ...prev]);
      }
      
      // Update last message in groups list
      setGroups(prevGroups => 
        prevGroups.map(group => {
          if (group.id === data.groupId) {
            return {
              ...group,
              lastMessage: data.message,
              unreadCount: group.id === currentGroup?.id ? 0 : group.unreadCount + 1
            };
          }
          return group;
        })
      );
    });

    return () => {
      cleanupMessage();
    };
  };

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const groupsData = await apiClient.getGroups();
      setGroups(groupsData.map((group: any) => ({
        ...group,
        unreadCount: 0
      })));
    } catch (err) {
      setError('Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGroups = async () => {
    await loadGroups();
  };

  const selectGroup = async (groupId: string) => {
    try {
      setIsLoading(true);
      const group = groups.find(g => g.id === groupId) || await apiClient.getGroup(groupId);
      
      if (group) {
        setCurrentGroup(group);
        
        // Mark messages as read
        setGroups(prevGroups => 
          prevGroups.map(g => 
            g.id === groupId ? { ...g, unreadCount: 0 } : g
          )
        );

        // Load messages
        const messagesData = await apiClient.getGroupMessages(groupId, 1, MESSAGES_PER_PAGE);
        setMessages(messagesData.messages);
        setCurrentPage(1);
        setHasMore(messagesData.messages.length === MESSAGES_PER_PAGE);
        
        // Start monitoring the group via WebSocket
        socketService.monitorGroup(groupId);
      }
    } catch (err) {
      setError('Failed to load group');
      console.error('Error selecting group:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!currentGroup || !hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const messagesData = await apiClient.getGroupMessages(
        currentGroup.id, 
        nextPage, 
        MESSAGES_PER_PAGE
      );
      
      setMessages(prev => [...prev, ...messagesData.messages]);
      setCurrentPage(nextPage);
      setHasMore(messagesData.messages.length === MESSAGES_PER_PAGE);
    } catch (err) {
      setError('Failed to load more messages');
      console.error('Error loading more messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (name: string, description?: string) => {
    try {
      setIsLoading(true);
      const newGroup = await apiClient.createGroup(name, description);
      setGroups(prev => [
        { ...newGroup, unreadCount: 0, lastMessage: undefined },
        ...prev
      ]);
      return newGroup;
    } catch (err) {
      setError('Failed to create group');
      console.error('Error creating group:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentGroup) return;
    
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const newMessage = {
        id: tempId,
        content,
        sender: 'You',
        timestamp: new Date(),
        isMedia: false
      };
      
      setMessages(prev => [newMessage, ...prev]);
      
      // Send to server
      await apiClient.post(`/groups/${currentGroup.id}/messages`, { content });
      
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      
      // Revert optimistic update on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        currentGroup,
        messages,
        isLoading,
        error,
        createGroup,
        selectGroup,
        loadMoreMessages,
        sendMessage,
        refreshGroups,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};
