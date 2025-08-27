import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    // Add middleware to automatically update release streams when tracks change
    this.$use(async (params, next) => {
      // Only handle Track operations
      if (params.model === 'Track') {
        const result = await next(params);

        // Get the releaseId from different operation types
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

        if (params.action === 'update' || params.action === 'create') {
          const trackId = result.id;
          const streams = result.streams || 0;
          const royalty = streams * 0.01;

          await this.track.update({
            where: { id: trackId },
            data: { royalty },
          });
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
