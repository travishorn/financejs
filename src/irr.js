/**
 * Computes the net present value (NPV) of a series of cash flows at a given
 * discount rate.
 *
 * Used internally by the IRR algorithm to evaluate the present value of cash
 * flows for a specific rate guess. Skips leading zero cash flows for
 * efficiency. Cash flows are discounted in reverse order, from last to first
 * nonzero value.
 *
 * @param {number[]} values - Array of cash flows, where each entry represents a
 * payment (negative) or income (positive) at a regular interval.
 * @param {number} [guess=0.1] - Discount rate guess (as a decimal, e.g., 0.1
 * for 10%).
 * @returns {number} The net present value of the cash flows at the supplied
 * discount rate.
 *
 * @example
 * internalPv([-1000, 300, 400, 500], 0.1); // -21.036814425244188
 */
function internalPv(values, guess = 0.1) {
  let lowerBound = 0;
  const upperBound = values.length - 1;
  let total = 0;
  const discountRate = 1 + guess;

  while (lowerBound <= upperBound && values[lowerBound] === 0) {
    lowerBound += 1;
  }

  for (let index = upperBound; index >= lowerBound; index -= 1) {
    total /= discountRate;
    total += values[index];
  }

  return total;
}

/**
 * Calculates the internal rate of return for a series of cash flows represented
 * by the numbers in `values`. These cash flows do not have to be even, as they
 * would be for an annuity. However, the cash flows must occur at regular
 * intervals, such as monthly or annually. The internal rate of return is the
 * interest rate received for an investment consisting of payments (negative
 * values) and income (positive values) that occur at regular periods.
 *
 * Remarks:
 * - Uses an iterative technique for calculating IRR. Starting with guess, this
 *   function cycles through the calculation until the result is accurate within
 *   a small absolute threshold. If this function can't find a result that works
 *   after 39 tries, a RangeError is thrown.
 * - `irr()` is closely related to `npv()`, the net present value function. The
 *   rate of return calculated by this function is the interest rate
 *   corresponding to a 0 (zero) net present value.
 *
 * @param {number[]} values - An array that contains numbers for which you want
 * to calculate the internal rate of return. Values must contain at least one
 * positive value and one negative value to calculate the internal rate of
 * return. This function uses the order of values to interpret the order of cash
 * flows. Be sure to enter your payment and income values in the sequence you
 * want.
 * @param {number} [guess=0.1] - A number that you guess is close to the result
 * of this function. In most cases you do not need to provide guess for this
 * calculation. If a RangeError is thrown, or if the result is not close to what
 * you expected, try again with a different value for `guess`.
 * @returns {number} The internal rate of return.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 * @example
 * irr([-70000,12000,15000,18000,21000]); // -0.021244848272975403
 */
export function irr(values, guess = 0.1) {
  if (guess <= -1) {
    throw new RangeError("Invalid guess.");
  }

  if (values.length < 1) {
    throw new RangeError("Invalid values.");
  }

  const epsilonMax = 0.0000001;
  const step = 0.00001;
  const iterationMax = 39;

  let maxAbsoluteValue = Math.abs(values[0]);

  for (let index = 0; index < values.length; index += 1) {
    const absoluteValue = Math.abs(values[index]);

    if (absoluteValue > maxAbsoluteValue) {
      maxAbsoluteValue = absoluteValue;
    }
  }

  const npvEpsilon = maxAbsoluteValue * epsilonMax * 0.01;

  let rate0 = guess;
  let npv0 = internalPv(values, rate0);
  let rate1 = npv0 > 0 ? rate0 + step : rate0 - step;

  if (rate1 <= -1) {
    throw new RangeError("Invalid values.");
  }

  let npv1 = internalPv(values, rate1);

  for (let iteration = 0; iteration <= iterationMax; iteration += 1) {
    if (npv1 === npv0) {
      rate0 = rate1 > rate0 ? rate0 - step : rate0 + step;
      npv0 = internalPv(values, rate0);

      if (npv1 === npv0) {
        throw new RangeError("Invalid values.");
      }
    }

    rate0 = rate1 - ((rate1 - rate0) * npv1) / (npv1 - npv0);

    if (rate0 <= -1) {
      rate0 = (rate1 - 1) * 0.5;
    }

    npv0 = internalPv(values, rate0);

    const rateDelta = Math.abs(rate0 - rate1);
    const absoluteNpv = Math.abs(npv0);

    if (absoluteNpv < npvEpsilon && rateDelta < epsilonMax) {
      return rate0;
    }

    const nextNpv = npv0;
    npv0 = npv1;
    npv1 = nextNpv;

    const nextRate = rate0;
    rate0 = rate1;
    rate1 = nextRate;
  }

  throw new RangeError("Maximum iterations exceeded while calculating IRR.");
}
