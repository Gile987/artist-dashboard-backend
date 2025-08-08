import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private users: User[] = []; // temporary in-memory users

  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, role: 'artist' | 'admin') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: this.users.length + 1,
      email,
      password: hashedPassword,
      role,
    };
    this.users.push(newUser);
    return { message: 'User registered' };
  }

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { access_token: token };
  }
}
