import { Prisma, Role } from 'database';
import { UserModel } from '../types/UserModel';

type PrismaUser = Prisma.UserGetPayload<{}>;

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
      email: user.email ?? '', // Handle null email with empty string
      name: user.name ?? null,
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

      // For leaderboard, don't expose email
      model.email = '';

      return model;
    })
    .filter((user): user is UserModel => user !== null);
}
