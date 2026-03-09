/**
 * Calculates the interest paid (or received) for the specified period of a loan
 * (or investment) with even principal payments.
 *
 * Remarks:
 * - Make sure that you are consistent about the units you use for specifying
 *   `rate` and `nper`. If you make monthly payments on a four-year loan at 12
 *   percent annual interest, use `.12/12` for `rate` and `4*12` for `nper`. If
 *   you make annual payments on the same loan, use `.12` for `rate` and `4` for
 *   `nper`.
 * - For all the arguments, cash you pay out, such as deposits to savings, is
 *   represented by negative numbers. Cash you receive, such as dividend checks,
 *   is represented by positive numbers.
 * - This function counts each period beginning with zero, not with one.
 * - Most loans use a repayment schedule with even periodic payments. This
 *   function returns the interest payment for a given period for this type of
 *   loan.
 * - Some loans use a repayment schedule with even principal payments. This
 *   function returns the interest payment for a given period for this type of
 *   loan.
 * - The interest charge each period is equal to the `rate` times the unpaid
 *   balance for the previous period. And the payment each period is equal to
 *   the ven principal plus th einterest for the period.
 *
 * @param {number} rate - The interest rate for the investment.
 * @param {number} per - The period for which you want to find the interest, and
 * must be between `1` and `nper`.
 * @param {number} nper - The total number of payment periods for the
 * investment.
 * @param {number} pv - The present value of the investment. For a loan, this is
 * the loan amount.
 * @returns {number} the interest paid (or received)
 *
 * @example
 * ispmt(0.1, 0, 4, 4000); // -400
 */
export function ispmt(rate, per, nper, pv) {
  // Validate inputs
  if (typeof rate !== "number" || isNaN(rate) || !isFinite(rate))
    throw new RangeError("rate must be a finite number");
  if (typeof per !== "number" || isNaN(per) || !isFinite(per))
    throw new RangeError("per must be a finite number");
  if (typeof nper !== "number" || isNaN(nper) || !isFinite(nper))
    throw new RangeError("nper must be a finite number");
  if (typeof pv !== "number" || isNaN(pv) || !isFinite(pv))
    throw new RangeError("pv must be a finite number");
  if (nper <= 0) throw new RangeError("nper must be > 0");
  if (per < 0 || per >= nper)
    throw new RangeError("per must be between 0 and nper-1");

  // ISPIMT formula: -pv * rate * (1 - per / nper)
  return -pv * rate * (1 - per / nper);
}
