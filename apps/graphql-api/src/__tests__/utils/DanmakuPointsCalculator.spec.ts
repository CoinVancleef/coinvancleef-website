import { TouhouGame } from '../../../../web/src/touhou-types/enums';
import {
  DanmakuPointsCalculator,
  CalculationInput,
  DanmakuPointsType,
} from '../../utils/DanmakuPointsCalculator';

// Mock the database to avoid dependencies in tests
jest.mock('../../../../web/src/touhou-types/danmakuPointsData', () => ({
  DANMAKU_POINTS_DATABASE: [
    // TH06 - Embodiment of Scarlet Devil
    { game: 'th06', shotType: 'ReimuA', lnn: 360, lnbPlus: 30, lnb: 30, l1cc: 21 },
    { game: 'th06', shotType: 'MarisaB', lnn: 360, lnbPlus: 30, lnb: 30, l1cc: 21 },
    // TH07 - Perfect Cherry Blossom
    { game: 'th07', shotType: 'SakuyaB', lnn: 80, lnbPlus: 29, lnb: 26, l1cc: 18 },
  ],
}));

describe('DanmakuPointsCalculator', () => {
  describe('achievement type detection through calculate method', () => {
    it('should return LNN points for no deaths and no bombs', () => {
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
  });

  describe('calculateLowMissPoints through calculate method', () => {
    it('should correctly calculate points for 1 miss', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
        numberOfDeaths: 1,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      // Expected: 360 * 0.5 = 180
      expect(points).toBe(180);
    });

    it('should correctly calculate points for 2 misses', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
        numberOfDeaths: 2,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      // Expected: 360 * 0.5 * 0.6 = 108
      expect(points).toBe(108);
    });

    it('should correctly calculate points for 3 misses', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH06,
        shotType: 'ReimuA',
        isNoBombs: true,
        numberOfDeaths: 3,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      // Expected: 360 * 0.5 * 0.6 * 0.7 = 75.6, rounded to 76
      expect(points).toBe(76);
    });

    it('should return 120% of LNB+ when calculated points are lower than the threshold', () => {
      const input: CalculationInput = {
        game: TouhouGame.TH07,
        shotType: 'SakuyaB',
        isNoBombs: true,
        numberOfDeaths: 3,
      };

      const points = DanmakuPointsCalculator.calculate(input);
      // Expected calculation: 80 * 0.5 * 0.6 * 0.7 = 16.8
      // Threshold: 29 * 1.2 = 34.8
      // Since 16.8 < 34.8, should return 29 * 1.2 = 34.8, rounded to 35
      expect(points).toBe(35);
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
        isNoBombs: true,
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
