import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../db/entities/User';
import { UserRole } from '../db/entities/User';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(email: string, password: string, name?: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User();
    user.email = email;
    user.password = password; // Will be hashed by the @BeforeInsert hook
    user.name = name;
    user.role = UserRole.USER;
    user.isActive = true;

    return this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async getProfile(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
