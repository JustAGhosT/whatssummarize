import { DataSource } from 'typeorm';
import { Message } from '../db/entities/Message';
import { Group } from '../db/entities/Group';
import { User } from '../db/entities/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // Set to false in production and use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [Message, Group, User],
  migrations: ['src/db/migrations/*.ts'],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};
