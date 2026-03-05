/**
 * Calculates the effective annual interest rate, given the nominal annual
 * interest rate and the number of compounding periods per year.
 *
 * Remarks:
 * - `npery` is truncated to an integer.
 * - If either argument is nonnumeric, an error is thrown.
 * - If `nominalRate` <= `0` or if `npery` < `1`, an error is thrown.
 * - Rate is calculated as follows: `(1 + nominalRate / npery)^npery - 1`
 * - This function is related to `nominal()` through `effectiveRate = (1 +
 *   (nominalRate / npery)) * npery - 1`.
 *
 * @param {number} nominalRate - The nominal interest rate.
 * @param {number} npery - The number of compounding periods per year.
 * @returns {number} the effective annual interest rate
 *
 * @example
 * effect(0.0525, 4); // 0.05354267
 */
export function effect(nominalRate, npery) {
  if (
    typeof nominalRate !== "number" ||
    typeof npery !== "number" ||
    isNaN(nominalRate) ||
    isNaN(npery)
  ) {
    throw new TypeError("Both arguments must be numbers");
  }

  if (nominalRate <= 0) {
    throw new RangeError("nominalRate must be > 0");
  }

  npery = Math.trunc(npery);

  if (npery < 1) {
    throw new RangeError("npery must be >= 1");
  }

  return Math.pow(1 + nominalRate / npery, npery) - 1;
}
