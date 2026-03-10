/**
 * Calculates the price per $100 face value of a security that pays periodic
 * interest.
 *
 * Remarks:
 * - The settlement date is the date a buyer purchases a coupon, such as a bond.
 *   The maturity date is the date when a coupon expires. For example, suppose a
 *   30-year bond is issued on January 1, 2008, and is purchased by a buyer six
 *   months later. The issue date would be January 1, 2008, the settlement date
 *   would be July 1, 2008, and the maturity date would be January 1, 2038,
 *   which is 30 years after the January 1, 2008, issue date.
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `yld` < `0` or if `rate` < `0`, an error is thrown.
 * - If `redemption` <= `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4` and error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 * - When N > 1 (N is the number of coupons payable between the settlement date
 *   and redemption date), the calculation is: TODO, where:
 *    - DSC = number of days from settlement to next coupon date.
 *    - E = number of days in coupon period in which the settlement date falls.
 *    - A = number of days from beginning of coupon period to settlement date.
 * - When N = 1, the calculation is: TODO.
 *
 * @param {Date} settlement - The security's settlement date. The security
 * settlement date is the date after the issue date when the security is traded
 * to the buyer.
 * @param {Date} maturity - The security's maturity date. The maturity date is
 * the date when the security expires.
 * @param {number} rate - The security's annual coupon rate.
 * @param {number} yld - The security's annual yield.
 * @param {number} redemption - The security's redemption value per $100 face
 * value.
 * @param {1|2|4} frequency - The number of coupon payments per year. For annual
 * payments, frequency = `1`; for semiannual, frequency = `2`; for quarterly,
 * frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} the price per $100 face value
 *
 * @example
 * price(new Date("2008-02-15"), new Date("2017-11-15"), 0.0575, 0.065, 100, 2, 0); // 94.63436162
 */
export function price(
  settlement,
  maturity,
  rate,
  yld,
  redemption,
  frequency,
  basis = 0,
) {}
