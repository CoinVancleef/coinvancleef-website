import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { ClearEntry, prisma, AchievementType } from 'database';
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
import { DanmakuPointsCalculator } from '../utils/DanmakuPointsCalculator';
import { WeightingCalculator } from '../utils/WeightingCalculator';
import { TouhouGame } from '../../../web/src/touhou-types/enums';
import {
  mapPrismaClearEntryToClearEntryModel,
  mapPrismaClearEntriesToClearEntryModels,
  idToString,
  stringToBigInt,
} from '../utils/mappers';
import { toBigInt, idFilter, userIdFilter } from '../utils/prismaHelpers';

@Resolver()
export class ClearEntryResolver {
  // Get all clear entries
  @Query(() => ClearEntriesResponse)
  async clearEntries(): Promise<ClearEntriesResponse> {
    try {
      const entries = await prisma.clearEntry.findMany({
        include: {
          createdBy: true,
        },
        orderBy: {
          danmaku_points: 'desc',
        },
      });

      const mappedEntries = mapPrismaClearEntriesToClearEntryModels(entries);

      return {
        clearEntries: mappedEntries,
        totalCount: mappedEntries.length,
      };
    } catch (error: any) {
      console.error('Error fetching clear entries:', error);
      return {
        clearEntries: [],
        totalCount: 0,
      };
    }
  }

  // Get a specific clear entry by ID
  @Query(() => ClearEntryModel, { nullable: true })
  async clearEntry(@Arg('publicUuid') publicUuid: string): Promise<ClearEntryModel | null> {
    const entry = await prisma.clearEntry.findUnique({
      where: { public_uuid: publicUuid },
      include: {
        createdBy: true,
      },
    });

    return mapPrismaClearEntryToClearEntryModel(entry);
  }

  // Get all clear entries for a specific user
  @Query(() => ClearEntriesResponse)
  async userClearEntries(
    @Arg('userPublicUuid') userPublicUuid: string,
    @Ctx() ctx: Context,
  ): Promise<ClearEntriesResponse> {
    try {
      let userId;

      // Handle the "me" special case
      if (userPublicUuid === 'me') {
        if (!ctx.user) {
          return {
            clearEntries: [],
            totalCount: 0,
          };
        }
        userId = ctx.user.id;
      } else {
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

        userId = user.id;
      }

      const entries = await prisma.clearEntry.findMany({
        where: userIdFilter(userId),
        orderBy: {
          danmaku_points: 'desc',
        },
        include: {
          createdBy: true,
        },
      });

      const mappedEntries = mapPrismaClearEntriesToClearEntryModels(entries);

      return {
        clearEntries: mappedEntries,
        totalCount: mappedEntries.length,
      };
    } catch (error: any) {
      console.error('Error fetching user clear entries:', error);
      return {
        clearEntries: [],
        totalCount: 0,
      };
    }
  }

  // Create a new clear entry
  @Mutation(() => ClearEntryResponse)
  @UseMiddleware(isAuth)
  async createClearEntry(
    @Arg('data') data: ClearEntryInput,
    @Ctx() ctx: Context,
  ): Promise<ClearEntryResponse> {
    try {
      // Get user ID from request
      const userId = ctx.user!.id;

      // Calculate danmaku points for this entry
      const points = DanmakuPointsCalculator.calculate({
        game: data.game as TouhouGame,
        shotType: data.shotType,
        isNoDeaths: data.isNoDeaths || false,
        isNoBombs: data.isNoBombs || false,
        isNo3rdCondition: data.isNo3rdCondition || false,
        numberOfDeaths: data.numberOfDeaths as 1 | 2 | 3 | undefined,
      });

      // Check if the user already has a clear entry for this game, difficulty, and shot type
      const existingEntry = await prisma.clearEntry.findFirst({
        where: {
          ...userIdFilter(userId),
          game: data.game,
          difficulty: data.difficulty || 'Lunatic',
          shotType: data.shotType,
        },
      });

      // If an existing entry is found, compare the danmaku points
      if (existingEntry) {
        if (points <= existingEntry.danmaku_points) {
          // The new entry has equal or fewer points than the existing one
          return {
            errors: [
              {
                field: 'danmaku_points',
                message: `You've already submitted a clear for ${data.game} ${
                  data.difficulty || 'Lunatic'
                } ${data.shotType} that is valued higher or equal to this one (${
                  existingEntry.danmaku_points
                } DP). Delete the previous clear if you want to submit this one.`,
              },
            ],
          };
        } else {
          // The new entry has more points - delete the old one
          await prisma.clearEntry.delete({
            where: { id: existingEntry.id },
          });
        }
      }

      // Determine the achievement type
      const achievementType = this.determineAchievementType(data);

      // Create the clear entry
      const createdEntry = await prisma.clearEntry.create({
        data: {
          userId: toBigInt(userId),
          shotType: data.shotType,
          game: data.game,
          difficulty: data.difficulty || 'Lunatic',
          achievementType,
          danmaku_points: points,
          replayLink: data.replayLink,
          videoLink: data.videoLink,
          dateAchieved: data.dateAchieved,
          isNoDeaths: data.isNoDeaths,
          isNoBombs: data.isNoBombs,
          isNo3rdCondition: data.isNo3rdCondition,
          numberOfDeaths: data.numberOfDeaths,
          numberOfBombs: data.numberOfBombs,
        },
        include: {
          createdBy: true,
        },
      });

      // Map to GraphQL model
      const clearEntry = mapPrismaClearEntryToClearEntryModel(createdEntry);

      if (!clearEntry) {
        return {
          errors: [
            {
              field: 'server',
              message: 'Failed to map clear entry data after creation',
            },
          ],
        };
      }

      // Update user statistics
      await this.updateUserStatistics(idToString(userId));

      // Update global rankings
      await this.updateGlobalRankings();

      return { clearEntry };
    } catch (error) {
      console.error('Error creating clear entry:', error);
      return {
        errors: [
          {
            field: 'server',
            message: 'An unexpected error occurred while creating the clear entry.',
          },
        ],
      };
    }
  }

  /**
   * Helper method to determine achievement type based on the input data
   */
  private determineAchievementType(data: ClearEntryInput): AchievementType {
    if (data.isNoDeaths && data.isNoBombs) {
      return AchievementType.LNN;
    } else if (data.isNoBombs && data.isNo3rdCondition) {
      return AchievementType.LNB_PLUS;
    } else if (data.isNoBombs) {
      return AchievementType.LNB;
    } else {
      return AchievementType.L1CC;
    }
  }

  /**
   * Helper method to update user statistics after a clear is added
   */
  private async updateUserStatistics(userId: string | number | bigint): Promise<void> {
    // Get all clear entries for the user
    const clearEntries = await prisma.clearEntry.findMany({
      where: userIdFilter(userId),
    });

    // Calculate statistics
    const totalClears = clearEntries.length;

    // Count LNN achievements (highest tier)
    const lnnEntries = clearEntries.filter(entry => entry.achievementType === AchievementType.LNN);
    const lnn = lnnEntries.length;

    // Count LNB achievements (includes LNB, LNB_PLUS)
    const lnbEntries = clearEntries.filter(
      entry =>
        entry.achievementType === AchievementType.LNB ||
        entry.achievementType === AchievementType.LNB_PLUS,
    );

    // Count L1CC direct achievements
    const l1ccEntries = clearEntries.filter(
      entry => entry.achievementType === AchievementType.L1CC,
    );

    // LNB count includes direct LNB/LNB+ achievements plus all LNN achievements
    const lnb = lnbEntries.length + lnn;

    // L1CC count includes direct L1CC achievements plus all LNB/LNB+ and LNN achievements
    const l1cc = l1ccEntries.length + lnbEntries.length + lnn;

    // Calculate total danmaku points using the weighting calculator
    const danmakuPointsArray = clearEntries.map(entry => Number(entry.danmaku_points));
    const danmaku_points = WeightingCalculator.calculateTotalPoints(danmakuPointsArray);

    // Update user record
    await prisma.user.update({
      where: idFilter(userId),
      data: {
        totalClears,
        lnn,
        lnb,
        l1cc,
        danmaku_points,
      },
    });
  }

  /**
   * Helper method to update global rankings for all users
   */
  private async updateGlobalRankings(): Promise<void> {
    // Get all users ordered by danmaku points (descending)
    const users = await prisma.user.findMany({
      orderBy: { danmaku_points: 'desc' },
    });

    // Update each user's global rank
    for (let i = 0; i < users.length; i++) {
      await prisma.user.update({
        where: idFilter(users[i].id),
        data: { globalRank: i + 1 }, // Ranks start at 1
      });
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

      // Fix the ID comparison by converting both to strings
      const entryUserId = idToString(existingEntry.userId);
      const contextUserId = idToString(ctx.user.id);

      // Check if user is the owner or an admin
      if (entryUserId !== contextUserId && ctx.user.role !== 'ADMIN') {
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

      // Recalculate danmaku points
      if (
        data.isNoDeaths !== undefined ||
        data.isNoBombs !== undefined ||
        data.isNo3rdCondition !== undefined
      ) {
        const gameValue = data.game || existingEntry.game;
        const points = DanmakuPointsCalculator.calculate({
          game: gameValue as unknown as TouhouGame,
          shotType: data.shotType || existingEntry.shotType,
          isNoDeaths: data.isNoDeaths !== undefined ? data.isNoDeaths : existingEntry.isNoDeaths,
          isNoBombs: data.isNoBombs !== undefined ? data.isNoBombs : existingEntry.isNoBombs,
          isNo3rdCondition:
            data.isNo3rdCondition !== undefined
              ? data.isNo3rdCondition
              : existingEntry.isNo3rdCondition,
          numberOfDeaths:
            data.numberOfDeaths !== undefined
              ? (data.numberOfDeaths as 1 | 2 | 3 | undefined)
              : (existingEntry.numberOfDeaths as 1 | 2 | 3 | undefined),
        });

        updateData.danmaku_points = points;
      }

      const updatedEntry = await prisma.clearEntry.update({
        where: { public_uuid: data.public_uuid },
        data: updateData,
        include: {
          createdBy: true,
        },
      });

      // Map to GraphQL model
      const clearEntry = mapPrismaClearEntryToClearEntryModel(updatedEntry);

      if (!clearEntry) {
        return {
          errors: [
            {
              field: 'server',
              message: 'Failed to map clear entry data after update',
            },
          ],
        };
      }

      // Update user statistics after update
      await this.updateUserStatistics(idToString(ctx.user.id));

      // Update global rankings
      await this.updateGlobalRankings();

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
      }

      const updatedEntry = await prisma.clearEntry.update({
        where: { public_uuid: data.public_uuid },
        data: updateData,
        include: {
          createdBy: true,
        },
      });

      // Map to GraphQL model
      const clearEntry = mapPrismaClearEntryToClearEntryModel(updatedEntry);

      if (!clearEntry) {
        return {
          errors: [
            {
              field: 'server',
              message: 'Failed to map clear entry data after verification',
            },
          ],
        };
      }

      // If we're verifying the entry, recalculate the user's total danmaku points
      if (data.verified) {
        const userId = idToString(existingEntry.userId);

        // Get all verified clear entries for this user
        const userClearEntries = await prisma.clearEntry.findMany({
          where: {
            ...userIdFilter(existingEntry.userId),
            verified: true,
          },
          select: { danmaku_points: true },
        });

        // Extract point values
        const pointsArray = userClearEntries.map(entry => Number(entry.danmaku_points));

        // Calculate weighted total using the static utility
        const totalPoints = WeightingCalculator.calculateTotalPoints(pointsArray);

        // Update user's total points
        await prisma.user.update({
          where: idFilter(userId),
          data: { danmaku_points: totalPoints },
        });
      }

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

      // Fix the ID comparison by converting both to strings and trimming any 'n' suffix
      const entryUserId = idToString(existingEntry.userId);
      const contextUserId = idToString(ctx.user.id);

      // Check if user is the owner or an admin
      if (entryUserId !== contextUserId && ctx.user.role !== 'ADMIN') {
        return false;
      }

      await prisma.clearEntry.delete({
        where: { public_uuid: publicUuid },
      });

      // Update user statistics after deletion
      await this.updateUserStatistics(ctx.user.id);

      // Update global rankings
      await this.updateGlobalRankings();

      return true;
    } catch (error) {
      console.error('Error deleting clear entry:', error);
      return false;
    }
  }
}
