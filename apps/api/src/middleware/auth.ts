import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { AppDataSource } from '../config/database';
import { User } from '../db/entities/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: decoded.userId });

      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      return res.sendStatus(403);
    }
  }

  res.sendStatus(401);
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
