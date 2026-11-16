import { calculateEquivalentRate } from "../equivalent-rate.js";

/**
 * Calculates an equivalent interest rate for the growth of an investment.
 *
 * @param {number} nper - The number of periods for the investment.
 * @param {number} pv - The present value of the investment.
 * @param {number} fv - The future value of the investment.
 * @returns {number} the equivalent interest rate
 * @throws {RangeError} if `nper` is less than or equal to zero
 * @throws {RangeError} if `pv` is zero
 *
 * @example
 * rri(96, 10000, 11000); // 0.00099331
 */
export function rri(nper, pv, fv) {
  return calculateEquivalentRate({
    periods: nper,
    presentValue: pv,
    futureValue: fv,
  });
}
