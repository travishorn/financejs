import { ipmt } from "./ipmt.js";

/**
 * Calculates the cumulative interest paid on a loan between a start period and
 * and end period.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at an
 *   annual interest rate of 12 percent, use `0.12 / 12` for `rate` and `4 * 12`
 *   for `nper`. If you make annual payments on the same loan, use `0.12` for
 *   `rate` and `4` for `nper`.
 * - If `rate` <= `0`, `nper` <= `0`, or `pv` <= `0`, this function throws a
 *   RangeError.
 * - If `startPeriod` < `1`, `endPeriod` < `1`, or `startPeriod` >
 *   `endPeriod`, this function throws a RangeError.
 *
 * @param {number} rate - The interest rate.
 * @param {number} nper - The total number of payment periods.
 * @param {number} pv - The present value.
 * @param {number} startPeriod - The first period in the calculation. Payment
 * periods are numbered beginning with 1.
 * @param {number} endPeriod - The last period in the calculation.
 * @param {0|1} type - The timing of the payment. `0` (zero) = payment at
 * the end of the period. `1` = payment at the beginning of the period.
 * @returns {number} The cumulative interest paid
 *
 * @example
 * cumipmt(0.09 / 12, 30 * 12, 125000, 13, 24, 0); // -11135.23213075
 */
export function cumipmt(rate, nper, pv, startPeriod, endPeriod, type) {
  // Input validation
  if (rate <= 0 || nper <= 0 || pv <= 0) {
    throw new RangeError("rate, nper, and pv must be > 0");
  }

  if (
    startPeriod < 1 ||
    endPeriod < 1 ||
    startPeriod > endPeriod ||
    startPeriod > nper ||
    endPeriod > nper
  ) {
    throw new RangeError("Invalid startPeriod or endPeriod");
  }

  if (type !== 0 && type !== 1) {
    throw new RangeError("type must be 0 or 1");
  }

  let cumInterest = 0;

  for (let per = startPeriod; per <= endPeriod; per++) {
    cumInterest += ipmt(rate, per, nper, pv, 0, type);
  }

  return cumInterest;
}
