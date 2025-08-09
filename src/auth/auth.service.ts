import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import type { User } from '@prisma/client';

function isUser(value: any): value is User {
  return (
    value &&
    typeof value.id === 'number' &&
    typeof value.email === 'string' &&
    typeof value.password === 'string' &&
    (value.role === 'artist' || value.role === 'admin')
  );
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    role: 'artist' | 'admin',
  ): Promise<{ message: string }> {
    const hashed = await bcrypt.hash(password, 10);
    await this.prisma.user.create({
      data: { email, password: hashed, role },
    });
    return { message: 'User registered' };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const userRaw = (await this.prisma.user.findUnique({
      where: { email },
    })) as User | null;
    if (!userRaw) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(password, userRaw.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    const payload = { sub: userRaw.id, role: userRaw.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
