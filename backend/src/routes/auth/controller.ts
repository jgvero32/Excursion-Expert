import { Request, Response } from 'express';
import { AuthService } from './service';
import { LoginRequest, RegisterRequest } from './models';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {
  static async login(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const loginRequest: LoginRequest = req.body;
      const result = await AuthService.login(loginRequest);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async register(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const registerRequest: RegisterRequest = req.body;
      const result = await AuthService.register(registerRequest);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const user = await AuthService.getUserById(req.user.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // If you're using session-based auth, you might want to destroy the session here
      // If you're using JWT, you typically just let the token expire
      // The frontend will remove the token from localStorage

      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}