import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

export * from '@prisma/client';

// Determine which environment to use
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

// Load environment variables if not already set
if (!process.env.DATABASE_URL) {
  // Define paths to look for environment files
  const envPaths = [
    // Root level environment-specific file
    path.resolve(process.cwd(), `../../.env.${NODE_ENV}`),
    // Root level .env
    path.resolve(process.cwd(), '../../.env'),
    // Root level .env.local for overrides
    path.resolve(process.cwd(), '../../.env.local'),
    // Package level environment files (fallback)
    path.resolve(process.cwd(), `.env.${NODE_ENV}`),
    path.resolve(process.cwd(), '.env'),
  ];

  // Try to load from each path until successful
  let loaded = false;
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      if (isDev) console.log(`Loading database environment from: ${envPath}`);
      dotenv.config({ path: envPath });
      loaded = true;
      break;
    }
  }

  if (!loaded && isDev) {
    console.warn('⚠️ No environment file found for database connection');
  }
}

// Verify database environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is missing');
  console.error('   Prisma requires DATABASE_URL to connect to the database.');
}

if (!process.env.DIRECT_URL && NODE_ENV !== 'development') {
  console.warn('⚠️ Warning: DIRECT_URL environment variable is missing');
  console.warn('   For optimal connection pooling in Prisma, DIRECT_URL should be provided.');
}

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
  id: bigint;
  public_uuid: string;
  email?: string | null;
  name: string;
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
  description?: string | null;
  resetTokens?: PasswordResetToken[];
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

// Define PasswordResetToken type
export type PasswordResetToken = {
  id: string;
  token: string;
  userId: bigint;
  user?: User;
  expiresAt: Date;
  createdAt: Date;
};

// Define global for development environment
declare global {
  var prisma: PrismaClient | undefined;
}

// Create PrismaClient singleton
const databaseUrl = process.env.DATABASE_URL;

// NOTE: For PrismaClient constructor, we ONLY use url in datasources
// The directUrl is automatically used by Prisma from the schema.prisma file
// It cannot be passed directly in the constructor
export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Only log errors in production, more verbose in development
    log: NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  });

// Save PrismaClient to global in development to avoid too many instances
if (isDev) global.prisma = prisma;
