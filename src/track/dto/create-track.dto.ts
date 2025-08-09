import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title!: string;

  @IsInt()
  @Min(1)
  duration!: number;

  @IsOptional()
  @IsString()
  isrc?: string;

  @IsInt()
  releaseId!: number;
}
