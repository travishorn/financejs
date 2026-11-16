import { normalizeZero } from "./util.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculateFutureValue}.
 *
 * @typedef {object} FutureValueOptions
 * @property {number} rate - The interest rate per period. Make sure that you
 * are consistent about the units you use for specifying `rate` and `periods`.
 * If you make monthly payments on a four-year loan at an annual interest rate
 * of 12 percent, use `0.12 / 12` for `rate` and `4 * 12` for `periods`. If you
 * make annual payments on the same loan, use `0.12` for `rate` and `4` for
 * `periods`.
 * @property {number} periods - The total number of payment periods in an
 * annuity. For example, if you get a four-year car loan and make monthly
 * payments, your loan has `4 * 12` (or 48) periods.
 * @property {number} [payment=0] - The payment made each period; it cannot
 * change over the life of the annuity. Typically, `payment` includes principal
 * and interest but no other fees or taxes. If `payment` is omitted (i.e. `0`),
 * you must include the `presentValue` property.
 * @property {number} [presentValue=0] - The present value, or the lump-sum
 * amount that a series of future payments is worth right now. If omitted, it
 * is assumed to be `0` (zero), and you must include the `payment` property.
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Calculates the future value of an investment based on a constant interest
 * rate. You can use this function with either periodic, constant payments, or
 * a single lump sum payment.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `periods`. If you make monthly payments on a four-year loan at
 *   12 percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `periods`. If you make annual payments on the same loan, use `0.12` for
 *   `rate` and `4` for `periods`.
 * - In annuity functions, cash you pay out, such as a deposit to savings, is
 *   represented by a negative number. Cash you receive, such as a dividend
 *   check, is represented by a positive number. For example, a $1,000 deposit
 *   to the bank would be represented by the argument `-1000` if you are the
 *   depositor and by the argument `1000` if you are the bank.
 * - A result of `-0` is normalized to `0`.
 *
 * @param {FutureValueOptions} options - The future value calculation options.
 * @returns {number} The future value.
 *
 * @example
 * calculateFutureValue({
 *   rate: 0.06 / 12,
 *   periods: 10,
 *   payment: -200,
 *   presentValue: -500,
 *   timing: "beginning",
 * }); // 2581.4033740601362
 *
 * @example
 * calculateFutureValue({
 *   rate: 0.005625,
 *   periods: 60,
 *   payment: 500,
 *   presentValue: -30000,
 * }); // 6437.6763640914
 */
export function calculateFutureValue(options) {
  const {
    rate,
    periods,
    payment = 0,
    presentValue = 0,
    timing = "end",
  } = options;

  if (rate === 0) {
    return normalizeZero(-presentValue - payment * periods);
  }

  const paymentTimingFactor = timing === "beginning" ? 1 + rate : 1;
  const compoundFactor = Math.pow(1 + rate, periods);

  return normalizeZero(
    -presentValue * compoundFactor -
      (payment / rate) * paymentTimingFactor * (compoundFactor - 1),
  );
}
