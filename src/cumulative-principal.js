import { calculatePrincipalPayment } from "./principal-payment.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculateCumulativePrincipal}.
 *
 * @typedef {object} CumulativePrincipalOptions
 * @property {number} rate - The interest rate. Make sure that you are
 * consistent about the units you use for specifying `rate` and `periods`. If
 * you make monthly payments on a four-year loan at an annual interest rate of
 * 12 percent, use `0.12 / 12` for `rate` and `4 * 12` for `periods`. If you
 * make annual payments on the same loan, use `0.12` for `rate` and `4` for
 * `periods`.
 * @property {number} periods - The total number of payment periods.
 * @property {number} presentValue - The present value.
 * @property {number} startPeriod - The first period in the calculation.
 * Payment periods are numbered beginning with 1.
 * @property {number} endPeriod - The last period in the calculation.
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Calculates the cumulative principal paid on a loan between a start period and
 * an end period.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `periods`. If you make monthly payments on a four-year loan at
 *   an annual interest rate of 12 percent, use `0.12 / 12` for `rate` and
 *   `4 * 12` for `periods`. If you make annual payments on the same loan, use
 *   `0.12` for `rate` and `4` for `periods`.
 * - If `rate` <= `0`, `periods` <= `0`, or `presentValue` <= `0`, this function
 *   throws a RangeError.
 * - If `startPeriod` < `1`, `endPeriod` < `1`, or `startPeriod` >
 *   `endPeriod`, this function throws a RangeError.
 *
 * @param {CumulativePrincipalOptions} options - The cumulative principal
 * calculation options.
 * @returns {number} The cumulative principal paid.
 * @throws {RangeError} When inputs are invalid.
 *
 * @example
 * calculateCumulativePrincipal({
 *   rate: 0.09 / 12,
 *   periods: 30 * 12,
 *   presentValue: 125000,
 *   startPeriod: 13,
 *   endPeriod: 24,
 * }); // -934.1071234208764
 *
 * @example
 * calculateCumulativePrincipal({
 *   rate: 0.08 / 12,
 *   periods: 30 * 12,
 *   presentValue: 250000,
 *   startPeriod: 13,
 *   endPeriod: 24,
 *   timing: "beginning",
 * }); // -2246.7684918774785
 */
export function calculateCumulativePrincipal(options) {
  const {
    rate,
    periods,
    presentValue,
    startPeriod,
    endPeriod,
    timing = "end",
  } = options;

  if (rate <= 0 || periods <= 0 || presentValue <= 0) {
    throw new RangeError("rate, periods, and presentValue must be > 0");
  }

  if (
    startPeriod < 1 ||
    endPeriod < 1 ||
    startPeriod > endPeriod ||
    startPeriod > periods ||
    endPeriod > periods
  ) {
    throw new RangeError("Invalid startPeriod or endPeriod");
  }

  let cumulativePrincipal = 0;

  for (let period = startPeriod; period <= endPeriod; period += 1) {
    cumulativePrincipal += calculatePrincipalPayment({
      rate,
      period,
      periods,
      presentValue,
      timing,
    });
  }

  return cumulativePrincipal;
}
