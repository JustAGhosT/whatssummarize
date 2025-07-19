import { logger } from '../utils/logger.js';

export interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  mediaUrl?: string;
}

export interface ChatExportData {
  participants: string[];
  messages: ChatMessage[];
  metadata: {
    exportDate: Date;
    platform: 'whatsapp';
    version: string;
  };
}

/**
 * Parses a WhatsApp chat export file content into structured data
 * @param fileContent The raw text content of the WhatsApp export file
 * @returns Parsed chat data
 */
export async function parseWhatsAppExport(
  fileContent: string
): Promise<ChatExportData> {
  try {
    const lines = fileContent.split('\n');
    const participants = new Set<string>();
    const messages: ChatMessage[] = [];
    
    // WhatsApp export format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
    const messageRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?)\s?(?:AM|PM)?\]\s(.+?):\s(.+)$/;
    
    // Alternative format for system messages
    const systemMessageRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?)\s?(?:AM|PM)?\]\s(.+)$/;
    
    let currentMessage: Partial<ChatMessage> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      let match = messageRegex.exec(line);
      let isSystemMessage = false;
      
      if (!match) {
        // Try matching system message format
        const systemMatch = systemMessageRegex.exec(line);
        if (systemMatch) {
          isSystemMessage = true;
          match = systemMatch;
        } else if (currentMessage) {
          // This is a continuation of the previous message
          currentMessage.content += '\n' + line;
          continue;
        } else {
          logger.warn(`Skipping malformed line: ${line}`);
          continue;
        }
      }
      
      // If we have a complete previous message, add it to the messages array
      if (currentMessage && currentMessage.content) {
        messages.push(currentMessage as ChatMessage);
      }
      
      // Parse the new message
      const [_, dateStr, timeStr, sender, content] = match;
      
      // Parse date and time
      let timestamp: Date;
      try {
        // Handle different date formats (DD/MM/YYYY or MM/DD/YYYY)
        const [day, month, year] = dateStr.split(/[\/\-]/).map(Number);
        const yearFull = year < 100 ? 2000 + year : year; // Handle YY vs YYYY
        
        const [hours, minutes, seconds = '00'] = timeStr.split(':');
        timestamp = new Date(
          yearFull,
          month - 1, // months are 0-indexed
          day,
          parseInt(hours, 10),
          parseInt(minutes, 10),
          seconds ? parseInt(seconds, 10) : 0
        );
      } catch (error) {
        logger.error('Error parsing date:', error);
        timestamp = new Date(); // Fallback to current time
      }
      
      // Handle system messages
      if (isSystemMessage) {
        currentMessage = {
          id: `sys-${timestamp.getTime()}-${i}`,
          timestamp,
          sender: 'System',
          content: match[3], // The entire message content for system messages
          isMedia: false,
        };
      } else {
        // Regular message
        participants.add(sender);
        
        // Check for media messages
        const mediaMatch = content.match(/<attached: (.+?)>/);
        const isMedia = !!mediaMatch;
        
        currentMessage = {
          id: `msg-${timestamp.getTime()}-${i}`,
          timestamp,
          sender,
          content: isMedia ? mediaMatch[1] : content,
          isMedia,
        };
      }
    }
    
    // Add the last message if it exists
    if (currentMessage && currentMessage.content) {
      messages.push(currentMessage as ChatMessage);
    }
    
    return {
      participants: Array.from(participants),
      messages: messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
      metadata: {
        exportDate: new Date(),
        platform: 'whatsapp',
        version: '1.0',
      },
    };
  } catch (error) {
    logger.error('Error parsing WhatsApp export:', error);
    throw new Error('Failed to parse WhatsApp export file');
  }
}

/**
 * Validates if the content is a valid WhatsApp chat export
 * @param content The file content to validate
 * @returns boolean indicating if the content is valid
 */
export function isValidWhatsAppExport(content: string): boolean {
  // Check for common WhatsApp export patterns
  const patterns = [
    /\[\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?::\d{2})?\] [^:]+: /, // Standard message
    /^WhatsApp Chat with .+$/, // Header
    /^Messages and calls are end-to-end encrypted/, // Footer
  ];
  
  // Check if any of the patterns match
  return patterns.some(pattern => pattern.test(content));
}
