import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  create(@Body() data: CreateTrackDto) {
    return this.trackService.create(data);
  }

  @Get('release/:releaseId')
  findByRelease(@Param('releaseId', ParseIntPipe) releaseId: number) {
    return this.trackService.findByRelease(releaseId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trackService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTrackDto) {
    return this.trackService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.trackService.delete(id);
  }
}
