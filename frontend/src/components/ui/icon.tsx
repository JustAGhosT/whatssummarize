import { ComponentType, SVGProps } from 'react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 24, className = '', ...props }: IconProps) => {
  const LucideIcon = LucideIcons[name] as ComponentType<SVGProps<SVGSVGElement>>;
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <LucideIcon 
      width={size} 
      height={size} 
      className={className} 
      {...props} 
    />
  );
};

export type { IconName };

// Re-export all Lucide icons for convenience
export * from 'lucide-react';
