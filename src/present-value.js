import { normalizeZero } from "./util.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculatePresentValue}.
 *
 * @typedef {object} PresentValueOptions
 * @property {number} rate - The interest rate per period. Make sure that you
 * are consistent about the units you use for specifying `rate` and `periods`.
 * If you make monthly payments on a four-year loan at an annual interest rate
 * of 12 percent, use `0.12 / 12` for `rate` and `4 * 12` for `periods`. If you
 * make annual payments on the same loan, use `0.12` for `rate` and `4` for
 * `periods`.
 * @property {number} periods - The total number of payment periods in an
 * annuity. For example, if you get a four-year car loan and make monthly
 * payments, your loan has `4 * 12` (or 48) periods.
 * @property {number} [payment=0] - The payment made each period and cannot
 * change over the life of the annuity. Typically, `payment` includes principal
 * and interest but no other fees or taxes. For example, the monthly payments
 * on a $10,000, four-year car loan at 12 percent are $263.33. You would enter
 * `-263.33` as the `payment`. If `payment` is omitted (i.e. `0`), you must
 * include the `futureValue` property.
 * @property {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is 0). For example, if you
 * want to save $50,000 to pay for a special project in 18 years, then $50,000
 * is the future value. You could then make a conservative guess at an interest
 * rate and determine how much you must save each month. If `futureValue` is
 * omitted (i.e. `0`), you must include the `payment` property.
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Calculates the present value of a loan or an investment, based on a constant
 * interest rate. You can use this function with either periodic, constant
 * payments (such as a mortgage or other loan), or a future value that's your
 * investment goal.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `periods`. If you make monthly payments on a four-year loan at
 *   12 percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `periods`. If you make annual payments on the same loan, use `0.12` for
 *   `rate` and `4` for `periods`.
 * - An annuity is a series of constant cash payments made over a continuous
 *   period. For example, a car loan or a mortgage is an annuity.
 * - In annuity functions, cash you pay out, such as a deposit to savings, is
 *   represented by a negative number. Cash you receive, such as a dividend
 *   check, is represented by a positive number. For example, a $1,000 deposit
 *   to the bank would be represented by the argument `-1000` if you are the
 *   depositor and by the argument `1000` if you are the bank.
 * - A result of `-0` is normalized to `0`.
 *
 * @param {PresentValueOptions} options - The present value calculation options.
 * @returns {number} The present value of the investment.
 *
 * @example
 * calculatePresentValue({
 *   rate: 0.08 / 12,
 *   periods: 20 * 12,
 *   payment: 500,
 * }); // -59777.14585118777
 *
 * @example
 * calculatePresentValue({
 *   rate: 0.06 / 12,
 *   periods: 10,
 *   payment: -200,
 *   timing: "beginning",
 * }); // 1955.8127840179968
 */
export function calculatePresentValue(options) {
  const {
    rate,
    periods,
    payment = 0,
    futureValue = 0,
    timing = "end",
  } = options;

  if (rate === 0) {
    return normalizeZero(-payment * periods - futureValue);
  }

  const paymentTimingFactor = timing === "beginning" ? 1 + rate : 1;
  const compoundFactor = Math.pow(1 + rate, periods);

  return normalizeZero(
    -(
      futureValue +
      payment * paymentTimingFactor * ((compoundFactor - 1) / rate)
    ) / compoundFactor,
  );
}
