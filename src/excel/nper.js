import { calculatePeriods } from "../periods.js";

/**
 * Calculates the number of periods for an investment based on periodic,
 * constant payments and a constant interest rate.
 *
 * @param {number} rate - The interest rate per period.
 * @param {number} pmt - The payment made each period; it cannot change over the
 * life of the annuity. Typically, `pmt` contains principal and interest but no
 * other fees or taxes.
 * @param {number} pv - The present value, or the lump-sum amount that a series
 * of future payments is worth right now.
 * @param {number} [fv=0] - The future value, or a cash balance you want to
 * attain after the last payment is made. If `fv` is omitted, it is assumed to
 * be `0` (the future value of a loan, for example, is 0).
 * @param {0|1} [type=0] - The number 0 or 1 and indicates when payments are
 * due. Set `type` equal to `0` or omitted if payments are due at the end of the
 * period. Set `type` equal to `1` if payments are due at the beginning of the
 * period.
 * @returns {number} Number of periods.
 * @throws {RangeError} When calculation is impossible with the provided inputs.
 *
 * @example
 * nper(0.12 / 12, -100, -1000, 10000, 1); // 59.67386567
 */
export function nper(rate, pmt, pv, fv = 0, type = 0) {
  return calculatePeriods({
    rate,
    payment: pmt,
    presentValue: pv,
    futureValue: fv,
    timing: type === 1 ? "beginning" : "end",
  });
}
