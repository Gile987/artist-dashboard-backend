import {
  IsString,
  IsDateString,
  IsOptional,
  IsUrl,
  IsInt,
} from 'class-validator';

export class CreateReleaseDto {
  @IsString()
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
