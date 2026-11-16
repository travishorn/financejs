import { calculateInterestPayment } from "./interest-payment.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculateCumulativeInterest}.
 *
 * @typedef {object} CumulativeInterestOptions
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
 * Calculates the cumulative interest paid on a loan between a start period and
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
 * @param {CumulativeInterestOptions} options - The cumulative interest
 * calculation options.
 * @returns {number} The cumulative interest paid.
 * @throws {RangeError} When inputs are invalid.
 *
 * @example
 * calculateCumulativeInterest({
 *   rate: 0.09 / 12,
 *   periods: 30 * 12,
 *   presentValue: 125000,
 *   startPeriod: 13,
 *   endPeriod: 24,
 * }); // -11135.232130750845
 *
 * @example
 * calculateCumulativeInterest({
 *   rate: 0.09 / 12,
 *   periods: 30 * 12,
 *   presentValue: 125000,
 *   startPeriod: 1,
 *   endPeriod: 12,
 *   timing: "beginning",
 * }); // -10201.332884494608
 */
export function calculateCumulativeInterest(options) {
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

  let cumulativeInterest = 0;

  for (let period = startPeriod; period <= endPeriod; period += 1) {
    cumulativeInterest += calculateInterestPayment({
      rate,
      period,
      periods,
      presentValue,
      timing,
    });
  }

  return cumulativeInterest;
}
