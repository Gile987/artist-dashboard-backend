import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Release } from '@prisma/client';

@Injectable()
export class ReleaseService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    releaseDate: Date;
    artistId: number;
    coverUrl?: string;
    audioUrl?: string;
  }): Promise<Release> {
    return this.prisma.release.create({ data });
  }

  async findByArtist(artistId: number): Promise<Release[]> {
    return this.prisma.release.findMany({
      where: { artistId },
      include: { tracks: true },
    });
  }
}
