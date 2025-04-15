import { TouhouGame, AchievementType } from './enums';

/**
 * Base interface for shot types across all games
 */
export interface ShotType {
  id: string; // Unique identifier
  name: string; // Display name
  game: TouhouGame; // Which game this shot type belongs to
  basePoints: number; // Base points for this shot type
}

/**
 * Interface for the data row in our points database
 */
export interface DanmakuPointsData {
  game: TouhouGame;
  shotType: string;
  lnn: number;
  lnbPlus: number;
  lnb: number;
  l1cc: number;
}

/**
 * Interface for a user's clear record
 */
export interface Clear {
  id: string;
  userId: string;
  game: TouhouGame;
  shotType: string;
  achievementType: AchievementType;
  replayLink?: string;
  videoLink?: string;
  description?: string;
  verified: boolean;
  points: number;
  dateAchieved: Date;
  dateSubmitted: Date;
}

/**
 * Interface for a clear submission awaiting validation
 */
export interface ClearSubmission {
  userId: string;
  game: TouhouGame;
  shotType: string;
  achievementType: AchievementType;
  replayLink?: string;
  videoLink?: string;
  description?: string;
  dateAchieved?: Date;
}

/**
 * Interface for user profiles with Danmaku points
 */
export interface UserDanmakuProfile {
  userId: string;
  totalDanmakuPoints: number;
  gameClears: Record<TouhouGame, number>; // Count of clears per game
  achievementCounts: Record<AchievementType, number>; // Count of each achievement type
}

/**
 * Interface for leaderboard entries
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: number;
  totalDanmakuPoints: number;
  totalClears: number;
  highestAchievement?: {
    game: TouhouGame;
    shotType: string;
    achievementType: AchievementType;
    points: number;
  };
}
