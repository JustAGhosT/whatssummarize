/**
 * Chrome Extension Configuration
 *
 * Production-ready configuration management for the WhatsSummarize extension.
 * Supports both development and production environments.
 */

// Environment detection
const isDevelopment = !chrome.runtime.getManifest().update_url;

// API Configuration
export const API_CONFIG = {
  // Production URLs (updated during build)
  production: {
    apiUrl: 'https://api.whatssummarize.com',
    wsUrl: 'wss://api.whatssummarize.com/ws',
    dashboardUrl: 'https://app.whatssummarize.com',
  },
  // Development URLs
  development: {
    apiUrl: 'http://localhost:3001',
    wsUrl: 'ws://localhost:3001/ws',
    dashboardUrl: 'http://localhost:3000',
  },
};

// Get current environment config
export function getConfig() {
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
}

// WhatsApp Web DOM Selectors
// These may need updates as WhatsApp changes their UI
export const SELECTORS = {
  // Primary selectors (data-testid based - most stable)
  primary: {
    chatList: '[data-testid="chat-list"]',
    messageList: '[data-testid="conversation-panel-messages"]',
    messageContainer: '[data-testid="msg-container"]',
    messageText: '[data-testid="msg-text"]',
    messageTime: '[data-testid="msg-meta"]',
    senderName: '[data-testid="msg-sender"]',
    chatHeader: '[data-testid="conversation-header"]',
    contactName: '[data-testid="conversation-info-header-chat-title"]',
    scrollableMessageList: '[data-testid="conversation-panel-body"]',
  },
  // Fallback selectors (class-based - less stable)
  fallback: {
    chatList: '.copyable-area [role="listitem"]',
    messageList: '.message-list',
    messageContainer: '.message-in, .message-out',
    messageText: '.selectable-text span[dir="ltr"]',
    messageTime: '.copyable-text span[dir="auto"]',
    senderName: 'span[dir="auto"]._ahxt',
    chatHeader: 'header._ao8g',
    contactName: 'span[dir="auto"]._ao3e',
    scrollableMessageList: '._asmz',
  },
};

// Extraction configuration
export const EXTRACTION_CONFIG = {
  // Delay between message extractions to avoid rate limiting
  extractionDelayMs: 50,
  // Maximum messages to extract in one batch
  maxMessagesPerBatch: 500,
  // Timeout for extraction operations
  extractionTimeoutMs: 30000,
  // Retry configuration
  retryAttempts: 3,
  retryDelayMs: 1000,
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // Maximum extractions per minute
  maxExtractionsPerMinute: 5,
  // Maximum API calls per minute
  maxApiCallsPerMinute: 10,
  // Cooldown period after rate limit hit
  cooldownMs: 60000,
};

// Storage keys
export const STORAGE_KEYS = {
  authToken: 'authToken',
  user: 'user',
  settings: 'settings',
  extractionHistory: 'extractionHistory',
  pendingUploads: 'pendingUploads',
};

// Default settings
export interface ExtensionSettings {
  autoExtract: boolean;
  showNotifications: boolean;
  extractMediaMetadata: boolean;
  maxStoredExtractions: number;
  theme: 'light' | 'dark' | 'auto';
  apiEndpoint: string;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  autoExtract: false,
  showNotifications: true,
  extractMediaMetadata: true,
  maxStoredExtractions: 50,
  theme: 'auto',
  apiEndpoint: '',
};

// Message types for extension communication
export type MessageAction =
  | 'GET_CURRENT_CHAT'
  | 'CHECK_STATUS'
  | 'SET_AUTH_TOKEN'
  | 'SEND_CHAT_DATA'
  | 'OPEN_DASHBOARD'
  | 'GET_AUTH_STATUS'
  | 'LOGIN'
  | 'LOGOUT'
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS'
  | 'CLEAR_PENDING_UPLOADS'
  | 'RETRY_PENDING_UPLOADS';

export interface ExtensionMessage {
  action: MessageAction;
  [key: string]: any;
}

export interface ExtensionResponse {
  success: boolean;
  data?: any;
  error?: string;
}
