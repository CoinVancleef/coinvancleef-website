export class WeightingCalculator {
  /**
   * Default decay factor for the weighting system.
   * Each subsequent clear is weighted by this factor to the power of its position.
   */
  private static readonly DEFAULT_DECAY_FACTOR = 0.95;

  /**
   * Threshold after which clears receive significantly less weight.
   * Clears beyond this position will have a steeper decay.
   */
  private static readonly TOP_CLEARS_THRESHOLD = 20;

  /**
   * Secondary decay factor for clears beyond the top threshold.
   * This creates a sharper drop-off in clear contribution.
   */
  private static readonly SECONDARY_DECAY_FACTOR = 0.9;

  /**
   * Calculate the total weighted danmaku points from an array of individual clear danmaku points.
   *
   * Formula (similar to osu! pp formula):
   * total_danmaku_points = dp[1] * 0.95^0 + dp[2] * 0.95^1 + dp[3] * 0.95^2 + ... + dp[m] * 0.95^(m-1)
   *
   * Where:
   * - dp[n] is the n-th highest danmaku point value from a player's clears
   * - For clears beyond the top 20, an even steeper decay is applied
   *
   * @param danmakuPoints Array of individual danmaku point values from clears
   * @param decayFactor Optional custom decay factor (default: 0.95)
   * @returns The total weighted danmaku points
   */
  public static calculateTotalPoints(
    danmakuPoints: number[],
    decayFactor = this.DEFAULT_DECAY_FACTOR,
  ): number {
    if (!danmakuPoints.length) return 0;

    // Sort danmaku points in descending order
    const sortedDanmakuPoints = [...danmakuPoints].sort((a, b) => b - a);

    // Calculate weighted sum
    let totalPoints = 0;

    sortedDanmakuPoints.forEach((points, index) => {
      // Apply different decay factors based on position
      const position = index;
      let weight: number;

      if (position < this.TOP_CLEARS_THRESHOLD) {
        // Top clears use the standard decay
        weight = Math.pow(decayFactor, position);
      } else {
        // Clears beyond threshold get a steeper decay
        // First apply the regular decay for the threshold positions
        const baseWeight = Math.pow(decayFactor, this.TOP_CLEARS_THRESHOLD - 1);
        // Then apply the secondary decay for positions beyond the threshold
        const extraDecay = Math.pow(
          this.SECONDARY_DECAY_FACTOR,
          position - this.TOP_CLEARS_THRESHOLD + 1,
        );
        weight = baseWeight * extraDecay;
      }

      totalPoints += points * weight;
    });

    // Round to nearest integer
    return Math.round(totalPoints);
  }
}
