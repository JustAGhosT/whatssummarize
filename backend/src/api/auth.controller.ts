import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const user = await this.authService.register(email, password, name);
      res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        }, 
        token 
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await this.authService.getProfile(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthController();
