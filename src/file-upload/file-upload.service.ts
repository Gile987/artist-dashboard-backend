import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto', // Cloudflare R2 uses 'auto'
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
      forcePathStyle: true, // important for R2
    });
  }

  async getSignedUploadUrl(
    filename: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: filename,
      ContentType: contentType,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    }); // 5 mins
    return signedUrl;
  }
}
