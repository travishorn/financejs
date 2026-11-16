import { calculateDoubleDecliningBalanceDepreciation } from "../double-declining-balance-depreciation.js";

/**
 * Calculates the depreciation of an asset for a specified period using the
 * double-declining balance method or some other method you specify.
 *
 * Remarks:
 * - The double-declining balance method computes depreciation at an accelerated
 *   rate. Depreciation is highest in the first period and decreases in
 *   successive periods. This function uses the following formula to calculate
 *   depreciation for a period: `Min( (cost - total depreciation from prior
 *   periods) * (factor/life), (cost - salvage - total depreciation from prior
 *   periods) )`
 * - Change `factor` if you do not want to use the double-declining balance
 *   method.
 *
 * @param {number} cost - The initial cost of the asset.
 * @param {number} salvage - The value at the end of the depreciation (sometimes
 * called the salvage value of the asset). This value can be `0`.
 * @param {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 * @param {number} period - The period for which you want to calculate the
 * depreciation. Period must use the same units as `life`.
 * @param {number} [factor=2] - The rate at which the balance declines. If
 * `factor` is omitted, it is assumed to be `2` (the double-declining balance
 * method).
 * @returns {number} the depreciation
 * @throws {RangeError} When `period` is outside the valid range.
 *
 * @example
 * ddb(2400, 300, 10 * 365, 1); // 1.31506849
 */
export function ddb(cost, salvage, life, period, factor = 2) {
  return calculateDoubleDecliningBalanceDepreciation({
    cost,
    salvage,
    life,
    period,
    factor,
  });
}
