import { calculateModifiedInternalRateOfReturn } from "../modified-internal-rate-of-return.js";

/**
 * Calculates the modified internal rate of return for a series of periodic cash
 * flows. Considers both the cost of the investment and the interest received on
 * reinvestment of cash.
 *
 * Remarks:
 * - Uses the order of values to interpret the order of cash flows. Be sure to
 *   enter your payment and income values in the sequence you want and with the
 *   correct signs (positive values for cash received, negative values for cash
 *   paid).
 * - If `n` is the number of cash flows in values, `frate` is the `financeRate`,
 *   and `rrate` is the `reinvestRate`, then the equation is: `((-NPV(rrate,
 *   values[positive]) * (1 + rrate)) / (NPV(frate, values[negative]) * (1 +
 *   frate)))^(1 / (n - 1)) - 1`
 *
 * @param {number[]} values - An array that contains numbers. These numbers
 * represent a series of payments (negative values) and income (positive values)
 * occurring at regular periods. Values must contain at least one positive value
 * and one negative value to calculate the modified internal rate of return.
 * Otherwise, an error is thrown (divide by zero).
 * @param {number} financeRate - The interest rate you pay on the money used in the cash flows.
 * @param {number} reinvestRate - The interest rate you receive on the cash flows as you reinvest them.
 * @returns {number} the modified internal rate of return
 * @throws {RangeError} If `values` is not an array of at least two elements, or if there are not both positive and negative cash flows.
 * @throws {TypeError} If `financeRate` or `reinvestRate` is not a number.
 *
 * @example
 * mirr([-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.12); // 0.12609413
 */
export function mirr(values, financeRate, reinvestRate) {
  return calculateModifiedInternalRateOfReturn({
    cashFlows: values,
    financeRate,
    reinvestRate,
  });
}
