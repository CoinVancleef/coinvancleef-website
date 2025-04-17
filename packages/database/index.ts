import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

// Load environment variables if needed
try {
  // Only try to load .env if needed
  if (!process.env.DATABASE_URL) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
  }
} catch (e) {
  console.warn('Failed to load dotenv:', e);
}

// Define Role enum directly since we don't have access to generated types
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Define AchievementType enum
export enum AchievementType {
  LNN = 'LNN',
  LNB_PLUS = 'LNB_PLUS',
  LNB = 'LNB',
  L1CC = 'L1CC',
}

// Define User type
export type User = {
  id: string;
  public_uuid: string;
  email: string;
  name?: string | null;
  password: string;
  role: Role;
  danmaku_points: number;
  totalClears: number;
  lnn: number;
  lnb: number;
  l1cc: number;
  globalRank?: number | null;
  twitterHandle?: string | null;
  youtubeChannel?: string | null;
  twitchChannel?: string | null;
  discord?: string | null;
  country?: string | null;
  profilePicture?: string | null;
  createdAt: Date;
  updatedAt: Date;
  clearEntries?: ClearEntry[];
};

// Define ClearEntry type
export type ClearEntry = {
  id: bigint;
  public_uuid: string;
  userId: bigint;
  shotType: string;
  game: string;
  difficulty: string;
  achievementType: AchievementType;
  danmaku_points: number;
  numberOfDeaths?: number | null;
  numberOfBombs?: number | null;
  isNoDeaths?: boolean | null;
  isNoBombs?: boolean | null;
  isNo3rdCondition?: boolean | null;
  replayLink?: string | null;
  videoLink?: string | null;
  verified: boolean;
  dateAchieved?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User;
};

// Define default Supabase URL if environment variable is not available
const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres.gyywxyobcbnhbzzbdeop:htHf4izqkGbLj3wW@aws-0-eu-north-1.pooler.supabase.com:5432/postgres';

// Create singleton with explicit URL
declare global {
  var prisma: PrismaClient | undefined;
}

// Use custom connection URL
export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
