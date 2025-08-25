import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // Must match AuthModule secret
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
