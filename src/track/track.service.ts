import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Track } from '@prisma/client';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({ data });
  }

  async findByRelease(releaseId: number): Promise<Track[]> {
    return this.prisma.track.findMany({ where: { releaseId } });
  }

  async findOne(id: number): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async update(id: number, data: UpdateTrackDto): Promise<Track> {
    await this.findOne(id);
    return this.prisma.track.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Track> {
    await this.findOne(id);

    await this.prisma.royalty.deleteMany({
      where: { trackId: id },
    });

    return this.prisma.track.delete({ where: { id } });
  }
}
