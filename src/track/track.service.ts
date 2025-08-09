import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    duration: number;
    releaseId: number;
    isrc?: string;
  }): Promise<Track> {
    return this.prisma.track.create({ data });
  }

  async findByRelease(releaseId: number): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: { releaseId },
    });
  }
}
