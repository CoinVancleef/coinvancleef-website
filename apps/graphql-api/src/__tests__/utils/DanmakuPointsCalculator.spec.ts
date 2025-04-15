import { TouhouGame } from '@touhou-types/enums';
import {
  DanmakuPointsCalculator,
  CalculationInput,
  DanmakuPointsType,
} from '../../utils/DanmakuPointsCalculator';

// Mock the database to avoid dependencies in tests
jest.mock('@touhou-types/danmakuPointsData', () => ({
  DANMAKU_POINTS_DATABASE: [
    // TH06 - Embodiment of Scarlet Devil
    { game: 'th06', shotType: 'ReimuA', lnn: 360, lnbPlus: 30, lnb: 30, l1cc: 21 },
    { game: 'th06', shotType: 'MarisaB', lnn: 360, lnbPlus: 30, lnb: 30, l1cc: 21 },
    // TH07 - Perfect Cherry Blossom
    { game: 'th07', shotType: 'SakuyaB', lnn: 80, lnbPlus: 29, lnb: 26, l1cc: 18 },
  ],
}));

describe('DanmakuPointsCalculator', () => {
  describe('determineAchievementType', () => {
    it('should return LNN for no deaths and no bombs', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoDeaths: true,
        isNoBombs: true,
      };

      // Access private method using type assertion
      const achievementType = (DanmakuPointsCalculator as any)['determineAchievementType'](input);
      expect(achievementType).toBe(DanmakuPointsType.LNN);
    });

    it('should return LNB_PLUS for no bombs and no 3rd condition', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
        isNo3rdCondition: true,
      };

      const achievementType = (DanmakuPointsCalculator as any)['determineAchievementType'](input);
      expect(achievementType).toBe(DanmakuPointsType.LNB_PLUS);
    });

    it('should return LNB for no bombs only', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
      };

      const achievementType = (DanmakuPointsCalculator as any)['determineAchievementType'](input);
      expect(achievementType).toBe(DanmakuPointsType.LNB);
    });

    it('should return L1CC as default when no special conditions are met', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
      };

      const achievementType = (DanmakuPointsCalculator as any)['determineAchievementType'](input);
      expect(achievementType).toBe(DanmakuPointsType.L1CC);
    });
  });

  describe('calculateLowMissPoints', () => {
    it('should correctly calculate points for 1 miss', () => {
      const pointsData = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        lnn: 360,
        lnbPlus: 30,
        lnb: 30,
        l1cc: 21,
      };
      const calculatedPoints = (DanmakuPointsCalculator as any)['calculateLowMissPoints'](
        pointsData,
        1,
      );

      // Expected: 360 * 0.5 = 180
      expect(calculatedPoints).toBe(180);
    });

    it('should correctly calculate points for 2 misses', () => {
      const pointsData = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        lnn: 360,
        lnbPlus: 30,
        lnb: 30,
        l1cc: 21,
      };
      const calculatedPoints = (DanmakuPointsCalculator as any)['calculateLowMissPoints'](
        pointsData,
        2,
      );

      // Expected: 360 * 0.5 * 0.6 = 108
      expect(calculatedPoints).toBe(108);
    });

    it('should correctly calculate points for 3 misses', () => {
      const pointsData = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        lnn: 360,
        lnbPlus: 30,
        lnb: 30,
        l1cc: 21,
      };
      const calculatedPoints = (DanmakuPointsCalculator as any)['calculateLowMissPoints'](
        pointsData,
        3,
      );

      // Expected: 360 * 0.5 * 0.6 * 0.7 = 75.6, rounded to 76
      expect(calculatedPoints).toBe(76);
    });

    it('should return 120% of LNB+ when calculated points are lower than the threshold', () => {
      const pointsData = {
        game: TouhouGame.TH07,
        shotType: 'SakuyaB',
        lnn: 80,
        lnbPlus: 29,
        lnb: 26,
        l1cc: 18,
      };
      const calculatedPoints = (DanmakuPointsCalculator as any)['calculateLowMissPoints'](
        pointsData,
        3,
      );

      // Expected calculation: 80 * 0.5 * 0.6 * 0.7 = 16.8
      // Threshold: 29 * 1.2 = 34.8
      // Since 16.8 < 34.8, should return 29 * 1.2 = 34.8, rounded to 35
      expect(calculatedPoints).toBe(35);
    });
  });

  describe('calculate', () => {
    it('should return LNN points for a perfect run', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoDeaths: true,
        isNoBombs: true,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      expect(points).toBe(360); // LNN points for TH06 ReimuA
    });

    it('should return LNB+ points for no bombs and no 3rd condition', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
        isNo3rdCondition: true,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      expect(points).toBe(30); // LNB+ points for TH06 ReimuA
    });

    it('should return LNB points for no bombs only', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      expect(points).toBe(30); // LNB points for TH06 ReimuA
    });

    it('should return L1CC points as default when no special conditions are met', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
      };

      const points = DanmakuPointsCalculator.calculate(input);
      expect(points).toBe(21); // L1CC points for TH06 ReimuA
    });

    it('should calculate low miss points when numberOfDeaths is provided', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        numberOfDeaths: 2,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      expect(points).toBe(108); // Low miss points for TH06 ReimuA with 2 deaths
    });

    it('should return 0 when no data is found for the game and shot type', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH14,
        shotType: 'NonExistentShotType',
      };

      const points = DanmakuPointsCalculator.calculate(input);
      expect(points).toBe(0);
    });
  });
});
