import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsInt()
  @Min(1)
  duration!: number; // seconds

  @IsInt()
  releaseId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  isrc?: string;

  @IsUrl()
  fileUrl!: string; //Cloudflare file URL

  @IsOptional()
  @IsInt()
  @Min(0)
  streams?: number;
}
