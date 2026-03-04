import { normalizeZero } from "./normalizeZero.js";

/**
 * Calculates the future value of an investment based on a constant interest
 * rate. You can use FV with either periodic, constant payments, or a single
 * lump sum payment.
 *
 * Remarks:
 * - Be consistent with units for `rate` and `nper`. For example, for monthly
 *   payments on a four-year loan at 12% annual interest, use `12%/12` for
 *   `rate` and `4*12` for `nper`. For annual payments, use `12%` for `rate` and
 *   `4` for `nper`.
 * - Cash paid out (for example, deposits to savings) is represented by negative
 *   numbers; cash received is represented by positive numbers.
 *
 * @param {number} rate - The interest rate per period.
 * @param {number} nper - The total number of payment periods in an annuity.
 * @param {number} [pmt=0] - The payment made each period; it cannot change over
 * the life of the annuity. Typically, pmt contains principal and interest but
 * no other fees or taxes. If `pmt` is omitted, you must include the `pv`
 * argument.
 * @param {number} [pv=0] - The present value, or the lump-sum amount that a
 * series of future payments is worth right now. If `pv` is omitted, it is
 * assumed to be `0` (zero), and you must include the `pmt` argument.
 * @param {0|1} [type=0] - The number `0` or `1` and indicates when payments are
 * due. If `type` is omitted, it is assumed to be `0`. Set `type` equal to `0`
 * if payments are due at the end of the period. Set `type` equal to `1` if
 * payments are due at the beginning of the period.
 * @returns {number} The future value.
 *
 * @example
 * fv(0.06 / 12, 10, -200, -500, 1); // 2581.40
 */
export function fv(rate, nper, pmt = 0, pv = 0, type = 0) {
  if (rate === 0) {
    return normalizeZero(-pv - pmt * nper);
  } else {
    const paymentTimingFactor = type !== 0 ? 1 + rate : 1;
    const interestFactor = 1 + rate;
    const compoundFactor = Math.pow(interestFactor, nper);

    return normalizeZero(
      -pv * compoundFactor -
        (pmt / rate) * paymentTimingFactor * (compoundFactor - 1),
    );
  }
}
