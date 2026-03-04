import { fv as calculateFv } from "./fv.js";
import { pmt } from "./pmt.js";

/**
 * Returns the interest payment for a given period for an investment based on
 * periodic, constant payments and a constant interest rate.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at 12
 *   percent annual interest, use `.12/12` for `rate` and `4*12` for `nper`. If
 *   you make annual payments on the same loan, use `.12` for `rate` and `4` for
 *   `nper`.
 * - For all the arguments, cash you pay out, such as deposits to savings, is
 *   represented by negative numbers. Cash you receive, such as dividend checks,
 *   is represented by positive numbers.
 *
 * @param {number} rate - The interest rate per period.
 * @param {number} per - The period for which you want to find the interest and
 * must be in the range `1` to `nper`.
 * @param {number} nper - The total number of payment periods in an annuity.
 * @param {number} pv - The present value, or the lump-sum amount that a series
 * of future payments is worth right now.
 * @param {number} [fv=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If `fv` is omitted, it is
 * assumed to be `0` (the future value of a loan, for example, is `0`).
 * @param {0|1} [type=0] - The number `0` or `1` and indicates when payments are
 * due. If type is omitted, it is assumed to be `0`. Set `type` equal to `0` if
 * payments are due at the end of the period. Set `type` equal to `1` if
 * payments are due at the beginning of the period.
 * @returns {number} The interest payment for the specified period.
 * @throws {RangeError} When `per` is outside the valid range.
 *
 * @example
 * ipmt(0.1 / 12, 1, 3, 8000); // -66.67
 */
export function ipmt(rate, per, nper, pv, fv = 0, type = 0) {
  if (per <= 0 || per >= nper + 1) {
    throw new RangeError("Invalid period.");
  }

  if (type !== 0 && per === 1) {
    return 0;
  }

  const periodOffset = type !== 0 ? 2 : 1;
  const periodicPayment = pmt(rate, nper, pv, fv, type);
  const adjustedPresentValue = type !== 0 ? pv + periodicPayment : pv;
  const periodFutureValue = calculateFv(
    rate,
    per - periodOffset,
    periodicPayment,
    adjustedPresentValue,
  );

  return periodFutureValue * rate;
}
