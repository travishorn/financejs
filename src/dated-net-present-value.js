/**
 * Options for {@link calculateDatedNetPresentValue}.
 *
 * @typedef {object} DatedNetPresentValueOptions
 * @property {number} rate - Discount rate per year (as a decimal, e.g., 0.1 for
 * 10%).
 * @property {number[]} cashFlows - Cash flow values where each value is a
 * payment (negative) or income (positive).
 * @property {Date[]} dates - Dates corresponding to each cash flow. The first
 * date is treated as the base date.
 */

/**
 * Calculates the net present value for a schedule of cash flows that is not
 * necessarily periodic.
 *
 * @param {DatedNetPresentValueOptions} options - The dated net present value
 * calculation options.
 * @returns {number} The net present value for the supplied rate and dated cash
 * flows.
 * @throws {RangeError} When inputs are invalid.
 *
 * @example
 * const cashFlows = [-10000, 2750, 4250, 3250, 2750];
 * const dates = [new Date("2008-01-01"), new Date("2008-03-01"), new Date("2008-10-30"), new Date("2009-02-15"), new Date("2009-04-01")];
 * calculateDatedNetPresentValue({ rate: 0.09, cashFlows, dates }); // 2086.647602031535
 *
 * @example
 * calculateDatedNetPresentValue({
 *   rate: 0.05,
 *   cashFlows: [-5000, 1000, 2000, 3000, 4000],
 *   dates: [new Date("2020-01-01"), new Date("2020-06-01"), new Date("2021-01-01"), new Date("2021-06-01"), new Date("2022-01-01")],
 * }); // 4311.704135504524
 */
export function calculateDatedNetPresentValue(options) {
  const { rate, cashFlows, dates } = options;

  if (rate <= -1) {
    throw new RangeError("Invalid rate.");
  }

  if (
    !Array.isArray(cashFlows) ||
    !Array.isArray(dates) ||
    cashFlows.length !== dates.length ||
    cashFlows.length < 1
  ) {
    throw new RangeError(
      "Values and dates must be arrays of the same length (at least 1).",
    );
  }

  const firstDate = dates[0];

  if (!(firstDate instanceof Date) || Number.isNaN(firstDate.getTime())) {
    throw new RangeError("All dates must be valid Date objects.");
  }

  const baseDay = Date.UTC(
    firstDate.getUTCFullYear(),
    firstDate.getUTCMonth(),
    firstDate.getUTCDate(),
  );

  let total = 0;

  for (let index = 0; index < cashFlows.length; index += 1) {
    const date = dates[index];

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new RangeError("All dates must be valid Date objects.");
    }

    const currentDay = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );

    if (currentDay < baseDay) {
      throw new RangeError("Dates must not precede the first date.");
    }

    const elapsedDays = (currentDay - baseDay) / (1000 * 60 * 60 * 24);
    total += cashFlows[index] / Math.pow(1 + rate, elapsedDays / 365);
  }

  return total;
}
