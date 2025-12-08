import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import groupRoutes from './routes/group.routes';
import chatExportRoutes from './routes/chat-export.routes';
import { logger } from './utils/logger';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  
  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/chat-export', chatExportRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  });

  return app;
};

// Initialize database and start server if this file is run directly
if (require.main === module) {
  (async () => {
    try {
      await initializeDatabase();
      const app = createApp();
      const PORT = process.env.PORT || 3001;
      
      const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });

      // Set up WebSocket
      const io = require('socket.io')(server, {
        cors: {
          origin: process.env.FRONTEND_URL || 'http://localhost:3000',
          methods: ['GET', 'POST']
        }
      });
      
      require('./sockets/whatsapp.socket').initializeSocket(io);
      
      // Handle graceful shutdown
      process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully');
        server.close(() => {
          logger.info('Process terminated');
          process.exit(0);
        });
      });

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  })();
}

export default createApp;
