import { Router } from 'express';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJWT } from '../middleware/auth';
import { logger } from '../utils/logger';
import { initWebSocket, emitToGroup } from '../sockets';
import { WS_EVENTS } from '../config/constants';

// This file is kept for backward compatibility
// All routes have been moved to their respective route files in the api/ directory

export function setupRoutes(app: any, httpServer: HttpServer): void {
  const router = Router();

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Initialize WebSocket server
  const io = initWebSocket(httpServer);
  
  // Handle WebSocket connections
  io.on('connection', (socket) => {
    logger.info(`New WebSocket connection: ${socket.id}`);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error: Error) => {
      logger.error('WebSocket error:', error);
    });
  });

  // Example of emitting to a group (for reference)
  // emitToGroup(io, 'group-id', WS_EVENTS.GROUP_UPDATED, { message: 'Group updated' });

  // Mount API routes
  app.use('/api', router);
  
  // Global error handler
  app.use((error: any, _req: any, res: any, _next: any) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  });
}
