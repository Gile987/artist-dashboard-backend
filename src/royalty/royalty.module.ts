import { Module } from '@nestjs/common';
import { RoyaltyService } from './royalty.service';
import { RoyaltyController } from './royalty.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [RoyaltyController],
  providers: [RoyaltyService, PrismaService],
  exports: [RoyaltyService],
})
export class RoyaltyModule {}
