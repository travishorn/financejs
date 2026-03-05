/**
 * Calculates the sum-of-years' digits depreciation of an asset for a specified
 * period.
 *
 * Remarks:
 * - The calculation is `((cost - salvage) * (life - per + 1) * 2) / (life)(life
 *   + 1)`.
 *
 * @param {number} cost - The initial cost of the asset.
 * @param {number} salvage - The value at the end of the depreciation (sometimes
 * called the salvage value of the asset).
 * @param {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 * @param {number} per - The period and must use the same units as `life`.
 * @returns {number} the straight-line depreciation
 *
 * @example
 * syd(30000, 7500, 10, 1); // 4090.91
 */
export function syd(cost, salvage, life, per) {
  return ((cost - salvage) * (life - per + 1) * 2) / (life * (life + 1));
}
