import { normalizeZero } from "./util.js";
import { duration } from "./duration.js";

/**
 * Returns the modified Macauley duration for a security with an assumed par
 * value of $100.
 *
 * Modified duration is defined as:
 * ```
 * MDURATION = DURATION / (1 + yld / frequency)
 * ```
 *
 * Remarks:
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `coupon` < `0` or if `yld` < `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4`, an error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 *
 * @param {Date} settlement - The security's settlement date.
 * @param {Date} maturity - The security's maturity date.
 * @param {number} coupon - The security's annual coupon rate.
 * @param {number} yld - The security's annual yield.
 * @param {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} The modified Macauley duration.
 *
 * @example
 * mduration(new Date("2008-01-01"), new Date("2016-01-01"), 0.08, 0.09, 2, 1); // 5.73566981
 */
export function mduration(
  settlement,
  maturity,
  coupon,
  yld,
  frequency,
  basis = 0,
) {
  const macDur = duration(settlement, maturity, coupon, yld, frequency, basis);

  return normalizeZero(macDur / (1 + yld / frequency));
}
