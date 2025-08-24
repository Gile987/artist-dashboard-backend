import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';

@Injectable()
export class RoyaltyService {
  constructor(private prisma: PrismaService) {}

  async create(createRoyaltyDto: CreateRoyaltyDto) {
    return this.prisma.royalty.create({
      data: createRoyaltyDto,
      include: {
        track: {
          select: {
            id: true,
            title: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.royalty.findMany({
      include: {
        track: {
          select: {
            id: true,
            title: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        period: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const royalty = await this.prisma.royalty.findUnique({
      where: { id },
      include: {
        track: {
          select: {
            id: true,
            title: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!royalty) {
      throw new NotFoundException(`Royalty with ID ${id} not found`);
    }

    return royalty;
  }

  async update(id: number, updateRoyaltyDto: UpdateRoyaltyDto) {
    await this.findOne(id);

    return this.prisma.royalty.update({
      where: { id },
      data: updateRoyaltyDto,
      include: {
        track: {
          select: {
            id: true,
            title: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.royalty.delete({
      where: { id },
    });
  }

  async findByArtist(artistId: number) {
    return this.prisma.royalty.findMany({
      where: { artistId },
      include: {
        track: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        period: 'desc',
      },
    });
  }

  async findByTrack(trackId: number) {
    return this.prisma.royalty.findMany({
      where: { trackId },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        period: 'desc',
      },
    });
  }
}
