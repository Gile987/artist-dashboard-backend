import { PartialType } from '@nestjs/mapped-types';
import { CreateReleaseDto } from './create-release.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateReleaseDto extends PartialType(CreateReleaseDto) {
  @IsOptional()
  @IsString()
  @IsIn(
    ['PENDING', 'APPROVED', 'REJECTED', 'pending', 'approved', 'rejected'],
    {
      message:
        'Status must be one of: PENDING, APPROVED, REJECTED (case insensitive)',
    },
  )
  status?: string;
}
