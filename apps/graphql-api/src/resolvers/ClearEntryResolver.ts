import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { ClearEntry, prisma } from 'database';
import { ClearEntryModel } from '../types/ClearEntryModel';
import {
  ClearEntryInput,
  UpdateClearEntryInput,
  VerifyClearEntryInput,
} from '../inputs/ClearEntryInput';
import { ClearEntryResponse, ClearEntriesResponse } from '../types/ClearEntryResponse';
import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';
import { Context } from '../types/Context';

@Resolver()
export class ClearEntryResolver {
  // Get all clear entries
  @Query(() => ClearEntriesResponse)
  async clearEntries(): Promise<ClearEntriesResponse> {
    const clearEntries = await prisma.clearEntry.findMany({
      include: {
        createdBy: true,
      },
    });
    return {
      clearEntries,
      totalCount: clearEntries.length,
    };
  }

  // Get a specific clear entry by ID
  @Query(() => ClearEntryModel, { nullable: true })
  async clearEntry(@Arg('publicUuid') publicUuid: string): Promise<ClearEntry | null> {
    return prisma.clearEntry.findUnique({
      where: { public_uuid: publicUuid },
      include: {
        createdBy: true,
      },
    });
  }

  // Get all clear entries for a specific user
  @Query(() => ClearEntriesResponse)
  async userClearEntries(
    @Arg('userPublicUuid') userPublicUuid: string,
  ): Promise<ClearEntriesResponse> {
    // First get the user to obtain the internal userId
    const user = await prisma.user.findUnique({
      where: { public_uuid: userPublicUuid },
    });

    if (!user) {
      return {
        clearEntries: [],
        totalCount: 0,
      };
    }

    const clearEntries = await prisma.clearEntry.findMany({
      where: { userId: BigInt(user.id) },
      include: {
        createdBy: true,
      },
    });
    return {
      clearEntries,
      totalCount: clearEntries.length,
    };
  }

  // Create a new clear entry
  @Mutation(() => ClearEntryResponse)
  @UseMiddleware(isAuth)
  async createClearEntry(
    @Arg('data') data: ClearEntryInput,
    @Ctx() ctx: Context,
  ): Promise<ClearEntryResponse> {
    try {
      if (!ctx.user) {
        return {
          errors: [{ field: 'auth', message: 'Not authenticated' }],
        };
      }

      const clearEntry = await prisma.clearEntry.create({
        data: {
          shotType: data.shotType,
          game: data.game,
          achievementType: data.achievementType as any,
          numberOfDeaths: data.numberOfDeaths,
          numberOfBombs: data.numberOfBombs,
          isNoDeaths: data.isNoDeaths,
          isNoBombs: data.isNoBombs,
          isNo3rdCondition: data.isNo3rdCondition,
          replayLink: data.replayLink,
          videoLink: data.videoLink,
          dateAchieved: data.dateAchieved,
          userId: BigInt(ctx.user.id),
        },
        include: {
          createdBy: true,
        },
      });

      return { clearEntry };
    } catch (error: any) {
      return {
        errors: [{ field: 'server', message: `Error: ${error.message || 'Something went wrong'}` }],
      };
    }
  }

  // Update an existing clear entry
  @Mutation(() => ClearEntryResponse)
  @UseMiddleware(isAuth)
  async updateClearEntry(
    @Arg('data') data: UpdateClearEntryInput,
    @Ctx() ctx: Context,
  ): Promise<ClearEntryResponse> {
    try {
      if (!ctx.user) {
        return {
          errors: [{ field: 'auth', message: 'Not authenticated' }],
        };
      }

      // Find the clear entry
      const existingEntry = await prisma.clearEntry.findUnique({
        where: { public_uuid: data.public_uuid },
      });

      if (!existingEntry) {
        return {
          errors: [{ field: 'id', message: 'Clear entry not found' }],
        };
      }

      // Check if user is the owner or an admin
      if (existingEntry.userId.toString() !== ctx.user.id && ctx.user.role !== 'ADMIN') {
        return {
          errors: [{ field: 'auth', message: 'Not authorized to update this entry' }],
        };
      }

      const updateData: any = {};
      if (data.shotType) updateData.shotType = data.shotType;
      if (data.game) updateData.game = data.game;
      if (data.achievementType) updateData.achievementType = data.achievementType;
      if (data.numberOfDeaths !== undefined) updateData.numberOfDeaths = data.numberOfDeaths;
      if (data.numberOfBombs !== undefined) updateData.numberOfBombs = data.numberOfBombs;
      if (data.isNoDeaths !== undefined) updateData.isNoDeaths = data.isNoDeaths;
      if (data.isNoBombs !== undefined) updateData.isNoBombs = data.isNoBombs;
      if (data.isNo3rdCondition !== undefined) updateData.isNo3rdCondition = data.isNo3rdCondition;
      if (data.replayLink !== undefined) updateData.replayLink = data.replayLink;
      if (data.videoLink !== undefined) updateData.videoLink = data.videoLink;
      if (data.dateAchieved) updateData.dateAchieved = data.dateAchieved;

      const clearEntry = await prisma.clearEntry.update({
        where: { public_uuid: data.public_uuid },
        data: updateData,
        include: {
          createdBy: true,
        },
      });

      return { clearEntry };
    } catch (error: any) {
      return {
        errors: [{ field: 'server', message: `Error: ${error.message || 'Something went wrong'}` }],
      };
    }
  }

  // Verify a clear entry (admin only)
  @Mutation(() => ClearEntryResponse)
  @UseMiddleware(isAuth, isAdmin)
  async verifyClearEntry(@Arg('data') data: VerifyClearEntryInput): Promise<ClearEntryResponse> {
    try {
      const existingEntry = await prisma.clearEntry.findUnique({
        where: { public_uuid: data.public_uuid },
      });

      if (!existingEntry) {
        return {
          errors: [{ field: 'id', message: 'Clear entry not found' }],
        };
      }

      const updateData: any = {
        verified: data.verified,
      };

      // If danmaku points are provided, update them
      if (data.danmaku_points !== undefined) {
        updateData.danmaku_points = data.danmaku_points;

        // If we're verifying the entry, update the user's total danmaku points
        if (data.verified) {
          const user = await prisma.user.findUnique({
            where: { id: existingEntry.userId.toString() },
          });

          if (user) {
            // Update user's danmaku points
            await prisma.user.update({
              where: { id: existingEntry.userId.toString() },
              data: {
                danmaku_points: {
                  increment: data.danmaku_points,
                },
              },
            });
          }
        }
      }

      const clearEntry = await prisma.clearEntry.update({
        where: { public_uuid: data.public_uuid },
        data: updateData,
        include: {
          createdBy: true,
        },
      });

      return { clearEntry };
    } catch (error: any) {
      return {
        errors: [{ field: 'server', message: `Error: ${error.message || 'Something went wrong'}` }],
      };
    }
  }

  // Delete a clear entry
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteClearEntry(
    @Arg('publicUuid') publicUuid: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    try {
      if (!ctx.user) {
        return false;
      }

      const existingEntry = await prisma.clearEntry.findUnique({
        where: { public_uuid: publicUuid },
      });

      if (!existingEntry) {
        return false;
      }

      // Check if user is the owner or an admin
      if (existingEntry.userId.toString() !== ctx.user.id && ctx.user.role !== 'ADMIN') {
        return false;
      }

      await prisma.clearEntry.delete({
        where: { public_uuid: publicUuid },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
