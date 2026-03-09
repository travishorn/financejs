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
  // Input validation
  if (cost < 0) throw new RangeError("cost must be >= 0");
  if (salvage < 0) throw new RangeError("salvage must be >= 0");
  if (life <= 0) throw new RangeError("life must be > 0");
  if (factor <= 0) throw new RangeError("factor must be > 0");
  if (startPeriod < 0) throw new RangeError("startPeriod must be >= 0");
  if (endPeriod < 0) throw new RangeError("endPeriod must be >= 0");
  if (startPeriod > endPeriod)
    throw new RangeError("startPeriod must be <= endPeriod");
  if (salvage >= cost) return 0;

  // Clamp periods to [0, life]
  startPeriod = Math.max(0, Math.min(startPeriod, life));
  endPeriod = Math.max(0, Math.min(endPeriod, life));
  if (startPeriod === endPeriod) return 0;

  // Excel returns 0 for a fractional interval wholly within the final period
  // when it ends exactly at life (e.g. start=9.5, end=10 with life=10).
  if (!noSwitch && endPeriod === life && startPeriod > life - 1) return 0;

  let totalDep = 0;
  let period = Math.floor(startPeriod * 1e9) / 1e9; // avoid floating point issues

  while (period < endPeriod) {
    // Calculate the portion of the period to depreciate
    let next = Math.min(Math.floor(period + 1), endPeriod);
    let periodLength = next - period;

    // Calculate depreciation for this period
    let book = cost;
    let accDep = 0;

    for (let i = 0; i < Math.floor(period); ++i) {
      let d = (book * factor) / life;

      if (!noSwitch) {
        let sl = (cost - accDep - salvage) / (life - i);
        if (sl > d) d = sl;
      }

      if (book - d < salvage) d = book - salvage;
      accDep += d;
      book -= d;
    }

    // For the current period (may be partial)
    let d = (book * factor) / life;

    if (!noSwitch) {
      let sl = (cost - accDep - salvage) / (life - period);
      if (sl > d) d = sl;
    }

    if (book - d < salvage) d = book - salvage;

    let dep = d * periodLength;
    totalDep += dep;
    period = next;
  }

  return totalDep;
}
