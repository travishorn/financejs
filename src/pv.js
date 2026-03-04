import { normalizeZero } from "./normalizeZero.js";

/**
 * Calculates the present value of a loan or an investment, based on a constant
 * interest rate. You can use PV with either periodic, constant payments (such
 * as a mortgage or other loan), or a future value that's your investment goal.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at 12
 *   percent annual interest, use 12%/12 for `rate` and 4*12 for `nper`. If you
 *   make annual payments on the same loan, use 12% for `rate` and 4 for `nper`.
 * - An annuity is a series of constant cash payments made over a continuous
 *   period. For example, a car loan or a mortgage is an annuity.
 * - In annuity functions, cash you pay out, such as a deposit to savings, is
 *   represented by a negative number. Cash you receive, such as a dividend
 *   check, is represented by a positive number. For example, a $1,000 deposit
 *   to the bank would be represented by the argument -1000 if you are the
 *   depositor and by the argument 1000 if you are the bank.
 *
 * @param {number} rate - The interest rate per period. For example, if you
 * obtain an automobile loan at a 10 percent annual interest rate and make
 * monthly payments, your interest rate per month is 10%/12, or 0.83%. You would
 * enter 10%/12, or 0.83%, or 0.0083, into the formula as the rate.
 * @param {number} nper - The total number of payment periods in an annuity. For
 * example, if you get a four-year car loan and make monthly payments, your loan
 * has 4*12 (or 48) periods. You would enter 48 into the formula for nper.
 * @param {number} [pmt=0] - The payment made each period and cannot change over
 * the life of the annuity. Typically, pmt includes principal and interest but
 * no other fees or taxes. For example, the monthly payments on a $10,000,
 * four-year car loan at 12 percent are $263.33. You would enter -263.33 into
 * the formula as the pmt. If pmt is omitted, you must include the fv argument.
 * @param {number} [fv=0] - The future value or a cash balance you want to
 * attain after the last payment is made. If fv is omitted, it is assumed to be
 * 0 (the future value of a loan, for example, is 0). For example, if you want
 * to save $50,000 to pay for a special project in 18 years, then $50,000 is the
 * future value. You could then make a conservative guess at an interest rate
 * and determine how much you must save each month. If fv is omitted, you must
 * include the pmt argument.
 * @param {0|1} [type=0] - The number 0 or 1 and indicates when payments are
 * due. Set `type` equal to `0` or omitted if payments are due at the end of the
 * period. Set `type` equal to `1` if payments are due at the end of the period.
 * @returns {number} The present value of the investment.
 *
 * @example
 * pv(0.08 / 12, 20 * 12, 500); // -59777.15
 */
export function pv(rate, nper, pmt = 0, fv = 0, type = 0) {
  if (rate === 0) {
    return normalizeZero(-pmt * nper - fv);
  } else {
    const paymentTimingFactor = type !== 0 ? 1 + rate : 1;
    const interestFactor = 1 + rate;
    const compoundFactor = Math.pow(interestFactor, nper);

    return normalizeZero(
      -(fv + pmt * paymentTimingFactor * ((compoundFactor - 1) / rate)) /
        compoundFactor,
    );
  }
}
