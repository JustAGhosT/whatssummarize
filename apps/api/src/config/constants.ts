// JWT Configuration
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// WebSocket Events
export const WS_EVENTS = {
  NEW_MESSAGE: 'new_message',
  MESSAGE_UPDATED: 'message_updated',
  GROUP_UPDATED: 'group_updated',
  USER_CONNECTED: 'user_connected',
  USER_DISCONNECTED: 'user_disconnected',
  ERROR: 'error',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Default Pagination
// ... (rest of the content remains the same)

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Cache TTL in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 1 day
};
