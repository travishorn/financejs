import { normalizeZero } from "./normalizeZero.js";

/**
 * Evaluates the annuity equation for a candidate interest rate.
 *
 * Used internally by the `rate()` function to compute the result of the annuity
 * equation for a given rate guess. This function supports both ordinary
 * annuities (payments at end of period) and annuities due (payments at
 * beginning of period), and accounts for present value, future value, and
 * periodic payments.
 *
 * @param {number} rate - Candidate interest rate per period (as a decimal,
 * e.g., `0.1` for 10%).
 * @param {number} nper - Total number of payment periods.
 * @param {number} pmt - Payment made each period (negative for outflows,
 * positive for inflows).
 * @param {number} pv - Present value (the lump sum amount at the start).
 * @param {number} [fv=0] - Future value (the desired balance after the last
 * payment; defaults to `0`).
 * @param {0|1} [type=0] - Payment timing: `0` = end of period (ordinary annuity),
 * `1` = beginning of period (annuity due).
 * @returns {number} The result of the annuity equation for the supplied rate
 * and parameters. A value close to zero indicates a solution for the interest
 * rate.
 *
 * @example
 * evalRate(0.05, 12, -100, 1000, 0, 0); // 204.1436739778701
 */
function evalRate(rate, nper, pmt, pv, fv = 0, type = 0) {
  if (rate === 0) {
    return pv + pmt * nper + fv;
  } else {
    const interestFactor = 1 + rate;
    const compoundFactor = Math.pow(interestFactor, nper);
    const paymentTimingFactor = type !== 0 ? 1 + rate : 1;

    return (
      pv * compoundFactor +
      (pmt * paymentTimingFactor * (compoundFactor - 1)) / rate +
      fv
    );
  }
}

/**
 * Calculates the interest rate per period of an annuity. The rate is calculated
 * by iteration and can have zero or more solutions. If the successive results
 * of this function do not converge to within 0.0000001 after 128 iterations, a
 * RangeError is thrown.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at 12
 *   percent annual interest, use `0.12 / 12` for `rate` and `4 * 12` for
 *   `nper`. If you make annual payments on the same loan, use `0.12` for `rate`
 *   and `4` for `nper`.
 *
 * @param {number} nper - The total number of payment periods in an annuity.
 * @param {number} pmt - The payment made each period and cannot change over the
 * life of the annuity. Typically, `pmt` includes principal and interest but no
 * other fees or taxes. If `pmt` is omitted, you must include the `fv` argument
 * for a meaningful equation.
 * @param {number} pv - The present value — the total amount that a series of
 * future payments is worth now.
 * @param {number} [fv=0] - The future value, or a cash balance you want to
 * attain after the last payment is made. If `fv` is omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is 0). If `fv` is omitted,
 * you must include the `pmt` argument.
 * @param {0|1} [type=0] - The number `0` (zero) or `1` and indicates when
 * payments are due. Set `type` equal to `0` or omitted if payments are due at
 * the end of the period. Set `type` equal to `1` if payments are due at the
 * beginning of the period.
 * @param {number} [guess=0.1] - Your guess for what the rate will be. If you
 * omit `guess`, it is assumed to be `0.1` (10 percent). If the calculation does
 * not converge, try different values for `guess`. The calculation usually
 * converges if guess is between `0` and `1`.
 * @returns {number} The calculated interest rate per period of an annuity.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 *
 * @example
 * rate(4 * 12, -200, 8000); // 0.007701472488210098
 */
export function rate(nper, pmt, pv, fv = 0, type = 0, guess = 0.1) {
  if (nper <= 0) {
    throw new RangeError("Invalid period.");
  }

  const epsilonMax = 0.0000001;
  const step = 0.00001;
  const iterationMax = 128;

  let rate0 = guess;
  let y0 = evalRate(rate0, nper, pmt, pv, fv, type);

  let rate1 = y0 > 0 ? rate0 / 2 : rate0 * 2;
  let y1 = evalRate(rate1, nper, pmt, pv, fv, type);

  for (let iteration = 0; iteration < iterationMax; iteration += 1) {
    if (y1 === y0) {
      rate0 = rate0 < rate1 ? rate0 - step : rate0 + step;
      y0 = evalRate(rate0, nper, pmt, pv, fv, type);
    }

    if (y1 === y0) {
      throw new RangeError("Cannot calculate RATE with the provided values.");
    }

    rate0 = rate1 - ((rate1 - rate0) * y1) / (y1 - y0);
    y0 = evalRate(rate0, nper, pmt, pv, fv, type);

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
