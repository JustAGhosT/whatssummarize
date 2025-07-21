import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names to be combined and merged
 * @returns A single string of combined and merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a human-readable string
 * @param date - Date object or timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', options);
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param str - String to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

/**
 * Generates a unique ID
 * @returns A unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounces a function
 * @param func - Function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Checks if a value is empty
 * @param value - Value to check
 * @returns True if the value is null, undefined, empty string, empty array, or empty object
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}
