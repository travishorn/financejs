/**
 * Calculates the nominal annual interest rate, given the effective rate and the
 * number of compounding periods per year.
 *
 * Remarks:
 * - `npery` is truncated to an integer.
 * - If either argument is nonnumeric, an error is thrown.
 * - If `effectRate` <= `0` or if `npery` < `1`, an error is thrown.
 * - `nominal()` is related to `effect()` through `effectiveRate = (1 +
 *   (nominalRate / npery)) * npery - 1`.
 *
 * @param {number} effectRate - The effective interest rate.
 * @param {number} npery - The number of compounding periods per year.
 * @returns {number} the nominal annual interest rate
 *
 * @example
 * nominal(0.053543, 4); // 0.05250032
 */
export function nominal(effectRate, npery) {
  if (
    typeof effectRate !== "number" ||
    typeof npery !== "number" ||
    isNaN(effectRate) ||
    isNaN(npery)
  ) {
    throw new TypeError("Both arguments must be numbers");
  }
  if (effectRate <= 0) {
    throw new RangeError("effectRate must be > 0");
  }
  npery = Math.trunc(npery);
  if (npery < 1) {
    throw new RangeError("npery must be >= 1");
  }
  return npery * (Math.pow(1 + effectRate, 1 / npery) - 1);
}
