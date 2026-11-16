import { calculateMacaulayDuration } from "../macaulay-duration.js";

/**
 * Calculates the Macauley duration for an assumed par value of $100. Duration
 * is defined as the weighted average of the present value of cash flows, and is
 * used as a measure of a bond's price sensitivity to changes in yield.
 *
 * Remarks:
 * - The settlement date is the date a buyer purchases a coupon, such as a bond.
 *   The maturity date is the date when a coupon expires.
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `coupon` < `0` or if `yld` < `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4`, an error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 *
 * The duration is calculated as:
 *
 * When N > 1:
 * ```
 * DURATION = (1 / PRICE) * [
 *   SUM(k=1 to N) (100 * rate/frequency) / (1 + yld/frequency)^(DSC/E + k-1)
 *     * (DSC/E + k-1)
 *   + redemption / (1 + yld/frequency)^(DSC/E + N-1) * (DSC/E + N-1)
 * ]
 * ```
 *
 * When N = 1:
 * ```
 * DURATION = (1 / PRICE) * [
 *   (100 * rate/frequency + redemption) / (1 + yld/frequency * DSC/E)
 *     * (DSC/E)
 * ]
 * ```
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
 * @returns {number} The Macauley duration.
 *
 * @example
 * duration(new Date("2018-07-01"), new Date("2048-01-01"), 0.08, 0.09, 2, 1); // 10.91914528
 */
export function duration(
  settlement,
  maturity,
  coupon,
  yld,
  frequency,
  basis = 0,
) {
  return calculateMacaulayDuration({
    settlement,
    maturity,
    coupon,
    yield: yld,
    frequency,
    basis,
  });
}
