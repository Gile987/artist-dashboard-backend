import {
  IsString,
  IsDateString,
  IsOptional,
  IsUrl,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateReleaseDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsDateString()
  releaseDate!: string;

  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @IsInt()
  artistId!: number;
}
