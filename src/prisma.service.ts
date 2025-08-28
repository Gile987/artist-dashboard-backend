import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (params.model === 'Track') {
        console.log(
          `Prisma Middleware: Handling Track operation - Action: ${params.action}`,
        );

        if (
          params.action === 'update' &&
          params.args.data?.royalty !== undefined
        ) {
          console.log('Skipping middleware for internal royalty update');
          return next(params);
        }

        const result = await next(params);

        let releaseId: number | null = null;
        if (params.action === 'create' && result) {
          releaseId = result.releaseId;
        } else if (params.action === 'update' && result) {
          releaseId = result.releaseId;
        } else if (params.action === 'delete' && result) {
          releaseId = result.releaseId;
        } else if (
          params.action === 'updateMany' &&
          params.args.where?.releaseId
        ) {
          releaseId = params.args.where.releaseId;
        }

        if (releaseId) {
          await this.recalculateReleaseStreamsAndRoyalties(releaseId);
        }

        if (
          (params.action === 'update' || params.action === 'create') &&
          result
        ) {
          const trackId = result.id;
          const streams = result.streams || 0;
          const royalty = streams * 0.01;
          await this.track.update({
            where: { id: trackId },
            data: { royalty },
          });
          const track = await this.track.findUnique({
            where: { id: trackId },
            select: { release: { select: { artistId: true } } },
          });
          const artistId = track?.release?.artistId;
          if (artistId) {
            const now = new Date();
            const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            await this.royalty.upsert({
              where: { trackId_period: { trackId, period } },
              update: { amount: royalty, artistId },
              create: { amount: royalty, period, trackId, artistId },
            });
          }
        }

        return result;
      }

      return next(params);
    });
  }

  private async recalculateReleaseStreamsAndRoyalties(
    releaseId: number,
  ): Promise<void> {
    try {
      const tracks = await this.track.findMany({
        where: { releaseId },
        select: { streams: true },
      });

      const totalStreams = tracks.reduce(
        (sum, track) => sum + (track.streams || 0),
        0,
      );
      const totalRoyalty = tracks.reduce(
        (sum, track) => sum + (track.streams || 0) * 0.01,
        0,
      );

      await this.release.update({
        where: { id: releaseId },
        data: { streams: totalStreams, totalRoyalty },
      });
    } catch (error) {}
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
