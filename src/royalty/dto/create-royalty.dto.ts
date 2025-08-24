import { IsNumber, IsString, IsInt, Min } from 'class-validator';

export class CreateRoyaltyDto {
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  period!: string;

  @IsInt()
  trackId!: number;

  @IsInt()
  artistId!: number;
}
