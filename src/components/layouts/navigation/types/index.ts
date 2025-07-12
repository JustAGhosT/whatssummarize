import { ComponentType, MouseEvent } from 'react';
import { User } from "@/types/contexts";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  shortcut?: string;
  requiresAuth?: boolean;
  description?: string;
  className?: string;
  size?: number;
  onClick?: (e?: MouseEvent) => void;
}

export interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  className?: string;
  onClick?: () => void;
}

export interface MobileNavLinkProps extends NavLinkProps {}

export interface DropdownButtonProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  id: string;
}

export interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export interface NavigationProps {
  user?: User | null;
  logout: () => void;
}

export interface UseNavigationReturn {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  moreDropdownOpen: boolean;
  userDropdownOpen: boolean;
  isDarkMode: boolean;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  toggleMoreDropdown: () => void;
  toggleUserDropdown: () => void;
  toggleDarkMode: () => void;
  handleUserMenuItemClick: (e: React.MouseEvent, href?: string, onClick?: (e: React.MouseEvent) => void | Promise<void>) => void;
  moreDropdownRef: React.RefObject<HTMLButtonElement>;
  userDropdownRef: React.RefObject<HTMLDivElement>;
  mobileMenuRef: React.RefObject<HTMLDivElement>;
  searchBarRef: React.RefObject<HTMLDivElement>;
  filteredNavItems: NavItem[];
  filteredMoreItems: NavItem[];
  userMenuItems: NavItem[];
}
