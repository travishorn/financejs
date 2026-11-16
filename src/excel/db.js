import { calculateDecliningBalanceDepreciation } from "../declining-balance-depreciation.js";

/**
 * Calculates the depreciation of an asset for a specified period using the
 * fixed-declining balance method.
 *
 * Remarks:
 * - The fixed-declining balance method computes depreciation at a fixed rate.
 *   Uses the following formulas to calculate depreciation for a period: `(cost
 *   - total depreciation from prior periods) * rate`, where `rate = 1 -
 *     ((salvage / cost) ^ (1 / life))`, rounded to three decimal places.
 * - Depreciation for the first and last periods is a special case. For the
 *   first period, this function uses this formula: `cost * rate * month / 12`
 * - For the last period, DB uses this formula: `((cost - total depreciation
 *   from prior periods) * rate * (12 - month)) / 12`
 *
 * @param {number} cost - The initial cost of the asset.
 * @param {number} salvage - The value at the end of the depreciation (sometimes
 * called the salvage value of the asset).
 * @param {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 * @param {number} period - The period for which you want to calculate the
 * depreciation. Period must use the same units as `life`.
 * @param {number} [month=12] - The number of months in the first year. If month
 * is omitted, it is assumed to be `12`.
 * @returns {number} the depreciation
 *
 * @example
 * db(1000000, 100000, 6, 1, 7); // 186083.33333333
 */
export function db(cost, salvage, life, period, month = 12) {
  return calculateDecliningBalanceDepreciation({
    cost,
    salvage,
    life,
    period,
    month,
  });
}
