import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard) // guard the whole controller
@Controller('upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  // only artists can request signed urls
  @Roles('artist')
  @Get('signed-url')
  async getSignedUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
  ) {
    if (!filename || !contentType) {
      throw new Error('Missing filename or contentType');
    }
    const url = await this.fileUploadService.getSignedUploadUrl(
      filename,
      contentType,
    );
    return { url };
  }
}
