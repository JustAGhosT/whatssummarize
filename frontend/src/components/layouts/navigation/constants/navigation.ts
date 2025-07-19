import { 
  FileText as FileTextIcon,
  Hash as HashIcon,
  HelpCircle as HelpCircleIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  LogOut as LogOutIcon,
  MessageSquare as MessageSquareIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  User as UserIcon,
} from 'lucide-react';
import type { NavItem, NavIcon } from '../navigation.types';

// Helper function to create nav items with proper typing
function createNavItem<T extends { onClick?: (e?: React.MouseEvent) => void }>(
  item: Omit<NavItem, 'icon'> & {
    icon: NavIcon;
    requiresAuth?: boolean;
  } & T
): NavItem & T {
  return item as unknown as NavItem & T;
}

// Helper function to safely cast Lucide icons to NavIcon type
const createIconComponent = (Icon: any): NavIcon => {
  return Icon as unknown as NavIcon;
};

export const CORE_NAV_ITEMS = [
  createNavItem({
    href: "/dashboard",
    label: "Dashboard",
    icon: createIconComponent(HomeIcon),
    description: "View your dashboard",
    requiresAuth: true
  }),
  createNavItem({
    href: "/summaries",
    label: "Summaries",
    icon: createIconComponent(FileTextIcon),
    description: "View your conversation summaries",
    requiresAuth: true
  }),
  createNavItem({
    href: "/chats",
    label: "Chats",
    icon: createIconComponent(MessageSquareIcon),
    description: "View your chat history",
    requiresAuth: true
  }),
  createNavItem({
    href: "/topics",
    label: "Topics",
    icon: createIconComponent(HashIcon),
    description: "Browse topics of interest",
    requiresAuth: true
  })
];

export const MORE_NAV_ITEMS = [
  createNavItem({
    href: "/settings",
    label: "Settings",
    icon: createIconComponent(SettingsIcon),
    description: "Configure your preferences",
    requiresAuth: true
  }),
  createNavItem({
    href: "/moodboard",
    label: "Moodboard",
    icon: createIconComponent(PaletteIcon),
    description: "View the design system moodboard"
  }),
  createNavItem({
    href: "/help",
    label: "Help & Support",
    icon: createIconComponent(HelpCircleIcon),
    description: "Get help and support"
  }),
  createNavItem({
    href: "/about",
    label: "About",
    icon: createIconComponent(InfoIcon),
    description: "Learn more about our platform"
  })
];

export const getUserMenuItems = (router: any, logout: () => void) => [
  createNavItem({
    href: "/profile",
    label: "Your Profile",
    icon: createIconComponent(UserIcon),
    description: "View and edit your profile",
    onClick: () => router.push('/profile')
  }),
  createNavItem({
    href: "/settings",
    label: "Settings",
    icon: createIconComponent(SettingsIcon),
    description: "Configure your preferences",
    onClick: () => router.push('/settings')
  }),
  createNavItem({
    href: "#",
    label: "Sign out",
    icon: createIconComponent(LogOutIcon),
    description: "Sign out of your account",
    onClick: (e?: React.MouseEvent) => {
      e?.preventDefault();
      logout();
      router.push('/');
    }
  })
];
