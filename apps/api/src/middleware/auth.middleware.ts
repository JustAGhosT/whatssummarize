import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with your User type
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('No authentication token provided');
    return res.sendStatus(401);
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const user = jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (error) {
    logger.error('Invalid or expired token', { error });
    return res.sendStatus(403);
  }
};

export default {
  authenticateToken,
};
