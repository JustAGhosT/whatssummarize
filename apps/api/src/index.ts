import 'reflect-metadata';
import dotenv from 'dotenv';
import http from 'http';
import { createApp } from './app';
import { logger } from './utils/logger';
import { initializeDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Create Express app
    const app = createApp();
    
    // Create HTTP server
    const server = http.createServer(app);
    
    // Set up WebSocket
    const io = require('socket.io')(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    
    // Initialize WebSocket handlers
    require('./sockets/whatsapp.socket').initializeSocket(io);
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
    
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
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { startServer };
