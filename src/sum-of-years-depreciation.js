/**
 * Options for {@link calculateSumOfYearsDepreciation}.
 *
 * @typedef {object} SumOfYearsDepreciationOptions
 * @property {number} cost - The initial cost of the asset.
 * @property {number} salvage - The value at the end of the depreciation
 * (sometimes called the salvage value of the asset).
 * @property {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 * @property {number} period - The period and must use the same units as `life`.
 */

/**
 * Calculates the sum-of-years' digits depreciation of an asset for a specified
 * period.
 *
 * Remarks:
 * - The calculation is `((cost - salvage) * (life - per + 1) * 2) / (life)(life
 *   + 1)`.
 *
 * @param {SumOfYearsDepreciationOptions} options - The sum-of-years
 * depreciation calculation options.
 * @returns {number} The straight-line depreciation.
 *
 * @example
 * calculateSumOfYearsDepreciation({
 *   cost: 30000,
 *   salvage: 7500,
 *   life: 10,
 *   period: 1,
 * }); // 4090.909090909091
 */
export function calculateSumOfYearsDepreciation(options) {
  const { cost, salvage, life, period } = options;

  return ((cost - salvage) * (life - period + 1) * 2) / (life * (life + 1));
}
