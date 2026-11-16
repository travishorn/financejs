import {
  actualDays,
  couponsRemaining,
  getCouponBounds,
  normalizeZero,
  toUtcDate,
} from "./util.js";
import { calculateCouponDaysBeforeSettlement } from "./coupon-days-before-settlement.js";
import { calculateCouponDays } from "./coupon-days.js";
import { calculateCouponDaysToNextCoupon } from "./coupon-days-to-next-coupon.js";
import { calculateBondPrice } from "./bond-price.js";

/**
 * Options for {@link calculateMacaulayDuration}.
 *
 * @typedef {object} MacaulayDurationOptions
 * @property {Date} settlement - The security's settlement date.
 * @property {Date} maturity - The security's maturity date.
 * @property {number} coupon - The security's annual coupon rate.
 * @property {number} yield - The security's annual yield.
 * @property {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @property {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 */

/**
 * Calculates the Macauley duration for an assumed par value of $100. Duration
 * is defined as the weighted average of the present value of cash flows, and is
 * used as a measure of a bond's price sensitivity to changes in yield.
 *
 * Remarks:
 * - The settlement date is the date a buyer purchases a coupon, such as a bond.
 *   The maturity date is the date when a coupon expires.
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `coupon` < `0` or if `yield` < `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4`, an error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 *
 * The duration is calculated as:
 *
 * When N > 1:
 * ```
 * DURATION = (1 / PRICE) * [
 *   SUM(k=1 to N) (100 * rate/frequency) / (1 + yield/frequency)^(DSC/E + k-1)
 *     * (DSC/E + k-1)
 *   + redemption / (1 + yield/frequency)^(DSC/E + N-1) * (DSC/E + N-1)
 * ]
 * ```
 *
 * When N = 1:
 * ```
 * DURATION = (1 / PRICE) * [
 *   (100 * rate/frequency + redemption) / (1 + yield/frequency * DSC/E)
 *     * (DSC/E)
 * ]
 * ```
 *
 * @param {MacaulayDurationOptions} options - The Macauley duration calculation
 * options.
 * @returns {number} The Macauley duration.
 *
 * @example
 * calculateMacaulayDuration({
 *   settlement: new Date("2018-07-01"),
 *   maturity: new Date("2048-01-01"),
 *   coupon: 0.08,
 *   yield: 0.09,
 *   frequency: 2,
 *   basis: 1,
 * }); // 10.91914528
 */
export function calculateMacaulayDuration(options) {
  const {
    settlement,
    maturity,
    coupon,
    yield: yld,
    frequency: frequencyInput,
    basis = 0,
  } = options;

  const settlementDate = toUtcDate(settlement);
  const maturityDate = toUtcDate(maturity);

  const frequency = /** @type {1|2|4} */ (Math.trunc(frequencyInput));
  const basisNumber = Math.trunc(basis);

  if (coupon < 0 || yld < 0) {
    throw new RangeError(
      "Coupon and yield must be greater than or equal to zero.",
    );
  }

  if (![1, 2, 4].includes(frequency)) {
    throw new RangeError("Invalid frequency.");
  }

  if (basisNumber < 0 || basisNumber > 4) {
    throw new RangeError("Invalid basis.");
  }

  /** @type {0|1|2|3|4} */
  const normalizedBasis = /** @type {0|1|2|3|4} */ (basisNumber);

  if (settlementDate >= maturityDate) {
    throw new RangeError("Settlement must be before maturity.");
  }

  const monthsPerCoupon = 12 / frequency;
  const { previousCouponDate, nextCouponDate } = getCouponBounds(
    settlementDate,
    maturityDate,
    monthsPerCoupon,
  );

  const a = calculateCouponDaysBeforeSettlement({
    settlement: settlementDate,
    maturity: maturityDate,
    frequency,
    basis: normalizedBasis,
  });
  let dsc = calculateCouponDaysToNextCoupon({
    settlement: settlementDate,
    maturity: maturityDate,
    frequency,
    basis: normalizedBasis,
  });
  let e = calculateCouponDays({
    settlement: settlementDate,
    maturity: maturityDate,
    frequency,
    basis: normalizedBasis,
  });

  if (normalizedBasis === 2) {
    e = actualDays(previousCouponDate, nextCouponDate);
  }

  if (normalizedBasis === 3) {
    dsc = e - a;
  }

  const n = couponsRemaining(nextCouponDate, maturityDate, monthsPerCoupon);
  const pr = calculateBondPrice({
    settlement,
    maturity,
    rate: coupon,
    yield: yld,
    redemption: 100,
    frequency,
    basis: normalizedBasis,
  });
  // DURATION uses the dirty price (clean price + accrued interest)
  const accruedInterest = ((100 * coupon) / frequency) * (a / e);
  const dirtyPrice = pr + accruedInterest;

  const couponAmount = (100 * coupon) / frequency;
  const base = 1 + yld / frequency;
  const firstExponent = dsc / e;

  let weightedPV = 0;

  if (n <= 1) {
    // Single coupon period
    const t = firstExponent;
    weightedPV = ((couponAmount + 100) / Math.pow(base, t)) * t;
  } else {
    // Multiple coupon periods
    for (let k = 1; k <= n; k += 1) {
      const exponent = firstExponent + k - 1;
      weightedPV += (couponAmount * exponent) / Math.pow(base, exponent);
    }
    // Add redemption cash flow
    const lastExponent = firstExponent + n - 1;
    weightedPV += (100 * lastExponent) / Math.pow(base, lastExponent);
  }

  // Divide by frequency to convert from coupon-period units to years
  return normalizeZero(weightedPV / dirtyPrice / frequency);
}
