/**
 * Options for {@link calculateNominalRate}.
 *
 * @typedef {object} NominalRateOptions
 * @property {number} effectiveRate - The effective interest rate.
 * @property {number} periodsPerYear - The number of compounding periods per
 * year.
 */

/**
 * Calculates the nominal annual interest rate, given the effective rate and the
 * number of compounding periods per year.
 *
 * Remarks:
 * - `periodsPerYear` is truncated to an integer.
 * - If either argument is nonnumeric, an error is thrown.
 * - If `effectiveRate` <= `0` or if `periodsPerYear` < `1`, an error is thrown.
 * - `calculateNominalRate()` is related to `calculateEffectiveRate()` through
 *   `effectiveRate = (1 + (nominalRate / periodsPerYear)) * periodsPerYear - 1`.
 *
 * @param {NominalRateOptions} options - The nominal rate calculation options.
 * @returns {number} The nominal annual interest rate.
 *
 * @example
 * calculateNominalRate({
 *   effectiveRate: 0.053543,
 *   periodsPerYear: 4,
 * }); // 0.052500319868356016
 */
export function calculateNominalRate(options) {
  let { effectiveRate, periodsPerYear } = options;

  if (
    typeof effectiveRate !== "number" ||
    typeof periodsPerYear !== "number" ||
    isNaN(effectiveRate) ||
    isNaN(periodsPerYear)
  ) {
    throw new TypeError("Both arguments must be numbers");
  }
  if (effectiveRate <= 0) {
    throw new RangeError("effectRate must be > 0");
  }
  periodsPerYear = Math.trunc(periodsPerYear);
  if (periodsPerYear < 1) {
    throw new RangeError("npery must be >= 1");
  }
  return periodsPerYear * (Math.pow(1 + effectiveRate, 1 / periodsPerYear) - 1);
}
