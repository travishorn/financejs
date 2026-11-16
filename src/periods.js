import { normalizeZero } from "./util.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculatePeriods}.
 *
 * @typedef {object} PeriodsOptions
 * @property {number} rate - The interest rate per period. Make sure that you
 * are consistent about the units you use for specifying `rate`. If you make
 * monthly payments on a four-year loan at an annual interest rate of 12
 * percent, use `0.12 / 12` for `rate`. If you make annual payments on the same
 * loan, use `0.12` for `rate`.
 * @property {number} payment - The payment made each period; it cannot change
 * over the life of the annuity. Typically, `payment` includes principal and
 * interest but no other fees or taxes.
 * @property {number} presentValue - The present value, or the lump-sum amount
 * that a series of future payments is worth right now.
 * @property {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is 0).
 * @property {PaymentTiming} [timing='end'] - When payments are due. `'end'` if
 * payments are due at the end of the period, `'beginning'` if they are due at
 * the beginning of the period.
 */

/**
 * Calculates the number of periods for an investment based on periodic,
 * constant payments and a constant interest rate.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate`. If you make monthly payments on a four-year loan at an annual
 *   interest rate of 12 percent, use `0.12 / 12` for `rate`. If you make
 *   annual payments on the same loan, use `0.12` for `rate`.
 * - A result of `-0` is normalized to `0`.
 *
 * @param {PeriodsOptions} options - The periods calculation options.
 * @returns {number} Number of periods.
 * @throws {RangeError} When calculation is impossible with the provided inputs.
 *
 * @example
 * calculatePeriods({
 *   rate: 0.12 / 12,
 *   payment: -100,
 *   presentValue: -1000,
 *   futureValue: 10000,
 *   timing: "beginning",
 * }); // 59.67386567429468
 *
 * @example
 * calculatePeriods({
 *   rate: 0.00166666666666667,
 *   payment: 500,
 *   presentValue: -25000,
 * }); // 52.25031980741783
 */
export function calculatePeriods(options) {
  const {
    rate,
    payment,
    presentValue,
    futureValue = 0,
    timing = "end",
  } = options;

  if (rate === 0) {
    if (payment === 0) {
      throw new RangeError("Payment cannot be 0 when rate is 0.");
    }

    return normalizeZero(-(presentValue + futureValue) / payment);
  }

  const paymentAdjustment =
    timing === "beginning" ? payment * (1 + rate) : payment;
  const paymentOverRate = paymentAdjustment / rate;

  let futureValueTerm = -futureValue + paymentOverRate;
  let presentValueTerm = presentValue + paymentOverRate;

  // Ensure values are valid for logarithms.
  if (futureValueTerm < 0 && presentValueTerm < 0) {
    futureValueTerm *= -1;
    presentValueTerm *= -1;
  } else if (futureValueTerm <= 0 || presentValueTerm <= 0) {
    throw new RangeError("Cannot calculate NPER with the provided values.");
  }

  const growthFactor = 1 + rate;

  return normalizeZero(
    (Math.log(futureValueTerm) - Math.log(presentValueTerm)) /
      Math.log(growthFactor),
  );
}
