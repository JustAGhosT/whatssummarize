import {
    FileText,
    Hash,
    HelpCircle,
    Home,
    Info,
    LogOut,
    MessageSquare,
    Palette,
    Settings,
    User
} from 'lucide-react';
import { NavItem } from '../types';

export const CORE_NAV_ITEMS: NavItem[] = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: Home,
    description: 'View your dashboard',
    requiresAuth: true
  },
  { 
    href: "/summaries", 
    label: "Summaries", 
    icon: FileText, 
    description: 'View your conversation summaries',
    requiresAuth: true
  },
  { 
    href: '/chats', 
    label: 'Chats', 
    icon: MessageSquare,
    description: 'View your chat history',
    requiresAuth: true
  },
  { 
    href: '/topics', 
    label: 'Topics', 
    icon: Hash,
    description: 'Browse topics of interest',
    requiresAuth: true
  }
];

export const MORE_NAV_ITEMS: NavItem[] = [
  { 
    href: '/settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'Configure your preferences',
    requiresAuth: true
  },
  { 
    href: '/moodboard', 
    label: 'Moodboard', 
    icon: Palette,
    description: 'View the design system moodboard'
  },
  { 
    href: '/help', 
    label: 'Help & Support', 
    icon: HelpCircle,
    description: 'Get help and support'
  },
  { 
    href: '/about', 
    label: 'About', 
    icon: Info,
    description: 'Learn more about our platform'
  }
];

export const getUserMenuItems = (router: any, logout: () => void): NavItem[] => [
  { 
    href: '/profile', 
    label: 'Your Profile', 
    icon: User,
    onClick: () => router.push('/profile')
  },
  { 
    href: '/settings', 
    label: 'Settings', 
    icon: Settings,
    onClick: () => router.push('/settings')
  },
  { 
    href: '#', 
    label: 'Sign out', 
    icon: LogOut,
    onClick: (e?: React.MouseEvent) => {
      e?.preventDefault();
      logout();
      router.push('/');
    }
  }
];
