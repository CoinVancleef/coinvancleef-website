import { Prisma, Role, AchievementType } from 'database';
import { UserModel } from '../types/UserModel';
import type { User } from 'database';
import { ClearEntryModel } from '../types/ClearEntryModel';

type PrismaUser = Prisma.UserGetPayload<{}>;
type PrismaClearEntry = Prisma.ClearEntryGetPayload<{ include: { createdBy: true } }>;

/**
 * Converts a Prisma User to a GraphQL UserModel
 * This properly maps the types and handles any transformations needed
 */
export function mapPrismaUserToUserModel(user: PrismaUser | null): UserModel | null {
  if (!user) return null;

  try {
    // Convert the raw Prisma user object to our GraphQL UserModel
    const userModel: UserModel = {
      public_uuid: user.public_uuid || '',
      email: user.email, // Keep email as is - it's optional
      name: user.name ?? '', // Ensure name is not null
      role: user.role as Role, // Handle enum conversion
      danmaku_points: typeof user.danmaku_points === 'number' ? user.danmaku_points : 0,
      totalClears: typeof user.totalClears === 'number' ? user.totalClears : 0,
      lnn: typeof user.lnn === 'number' ? user.lnn : 0,
      lnb: typeof user.lnb === 'number' ? user.lnb : 0,
      l1cc: typeof user.l1cc === 'number' ? user.l1cc : 0,
      globalRank: user.globalRank ?? null,
      twitterHandle: user.twitterHandle ?? null,
      youtubeChannel: user.youtubeChannel ?? null,
      twitchChannel: user.twitchChannel ?? null,
      discord: user.discord ?? null,
      country: user.country ?? null,
      profilePicture: user.profilePicture ?? null,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };

    return userModel;
  } catch (error) {
    console.error('Error mapping Prisma user to UserModel:', error, user);
    return null;
  }
}

/**
 * Maps an array of Prisma users to UserModel array
 */
export function mapPrismaUsersToUserModels(users: PrismaUser[]): UserModel[] {
  if (!users || !Array.isArray(users)) return [];

  return users
    .map(user => mapPrismaUserToUserModel(user))
    .filter((user): user is UserModel => user !== null);
}

/**
 * Maps an array of Prisma users to UserModel array,
 * with extra filtering for leaderboard display (removes sensitive data)
 */
export function mapUsersForLeaderboard(users: PrismaUser[]): UserModel[] {
  if (!users || !Array.isArray(users)) return [];

  return users
    .map(user => {
      const model = mapPrismaUserToUserModel(user);
      if (!model) return null;

      // For leaderboard, don't expose email (just set to null)
      model.email = null;

      return model;
    })
    .filter((user): user is UserModel => user !== null);
}

/**
 * Safely converts a Prisma ID type to string
 * Works with BigInt, string, number, or undefined
 */
export function idToString(id: any): string {
  if (id === null || id === undefined) return '';
  return id.toString().replace(/n$/, '');
}

/**
 * Safely converts a string ID to BigInt for database queries
 */
export function stringToBigInt(id: string | number | bigint): bigint {
  if (typeof id === 'bigint') return id;
  if (typeof id === 'number') return BigInt(id);
  return BigInt(id.replace(/n$/, ''));
}

/**
 * Maps a Prisma User to a GraphQL User model
 */
export function mapPrismaUserToUser(prismaUser: any): User {
  if (!prismaUser) return null;

  return {
    ...prismaUser,
    id: idToString(prismaUser.id),
  };
}

/**
 * Maps a Prisma ClearEntry to a GraphQL ClearEntryModel
 */
export function mapPrismaClearEntryToClearEntryModel(
  entry: PrismaClearEntry | null,
): ClearEntryModel | null {
  if (!entry) return null;

  try {
    // Map the createdBy user if it exists
    const createdBy = entry.createdBy ? mapPrismaUserToUserModel(entry.createdBy) : null;

    // If createdBy mapping failed but is required, return null
    if (!createdBy) {
      console.warn('Could not map required createdBy user for ClearEntryModel');
      return null;
    }

    const model: ClearEntryModel = {
      public_uuid: entry.public_uuid,
      shotType: entry.shotType,
      game: entry.game,
      difficulty: entry.difficulty,
      // Ensure enum types are properly mapped
      achievementType: entry.achievementType as unknown as AchievementType,
      danmaku_points: Number(entry.danmaku_points),
      numberOfDeaths: entry.numberOfDeaths,
      numberOfBombs: entry.numberOfBombs,
      isNoDeaths: entry.isNoDeaths,
      isNoBombs: entry.isNoBombs,
      isNo3rdCondition: entry.isNo3rdCondition,
      replayLink: entry.replayLink,
      videoLink: entry.videoLink,
      verified: entry.verified ?? false,
      dateAchieved: entry.dateAchieved,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      createdBy: createdBy,
    };

    return model;
  } catch (error) {
    console.error('Error mapping Prisma clear entry to ClearEntryModel:', error, entry);
    return null;
  }
}

/**
 * Maps an array of Prisma ClearEntries to GraphQL ClearEntryModels
 */
export function mapPrismaClearEntriesToClearEntryModels(
  entries: PrismaClearEntry[],
): ClearEntryModel[] {
  if (!entries || !Array.isArray(entries)) return [];

  return entries
    .map(entry => mapPrismaClearEntryToClearEntryModel(entry))
    .filter((entry): entry is ClearEntryModel => entry !== null);
}
