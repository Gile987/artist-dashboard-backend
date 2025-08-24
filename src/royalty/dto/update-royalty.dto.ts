import { PartialType } from '@nestjs/mapped-types';
import { CreateRoyaltyDto } from './create-royalty.dto';

export class UpdateRoyaltyDto extends PartialType(CreateRoyaltyDto) {}
