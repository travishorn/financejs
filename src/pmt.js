import { normalizeZero } from "./normalizeZero.js";

/**
 * Calculates the payment for a loan based on constant payments and a constant
 * interest rate.
 *
 * Remarks:
 * - The payment returned by this function includes principal and interest but
 *   no taxes, reserve payments, or fees sometimes associated with loans.
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at an
 *   annual interest rate of 12 percent, use `0.12 / 12` for `rate` and `4 * 12`
 *   for `nper`. If you make annual payments on the same loan, use `0.12` for
 *   `rate` and `4` for `nper`.
 *
 * @param {number} rate - The interest rate for the loan.
 * @param {number} nper - The total number of payments for the loan.
 * @param {number} pv - The present value, or the total amount that a series of
 * future payments is worth now; also known as the principal.
 * @param {number} [fv=0] - The future value, or a cash balance you want to
 * attain after the last payment is made. If `fv `is omitted, it is assumed to
 * be `0 `(zero), that is, the future value of a loan is 0.
 * @param {0|1} [type=0] - The number `0` (zero) or `1` and indicates when
 * payments are due. Set `type` equal to `0` or omitted if payments are due at
 * the end of the period. Set `type` equal to `1` if payments are due at the
 * beginning of the period.
 * @returns {number} The periodic payment amount.
 *
 * @example
 * pmt(0.08 / 12, 10, 10000); // -1037.03
 */
export function pmt(rate, nper, pv, fv = 0, type = 0) {
  if (rate === 0) {
    return normalizeZero((-fv - pv) / nper);
  } else {
    const paymentTimingFactor = type !== 0 ? 1 + rate : 1;
    const interestFactor = 1 + rate;
    const compoundFactor = Math.pow(interestFactor, nper);

    return normalizeZero(
      ((-fv - pv * compoundFactor) /
        (paymentTimingFactor * (compoundFactor - 1))) *
        rate,
    );
  }
}
