import { Prisma, Role } from 'database';
import { UserModel } from '../types/UserModel';

type PrismaUser = Prisma.UserGetPayload<{}>;

/**
 * Converts a Prisma User to a GraphQL UserModel
 * This properly maps the types and handles any transformations needed
 */
export function mapPrismaUserToUserModel(user: PrismaUser | null): UserModel | null {
  if (!user) return null;

  // Convert the raw Prisma user object to our GraphQL UserModel
  const userModel: UserModel = {
    public_uuid: user.public_uuid,
    email: user.email ?? '', // Handle null email with empty string
    name: user.name,
    role: user.role as Role, // Handle enum conversion
    danmaku_points: user.danmaku_points,
    totalClears: user.totalClears,
    lnn: user.lnn,
    lnb: user.lnb,
    l1cc: user.l1cc,
    globalRank: user.globalRank,
    twitterHandle: user.twitterHandle,
    youtubeChannel: user.youtubeChannel,
    twitchChannel: user.twitchChannel,
    discord: user.discord,
    country: user.country,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userModel;
}

/**
 * Maps an array of Prisma users to UserModel array
 */
export function mapPrismaUsersToUserModels(users: PrismaUser[]): UserModel[] {
  return users.map(user => mapPrismaUserToUserModel(user)!);
}

/**
 * Maps an array of Prisma users to UserModel array,
 * with extra filtering for leaderboard display (removes sensitive data)
 */
export function mapUsersForLeaderboard(users: PrismaUser[]): UserModel[] {
  return users.map(user => {
    const model = mapPrismaUserToUserModel(user)!;

    // For leaderboard, don't expose email
    model.email = '';

    return model;
  });
}
