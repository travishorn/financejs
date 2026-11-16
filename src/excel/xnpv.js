import { calculateDatedNetPresentValue } from "../dated-net-present-value.js";

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
  return calculateDatedNetPresentValue({ rate, cashFlows: values, dates });
}
