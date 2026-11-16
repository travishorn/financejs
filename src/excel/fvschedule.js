import { calculateFutureValueSchedule } from "../future-value-schedule.js";

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
 * @param {number} principal - The present value.
 * @param {number[]} schedule - An array of interest rates to apply.
 * @returns {number} the future value
 *
 * @example
 * fvschedule(1, [0.09, 0.11, 0.1]); // 1.33089000
 */
export function fvschedule(principal, schedule) {
  return calculateFutureValueSchedule({ principal, schedule });
}
