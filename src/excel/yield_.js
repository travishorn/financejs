import { calculateBondYield } from "../bond-yield.js";

/**
 * Calculates the yield on a security that pays periodic interest. Use to
 * calculate bond yield.
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
 * - If `rate` < `0`, an error is thrown.
 * - If `pr` ≤ `0` or if `redemption` ≤ `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4` and error is thrown.
 * - If `settlement` ≥ `maturity`, an error is thrown.
 * - If there is one coupon period or less until redemption, the yield is
 *   calculated as follows: `yield = ((redemption/100 + rate/frequency) -
 *   (par/100 + (A/E * rate/frequency))) / (par/100 + (A/E * rate/frequency)) *
 *   (frequency * E) / DSR`, where:
 *      - `A` = number of days from the beginning of the coupon period to the
 *        settlement date (accrued days).
 *      - `DSR` = number of days from the settlement date to the redemption date.
 *      - `E` = number of days in the coupon period.
 *  - If there is more than one coupon period until redemption, the yield is
 *    calculated through a hundred iterations. The resolution uses the Newton
 *    method. The yield is changed until the estimated price given the yield is
 *    close to price.
 *
 * @param {Date} settlement - The security's settlement date. The security
 * settlement date is the date after the issue date when the security is traded
 * to the buyer.
 * @param {Date} maturity - The security's maturity date. The maturity date is
 * the date when the security expires.
 * @param {number} rate - The security's annual coupon rate.
 * @param {number} pr - The security's price per $100 face value.
 * @param {number} redemption - The security's redemption value per $100 face
 * value.
 * @param {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} The yield
 *
 * @example
 * yield_(new Date("2008-02-15"), new Date("2016-11-15"), 0.0575, 95.04287, 100, 2, 0); // 0.06500001
 */
export function yield_(
  settlement,
  maturity,
  rate,
  pr,
  redemption,
  frequency,
  basis = 0,
) {
  return calculateBondYield({
    settlement,
    maturity,
    rate,
    price: pr,
    redemption,
    frequency,
    basis,
  });
}
