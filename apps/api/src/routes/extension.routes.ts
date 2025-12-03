/**
 * Extension Routes
 *
 * API endpoints for Chrome extension support.
 * Includes selector management and extension configuration.
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { cacheService } from '../services/cache.service.js';
import { CACHE_TTL } from '../config/constants.js';

const router = Router();

// =============================================================================
// Types
// =============================================================================

interface SelectorSet {
  chatList: string;
  messageList: string;
  messageContainer: string;
  messageText: string;
  messageTime: string;
  senderName: string;
  chatHeader: string;
  contactName: string;
  scrollableMessageList: string;
}

interface SelectorConfig {
  version: string;
  updatedAt: string;
  primary: SelectorSet;
  fallback: SelectorSet;
}

interface SelectorReport {
  discovered: Partial<SelectorSet>;
  userAgent: string;
  timestamp: string;
  extensionVersion?: string;
}

// =============================================================================
// Selector Configuration Store
// =============================================================================

// In-memory selector configuration
// In production, this would be stored in a database
let selectorConfig: SelectorConfig = {
  version: '1.0.0',
  updatedAt: new Date().toISOString(),
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

// Selector reports for analysis (kept in memory, would be database in production)
const selectorReports: SelectorReport[] = [];
const MAX_REPORTS = 100;

// =============================================================================
// Routes
// =============================================================================

/**
 * @route GET /api/extension/selectors
 * @description Get current WhatsApp Web selectors
 * @access Public (extension use)
 */
router.get('/selectors', async (req: Request, res: Response) => {
  try {
    const extensionVersion = req.headers['x-extension-version'] as string;

    // Check cache first
    const cacheKey = `selectors:${extensionVersion || 'default'}`;
    const cached = await cacheService.get<SelectorConfig>(cacheKey);

    if (cached) {
      return res.json({ selectors: cached });
    }

    // Cache and return
    await cacheService.set(cacheKey, selectorConfig, CACHE_TTL.LONG);

    res.json({ selectors: selectorConfig });
  } catch (error) {
    logger.error('Error fetching selectors:', error);
    res.status(500).json({ error: 'Failed to fetch selectors' });
  }
});

/**
 * @route POST /api/extension/selectors/report
 * @description Report discovered selectors from extension
 * @access Public (extension use)
 */
router.post('/selectors/report', async (req: Request, res: Response) => {
  try {
    const report: SelectorReport = {
      discovered: req.body.discovered || {},
      userAgent: req.body.userAgent || '',
      timestamp: req.body.timestamp || new Date().toISOString(),
      extensionVersion: req.headers['x-extension-version'] as string,
    };

    // Store report (limited to MAX_REPORTS)
    selectorReports.push(report);
    if (selectorReports.length > MAX_REPORTS) {
      selectorReports.shift();
    }

    logger.info('Selector report received', {
      discovered: Object.keys(report.discovered),
      extensionVersion: report.extensionVersion,
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing selector report:', error);
    res.status(500).json({ error: 'Failed to process report' });
  }
});

/**
 * @route GET /api/extension/selectors/reports
 * @description Get selector reports (admin only)
 * @access Private (would need admin auth)
 */
router.get('/selectors/reports', async (req: Request, res: Response) => {
  // In production, this would require admin authentication
  try {
    res.json({
      reports: selectorReports,
      count: selectorReports.length,
    });
  } catch (error) {
    logger.error('Error fetching selector reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

/**
 * @route PUT /api/extension/selectors
 * @description Update selectors (admin only)
 * @access Private (would need admin auth)
 */
router.put('/selectors', async (req: Request, res: Response) => {
  // In production, this would require admin authentication
  try {
    const { primary, fallback, version } = req.body;

    if (!primary && !fallback) {
      return res.status(400).json({ error: 'primary or fallback selectors required' });
    }

    // Update selectors
    if (primary) {
      selectorConfig.primary = { ...selectorConfig.primary, ...primary };
    }
    if (fallback) {
      selectorConfig.fallback = { ...selectorConfig.fallback, ...fallback };
    }
    if (version) {
      selectorConfig.version = version;
    }

    selectorConfig.updatedAt = new Date().toISOString();

    // Invalidate cache
    await cacheService.deletePattern('selectors:*');

    logger.info('Selectors updated', {
      version: selectorConfig.version,
      updatedFields: {
        primary: primary ? Object.keys(primary) : [],
        fallback: fallback ? Object.keys(fallback) : [],
      },
    });

    res.json({
      success: true,
      selectors: selectorConfig,
    });
  } catch (error) {
    logger.error('Error updating selectors:', error);
    res.status(500).json({ error: 'Failed to update selectors' });
  }
});

/**
 * @route GET /api/extension/config
 * @description Get extension configuration
 * @access Public
 */
router.get('/config', async (req: Request, res: Response) => {
  try {
    const extensionVersion = req.headers['x-extension-version'] as string;

    res.json({
      minVersion: '1.0.0',
      latestVersion: '1.0.0',
      updateRequired: false,
      features: {
        autoExtract: true,
        offlineSync: true,
        selectorAutoUpdate: true,
      },
      endpoints: {
        selectors: '/api/extension/selectors',
        chatExport: '/api/chat-export/extension',
      },
    });
  } catch (error) {
    logger.error('Error fetching extension config:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

export { router as default };
