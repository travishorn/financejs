import { calculateInternalRateOfReturn } from "../irr.js";

/**
 * Calculates the internal rate of return for a series of cash flows represented
 * by the numbers in `values`. These cash flows do not have to be even, as they
 * would be for an annuity. However, the cash flows must occur at regular
 * intervals, such as monthly or annually. The internal rate of return is the
 * interest rate received for an investment consisting of payments (negative
 * values) and income (positive values) that occur at regular periods.
 *
 * Remarks:
 * - Uses an iterative technique for calculating IRR. Starting with guess, this
 *   function cycles through the calculation until the result is accurate within
 *   a small absolute threshold. If this function can't find a result that works
 *   after 39 tries, a RangeError is thrown.
 * - `irr()` is closely related to `npv()`, the net present value function. The
 *   rate of return calculated by this function is the interest rate
 *   corresponding to a 0 (zero) net present value.
 *
 * @param {number[]} values - An array that contains numbers for which you want
 * to calculate the internal rate of return. Values must contain at least one
 * positive value and one negative value to calculate the internal rate of
 * return. This function uses the order of values to interpret the order of cash
 * flows. Be sure to enter your payment and income values in the sequence you
 * want.
 * @param {number} [guess=0.1] - A number that you guess is close to the result
 * of this function. In most cases you do not need to provide guess for this
 * calculation. If a RangeError is thrown, or if the result is not close to what
 * you expected, try again with a different value for `guess`.
 * @returns {number} The internal rate of return.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 *
 * @example
 * irr([-70000,12000,15000,18000,21000]); // -0.021244848272975403
 */
export function irr(values, guess = 0.1) {
  return calculateInternalRateOfReturn({ cashFlows: values, guess });
}
