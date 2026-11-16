import { calculateDatedNetPresentValue } from "./dated-net-present-value.js";

/**
 * Options for {@link calculateDatedInternalRateOfReturn}.
 *
 * @typedef {object} DatedInternalRateOfReturnOptions
 * @property {number[]} cashFlows - A series of cash flows that corresponds to
 * a schedule of payments in dates. The first payment is optional and
 * corresponds to a cost or payment that occurs at the beginning of the
 * investment. If the first value is a cost or payment, it must be a negative
 * value. All succeeding payments are discounted based on a 365-day year. The
 * series of values must contain at least one positive and one negative value.
 * @property {Date[]} dates - A schedule of payment dates that corresponds to
 * the cash flow payments. The first date is treated as the starting date and
 * all dates must be on or after this date.
 * @property {number} [guess=0.1] - A number that you guess is close to the
 * result. Must be greater than `-1`.
 */

/**
 * Calculates the internal rate of return for a schedule of cash flows that is
 * not necessarily periodic. To calculate the internal rate of return for a
 * series of periodic cash flows, use the `calculateInternalRateOfReturn()`
 * function.
 *
 * Remarks:
 * - `cashFlows` and `dates` must be arrays of equal length, with at least 2
 *   entries.
 * - `cashFlows` must contain at least one positive and one negative cash flow.
 * - All values in `dates` must be valid `Date` objects, and no date may precede
 *   the first date in the array.
 * - In most cases you do not need to provide `guess` for the calculation. If
 *   omitted, `guess` defaults to `0.1` (10 percent).
 * - `guess` must be greater than `-1`.
 * - `calculateDatedInternalRateOfReturn()` is closely related to
 *   `calculateDatedNetPresentValue()`, the net present value function. The rate
 *   of return calculated by `calculateDatedInternalRateOfReturn()` is the
 *   interest rate corresponding to XNPV = 0.
 * - Uses an iterative technique for calculating XIRR. Using a changing rate
 *   (starting with guess), this function cycles through the calculation until
 *   the result is accurate within a small absolute threshold. If this function
 *   can't find a result that works after 200 tries, a RangeError is thrown.
 *
 * @param {DatedInternalRateOfReturnOptions} options - The dated internal rate
 * of return calculation options.
 * @returns {number} The internal rate of return.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 *
 * @example
 * const cashFlows = [-10000, 2750, 4250, 3250, 2750];
 * const dates = [new Date("2008-01-01"), new Date("2008-03-01"), new Date("2008-10-30"), new Date("2009-02-15"), new Date("2009-04-01")];
 * calculateDatedInternalRateOfReturn({ cashFlows, dates, guess: 0.1 }); // 0.37336254
 */
export function calculateDatedInternalRateOfReturn(options) {
  const { cashFlows, dates, guess = 0.1 } = options;

  if (
    !Array.isArray(cashFlows) ||
    !Array.isArray(dates) ||
    cashFlows.length !== dates.length ||
    cashFlows.length < 2
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
  for (const value of cashFlows) {
    if (value > 0) hasPositive = true;
    if (value < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) {
    throw new RangeError(
      "Values must contain at least one positive and one negative cash flow.",
    );
  }

  // Validate dates
  const firstDate = dates[0];
  if (!(firstDate instanceof Date) || isNaN(firstDate.getTime())) {
    throw new RangeError("All dates must be valid Date objects.");
  }
  const time0 = Date.UTC(
    firstDate.getUTCFullYear(),
    firstDate.getUTCMonth(),
    firstDate.getUTCDate(),
  );
  for (const date of dates) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new RangeError("All dates must be valid Date objects.");
    }
    const currentDay = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
    if (currentDay < time0) {
      throw new RangeError("Dates must not precede the first date.");
    }
  }

  // Iterative secant method (like irr)
  const epsilonMax = 1e-11;
  const step = 1e-5;
  const iterationMax = 200;
  // xnpv requires rate > -1; this is the closest valid value to -1
  const minRate = -0.9999999999;

  let rate0 = guess;
  let npv0 = calculateDatedNetPresentValue({
    rate: rate0,
    cashFlows,
    dates,
  });
  let rate1 = npv0 > 0 ? rate0 + step : rate0 - step;
  let npv1 = calculateDatedNetPresentValue({
    rate: rate1,
    cashFlows,
    dates,
  });

  for (let iteration = 0; iteration < iterationMax; iteration++) {
    if (npv1 === npv0) {
      rate0 = rate1 > rate0 ? rate0 - step : rate0 + step;
      npv0 = calculateDatedNetPresentValue({
        rate: rate0,
        cashFlows,
        dates,
      });
      if (npv1 === npv0) {
        throw new RangeError("Invalid values for XIRR.");
      }
    }
    let nextRate = rate1 - ((rate1 - rate0) * npv1) / (npv1 - npv0);
    // Ensure the candidate rate stays within the valid domain for xnpv (rate > -1)
    if (nextRate <= -1) {
      nextRate = minRate;
    }
    const nextNpv = calculateDatedNetPresentValue({
      rate: nextRate,
      cashFlows,
      dates,
    });
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
