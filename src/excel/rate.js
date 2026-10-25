import { calculateRate } from "../rate.js";

/**
 * Calculates the interest rate per period of an annuity. The rate is calculated
 * by iteration and can have zero or more solutions. If the successive results
 * of this function do not converge to within 0.0000001 after 128 iterations, a
 * RangeError is thrown.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at 12
 *   percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `nper`. If you make annual payments on the same loan, use `0.12` for `rate`
 *   and `4` for `nper`.
 *
 * @param {number} nper - The total number of payment periods in an annuity.
 * @param {number} pmt - The payment made each period and cannot change over the
 * life of the annuity. Typically, `pmt` includes principal and interest but no
 * other fees or taxes. If `pmt` is omitted, you must include the `fv` argument
 * for a meaningful equation.
 * @param {number} pv - The present value — the total amount that a series of
 * future payments is worth now.
 * @param {number} [fv=0] - The future value, or a cash balance you want to
 * attain after the last payment is made. If `fv` is omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is 0). If `fv` is omitted,
 * you must include the `pmt` argument.
 * @param {0|1} [type=0] - The number `0` (zero) or `1` and indicates when
 * payments are due. Set `type` equal to `0` or omitted if payments are due at
 * the end of the period. Set `type` equal to `1` if payments are due at the
 * beginning of the period.
 * @param {number} [guess=0.1] - Your guess for what the rate will be. If you
 * omit `guess`, it is assumed to be `0.1` (10 percent). If the calculation does
 * not converge, try different values for `guess`. The calculation usually
 * converges if guess is between `0` and `1`.
 * @returns {number} The calculated interest rate per period of an annuity.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 *
 * @example
 * rate(4 * 12, -200, 8000); // 0.007701472488210084
 */
export function rate(nper, pmt, pv, fv = 0, type = 0, guess = 0.1) {
  return calculateRate({
    periods: nper,
    payment: pmt,
    presentValue: pv,
    futureValue: fv,
    timing: type === 1 ? "beginning" : "end",
    guess,
  });
}
