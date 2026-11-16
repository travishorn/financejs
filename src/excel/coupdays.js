import { calculateCouponDays } from "../coupon-days.js";

/**
 * Returns the number of days in the coupon period that contains the settlement
 * date.
 *
 * Remarks:
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4`, an error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 *
 * @param {Date} settlement - The security's settlement date.
 * @param {Date} maturity - The security's maturity date.
 * @param {1|2|4} frequency - The number of coupon payments per year. For annual
 * payments, frequency = `1`; for semiannual, frequency = `2`; for quarterly,
 * frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} The number of days in the coupon period that contains the
 * settlement date.
 *
 * @example
 * coupdays(new Date("2011-01-25"), new Date("2011-11-15"), 2, 1); // 184
 */
export function coupdays(settlement, maturity, frequency, basis = 0) {
  return calculateCouponDays({ settlement, maturity, frequency, basis });
}
