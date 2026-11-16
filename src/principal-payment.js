import { calculateInterestPayment } from "./interest-payment.js";
import { calculatePayment } from "./payment.js";
import { normalizeZero } from "./util.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculatePrincipalPayment}.
 *
 * @typedef {object} PrincipalPaymentOptions
 * @property {number} rate - The interest rate per period. Make sure that you
 * are consistent about the units you use for specifying `rate` and `periods`.
 * If you make monthly payments on a four-year loan at an annual interest rate
 * of 12 percent, use `0.12 / 12` for `rate` and `4 * 12` for `periods`. If you
 * make annual payments on the same loan, use `0.12` for `rate` and `4` for
 * `periods`.
 * @property {number} period - Specifies the period and must be in the range
 * `1` to `periods`.
 * @property {number} periods - The total number of payment periods in an
 * annuity. For example, if you get a four-year car loan and make monthly
 * payments, your loan has `4 * 12` (or 48) periods.
 * @property {number} presentValue - The present value — the total amount that
 * a series of future payments is worth now.
 * @property {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If omitted, it is assumed to
 * be `0` (zero), that is, the future value of a loan is 0.
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Calculates the payment on the principal for a given period for an investment
 * based on periodic, constant payments and a constant interest rate.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `periods`. If you make monthly payments on a four-year loan at
 *   12 percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `periods`. If you make annual payments on the same loan, use `0.12` for
 *   `rate` and `4` for `periods`.
 * - A result of `-0` is normalized to `0`.
 *
 * @param {PrincipalPaymentOptions} options - The principal payment calculation
 * options.
 * @returns {number} The payment on the principal for the specified period.
 * @throws {RangeError} When `period` is outside the valid range.
 *
 * @example
 * calculatePrincipalPayment({
 *   rate: 0.1 / 12,
 *   period: 1,
 *   periods: 2 * 12,
 *   presentValue: 2000,
 * }); // -75.62318600836664
 *
 * @example
 * calculatePrincipalPayment({
 *   rate: 0.02,
 *   period: 5,
 *   periods: 5,
 *   presentValue: -608926,
 *   futureValue: 37115,
 * }); // 118935.78773645744
 */
export function calculatePrincipalPayment(options) {
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

  const periodicPayment = calculatePayment({
    rate,
    periods,
    presentValue,
    futureValue,
    timing,
  });
  const interestPayment = calculateInterestPayment({
    rate,
    period,
    periods,
    presentValue,
    futureValue,
    timing,
  });

  return normalizeZero(periodicPayment - interestPayment);
}
