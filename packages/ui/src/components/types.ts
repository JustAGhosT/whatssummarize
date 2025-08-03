import { HTMLAttributes } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}
