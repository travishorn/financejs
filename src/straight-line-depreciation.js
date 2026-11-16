/**
 * Options for {@link calculateStraightLineDepreciation}.
 *
 * @typedef {object} StraightLineDepreciationOptions
 * @property {number} cost - The initial cost of the asset.
 * @property {number} salvage - The value at the end of the depreciation
 * (sometimes called the salvage value of the asset).
 * @property {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 */

/**
 * Calculates the straight-line depreciation of an asset for one period.
 *
 * @param {StraightLineDepreciationOptions} options - The straight-line
 * depreciation calculation options.
 * @returns {number} The straight-line depreciation.
 *
 * @example
 * calculateStraightLineDepreciation({
 *   cost: 30000,
 *   salvage: 7500,
 *   life: 10,
 * }); // 2250
 */
export function calculateStraightLineDepreciation(options) {
  const { cost, salvage, life } = options;

  return (cost - salvage) / life;
}
