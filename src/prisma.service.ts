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

        // Recalculate release total streams if we have a releaseId
        if (releaseId) {
          await this.recalculateReleaseStreams(releaseId);
        }

        return result;
      }

      return next(params);
    });
  }

  /**
   * Recalculate and update the total streams for a release
   */
  private async recalculateReleaseStreams(releaseId: number): Promise<void> {
    try {
      const tracks = await this.track.findMany({
        where: { releaseId },
        select: { streams: true },
      });

      const totalStreams = tracks.reduce(
        (sum, track) => sum + (track.streams || 0),
        0,
      );

      await this.release.update({
        where: { id: releaseId },
        data: { streams: totalStreams },
      });
    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      // In production, you might want to use a proper logger here
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
