/**
 * Options for {@link calculateInternalRateOfReturn}.
 *
 * @typedef {object} InternalRateOfReturnOptions
 * @property {number[]} cashFlows - An array that contains numbers for which you
 * want to calculate the internal rate of return. Values must contain at least
 * one positive value and one negative value to calculate the internal rate of
 * return. This function uses the order of values to interpret the order of cash
 * flows. Be sure to enter your payment and income values in the sequence you
 * want.
 * @property {number} [guess=0.1] - A number that you guess is close to the
 * result of this function. In most cases you do not need to provide a guess for
 * this calculation. If a RangeError is thrown, or if the result is not close to
 * what you expected, try again with a different value for `guess`.
 */

/**
 * Computes the net present value (NPV) of a series of cash flows at a given
 * discount rate.
 *
 * Used internally by {@link calculateInternalRateOfReturn} to evaluate the
 * present value of cash flows for a specific rate guess. Skips leading zero
 * cash flows for efficiency. Cash flows are discounted in reverse order, from
 * last to first nonzero value.
 *
 * @param {number[]} cashFlows - Array of cash flows, where each entry
 * represents a payment (negative) or income (positive) at a regular interval.
 * @param {number} [guess=0.1] - Discount rate guess (as a decimal, e.g., 0.1
 * for 10%).
 * @returns {number} The net present value of the cash flows at the supplied
 * discount rate.
 *
 * @example
 * internalPv([-1000, 300, 400, 500], 0.1); // -21.036814425244188
 */
function internalPv(cashFlows, guess = 0.1) {
  let lowerBound = 0;
  const upperBound = cashFlows.length - 1;
  let total = 0;
  const discountRate = 1 + guess;

  while (lowerBound <= upperBound && cashFlows[lowerBound] === 0) {
    lowerBound += 1;
  }

  for (let index = upperBound; index >= lowerBound; index -= 1) {
    total /= discountRate;
    total += cashFlows[index];
  }

  return total;
}

/**
 * Calculates the internal rate of return for a series of cash flows. The cash
 * flows do not have to be even, as they would be for an annuity. However, the
 * cash flows must occur at regular intervals, such as monthly or annually. The
 * internal rate of return is the interest rate received for an investment
 * consisting of payments (negative values) and income (positive values) that
 * occur at regular periods.
 *
 * Remarks:
 * - Uses an iterative technique for calculating the internal rate of return.
 *   Starting with `guess`, this function cycles through the calculation until
 *   the result is accurate within a small absolute threshold. If this function
 *   can't find a result that works after 100 tries, a RangeError is thrown.
 * - This function is closely related to `calculateNetPresentValue()`, the net
 *   present value function. The rate of return calculated by this function is
 *   the interest rate corresponding to a 0 (zero) net present value.
 *
 * @param {InternalRateOfReturnOptions} options - The internal rate of return
 * calculation options.
 * @returns {number} The internal rate of return.
 * @throws {RangeError} When inputs are invalid or the algorithm cannot
 * converge.
 *
 * @example
 * calculateInternalRateOfReturn({
 *   cashFlows: [-70000, 12000, 15000, 18000, 21000],
 * }); // -0.021244848272975403
 *
 * @example
 * calculateInternalRateOfReturn({
 *   cashFlows: [
 *     -59984, 5868, 9728, 7261, 2716, 1010, 8531, 3481, 8906, 7035, 1800,
 *     2436, 6143, 9844, 1200, 1528, 848,
 *   ],
 *   guess: 0.05,
 * }); // 0.03905013260704959
 */
export function calculateInternalRateOfReturn(options) {
  const { cashFlows, guess = 0.1 } = options;

  if (guess <= -1) {
    throw new RangeError("Invalid guess.");
  }

  if (cashFlows.length < 1) {
    throw new RangeError("Invalid values.");
  }

  const epsilonMax = 0.000000000001;
  const iterationMax = 100;

  let lowerRate = -0.99;
  let upperRate = guess > lowerRate ? guess : 0.1;
  let lowerNpv = internalPv(cashFlows, lowerRate);
  let upperNpv = internalPv(cashFlows, upperRate);

  if (lowerNpv === 0) {
    return lowerRate;
  }

  if (upperNpv === 0) {
    return upperRate;
  }

  for (let expansion = 0; expansion < 20; expansion += 1) {
    if ((lowerNpv > 0 && upperNpv < 0) || (lowerNpv < 0 && upperNpv > 0)) {
      break;
    }

    if (expansion % 2 === 0) {
      lowerRate = -1 + (1 + lowerRate) / 10;
      lowerNpv = internalPv(cashFlows, lowerRate);

      if (lowerNpv === 0) {
        return lowerRate;
      }
    } else {
      upperRate = (upperRate + 1) * 10;
      upperNpv = internalPv(cashFlows, upperRate);

      if (upperNpv === 0) {
        return upperRate;
      }
    }
  }

  if (!((lowerNpv > 0 && upperNpv < 0) || (lowerNpv < 0 && upperNpv > 0))) {
    throw new RangeError("Invalid values.");
  }

  let retainedSide = 0;

  for (let iteration = 0; iteration <= iterationMax; iteration += 1) {
    const bracketWidth = upperRate - lowerRate;

    let rate = lowerRate - (lowerNpv * bracketWidth) / (upperNpv - lowerNpv);

    if (!(
      rate > lowerRate + bracketWidth * 0.05 &&
      rate < upperRate - bracketWidth * 0.05
    )) {
      rate = (lowerRate + upperRate) / 2;
    }

    const npv = internalPv(cashFlows, rate);

    if (npv === 0) {
      return rate;
    }

    if ((npv > 0 && lowerNpv > 0) || (npv < 0 && lowerNpv < 0)) {
      lowerRate = rate;
      lowerNpv = npv;

      if (retainedSide === 1) {
        upperNpv /= 2;
      }

      retainedSide = 1;
    } else {
      upperRate = rate;
      upperNpv = npv;

      if (retainedSide === -1) {
        lowerNpv /= 2;
      }

      retainedSide = -1;
    }

    if (upperRate - lowerRate < epsilonMax) {
      return (lowerRate + upperRate) / 2;
    }
  }

  throw new RangeError("Maximum iterations exceeded while calculating IRR.");
}
