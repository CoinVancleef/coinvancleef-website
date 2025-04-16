import { WeightingCalculator } from '../../utils/WeightingCalculator';

describe('WeightingCalculator', () => {
  describe('calculateTotalPoints', () => {
    it('should return 0 for empty danmaku points array', () => {
      const total = WeightingCalculator.calculateTotalPoints([]);
      expect(total).toBe(0);
    });

    it('should return the exact value for a single clear with danmaku points', () => {
      const total = WeightingCalculator.calculateTotalPoints([100]);
      expect(total).toBe(100);
    });

    it('should correctly weight two clears with danmaku points', () => {
      const danmakuPoints = [100, 90];
      // 100 * 0.95^0 + 90 * 0.95^1
      // = 100 * 1 + 90 * 0.95
      // = 100 + 85.5 = 185.5 ≈ 186
      const expected = Math.round(100 + 90 * 0.95);
      const total = WeightingCalculator.calculateTotalPoints(danmakuPoints);
      expect(total).toBe(expected);
    });

    it('should correctly weight multiple clears with danmaku points within the threshold', () => {
      const danmakuPoints = [100, 95, 90, 85, 80]; // 5 clears, all within top 20

      // Manual calculation:
      // 100 * 0.95^0 + 95 * 0.95^1 + 90 * 0.95^2 + 85 * 0.95^3 + 80 * 0.95^4
      // = 100 * 1 + 95 * 0.95 + 90 * 0.9025 + 85 * 0.857375 + 80 * 0.81450625
      // = 100 + 90.25 + 81.225 + 72.877 + 65.16 = 409.51 ≈ 410
      let expected = 0;
      for (let i = 0; i < danmakuPoints.length; i++) {
        expected += danmakuPoints[i] * Math.pow(0.95, i);
      }
      expected = Math.round(expected);

      const total = WeightingCalculator.calculateTotalPoints(danmakuPoints);
      expect(total).toBe(expected);
    });

    it('should sort danmaku points in descending order before applying weights', () => {
      const unsortedDanmakuPoints = [90, 100, 80, 95, 85];
      const sortedDanmakuPoints = [100, 95, 90, 85, 80];

      // Calculate expected with sorted danmaku points
      let expected = 0;
      for (let i = 0; i < sortedDanmakuPoints.length; i++) {
        expected += sortedDanmakuPoints[i] * Math.pow(0.95, i);
      }
      expected = Math.round(expected);

      const total = WeightingCalculator.calculateTotalPoints(unsortedDanmakuPoints);
      expect(total).toBe(expected);
    });

    it('should apply a steeper decay to clears with danmaku points beyond the threshold', () => {
      // Create danmaku points: Top 20 clears of 100, followed by 5 clears of 80
      const danmakuPoints = Array(20).fill(100).concat(Array(5).fill(80));

      // Calculate expected total manually
      let expected = 0;

      // First 20 clears with normal decay
      for (let i = 0; i < 20; i++) {
        expected += 100 * Math.pow(0.95, i);
      }

      // Clears beyond threshold with steeper decay
      const baseWeight = Math.pow(0.95, 19); // Weight at position 20
      for (let i = 0; i < 5; i++) {
        const extraDecay = Math.pow(0.9, i + 1);
        expected += 80 * baseWeight * extraDecay;
      }

      expected = Math.round(expected);

      const total = WeightingCalculator.calculateTotalPoints(danmakuPoints);
      expect(total).toBe(expected);
    });

    it('should use a custom decay factor if provided', () => {
      const danmakuPoints = [100, 90, 80];
      const customDecay = 0.9;

      // 100 * 0.9^0 + 90 * 0.9^1 + 80 * 0.9^2
      // = 100 * 1 + 90 * 0.9 + 80 * 0.81
      // = 100 + 81 + 64.8 = 245.8 ≈ 246
      let expected = 0;
      for (let i = 0; i < danmakuPoints.length; i++) {
        expected += danmakuPoints[i] * Math.pow(customDecay, i);
      }
      expected = Math.round(expected);

      const total = WeightingCalculator.calculateTotalPoints(danmakuPoints, customDecay);
      expect(total).toBe(expected);
    });

    it('should handle a large number of varied clears with danmaku points', () => {
      // Create 50 danmaku point values with values decreasing by 1
      const danmakuPoints = Array.from({ length: 50 }, (_, i) => 100 - i);

      // Calculate expected manually (too complex to show here)
      let expected = 0;

      // First 20 clears with normal decay
      for (let i = 0; i < 20; i++) {
        expected += danmakuPoints[i] * Math.pow(0.95, i);
      }

      // Remaining clears with steeper decay
      const baseWeight = Math.pow(0.95, 19);
      for (let i = 20; i < danmakuPoints.length; i++) {
        const extraDecay = Math.pow(0.9, i - 20 + 1);
        expected += danmakuPoints[i] * baseWeight * extraDecay;
      }

      expected = Math.round(expected);

      const total = WeightingCalculator.calculateTotalPoints(danmakuPoints);
      expect(total).toBe(expected);
    });
  });
});
