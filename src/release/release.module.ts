import { Module } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReleaseController } from './release.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ReleaseService, PrismaService],
  controllers: [ReleaseController],
  exports: [ReleaseService],
})
export class ReleaseModule {}
