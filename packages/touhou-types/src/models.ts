import { TouhouGame, Difficulty, ClearType, AchievementType, Region, Th8Route } from './enums';
import {
  TH06ShotType,
  TH07ShotType,
  TH08ShotTypeA,
  TH08ShotTypeB,
  TH09ShotType,
  TH10ShotType,
  TH11ShotType,
  TH12ShotType,
  TH128ShotType,
  TH13ShotType,
  TH14ShotType,
  TH15ShotType,
  TH16ShotType,
  TH17ShotType,
  TH18ShotType,
} from './shotTypeEnums';

/**
 * Interface for player information
 */
export interface Player {
  id: string;
  name: string;
  country?: string;
  twitterHandle?: string;
  youtubeChannel?: string;
  twitchChannel?: string;
  discord?: string;
}

/**
 * Interface for base score data shared by all games
 */
export interface BaseScoreEntry {
  id: string;
  game: TouhouGame;
  player: Player;
  score: number;
  character: string;
  shotType: string;
  difficulty: Difficulty;
  clearType?: ClearType;
  achievementType?: AchievementType;
  replayLink?: string;
  videoLink?: string;
  isWorldRecord: boolean;
  isPersonalBest: boolean;
  date?: Date;
  region: Region;
  comment?: string;
  verified: boolean;
}

/**
 * Type for game-specific score data
 */
export interface TH06ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH06;
  shotType: TH06ShotType;
  bombs?: number;
  lives?: number;
  power?: number;
}

export interface TH07ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH07;
  shotType: TH07ShotType;
  cherry?: number;
  bombPieces?: number;
  lives?: number;
  power?: number;
}

export interface TH08ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH08;
  shotTypeA: TH08ShotTypeA;
  shotTypeB: TH08ShotTypeB;
  route: Th8Route;
  human?: number;
  youkai?: number;
  spell?: number;
}

export interface TH09ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH09;
  shotType: TH09ShotType;
  ai?: boolean;
  perfectPossessed?: number;
  cleared?: boolean;
  team?: string;
}

export interface TH10ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH10;
  shotType: TH10ShotType;
}

export interface TH11ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH11;
  shotType: TH11ShotType;
  ufos?: number;
}

export interface TH12ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH12;
  shotType: TH12ShotType;
  ufos?: number;
}

export interface TH128ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH128;
  shotType: TH128ShotType;
}

export interface TH13ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH13;
  shotType: TH13ShotType;
  trance?: number;
}

export interface TH14ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH14;
  shotType: TH14ShotType;
}

export interface TH15ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH15;
  shotType: TH15ShotType;
  pointItems?: number;
}

export interface TH16ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH16;
  shotType: TH16ShotType;
  seasons?: number;
}

export interface TH17ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH17;
  shotType: TH17ShotType;
  fragments?: number;
}

export interface TH18ScoreEntry extends BaseScoreEntry {
  game: TouhouGame.TH18;
  shotType: TH18ShotType;
  cards?: number;
}

/**
 * Union type for all game-specific score entries
 */
export type ScoreEntry =
  | TH06ScoreEntry
  | TH07ScoreEntry
  | TH08ScoreEntry
  | TH09ScoreEntry
  | TH10ScoreEntry
  | TH11ScoreEntry
  | TH12ScoreEntry
  | TH128ScoreEntry
  | TH13ScoreEntry
  | TH14ScoreEntry
  | TH15ScoreEntry
  | TH16ScoreEntry
  | TH17ScoreEntry
  | TH18ScoreEntry;

/**
 * Interface for leaderboard data structure
 */
export interface Leaderboard {
  game: TouhouGame;
  difficulty: Difficulty;
  entries: ScoreEntry[];
}

/**
 * Interface for statistics
 */
export interface GameStatistics {
  game: TouhouGame;
  totalEntries: number;
  worldRecords: number;
  averageScore: number;
  topPlayers: Player[];
}

/**
 * Interface for player statistics
 */
export interface PlayerStatistics {
  player: Player;
  totalEntries: number;
  worldRecords: number;
  gameBreakdown: Record<TouhouGame, number>;
  bestAchievements: AchievementType[];
}
