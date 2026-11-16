import { calculateNominalRate } from "../nominal-rate.js";

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
  return calculateNominalRate({
    effectiveRate: effectRate,
    periodsPerYear: npery,
  });
}
