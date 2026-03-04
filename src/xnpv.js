/**
 * Calculates the net present value for a schedule of cash flows that is not
 * necessarily periodic.
 *
 * @param {number} rate - Discount rate per year (as a decimal, e.g., 0.1 for
 * 10%).
 * @param {number[]} values - Cash flow values where each value is a payment
 * (negative) or income (positive).
 * @param {Date[]} dates - Dates corresponding to each cash flow. The first date
 * is treated as the base date.
 * @returns {number} The net present value for the supplied rate and dated cash
 * flows.
 * @throws {RangeError} When inputs are invalid.
 *
 * @example
 * const values = [-10000, 2750, 4250, 3250, 2750];
 * const dates = [new Date("2008-01-01"), new Date("2008-03-01"), new Date("2008-10-30"), new Date("2009-02-15"), new Date("2009-04-01")];
 * xnpv(0.09, values, dates); // 2086.64760203
 */
export function xnpv(rate, values, dates) {
  if (rate <= -1) {
    throw new RangeError("Invalid rate.");
  }

  if (
    !Array.isArray(values) ||
    !Array.isArray(dates) ||
    values.length !== dates.length ||
    values.length < 1
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
    firstDate.getFullYear(),
    firstDate.getMonth(),
    firstDate.getDate(),
  );

  let total = 0;

  for (let index = 0; index < values.length; index += 1) {
    const date = dates[index];

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new RangeError("All dates must be valid Date objects.");
    }

    const currentDay = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (currentDay < baseDay) {
      throw new RangeError("Dates must not precede the first date.");
    }

    const elapsedDays = (currentDay - baseDay) / (1000 * 60 * 60 * 24);
    total += values[index] / Math.pow(1 + rate, elapsedDays / 365);
  }

  return total;
}
