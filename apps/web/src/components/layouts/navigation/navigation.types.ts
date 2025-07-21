import { ComponentType, ForwardRefExoticComponent } from 'react';
import { LucideProps } from 'lucide-react';

export type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & { className?: string }
>;

export type NavIcon = LucideIcon | ComponentType<{ className?: string; size?: number | string }>;

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
  description?: string;
  requiresAuth?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  children?: NavItem[];
  className?: string;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}
