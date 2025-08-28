import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RoyaltyService } from './royalty.service';
import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@Controller('royalties')
export class RoyaltyController {
  constructor(private readonly royaltyService: RoyaltyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createRoyaltyDto: CreateRoyaltyDto) {
    return this.royaltyService.create(createRoyaltyDto);
  }

  @Get()
  findAll() {
    return this.royaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.royaltyService.findOne(id);
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId', ParseIntPipe) artistId: number) {
    return this.royaltyService.findByArtist(artistId);
  }

  @Get('track/:trackId')
  findByTrack(@Param('trackId', ParseIntPipe) trackId: number) {
    return this.royaltyService.findByTrack(trackId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoyaltyDto: UpdateRoyaltyDto,
  ) {
    return this.royaltyService.update(id, updateRoyaltyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.royaltyService.remove(id);
  }
}
