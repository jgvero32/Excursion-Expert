import pool from '../../../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginRequest, RegisterRequest } from './models';

export class AuthService {
  static async login({ email, password }: LoginRequest) {
    try {
      const result = await pool.query(
        'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async register({ email, password, firstName, lastName }: RegisterRequest) {
    try {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length) {
        throw new Error('Email already registered');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, 'user')
         RETURNING id, email, first_name, last_name, role`,
        [email, passwordHash, firstName, lastName]
      );

      const user = result.rows[0];

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId: string) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    };
  }
}