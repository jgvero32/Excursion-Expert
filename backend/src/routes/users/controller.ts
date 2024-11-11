import { Response } from 'express';
import { UserService } from './service';
import { UpdateUserRequest } from './models';
import { AuthRequest } from '../../middleware/auth.middleware';

export class UserController {
  static async getAllUsers(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProfile(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = await UserService.getUserByUsername(req.user!.username);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateProfile(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const updates: UpdateUserRequest = req.body;
      const user = await UserService.updateUser(req.user!.username, updates);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
