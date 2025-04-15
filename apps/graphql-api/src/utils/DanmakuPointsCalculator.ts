import { TouhouGame } from '@touhou-types/enums';
import { DANMAKU_POINTS_DATABASE } from '@touhou-types/danmakuPointsData';
import type { DanmakuPointsData } from '@touhou-types/interfaces';

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

export class DanmakuPointsCalculator {
  /**
   * Calculate danmaku points based on input criteria
   * @param input The calculation input
   * @returns The calculated points or 0 if data not found
   */
  public static calculate(input: CalculationInput): number {
    // First, get the achievement type
    const achievementType = this.determineAchievementType(input);

    // Find the base points for this game/shot type
    const pointsData = DANMAKU_POINTS_DATABASE.find(
      data => data.game === input.game && data.shotType === input.shotType,
    );

    if (!pointsData) {
      console.warn(`No points data found for ${input.game} ${input.shotType}`);
      return 0;
    }

    // First, get base points based on achievement type
    let points = pointsData[achievementType];

    // For low miss (1-3 deaths), calculate adjusted points
    if (
      achievementType === DanmakuPointsType.L1CC &&
      input.numberOfDeaths &&
      input.numberOfDeaths > 0
    ) {
      // Apply the low miss calculation
      return this.calculateLowMissPoints(pointsData, input.numberOfDeaths);
    }

    return Math.round(points);
  }

  /**
   * Determine the achievement type based on the input criteria
   */
  private static determineAchievementType(input: CalculationInput): DanmakuPointsType {
    if (input.isNoDeaths && input.isNoBombs) {
      return DanmakuPointsType.LNN;
    }

    if (input.isNoBombs && input.isNo3rdCondition) {
      return DanmakuPointsType.LNB_PLUS;
    }

    if (input.isNoBombs) {
      return DanmakuPointsType.LNB;
    }

    // Default to L1CC
    return DanmakuPointsType.L1CC;
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
    // Calculate the minimum points threshold (LNB+ value + 20%)
    const minThreshold = pointsData.lnbPlus * 1.2;

    // Apply the sequential multipliers based on number of deaths
    let calculatedPoints = lnnPoints * 0.5; // First miss: divide by 2

    if (numberOfDeaths >= 2) {
      calculatedPoints = calculatedPoints * 0.6; // Second miss: multiply by 0.6
    }

    if (numberOfDeaths >= 3) {
      calculatedPoints = calculatedPoints * 0.7; // Third miss: multiply by 0.7
    }

    // If calculated points are lower than minimum threshold, return 120% of LNB+
    if (calculatedPoints < minThreshold) {
      return Math.round(pointsData.lnbPlus * 1.2);
    }

    return Math.round(calculatedPoints);
  }
}
