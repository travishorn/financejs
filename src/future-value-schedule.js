/**
 * Options for {@link calculateFutureValueSchedule}.
 *
 * @typedef {object} FutureValueScheduleOptions
 * @property {number} principal - The present value.
 * @property {number[]} schedule - An array of interest rates to apply.
 */

/**
 * Calculates the future value of an initial principal after applying a series
 * of compound interest rates. Use this function to calculate the future value
 * of an investment with a variable or adjustable rate.
 *
 * Remarks:
 * - The values in schedule can be numbers or `null`; any other value will cause
 *   this function to throw a RangeError. Null values are taken as zeros (no
 *   interest).
 *
 * @param {FutureValueScheduleOptions} options - The future value schedule
 * calculation options.
 * @returns {number} The future value.
 *
 * @example
 * calculateFutureValueSchedule({
 *   principal: 1,
 *   schedule: [0.09, 0.11, 0.1],
 * }); // 1.3308900000000004
 */
export function calculateFutureValueSchedule(options) {
  const { principal, schedule } = options;

  if (typeof principal !== "number" || !Array.isArray(schedule)) {
    throw new RangeError("Invalid input types");
  }

  let fv = principal;

  for (let i = 0; i < schedule.length; ++i) {
    let rate = schedule[i];
    if (rate === null) {
      rate = 0;
    } else if (
      typeof rate !== "number" ||
      Number.isNaN(rate) ||
      rate === Infinity ||
      rate === -Infinity
    ) {
      throw new RangeError("Schedule must contain only finite numbers or null");
    }
    fv *= 1 + rate;
  }

  return fv;
}
