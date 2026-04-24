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

/**
 * Calculates the yield on a security that pays periodic interest. Use to
 * calculate bond yield.
 *
 * Remarks:
 * - The settlement date is the date a buyer purchases a coupon, such as a bond.
 *   The maturity date is the date when a coupon expires. For example, suppose a
 *   30-year bond is issued on January 1, 2008, and is purchased by a buyer six
 *   months later. The issue date would be January 1, 2008, the settlement date
 *   would be July 1, 2008, and the maturity date would be January 1, 2038,
 *   which is 30 years after the January 1, 2008, issue date.
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `rate` < `0`, an error is thrown.
 * - If `pr` ≤ `0` or if `redemption` ≤ `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4` and error is thrown.
 * - If `settlement` ≥ `maturity`, an error is thrown.
 * - If there is one coupon period or less until redemption, the yield is
 *   calculated as follows: `yield = ((redemption/100 + rate/frequency) -
 *   (par/100 + (A/E * rate/frequency))) / (par/100 + (A/E * rate/frequency)) *
 *   (frequency * E) / DSR`, where:
 *      - `A` = number of days from the beginning of the coupon period to the
 *        settlement date (accrued days).
 *      - `DSR` = number of days from the settlement date to the redemption date.
 *      - `E` = number of days in the coupon period.
 *  - If there is more than one coupon period until redemption, the yield is
 *    calculated through a hundred iterations. The resolution uses the Newton
 *    method. The yield is changed until the estimated price given the yield is
 *    close to price.
 *
 * @param {Date} settlement - The security's settlement date. The security
 * settlement date is the date after the issue date when the security is traded
 * to the buyer.
 * @param {Date} maturity - The security's maturity date. The maturity date is
 * the date when the security expires.
 * @param {number} rate - The security's annual coupon rate.
 * @param {number} pr - The security's price per $100 face value.
 * @param {number} redemption - The security's redemption value per $100 face
 * value.
 * @param {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} The yield
 *
 * @example
 * yield_(new Date("2008-02-15"), new Date("2016-11-15"), 0.0575, 95.04287, 100, 2, 0); // 0.06500001
 */
export function yield_(
  settlement,
  maturity,
  rate,
  pr,
  redemption,
  frequency,
  basis = 0,
) {
  const settlementDate = toUtcDate(settlement);
  const maturityDate = toUtcDate(maturity);

  frequency = /** @type {1|2|4} */ (Math.trunc(frequency));
  const basisNumber = Math.trunc(basis ?? 0);

  if (rate < 0) {
    throw new RangeError("Invalid rate.");
  }

  if (pr <= 0 || redemption <= 0) {
    throw new RangeError("Price and redemption must be greater than zero.");
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
  const coupon = (100 * rate) / frequency;

  if (n <= 1) {
    const numerator =
      redemption / 100 +
      rate / frequency -
      (pr / 100 + (a / e) * (rate / frequency));
    const denominator = pr / 100 + (a / e) * (rate / frequency);
    const result = (numerator / denominator) * ((frequency * e) / dsc);
    return normalizeZero(result);
  }

  /** @param {number} candidateYield */
  const priceFromYield = (candidateYield) => {
    const base = 1 + candidateYield / frequency;
    const firstExponent = dsc / e;

    let presentValue = 0;
    for (let k = 1; k <= n; k += 1) {
      presentValue += coupon / Math.pow(base, k - 1 + firstExponent);
    }

    presentValue += redemption / Math.pow(base, n - 1 + firstExponent);
    presentValue -= (coupon * a) / e;

    return presentValue;
  };

  const epsilon = 1e-11;
  const maxIterations = 100;
  const minYield = -frequency + 1e-10;
  const step = 0.01;

  let y0 = Math.max(rate, minYield + step);
  let f0 = priceFromYield(y0) - pr;
  let y1 = y0 + (f0 > 0 ? step : -step);
  y1 = Math.max(y1, minYield);
  let f1 = priceFromYield(y1) - pr;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    if (Math.abs(f1) < epsilon) {
      return normalizeZero(y1);
    }

    if (f1 === f0) {
      y0 = Math.max(y0 + step, minYield);
      f0 = priceFromYield(y0) - pr;
    }

    let y2 = y1 - ((y1 - y0) * f1) / (f1 - f0);
    y2 = Math.max(y2, minYield);
    const f2 = priceFromYield(y2) - pr;

    if (Math.abs(f2) < epsilon) {
      return normalizeZero(y2);
    }

    y0 = y1;
    f0 = f1;
    y1 = y2;
    f1 = f2;
  }

  throw new RangeError("Maximum iterations exceeded while calculating YIELD.");
}
