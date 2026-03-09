/**
 * Calculates the number of periods required by an investment to reach a
 * specified value.
 *
 * @param {number} rate - Rate is the interest rate per period.
 * @param {number} pv - The present value of the investment.
 * @param {number} fv - The future value of the investment.
 * @returns {number} the number of periods required
 * @throws {RangeError} if `rate` is less than or equal to zero
 * @throws {RangeError} if `pv` is zero
 *
 * @example
 * pduration(0.025, 2000, 2200); // 3.86
 */
export function pduration(rate, pv, fv) {
  if (rate <= 0) throw new RangeError("Rate must be positive");
  if (pv === 0) throw new RangeError("Present value cannot be zero");
  return Math.log(fv / pv) / Math.log(1 + rate);
}
