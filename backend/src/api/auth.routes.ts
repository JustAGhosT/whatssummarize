import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import authController from './auth.controller';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateJWT, authController.getProfile);

export default router;
