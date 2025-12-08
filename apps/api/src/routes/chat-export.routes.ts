import { Router, Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import { parseWhatsAppExport } from '../services/chat-export.service';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      user?: any; // You should replace 'any' with your actual user type
    }
  }
}

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'));
    }
  },
});

/**
 * @route POST /api/chat-export/upload
 * @description Upload and process a WhatsApp chat export file
 * @access Private
 */
router.post(
  '/upload',
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      const chatData = await parseWhatsAppExport(fileContent, userId);

      // TODO: Store chatData in the database
      // await saveChatData(chatData, userId);

      res.status(200).json({
        message: 'File processed successfully',
        data: {
          messageCount: chatData.messages.length,
          participants: chatData.participants,
          dateRange: {
            start: chatData.messages[0]?.timestamp,
            end: chatData.messages[chatData.messages.length - 1]?.timestamp,
          },
        },
      });
    } catch (error) {
      logger.error('Error processing chat export:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to process file';
      res.status(500).json({ error: errorMessage });
    }
  }
);

export { router as default };
