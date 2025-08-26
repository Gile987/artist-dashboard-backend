import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ReleaseService } from './release.service';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseStatus } from '@prisma/client';

@Controller('releases')
export class ReleaseController {
  constructor(private releaseService: ReleaseService) {}

  @Post()
  create(@Body() data: CreateReleaseDto) {
    return this.releaseService.create(data);
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId') artistId: string) {
    return this.releaseService.findByArtist(Number(artistId));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.releaseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReleaseDto,
  ) {
    // Valid status values: PENDING, APPROVED, REJECTED
    return this.releaseService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.releaseService.delete(id);
  }
}
