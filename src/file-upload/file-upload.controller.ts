import { Controller, Get, Query } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

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
