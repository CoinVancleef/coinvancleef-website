import { TouhouGame } from '../../../web/src/touhou-types/enums';
import { DANMAKU_POINTS_DATABASE } from '../../../web/src/touhou-types/danmakuPointsData';
import type { DanmakuPointsData } from '../../../web/src/touhou-types/interfaces';

export interface CalculationInput {
  game: TouhouGame;
  shotType: string;
  isNoDeaths?: boolean;
  isNoBombs?: boolean;
  isNo3rdCondition?: boolean;
  numberOfDeaths?: 1 | 2 | 3;
}

/**
 * Type of achievement for danmaku points calculation
 */
export enum DanmakuPointsType {
  LNN = 'lnn',
  LNB_PLUS = 'lnbPlus',
  LNB = 'lnb',
  L1CC = 'l1cc',
}

/**
 * Games that require the 3rd condition to be true for LNN
 * For these games, if NoDeaths and NoBombs but without 3rd condition, default to LNB
 */
const GAMES_REQUIRING_3RD_CONDITION = [
  TouhouGame.TH07, // PCB
  TouhouGame.TH08, // IN
  TouhouGame.TH13, // TD
  TouhouGame.TH16, // HSiFS
  TouhouGame.TH17, // WBaWC
  TouhouGame.TH18, // UM
];

export class DanmakuPointsCalculator {
  /**
   * Calculate danmaku points based on input criteria
   * @param input The calculation input
   * @returns The calculated points or 0 if data not found
   */
  public static calculate(input: CalculationInput): number {
    // Find the base points for this game/shot type
    const pointsData = DANMAKU_POINTS_DATABASE.find(
      data => data.game === input.game && data.shotType === input.shotType,
    );

    if (!pointsData) {
      console.warn(`No points data found for ${input.game} ${input.shotType}`);
      return 0;
    }

    // Ensure boolean flags have explicit boolean values (not undefined)
    const noDeaths = input.isNoDeaths === true;
    const noBombs = input.isNoBombs === true;
    const no3rdCondition = input.isNo3rdCondition === true;

    // For low miss runs (1-3 deaths), apply special calculation
    if (input.numberOfDeaths && input.numberOfDeaths > 0 && input.numberOfDeaths <= 3 && noBombs) {
      return this.calculateLowMissPoints(pointsData, input.numberOfDeaths);
    }

    // Determine achievement type
    let achievementType: DanmakuPointsType;

    if (noDeaths && noBombs) {
      // Special rule for games requiring 3rd condition:
      // If game requires 3rd condition and 3rd condition is false, default to LNB instead of LNN
      if (GAMES_REQUIRING_3RD_CONDITION.includes(input.game as TouhouGame) && !no3rdCondition) {
        achievementType = DanmakuPointsType.LNB;
      } else {
        achievementType = DanmakuPointsType.LNN;
      }
    } else if (noBombs && no3rdCondition) {
      achievementType = DanmakuPointsType.LNB_PLUS;
    } else if (noBombs) {
      achievementType = DanmakuPointsType.LNB;
    } else {
      // Default to L1CC for any other combination
      achievementType = DanmakuPointsType.L1CC;
    }

    // Get base points based on achievement type
    return Math.round(pointsData[achievementType]);
  }

  /**
   * Calculate points for low miss runs (1-3 deaths)
   */
  private static calculateLowMissPoints(
    pointsData: DanmakuPointsData,
    numberOfDeaths: 1 | 2 | 3,
  ): number {
    // Get the LNN points for this shot type
    const lnnPoints = pointsData.lnn;

    // Calculate the minimum threshold (LNB+ value + 20%)
    const minThreshold = pointsData.lnbPlus * 1.2;

    // Start with LNN points divided by 2 for the first miss
    let calculatedPoints = lnnPoints * 0.5;

    // Apply multipliers for additional misses
    if (numberOfDeaths >= 2) {
      calculatedPoints = calculatedPoints * 0.6; // Second miss: multiply by 0.6
    }

    if (numberOfDeaths >= 3) {
      calculatedPoints = calculatedPoints * 0.7; // Third miss: multiply by 0.7
    }

    // If calculated points are lower than the minimum threshold, return 120% of LNB+
    if (calculatedPoints < minThreshold) {
      return Math.round(minThreshold);
    }

    return Math.round(calculatedPoints);
  }
}
