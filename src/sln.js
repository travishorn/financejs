/**
 * Calculates the straight-line depreciation of an asset for one period.
 *
 * @param {number} cost - The initial cost of the asset.
 * @param {number} salvage - The value at the end of the depreciation (sometimes
 * called the salvage value of the asset).
 * @param {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 * @returns {number} the straight-line depreciation
 *
 * @example
 * sln(30000, 7500, 10); // 2250
 */
export function sln(cost, salvage, life) {
  return (cost - salvage) / life;
}
