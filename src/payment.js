import { normalizeZero } from "./util.js";

/**
 * The timing of payments within each period.
 *
 * - `'end'` — payments are due at the end of each period (in arrears). This is
 *   the default and matches most loan structures.
 * - `'beginning'` — payments are due at the beginning of each period (in
 *   advance), e.g. leases and annuities due.
 *
 * @typedef {'end' | 'beginning'} PaymentTiming
 */

/**
 * Options for {@link calculatePayment}.
 *
 * @typedef {object} PaymentOptions
 * @property {number} rate - The interest rate per period. Make sure that you
 * are consistent about the units you use for specifying `rate` and `periods`.
 * If you make monthly payments on a four-year loan at an annual interest rate
 * of 12 percent, use `0.12 / 12` for `rate` and `4 * 12` for `periods`. If you
 * make annual payments on the same loan, use `0.12` for `rate` and `4` for
 * `periods`.
 * @property {number} periods - The total number of payment periods.
 * @property {number} presentValue - The present value, or the total amount
 * that a series of future payments is worth now; also known as the principal.
 * Typically negative for loans (cash you receive) and positive for investments
 * (cash you pay out).
 * @property {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If omitted, it is assumed to
 * be `0` (zero), that is, the future value of a loan is 0.
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Calculates the payment for a loan based on constant payments and a constant
 * interest rate.
 *
 * Remarks:
 * - The payment returned by this function includes principal and interest but
 *   no taxes, reserve payments, or fees sometimes associated with loans.
 * - The payment is negative when it represents an outflow (e.g. repaying a
 *   loan received as a positive `presentValue`) and positive when it
 *   represents an inflow, following standard cash-flow sign conventions.
 * - A result of `-0` is normalized to `0`.
 *
 * @param {PaymentOptions} options - The payment calculation options.
 * @returns {number} The periodic payment amount.
 *
 * @example
 * calculatePayment({
 *   rate: 0.08 / 12,
 *   periods: 10,
 *   presentValue: 10000,
 * }); // -1037.0320893591638
 *
 * @example
 * calculatePayment({
 *   rate: 0.006875,
 *   periods: 60,
 *   presentValue: -150000,
 *   timing: "beginning",
 * }); // 3038.547734125
 */
export function calculatePayment(options) {
  const {
    rate,
    periods,
    presentValue,
    futureValue = 0,
    timing = "end",
  } = options;

  if (rate === 0) {
    return normalizeZero((-futureValue - presentValue) / periods);
  }

  const paymentTimingFactor = timing === "beginning" ? 1 + rate : 1;
  const compoundFactor = Math.pow(1 + rate, periods);

  return normalizeZero(
    ((-futureValue - presentValue * compoundFactor) /
      (paymentTimingFactor * (compoundFactor - 1))) *
      rate,
  );
}
