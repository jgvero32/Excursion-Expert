import pool from '../../../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginRequest, RegisterRequest } from './models';

export class AuthService {
  // Login method
  static async login({ username, password }: LoginRequest) {
    try {
      const result = await pool.query(
        'SELECT username, email, password, role FROM users WHERE username = $1',
        [username]
      );
  
      const user = result.rows[0];
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid username or password');
      }
  
      const token = jwt.sign(
        { 
          username: user.username, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
  
      return {
        token,
        user: {
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Register method
  static async register({ username, email, password }: RegisterRequest) {
  try {
    const existingUser = await pool.query(
      'SELECT username FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length) {
      throw new Error('Email or username already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING username, email, role`,
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
}

  // Get user by username
  static async getUserByUsername(username: string) {
    const result = await pool.query(
      'SELECT username, email, role FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    return {
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}
