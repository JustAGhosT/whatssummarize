import { jest, describe, it, expect, beforeAll, afterEach } from '@jest/globals';
import { parseWhatsAppExport } from '../chat-export.service';
import type { ChatExportData } from '../chat-export.service';

describe('ChatExportService', () => {
  describe('parseWhatsAppExport', () => {
    it('should parse a simple WhatsApp export', async () => {
      const chatContent = `
[08/01/2023, 10:30:00] John Doe: Hello, how are you?
[08/01/2023, 10:31:15] Jane Smith: I'm good, thanks! How about you?
[08/01/2023, 10:32:30] John Doe: Doing well, thanks for asking!
      `;

      const result = await parseWhatsAppExport(chatContent);

      expect(result).toBeDefined();
      expect(result.participants).toContain('John Doe');
      expect(result.participants).toContain('Jane Smith');
      expect(result.messages).toHaveLength(3);
      
      const firstMessage = result.messages[0];
      expect(firstMessage.sender).toBe('John Doe');
      expect(firstMessage.content).toBe('Hello, how are you?');
      expect(firstMessage.timestamp).toBeInstanceOf(Date);
      
      const secondMessage = result.messages[1];
      expect(secondMessage.sender).toBe('Jane Smith');
      expect(secondMessage.content).toBe('I\'m good, thanks! How about you?');
      
      // Verify metadata
      expect(result.metadata).toBeDefined();
      expect(result.metadata.exportDate).toBeInstanceOf(Date);
      expect(result.metadata.platform).toBe('whatsapp');
    });

    it('should handle empty content', async () => {
      const result = await parseWhatsAppExport('');
      
      expect(result).toBeDefined();
      expect(result.participants).toHaveLength(0);
      expect(result.messages).toHaveLength(0);
    });

    it('should handle malformed lines', async () => {
      const chatContent = `
This is not a valid line
[Invalid Date Format] John Doe: This line will be skipped
[08/01/2023, 10:30:00] : Message with missing sender
      `;

      const result = await parseWhatsAppExport(chatContent);
      
      expect(result).toBeDefined();
      expect(result.messages).toHaveLength(0);
    });
    
    it('should handle media messages', async () => {
      const chatContent = `
[08/01/2023, 10:30:00] John Doe: <Media omitted>
[08/01/2023, 10:31:00] Jane Smith: Here's a photo!
      `;
      
      const result = await parseWhatsAppExport(chatContent);
      
      expect(result.messages[0].isMedia).toBe(true);
      expect(result.messages[1].isMedia).toBe(false);
    });
  });
});
