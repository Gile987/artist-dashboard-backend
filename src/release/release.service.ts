import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Release, ReleaseStatus } from '@prisma/client';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';

@Injectable()
export class ReleaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReleaseDto): Promise<Release> {
    return this.prisma.release.create({ data });
  }

  async findOne(id: number): Promise<Release & { totalStreams: number }> {
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

    const totalStreams = release.tracks.reduce(
      (sum, track) => sum + (track.streams || 0),
      0,
    );

    return {
      ...release,
      totalStreams,
    };
  }

  async update(id: number, data: UpdateReleaseDto): Promise<Release> {
    await this.findOne(id);

    const updateData: any = {
      ...data,
      releaseDate:
        data.releaseDate && typeof data.releaseDate === 'string'
          ? new Date(data.releaseDate)
          : data.releaseDate,
    };

    if (data.status) {
      const upperStatus = data.status.toUpperCase();

      const validStatuses = Object.values(ReleaseStatus);
      if (!validStatuses.includes(upperStatus as ReleaseStatus)) {
        throw new BadRequestException(
          `Invalid status value. Valid values are: ${validStatuses.join(', ')}`,
        );
      }

      updateData.status = upperStatus;
    }

    return this.prisma.release.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<Release> {
    await this.findOne(id);
    return this.prisma.release.delete({ where: { id } });
  }

  async findByArtist(
    artistId: number,
  ): Promise<(Release & { totalStreams: number })[]> {
    const releases = await this.prisma.release.findMany({
      where: { artistId },
      include: {
        tracks: true,
      },
    });

    return releases.map((release) => ({
      ...release,
      totalStreams: release.tracks.reduce(
        (sum, track) => sum + (track.streams || 0),
        0,
      ),
    }));
  }
}
