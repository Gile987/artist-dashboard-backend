import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReleaseService } from './release.service';

@Controller('releases')
export class ReleaseController {
  constructor(private releaseService: ReleaseService) {}

  @Post()
  create(
    @Body()
    body: {
      title: string;
      releaseDate: string;
      artistId: number;
      coverUrl?: string;
      audioUrl?: string;
    },
  ) {
    return this.releaseService.create({
      title: body.title,
      releaseDate: new Date(body.releaseDate),
      artistId: body.artistId,
      coverUrl: body.coverUrl,
      audioUrl: body.audioUrl,
    });
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId') artistId: string) {
    return this.releaseService.findByArtist(Number(artistId));
  }
}
