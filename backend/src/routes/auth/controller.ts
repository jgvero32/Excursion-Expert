import { Request, Response } from 'express';
import { AuthService } from './service';
import { LoginRequest, RegisterRequest } from './models';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {
  // Login method
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

  // Register method
  static async register(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log('Registering user');
      const registerRequest: RegisterRequest = req.body;
      const result = await AuthService.register(registerRequest);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get the current authenticated user’s profile
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      // Retrieve user by `username` instead of `id`
      const user = await AuthService.getUserByUsername(req.user.username);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // Logout method
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
