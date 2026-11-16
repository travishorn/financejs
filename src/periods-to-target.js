/**
 * Options for {@link calculatePeriodsToTarget}.
 *
 * @typedef {object} PeriodsToTargetOptions
 * @property {number} rate - Rate is the interest rate per period.
 * @property {number} presentValue - The present value of the investment.
 * @property {number} futureValue - The future value of the investment.
 */

/**
 * Calculates the number of periods required by an investment to reach a
 * specified value.
 *
 * @param {PeriodsToTargetOptions} options - The periods-to-target calculation
 * options.
 * @returns {number} The number of periods required.
 * @throws {RangeError} If `rate` is less than or equal to zero.
 * @throws {RangeError} If `presentValue` is zero.
 *
 * @example
 * calculatePeriodsToTarget({
 *   rate: 0.025,
 *   presentValue: 2000,
 *   futureValue: 2200,
 * }); // 3.859866162622662
 */
export function calculatePeriodsToTarget(options) {
  const { rate, presentValue, futureValue } = options;

  if (rate <= 0) throw new RangeError("Rate must be positive");
  if (presentValue === 0) throw new RangeError("Present value cannot be zero");
  return Math.log(futureValue / presentValue) / Math.log(1 + rate);
}
