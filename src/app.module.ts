import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { ReleaseModule } from './release/release.module';
import { TrackModule } from './track/track.module';
import { FileUploadController } from './file-upload/file-upload.controller';
import { FileUploadService } from './file-upload/file-upload.service';

@Module({
  imports: [AuthModule, UserModule, ReleaseModule, TrackModule],
  controllers: [AppController, FileUploadController],
  providers: [AppService, PrismaService, FileUploadService],
})
export class AppModule {}
