/**
 * Options for {@link calculateModifiedInternalRateOfReturn}.
 *
 * @typedef {object} ModifiedInternalRateOfReturnOptions
 * @property {number[]} cashFlows - An array that contains numbers. These
 * numbers represent a series of payments (negative values) and income
 * (positive values) occurring at regular periods. Values must contain at least
 * one positive value and one negative value to calculate the modified internal
 * rate of return. Otherwise, an error is thrown (divide by zero).
 * @property {number} financeRate - The interest rate you pay on the money used
 * in the cash flows.
 * @property {number} reinvestRate - The interest rate you receive on the cash
 * flows as you reinvest them.
 */

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
 * @param {ModifiedInternalRateOfReturnOptions} options - The modified internal
 * rate of return calculation options.
 * @returns {number} The modified internal rate of return.
 * @throws {RangeError} If `cashFlows` is not an array of at least two elements,
 * or if there are not both positive and negative cash flows.
 * @throws {TypeError} If `financeRate` or `reinvestRate` is not a number.
 *
 * @example
 * calculateModifiedInternalRateOfReturn({
 *   cashFlows: [-120000, 39000, 30000, 21000, 37000, 46000],
 *   financeRate: 0.1,
 *   reinvestRate: 0.12,
 * }); // 0.1260941303659051
 *
 * @example
 * calculateModifiedInternalRateOfReturn({
 *   cashFlows: [-120000, 39000, 30000, 21000],
 *   financeRate: 0.1,
 *   reinvestRate: 0.12,
 * }); // -0.048044655249980806
 */
export function calculateModifiedInternalRateOfReturn(options) {
  const { cashFlows, financeRate, reinvestRate } = options;

  if (!Array.isArray(cashFlows) || cashFlows.length < 2) {
    throw new RangeError("values must be an array with at least two elements");
  }

  if (typeof financeRate !== "number" || typeof reinvestRate !== "number") {
    throw new TypeError("financeRate and reinvestRate must be numbers");
  }

  const n = cashFlows.length;
  let fvPos = 0;
  let pvNeg = 0;

  for (let i = 0; i < n; i++) {
    const v = cashFlows[i];
    if (v > 0) {
      fvPos += v * Math.pow(1 + reinvestRate, n - 1 - i);
    } else if (v < 0) {
      pvNeg += v * Math.pow(1 + financeRate, i);
    }
  }

  if (fvPos === 0 || pvNeg === 0) {
    throw new RangeError(
      "At least one negative and one positive cash flow required",
    );
  }

  return Math.pow(fvPos / -pvNeg, 1 / (n - 1)) - 1;
}
