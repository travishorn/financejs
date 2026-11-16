import { normalizeZero } from "./util.js";
import { calculateMacaulayDuration } from "./macaulay-duration.js";

/**
 * Options for {@link calculateModifiedDuration}.
 *
 * @typedef {object} ModifiedDurationOptions
 * @property {Date} settlement - The security's settlement date.
 * @property {Date} maturity - The security's maturity date.
 * @property {number} coupon - The security's annual coupon rate.
 * @property {number} yield - The security's annual yield.
 * @property {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @property {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 */

/**
 * Returns the modified Macauley duration for a security with an assumed par
 * value of $100.
 *
 * Modified duration is defined as:
 * ```
 * MDURATION = DURATION / (1 + yield / frequency)
 * ```
 *
 * Remarks:
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `coupon` < `0` or if `yield` < `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4`, an error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 *
 * @param {ModifiedDurationOptions} options - The modified duration calculation
 * options.
 * @returns {number} The modified Macauley duration.
 *
 * @example
 * calculateModifiedDuration({
 *   settlement: new Date("2008-01-01"),
 *   maturity: new Date("2016-01-01"),
 *   coupon: 0.08,
 *   yield: 0.09,
 *   frequency: 2,
 *   basis: 1,
 * }); // 5.73566981
 */
export function calculateModifiedDuration(options) {
  const {
    settlement,
    maturity,
    coupon,
    yield: yld,
    frequency,
    basis = 0,
  } = options;

  const macDur = calculateMacaulayDuration({
    settlement,
    maturity,
    coupon,
    yield: yld,
    frequency,
    basis,
  });

  return normalizeZero(macDur / (1 + yld / frequency));
}
