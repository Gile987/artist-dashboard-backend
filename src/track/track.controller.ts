import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  create(
    @Body()
    body: {
      title: string;
      duration: number;
      releaseId: number;
      isrc?: string;
    },
  ) {
    return this.trackService.create(body);
  }

  @Get('release/:releaseId')
  findByRelease(@Param('releaseId') releaseId: string) {
    return this.trackService.findByRelease(Number(releaseId));
  }
}
