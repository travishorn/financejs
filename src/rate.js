import { normalizeZero } from "./util.js";

/** @typedef {import("./payment.js").PaymentTiming} PaymentTiming */

/**
 * Options for {@link calculateRate}.
 *
 * @typedef {object} RateOptions
 * @property {number} periods - The total number of payment periods in an
 * annuity. Make sure that you are consistent about the units you use for
 * specifying `periods`. If you make monthly payments on a four-year loan at 12
 * percent annual interest, use `4 * 12` for `periods`. If you make annual
 * payments on the same loan, use `4` for `periods`.
 * @property {number} payment - The payment made each period and cannot change
 * over the life of the annuity. Typically, `payment` includes principal and
 * interest but no other fees or taxes. Negative for outflows, positive for
 * inflows. If `payment` is omitted (i.e. `0`), you must include the
 * `futureValue` property for a meaningful equation.
 * @property {number} presentValue - The present value — the total amount that
 * a series of future payments is worth now.
 * @property {number} [futureValue=0] - The future value, or a cash balance you
 * want to attain after the last payment is made. If omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is 0). If `futureValue` is
 * omitted (i.e. `0`), you must include the `payment` property.
 * @property {PaymentTiming} [timing='end'] - When payments are
 * due. `'end'` if payments are due at the end of the period, `'beginning'` if
 * they are due at the beginning of the period.
 * @property {number} [guess=0.1] - Your guess for what the rate will be. If
 * omitted, it is assumed to be `0.1` (10 percent). If the calculation does not
 * converge, try different values for `guess`. The calculation usually
 * converges if `guess` is between `0` and `1`.
 */

/**
 * Evaluates the annuity equation for a candidate interest rate.
 *
 * Used internally by {@link calculateRate} to compute the result of the
 * annuity equation for a given rate guess. This function supports both
 * ordinary annuities (payments at end of period) and annuities due (payments
 * at beginning of period), and accounts for present value, future value, and
 * periodic payments.
 *
 * @param {number} rate - Candidate interest rate per period (as a decimal,
 * e.g., `0.1` for 10%).
 * @param {number} periods - Total number of payment periods.
 * @param {number} payment - Payment made each period (negative for outflows,
 * positive for inflows).
 * @param {number} presentValue - Present value (the lump sum amount at the
 * start).
 * @param {number} [futureValue=0] - Future value (the desired balance after
 * the last payment; defaults to `0`).
 * @param {PaymentTiming} [timing='end'] - Payment timing: `'end'` = end of
 * period (ordinary annuity), `'beginning'` = beginning of period (annuity
 * due).
 * @returns {number} The result of the annuity equation for the supplied rate
 * and parameters. A value close to zero indicates a solution for the interest
 * rate.
 *
 * @example
 * evalRate(0.05, 12, -100, 1000, 0, "end"); // 204.1436739778701
 */
function evalRate(
  rate,
  periods,
  payment,
  presentValue,
  futureValue = 0,
  timing = "end",
) {
  if (rate === 0) {
    return presentValue + payment * periods + futureValue;
  } else {
    const interestFactor = 1 + rate;
    const compoundFactor = Math.pow(interestFactor, periods);
    const paymentTimingFactor = timing === "beginning" ? 1 + rate : 1;

    return (
      presentValue * compoundFactor +
      (payment * paymentTimingFactor * (compoundFactor - 1)) / rate +
      futureValue
    );
  }
}

/**
 * Calculates the interest rate per period of an annuity. The rate is
 * calculated by iteration and can have zero or more solutions. If the
 * successive results of this function do not converge to within 0.0000001
 * after 128 iterations, a RangeError is thrown.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `periods`. If you make monthly payments on a four-year loan at 12 percent
 *   annual interest, use `4 * 12` for `periods`. If you make annual payments
 *   on the same loan, use `4` for `periods`.
 * - A result of `-0` is normalized to `0`.
 *
 * @param {RateOptions} options - The rate calculation options.
 * @returns {number} The calculated interest rate per period of an annuity.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 *
 * @example
 * calculateRate({
 *   periods: 4 * 12,
 *   payment: -200,
 *   presentValue: 8000,
 * }); // 0.007701472488210084
 *
 * @example
 * calculateRate({
 *   periods: 276,
 *   payment: 1991,
 *   presentValue: -446386,
 *   futureValue: 3135,
 *   timing: "beginning",
 *   guess: 0.047,
 * }); // 0.0016051131093570657
 */
export function calculateRate(options) {
  const {
    periods,
    payment,
    presentValue,
    futureValue = 0,
    timing = "end",
    guess = 0.1,
  } = options;

  if (periods <= 0) {
    throw new RangeError("Invalid period.");
  }

  const epsilonMax = 0.0000001;
  const step = 0.00001;
  const iterationMax = 128;

  let rate0 = guess;
  let y0 = evalRate(rate0, periods, payment, presentValue, futureValue, timing);

  let rate1 = y0 > 0 ? rate0 / 2 : rate0 * 2;
  let y1 = evalRate(rate1, periods, payment, presentValue, futureValue, timing);

  for (let iteration = 0; iteration < iterationMax; iteration += 1) {
    if (y1 === y0) {
      rate0 = rate0 < rate1 ? rate0 - step : rate0 + step;
      y0 = evalRate(rate0, periods, payment, presentValue, futureValue, timing);
    }

    if (y1 === y0) {
      throw new RangeError("Cannot calculate RATE with the provided values.");
    }

    rate0 = rate1 - ((rate1 - rate0) * y1) / (y1 - y0);
    y0 = evalRate(rate0, periods, payment, presentValue, futureValue, timing);

    if (Math.abs(y0) < epsilonMax) {
      return normalizeZero(rate0);
    }

    const nextY = y0;
    y0 = y1;
    y1 = nextY;

    const nextRate = rate0;
    rate0 = rate1;
    rate1 = nextRate;
  }

  throw new RangeError("Maximum iterations exceeded while calculating RATE.");
}
