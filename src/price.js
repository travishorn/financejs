import {
  coupdaybs,
  coupdays,
  coupdaysnc,
  couponsRemaining,
  getCouponBounds,
  normalizeZero,
  toUtcDate,
} from "./util.js";

/**
 * Calculates the price per $100 face value of a security that pays periodic
 * interest.
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
 * - If `yld` < `0` or if `rate` < `0`, an error is thrown.
 * - If `redemption` <= `0`, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4` and error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 * - When N > 1 (N is the number of coupons payable between the settlement date
 *   and redemption date), the calculation is: `PRICE =[redemption / (1 +
 *   yld/frequency)^(N-1 + DSC/E)] +[SUM(k=1 to N) (100 * rate/frequency) / (1 +
 *   yld/frequency)^(k-1 + DSC/E)] - (100 * rate/frequency * A/E)`, where:
 *    - DSC = number of days from settlement to next coupon date.
 *    - E = number of days in coupon period in which the settlement date falls.
 *    - A = number of days from beginning of coupon period to settlement date.
 * - When N = 1, the calculation is: `DSR = E - A; T1 = 100 * (rate / frequency)
 *   + redemption; T2 = (yld / frequency) * (DSR / E) + 1; T3 = 100 * (rate /
 *   frequency) * (A / E); Price = (T1 / T2) - T3`.
 *
 * @param {Date} settlement - The security's settlement date. The security
 * settlement date is the date after the issue date when the security is traded
 * to the buyer.
 * @param {Date} maturity - The security's maturity date. The maturity date is
 * the date when the security expires.
 * @param {number} rate - The security's annual coupon rate.
 * @param {number} yld - The security's annual yield.
 * @param {number} redemption - The security's redemption value per $100 face
 * value.
 * @param {1|2|4} frequency - The number of coupon payments per year. For annual
 * payments, frequency = `1`; for semiannual, frequency = `2`; for quarterly,
 * frequency = `4`.
 * @param {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 * @returns {number} the price per $100 face value
 *
 * @example
 * price(new Date("2008-02-15"), new Date("2017-11-15"), 0.0575, 0.065, 100, 2, 0); // 94.63436162
 */
export function price(
  settlement,
  maturity,
  rate,
  yld,
  redemption,
  frequency,
  basis = 0,
) {
  const settlementDate = toUtcDate(settlement);
  const maturityDate = toUtcDate(maturity);

  frequency = /** @type {1|2|4} */ (Math.trunc(frequency));
  const basisNumber = Math.trunc(basis ?? 0);

  if (rate < 0 || yld < 0) {
    throw new RangeError(
      "Rate and yield must be greater than or equal to zero.",
    );
  }

  if (redemption <= 0) {
    throw new RangeError("Redemption must be greater than zero.");
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

  const a = coupdaybs(previousCouponDate, settlementDate, normalizedBasis);
  let dsc = coupdaysnc(settlementDate, nextCouponDate, normalizedBasis);
  const e = coupdays(
    previousCouponDate,
    nextCouponDate,
    frequency,
    normalizedBasis,
  );

  if (normalizedBasis === 3) {
    dsc = e - a;
  }

  const n = couponsRemaining(nextCouponDate, maturityDate, monthsPerCoupon);
  const coupon = (100 * rate) / frequency;

  if (n <= 1) {
    const t1 = coupon + redemption;
    const t2 = (yld / frequency) * (dsc / e) + 1;
    const t3 = coupon * (a / e);
    return normalizeZero(t1 / t2 - t3);
  }

  const base = 1 + yld / frequency;
  const firstExponent = dsc / e;

  let presentValue = 0;
  for (let k = 1; k <= n; k += 1) {
    presentValue += coupon / Math.pow(base, k - 1 + firstExponent);
  }

  presentValue += redemption / Math.pow(base, n - 1 + firstExponent);
  presentValue -= (coupon * a) / e;

  return normalizeZero(presentValue);
}
