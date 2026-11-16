import { calculateDatedInternalRateOfReturn } from "../dated-internal-rate-of-return.js";

/**
 * Calculates the internal rate of return for a schedule of cash flows that is
 * not necessarily periodic. To calculate the internal rate of return for a
 * series of periodic cash flows, use the `irr()` function.
 *
 * Remarks:
 * - `values` and `dates` must be arrays of equal length, with at least 2
 *   entries.
 * - `values` must contain at least one positive and one negative cash flow.
 * - All values in `dates` must be valid `Date` objects, and no date may precede
 *   the first date in the array.
 * - In most cases you do not need to provide `guess` for the calculation. If
 *   omitted, `guess` defaults to `0.1` (10 percent).
 * - `guess` must be greater than `-1`.
 * - `xirr()` is closely related to `xnpv()`, the net present value function.
 *   The rate of return calculated by `xirr()` is the interest rate
 *   corresponding to XNPV =
 *   0.
 * - Uses an iterative technique for calculating XIRR. Using a changing rate
 *   (starting with guess), this function cycles through the calculation until
 *   the result is accurate within a small absolute threshold. If this function
 *   can't find a result that works after 200 tries, a RangeError is thrown.
 *
 * @param {number[]} values - A series of cash flows that corresponds to a
 * schedule of payments in dates. The first payment is optional and corresponds
 * to a cost or payment that occurs at the beginning of the investment. If the
 * first value is a cost or payment, it must be a negative value. All succeeding
 * payments are discounted based on a 365-day year. The series of values must
 * contain at least one positive and one negative value.
 * @param {Date[]} dates - A schedule of payment dates that corresponds to the
 * cash flow payments. The first date is treated as the starting date and all
 * dates must be on or after this date.
 * @param {number} [guess=0.1] - A number that you guess is close to the result.
 * Must be greater than `-1`.
 * @returns {number} The internal rate of return.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 * @example
 * const values = [-10000, 2750, 4250, 3250, 2750];
 * const dates = [new Date("2008-01-01"), new Date("2008-03-01"), new Date("2008-10-30"), new Date("2009-02-15"), new Date("2009-04-01")];
 * xirr(values, dates, 0.1); // 0.37336254
 */
export function xirr(values, dates, guess = 0.1) {
  return calculateDatedInternalRateOfReturn({
    cashFlows: values,
    dates,
    guess,
  });
}
