import { ipmt } from "./ipmt.js";
import { normalizeZero } from "./normalizeZero.js";
import { pmt } from "./pmt.js";

/**
 * Calculates the payment on the principal for a given period for an investment
 * based on periodic, constant payments and a constant interest rate.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at 12
 *   percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `nper`. If you make annual payments on the same loan, use `0.12` for `rate`
 *   and `4` for `nper`.
 *
 * @param {number} rate - The interest rate per period.
 * @param {number} per - Specifies the period and must be in the range `1` to
 * `nper`.
 * @param {number} nper - The total number of payment periods in an annuity.
 * @param {number} pv - The present value — the total amount that a series of
 * future payments is worth now.
 * @param {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If `fv` is omitted, it is
 * assumed to be `0` (zero), that is, the future value of a loan is 0.
 * @param {0|1} [type=0] - The number `0` (zero) or `1` and indicates when
 * payments are due. Set `type` equal to `0` or omitted if payments are due at
 * the end of the period. Set `type` equal to `1` if payments are due at the
 * beginning of the period.
 * @returns {number} The payment on the principal for the specified period.
 * @throws {RangeError} When `per` is outside the valid range.
 *
 * @example
 * ppmt(0.1 / 12, 1, 2 * 12, 2000); // -75.62
 */
export function ppmt(rate, per, nper, pv, futureValue = 0, type = 0) {
  if (per <= 0 || per >= nper + 1) {
    throw new RangeError("Invalid period.");
  }

  const periodicPayment = pmt(rate, nper, pv, futureValue, type);
  const interestPayment = ipmt(rate, per, nper, pv, futureValue, type);

  return normalizeZero(periodicPayment - interestPayment);
}
