import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Release } from '@prisma/client';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';

@Injectable()
export class ReleaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReleaseDto): Promise<Release> {
    return this.prisma.release.create({ data });
  }

  async findOne(id: number) {
    const release = await this.prisma.release.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            royalties: true,
          },
        },
      },
    });
    if (!release) throw new NotFoundException('Release not found');
    return release;
  }

  async update(id: number, data: UpdateReleaseDto): Promise<Release> {
    await this.findOne(id);
    return this.prisma.release.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Release> {
    await this.findOne(id);
    return this.prisma.release.delete({ where: { id } });
  }

  async findByArtist(artistId: number) {
    return this.prisma.release.findMany({
      where: { artistId },
      include: {
        tracks: true,
      },
    });
  }
}
