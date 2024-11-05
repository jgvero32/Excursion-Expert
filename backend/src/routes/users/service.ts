import pool from '../../../database';
import { UpdateUserRequest, User } from './models';

export class UserService {
  static async getAllUsers() {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getUserById(id: string): Promise<User> {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
      [id]
    );

    if (!result.rows.length) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }

  static async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    const setClause = Object.entries(updates)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, first_name, last_name, role`,
      [id, ...Object.values(updates)]
    );

    return result.rows[0];
  }
}