import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { AuthRequest } from '../middleware/auth';

export class GroupController {
  private groupService = new GroupService();

  async createGroup(req: AuthRequest, res: Response) {
    try {
      const { name, description, metadata } = req.body;
      const group = await this.groupService.createGroup(name, description, metadata);
      res.status(201).json(group);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const group = await this.groupService.getGroupById(id);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.json(group);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllGroups(_req: Request, res: Response) {
    try {
      const groups = await this.groupService.getAllGroups();
      res.json(groups);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateGroup(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const group = await this.groupService.updateGroup(id, updates);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.json(group);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteGroup(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.groupService.deleteGroup(id);
      if (!success) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.json({ message: 'Group deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGroupMessages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const { messages, total } = await this.groupService.getGroupMessages(id, page, limit);
      
      res.json({
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new GroupController();
