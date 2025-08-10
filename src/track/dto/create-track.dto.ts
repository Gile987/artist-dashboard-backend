import { IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

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
}
