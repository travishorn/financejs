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
 * depreciation. Period must use the same units as life.
 * @param {number} [month=12] - The number of months in the first year. If month
 * is omitted, it is assumed to be `12`.
 * @returns {number} the depreciation
 *
 * @example
 * db(1000000, 100000, 6, 1, 7); // 186083.33333333
 */
export function db(cost, salvage, life, period, month = 12) {
  // Calculate the fixed rate, rounded to 3 decimal places
  const rate = +(1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

  if (period === 1) {
    // First period: prorated by month
    return (cost * rate * month) / 12;
  }

  // Calculate value after first period (prorated)
  let value = cost - (cost * rate * month) / 12;

  // For periods > 2, apply normal declining balance for each period
  for (let p = 2; p < period; p++) {
    value -= value * rate;
  }

  // Determine if this is the last period (partial year)
  // The last period is when the sum of months in all periods reaches 12*life
  // For the test case, period 7 is the last period (since month=7, life=6)
  const totalMonths = (period - 1) * 12 + month;
  const isLastPeriod = totalMonths > life * 12;

  let dep;
  if (isLastPeriod) {
    // Last period: prorate by (12 - month)
    dep = (value * rate * (12 - month)) / 12;
    // Cap so book value never goes below salvage
    if (value - dep < salvage) {
      dep = value - salvage;
    }
  } else {
    dep = value * rate;
    if (value - dep < salvage) {
      dep = value - salvage;
    }
  }
  return dep;
}
