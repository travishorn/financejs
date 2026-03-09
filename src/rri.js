/**
 * Calculates an equivalent interest rate for the growth of an investment.
 *
 * @param {number} nper - The number of periods for the investment.
 * @param {number} pv - The present value of the investment.
 * @param {number} fv - The future value of the investment.
 * @returns {number} the equivalent interest rate
 *
 * @example
 * rri(96, 10000, 11000); // 0.00099331
 */
export function rri(nper, pv, fv) {
  if (nper <= 0) throw new RangeError("Number of periods must be positive");
  if (pv === 0) throw new RangeError("Present value cannot be zero");
  return Math.pow(fv / pv, 1 / nper) - 1;
}
