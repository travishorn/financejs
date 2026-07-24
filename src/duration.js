import {
  actualDays,
  couponsRemaining,
  getCouponBounds,
  normalizeZero,
  toUtcDate,
} from "./util.js";
import { coupdaybs } from "./coupdaybs.js";
import { coupdays } from "./coupdays.js";
import { coupdaysnc } from "./coupdaysnc.js";
import { price } from "./price.js";

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
 * - If `coupon` < `0` or if `yld` < `0`, an error is thrown.
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
 *   SUM(k=1 to N) (100 * rate/frequency) / (1 + yld/frequency)^(DSC/E + k-1)
 *     * (DSC/E + k-1)
 *   + redemption / (1 + yld/frequency)^(DSC/E + N-1) * (DSC/E + N-1)
 * ]
 * ```
 *
 * When N = 1:
 * ```
 * DURATION = (1 / PRICE) * [
 *   (100 * rate/frequency + redemption) / (1 + yld/frequency * DSC/E)
 *     * (DSC/E)
 * ]
 * ```
 *
 * @param {Date} settlement - The security's settlement date.
 * @param {Date} maturity - The security's maturity date.
 * @param {number} coupon - The security's annual coupon rate.
 * @param {number} yld - The security's annual yield.
 * @param {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} The Macauley duration.
 *
 * @example
 * duration(new Date("2018-07-01"), new Date("2048-01-01"), 0.08, 0.09, 2, 1); // 10.91914528
 */
export function duration(
  settlement,
  maturity,
  coupon,
  yld,
  frequency,
  basis = 0,
) {
  const settlementDate = toUtcDate(settlement);
  const maturityDate = toUtcDate(maturity);

  frequency = /** @type {1|2|4} */ (Math.trunc(frequency));
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

  const a = coupdaybs(settlementDate, maturityDate, frequency, normalizedBasis);
  let dsc = coupdaysnc(
    settlementDate,
    maturityDate,
    frequency,
    normalizedBasis,
  );
  let e = coupdays(settlementDate, maturityDate, frequency, normalizedBasis);

  if (normalizedBasis === 2) {
    e = actualDays(previousCouponDate, nextCouponDate);
  }

  if (normalizedBasis === 3) {
    dsc = e - a;
  }

  const n = couponsRemaining(nextCouponDate, maturityDate, monthsPerCoupon);
  const pr = price(
    settlement,
    maturity,
    coupon,
    yld,
    100,
    frequency,
    normalizedBasis,
  );
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
