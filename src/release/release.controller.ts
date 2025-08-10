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
      releaseDate: body.releaseDate,
      artistId: body.artistId,
      coverUrl: body.coverUrl,
      audioUrl: body.audioUrl,
    });
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId') artistId: string) {
    return this.releaseService.findByArtist(Number(artistId));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReleaseDto,
  ) {
    return this.releaseService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.releaseService.delete(id);
  }
}
