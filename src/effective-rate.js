/**
 * Options for {@link calculateEffectiveRate}.
 *
 * @typedef {object} EffectiveRateOptions
 * @property {number} nominalRate - The nominal interest rate.
 * @property {number} periodsPerYear - The number of compounding periods per
 * year.
 */

/**
 * Calculates the effective annual interest rate, given the nominal annual
 * interest rate and the number of compounding periods per year.
 *
 * Remarks:
 * - `periodsPerYear` is truncated to an integer.
 * - If either argument is nonnumeric, an error is thrown.
 * - If `nominalRate` <= `0` or if `periodsPerYear` < `1`, an error is thrown.
 * - Rate is calculated as follows: `(1 + nominalRate / periodsPerYear)^periodsPerYear - 1`
 * - This function is related to `calculateNominalRate()` through
 *   `effectiveRate = (1 + (nominalRate / periodsPerYear)) * periodsPerYear - 1`.
 *
 * @param {EffectiveRateOptions} options - The effective rate calculation
 * options.
 * @returns {number} The effective annual interest rate.
 *
 * @example
 * calculateEffectiveRate({
 *   nominalRate: 0.0525,
 *   periodsPerYear: 4,
 * }); // 0.05354266737075819
 */
export function calculateEffectiveRate(options) {
  let { nominalRate, periodsPerYear } = options;

  if (
    typeof nominalRate !== "number" ||
    typeof periodsPerYear !== "number" ||
    isNaN(nominalRate) ||
    isNaN(periodsPerYear)
  ) {
    throw new TypeError("Both arguments must be numbers");
  }

  if (nominalRate <= 0) {
    throw new RangeError("nominalRate must be > 0");
  }

  periodsPerYear = Math.trunc(periodsPerYear);

  if (periodsPerYear < 1) {
    throw new RangeError("npery must be >= 1");
  }

  return Math.pow(1 + nominalRate / periodsPerYear, periodsPerYear) - 1;
}
