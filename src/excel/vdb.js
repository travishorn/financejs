import { calculateVariableDecliningBalanceDepreciation } from "../variable-declining-balance-depreciation.js";

/**
 * Calculates the depreciation of an asset for any period you specify, including
 * partial periods, using the double-declining balance method or some other
 * method you specify. VDB stands for variable declining balance.
 *
 * @param {number} cost - The initial cost of the asset.
 * @param {number} salvage - The value at the end of the depreciation (sometimes
 * called the salvage value of the asset). This value can be `0`.
 * @param {number} life - The number of periods over which the asset is
 * depreciated (sometimes called the useful life of the asset).
 * @param {number} startPeriod - The starting period for which you want to
 * calculate the depreciation. `startPeriod` must use the same units as `life`.
 * @param {number} endPeriod - The ending period for which you want to calculate
 * the depreciation. `endPeriod` must use the same units as `life`.
 * @param {number} [factor=2] -The rate at which the balance declines. If
 * `factor` is omitted, it is assumed to be `2` (the double-declining balance
 * method). Change factor if you do not want to use the double-declining balance
 * method.
 * @param {boolean} [noSwitch=false] - Whether to switch to straight-line
 * depreciation when depreciation is greater than the declining balance
 * calculation. If `noSwitch` is `true`, this function does not switch to
 * straigh-line depreciation even when the depreciation is greater than the
 * declining balance calculation. If `noSwitch` is `false`, this function
 * switches to straight-line depreciation when depreciation is greater than the
 * declining balance calculation.
 * @returns {number} the depreciation
 *
 * @example
 * vdb(2400, 300, 10 * 365, 0, 1); // 1.31506849
 */
export function vdb(
  cost,
  salvage,
  life,
  startPeriod,
  endPeriod,
  factor = 2,
  noSwitch = false,
) {
  return calculateVariableDecliningBalanceDepreciation({
    cost,
    salvage,
    life,
    startPeriod,
    endPeriod,
    factor,
    noSwitch,
  });
}
