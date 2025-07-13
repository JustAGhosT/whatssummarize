// Simple mock for the cn utility
export const cn = (...classes: (string | undefined)[]) => 
  classes.filter(Boolean).join(' ');
