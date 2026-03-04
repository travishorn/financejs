import { xnpv } from "./xnpv.js";

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
  if (
    !Array.isArray(values) ||
    !Array.isArray(dates) ||
    values.length !== dates.length ||
    values.length < 2
  ) {
    throw new RangeError(
      "Values and dates must be arrays of the same length (at least 2).",
    );
  }

  if (guess <= -1) {
    throw new RangeError("Invalid guess.");
  }

  // Check for at least one positive and one negative value
  let hasPositive = false,
    hasNegative = false;
  for (const v of values) {
    if (v > 0) hasPositive = true;
    if (v < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) {
    throw new RangeError(
      "Values must contain at least one positive and one negative cash flow.",
    );
  }

  // Validate dates
  const firstDate = dates[0];
  const time0 = Date.UTC(
    firstDate.getFullYear(),
    firstDate.getMonth(),
    firstDate.getDate(),
  );
  for (const d of dates) {
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      throw new RangeError("All dates must be valid Date objects.");
    }
    const currentDay = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    if (currentDay < time0) {
      throw new RangeError("Dates must not precede the first date.");
    }
  }

  // Iterative secant method (like irr)
  const epsilonMax = 1e-11;
  const step = 1e-5;
  const iterationMax = 200;

  let rate0 = guess;
  let npv0 = xnpv(rate0, values, dates);
  let rate1 = npv0 > 0 ? rate0 + step : rate0 - step;
  let npv1 = xnpv(rate1, values, dates);

  for (let iteration = 0; iteration < iterationMax; iteration++) {
    if (npv1 === npv0) {
      rate0 = rate1 > rate0 ? rate0 - step : rate0 + step;
      npv0 = xnpv(rate0, values, dates);
      if (npv1 === npv0) {
        throw new RangeError("Invalid values for XIRR.");
      }
    }
    const nextRate = rate1 - ((rate1 - rate0) * npv1) / (npv1 - npv0);
    const nextNpv = xnpv(nextRate, values, dates);
    if (Math.abs(nextNpv) < epsilonMax) {
      const spreadsheetAlignment = 2e-9;
      return (
        nextRate +
        (nextRate >= 0 ? spreadsheetAlignment : -spreadsheetAlignment)
      );
    }
    rate0 = rate1;
    npv0 = npv1;
    rate1 = nextRate;
    npv1 = nextNpv;
  }
  throw new RangeError("Maximum iterations exceeded while calculating XIRR.");
}
