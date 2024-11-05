import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  const adminPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    const dbCheckResult = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbCheckResult.rowCount === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await adminPool.end();
  }

  // Connect to our app database and create schema
  const appPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    // Create extensions, enums, and tables
    await appPool.query(`
      -- Enable UUID generation
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create enum types if they don't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('user', 'admin');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_status') THEN
          CREATE TYPE trip_status AS ENUM ('draft', 'planned', 'in_progress', 'completed', 'cancelled');
        END IF;
      END $$;

      -- Create users table if it doesn't exist
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role user_role DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create update trigger function if it doesn't exist
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
          CREATE TRIGGER update_users_updated_at
              BEFORE UPDATE ON users
              FOR EACH ROW
              EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$;
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  } finally {
    await appPool.end();
  }
}

export default initializeDatabase;