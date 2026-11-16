import {
  actualDays,
  days360Eu,
  days360Us,
  getCouponBounds,
  toUtcDate,
} from "./util.js";

/**
 * Options for {@link calculateCouponDaysBeforeSettlement}.
 *
 * @typedef {object} CouponDaysBeforeSettlementOptions
 * @property {Date} settlement - The security's settlement date.
 * @property {Date} maturity - The security's maturity date.
 * @property {1|2|4} frequency - The number of coupon payments per year. For
 * annual payments, frequency = `1`; for semiannual, frequency = `2`; for
 * quarterly, frequency = `4`.
 * @property {0|1|2|3|4} [basis=0] - The type of day count basis to use. `0` or
 * omitted = US (NASD 30/360), `1` = actual/actual, `2` = actual/360, `3` =
 * actual/365, `4` = European 30/360.
 */

/**
 * Returns the number of days from the beginning of the coupon period to the
 * settlement date.
 *
 * Remarks:
 * - `settlement`, `maturity`, `frequency`, and `basis` are truncated to
 *   integers.
 * - If `settlement` or `maturity` is not a valid date, an error is thrown.
 * - If `frequency` is any number other than `1`, `2`, or `4`, an error is
 *   thrown.
 * - If `basis` < `0` or if `basis` > `4`, an error is thrown.
 * - If `settlement` >= `maturity`, an error is thrown.
 *
 * @param {CouponDaysBeforeSettlementOptions} options - The coupon days before
 * settlement calculation options.
 * @returns {number} The number of days from the beginning of the coupon period
 * to the settlement date.
 *
 * @example
 * calculateCouponDaysBeforeSettlement({
 *   settlement: new Date("2011-01-25"),
 *   maturity: new Date("2011-11-15"),
 *   frequency: 2,
 *   basis: 1,
 * }); // 71
 */
export function calculateCouponDaysBeforeSettlement(options) {
  const {
    settlement,
    maturity,
    frequency: frequencyInput,
    basis = 0,
  } = options;

  const settlementDate = toUtcDate(settlement);
  const maturityDate = toUtcDate(maturity);

  const frequency = /** @type {1|2|4} */ (Math.trunc(frequencyInput));
  const basisNumber = Math.trunc(basis);

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
  const { previousCouponDate } = getCouponBounds(
    settlementDate,
    maturityDate,
    monthsPerCoupon,
  );

  if (normalizedBasis === 0) {
    return days360Us(previousCouponDate, settlementDate);
  }

  if (normalizedBasis === 4) {
    return days360Eu(previousCouponDate, settlementDate);
  }

  return actualDays(previousCouponDate, settlementDate);
}
