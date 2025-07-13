import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth';
import groupController from './group.controller';

const router = Router();

// Apply authentication middleware to all group routes
router.use(authenticateJWT);

// Group routes
router.post('/', groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', requireRole(['admin']), groupController.deleteGroup);
router.get('/:id/messages', groupController.getGroupMessages);

export default router;
