/**
 * Options for {@link calculateEquivalentRate}.
 *
 * @typedef {object} EquivalentRateOptions
 * @property {number} periods - The number of periods for the investment.
 * @property {number} presentValue - The present value of the investment.
 * @property {number} futureValue - The future value of the investment.
 */

/**
 * Calculates an equivalent interest rate for the growth of an investment.
 *
 * @param {EquivalentRateOptions} options - The equivalent rate calculation
 * options.
 * @returns {number} The equivalent interest rate.
 * @throws {RangeError} If `periods` is less than or equal to zero.
 * @throws {RangeError} If `presentValue` is zero.
 *
 * @example
 * calculateEquivalentRate({
 *   periods: 96,
 *   presentValue: 10000,
 *   futureValue: 11000,
 * }); // 0.0009933073762913303
 */
export function calculateEquivalentRate(options) {
  const { periods, presentValue, futureValue } = options;

  if (periods <= 0) throw new RangeError("Number of periods must be positive");
  if (presentValue === 0) throw new RangeError("Present value cannot be zero");
  return Math.pow(futureValue / presentValue, 1 / periods) - 1;
}
