/**
 * Calculates the net present value (NPV) of a subset of cash flows at a
 * specified discount rate.
 *
 * Used internally by the `npv()` function to evaluate the present value of cash
 * flows between given indices. Each cash flow is discounted to its present
 * value using the supplied rate, starting from lowerBound to upperBound
 * (inclusive).
 *
 * @param {number} rate - Discount rate per period (as a decimal, e.g., `0.1`
 * for 10%).
 * @param {number[]} values - Array of cash flows, where each entry represents a
 * payment (negative) or income (positive) at a regular interval.
 * @param {number} [lowerBound=0] - Start index (inclusive) for the range of
 * values to evaluate.
 * @param {number} [upperBound=values.length - 1] - End index (inclusive) for
 * the range of values to evaluate.
 * @returns {number} The net present value of the specified range of cash flows
 * at the given discount rate.
 *
 * @example
 * evalNpv(0.1, [-1000, 300, 400, 500], 0, 2); // -360.6311044327573
 */
function evalNpv(rate, values, lowerBound = 0, upperBound = values.length - 1) {
  let discountFactor = 1;
  let total = 0;

  for (let index = lowerBound; index <= upperBound; index += 1) {
    const value = values[index];
    discountFactor += discountFactor * rate;
    total += value / discountFactor;
  }

  return total;
}

/**
 * Calculates the net present value of an investment by using a discount rate
 * and a series of future payments (negative values) and income (positive
 * values).
 *
 * Remarks:
 * - The NPV investment begins one period before the date of the first value in
 *   the cash flow and ends with the last value in the cash flow. The NPV
 *   calculation is based on future cash flows. If your first cash flow occurs
 *   at the beginning of the first period, the first value must be added to the
 *   NPV result, not included in the values arguments.
 * - `npv()` is similar to the `pv()` function (present value). The primary
 *   difference between `pv()` and `npv()` is that `pv()` allows cash flows to
 *   begin either at the end or at the beginning of the period. Unlike the
 *   variable NPV cash flow values, PV cash flows must be constant throughout
 *   the investment.
 * - `npv()` is also related to the `irr()` function (internal rate of return).
 *   IRR is the rate for which NPV equals zero: `npv(irr(...), ...) = 0`.
 *
 * @param {number} rate - The rate of discount over the length of one period.
 * @param {...number} values - At least one value is required. Values must be
 * equally spaced in time and occur at the end of each period. This function
 * uses the order of the values to interpret the order of cash flows. Be sure to
 * enter your payment and income values in the correct sequence.
 * @returns {number} The net present value.
 * @throws {RangeError} When there are no cash flow values or rate is invalid.
 *
 * @example
 * npv(0.1, -10000, 3000, 4200, 6800); // 1188.44
 */
export function npv(rate, ...values) {
  if (values.length < 1) {
    throw new RangeError("Invalid values.");
  }

  if (rate === -1) {
    throw new RangeError("Invalid rate.");
  }

  return evalNpv(rate, values, 0, values.length - 1);
}
