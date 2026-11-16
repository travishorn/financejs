import { calculateFutureValue } from "./future-value.js";
import { calculatePayment } from "./payment.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculateInterestPayment}.
 *
 * @typedef {object} InterestPaymentOptions
 * @property {number} rate - The interest rate per period. Make sure that you
 * are consistent about the units you use for specifying `rate` and `periods`.
 * If you make monthly payments on a four-year loan at an annual interest rate
 * of 12 percent, use `0.12 / 12` for `rate` and `4 * 12` for `periods`. If you
 * make annual payments on the same loan, use `0.12` for `rate` and `4` for
 * `periods`.
 * @property {number} period - The period for which you want to find the
 * interest and must be in the range `1` to `periods`.
 * @property {number} periods - The total number of payment periods in an
 * annuity. For example, if you get a four-year car loan and make monthly
 * payments, your loan has `4 * 12` (or 48) periods.
 * @property {number} presentValue - The present value, or the lump-sum amount
 * that a series of future payments is worth right now.
 * @property {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is `0`).
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Returns the interest payment for a given period for an investment based on
 * periodic, constant payments and a constant interest rate.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `periods`. If you make monthly payments on a four-year loan at
 *   12 percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `periods`. If you make annual payments on the same loan, use `0.12` for
 *   `rate` and `4` for `periods`.
 * - For all the arguments, cash you pay out, such as deposits to savings, is
 *   represented by negative numbers. Cash you receive, such as dividend
 *   checks, is represented by positive numbers.
 *
 * @param {InterestPaymentOptions} options - The interest payment calculation
 * options.
 * @returns {number} The interest payment for the specified period.
 * @throws {RangeError} When `period` is outside the valid range.
 *
 * @example
 * calculateInterestPayment({
 *   rate: 0.1 / 12,
 *   period: 1,
 *   periods: 3,
 *   presentValue: 8000,
 * }); // -66.66666666666667
 *
 * @example
 * calculateInterestPayment({
 *   rate: 0.02,
 *   period: 5,
 *   periods: 5,
 *   presentValue: -608926,
 *   futureValue: 37115,
 * }); // 3121.015754729151
 */
export function calculateInterestPayment(options) {
  const {
    rate,
    period,
    periods,
    presentValue,
    futureValue = 0,
    timing = "end",
  } = options;

  if (period <= 0 || period >= periods + 1) {
    throw new RangeError("Invalid period.");
  }

  if (timing === "beginning" && period === 1) {
    return 0;
  }

  const periodOffset = timing === "beginning" ? 2 : 1;
  const periodicPayment = calculatePayment({
    rate,
    periods,
    presentValue,
    futureValue,
    timing,
  });
  const adjustedPresentValue =
    timing === "beginning" ? presentValue + periodicPayment : presentValue;
  const periodFutureValue = calculateFutureValue({
    rate,
    periods: period - periodOffset,
    payment: periodicPayment,
    presentValue: adjustedPresentValue,
  });

  return periodFutureValue * rate;
}
