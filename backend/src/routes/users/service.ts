import pool from '../../../database';
import { UpdateUserRequest, User } from './models';

export class UserService {
  static async getAllUsers() {
    const result = await pool.query(
      'SELECT username, email, role, FROM users ORDER BY username ASC'
    );
    return result.rows;
  }

  static async getUserByUsername(username: string): Promise<User> {
    const result = await pool.query(
      'SELECT username, email, role FROM users WHERE username = $1',
      [username]
    );

    if (!result.rows.length) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }

  static async updateUser(username: string, updates: UpdateUserRequest): Promise<User> {
    const setClause = Object.entries(updates)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE username = $1 RETURNING username, email, role`,
      [username, ...Object.values(updates)]
    );

    return result.rows[0];
  }
}