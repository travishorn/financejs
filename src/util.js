/**
 * Gets the last calendar day number for the month that contains `date`.
 *
 * This helper is UTC-based, so results are not affected by local timezone or
 * daylight-saving transitions.
 *
 * @param {Date} date - The date whose month should be inspected.
 * @returns {number} The month-end day of month, from 28 to 31.
 *
 * @example
 * lastDayOfMonthUtc(new Date("2024-02-10")); // 29
 * lastDayOfMonthUtc(new Date("2023-02-10")); // 28
 */
export function lastDayOfMonthUtc(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

/**
 * Adds or subtracts whole months from a UTC date while preserving end-of-month
 * behavior.
 *
 * If the input date is the last day of its month, the result is also forced to
 * the last day of the destination month. Otherwise, the day is clamped to the
 * destination month when needed (for example, Jan 30 + 1 month => Feb 28/29).
 *
 * @param {Date} date - The starting date.
 * @param {number} months - Number of months to add. Use negative values to
 * subtract months.
 * @returns {Date} A new UTC date shifted by `months`.
 *
 * @example
 * addMonthsUtc(new Date("2021-01-31"), 1); // 2021-02-28T00:00:00.000Z
 * addMonthsUtc(new Date("2024-01-31"), 1); // 2024-02-29T00:00:00.000Z
 */
export function addMonthsUtc(date, months) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const isEndOfMonth = day === lastDayOfMonthUtc(date);

  const monthIndex = month + months;
  const newYear = year + Math.floor(monthIndex / 12);
  const newMonth = ((monthIndex % 12) + 12) % 12;
  const monthEndDay = new Date(Date.UTC(newYear, newMonth + 1, 0)).getUTCDate();
  const newDay = isEndOfMonth ? monthEndDay : Math.min(day, monthEndDay);

  return new Date(Date.UTC(newYear, newMonth, newDay));
}

/**
 * Computes day count using Excel/NASD 30/360 convention.
 *
 * This convention applies special normalization around month-end boundaries,
 * especially for February and day 31 handling, to produce a synthetic
 * 360-day-year day count.
 *
 * @param {Date} start - Start date (inclusive boundary for convention logic).
 * @param {Date} end - End date.
 * @returns {number} Day count between `start` and `end` under US 30/360 rules.
 *
 * @example
 * days360Us(new Date("2024-01-30"), new Date("2024-03-31")); // 60
 */
export function days360Us(start, end) {
  let d1 = start.getUTCDate();
  let d2 = end.getUTCDate();
  const m1 = start.getUTCMonth() + 1;
  const m2 = end.getUTCMonth() + 1;
  const y1 = start.getUTCFullYear();
  const y2 = end.getUTCFullYear();

  const startIsMonthEnd = d1 === lastDayOfMonthUtc(start);
  const endIsMonthEnd = d2 === lastDayOfMonthUtc(end);

  if (m1 === 2 && startIsMonthEnd) {
    d1 = 30;
  }
  if (m2 === 2 && endIsMonthEnd && m1 === 2 && startIsMonthEnd) {
    d2 = 30;
  }

  if (d2 === 31 && d1 >= 30) {
    d2 = 30;
  }
  if (d1 === 31) {
    d1 = 30;
  }

  return 360 * (y2 - y1) + 30 * (m2 - m1) + (d2 - d1);
}

/**
 * Computes day count using European 30/360 convention.
 *
 * Unlike NASD 30/360, this method simply converts day 31 to day 30 for both
 * dates, then calculates using a 360-day year basis.
 *
 * @param {Date} start - Start date.
 * @param {Date} end - End date.
 * @returns {number} Day count between `start` and `end` under EU 30/360 rules.
 *
 * @example
 * days360Eu(new Date("2024-01-31"), new Date("2024-03-31")); // 60
 */
export function days360Eu(start, end) {
  let d1 = start.getUTCDate();
  let d2 = end.getUTCDate();

  if (d1 === 31) {
    d1 = 30;
  }
  if (d2 === 31) {
    d2 = 30;
  }

  const m1 = start.getUTCMonth() + 1;
  const m2 = end.getUTCMonth() + 1;
  const y1 = start.getUTCFullYear();
  const y2 = end.getUTCFullYear();

  return 360 * (y2 - y1) + 30 * (m2 - m1) + (d2 - d1);
}

/**
 * Computes the actual elapsed days between two dates using UTC timestamps.
 *
 * @param {Date} start - Start date.
 * @param {Date} end - End date.
 * @returns {number} Exact day difference as `(end - start)` in days.
 *
 * @example
 * actualDays(new Date("2024-01-01"), new Date("2024-01-11")); // 10
 */
export function actualDays(start, end) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return (end.getTime() - start.getTime()) / msPerDay;
}

/**
 * Finds coupon period boundaries around a settlement date.
 *
 * Starting from maturity and stepping backward by coupon interval, this helper
 * returns the coupon date immediately before settlement and the next coupon
 * date after settlement. If settlement lands exactly on a coupon date, it is
 * treated as the start of the next period (Excel-compatible behavior).
 *
 * @param {Date} settlementDate - Security settlement date.
 * @param {Date} maturityDate - Security maturity date.
 * @param {number} monthsPerCoupon - Coupon interval in months (e.g., 12, 6, or
 * 3).
 * @returns {{ previousCouponDate: Date, nextCouponDate: Date }} Coupon bounds
 * containing settlement.
 *
 * @example
 * getCouponBounds(new Date("2021-01-15"), new Date("2022-01-31"), 6);
 */
export function getCouponBounds(settlementDate, maturityDate, monthsPerCoupon) {
  let nextCouponDate = new Date(maturityDate.getTime());
  let previousCouponDate = addMonthsUtc(nextCouponDate, -monthsPerCoupon);

  while (settlementDate < previousCouponDate) {
    nextCouponDate = previousCouponDate;
    previousCouponDate = addMonthsUtc(nextCouponDate, -monthsPerCoupon);
  }

  // Excel treats settlement on a coupon date as the start of the next period.
  if (settlementDate >= nextCouponDate) {
    previousCouponDate = nextCouponDate;
    nextCouponDate = addMonthsUtc(nextCouponDate, monthsPerCoupon);
  }

  return { previousCouponDate, nextCouponDate };
}

/**
 * Counts remaining coupon payments from `nextCouponDate` through maturity.
 *
 * The count includes the coupon on `nextCouponDate` itself, then steps by the
 * coupon interval until the maturity date is reached.
 *
 * @param {Date} nextCouponDate - Next coupon date after settlement.
 * @param {Date} maturityDate - Security maturity date.
 * @param {number} monthsPerCoupon - Coupon interval in months.
 * @returns {number} Number of remaining coupon payments.
 *
 * @example
 * couponsRemaining(new Date("2025-01-01"), new Date("2026-01-01"), 6); // 3
 */
export function couponsRemaining(
  nextCouponDate,
  maturityDate,
  monthsPerCoupon,
) {
  let n = 1;
  let current = new Date(nextCouponDate.getTime());

  while (current < maturityDate) {
    current = addMonthsUtc(current, monthsPerCoupon);
    n += 1;
  }

  return n;
}

/**
 * Converts a `Date` to a UTC-midnight date-only representation.
 *
 * This helper is used to remove time-of-day components so financial date
 * calculations operate on whole UTC dates.
 *
 * @param {Date} value - Input date value.
 * @returns {Date} A new date at `00:00:00.000Z` for the same UTC
 * year/month/day.
 * @throws {RangeError} If `value` is not a valid `Date` instance.
 *
 * @example
 * toUtcDate(new Date("2024-04-03T15:45:12.250Z")); // 2024-04-03T00:00:00.000Z
 */
export function toUtcDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new RangeError("Settlement and maturity must be valid Date objects.");
  }

  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

/**
 * Normalizes zero values to ensure consistent handling of positive and negative
 * zero in calculations.
 *
 * In JavaScript, +0 and -0 are distinct values that can yield different results
 * in equality checks (e.g., Object.is(+0, -0) is false), sign checks
 * (Math.sign), and division (1/0 vs 1/-0). This function coerces any zero input
 * (either +0 or -0) to positive zero (+0), providing a consistent
 * representation for downstream calculations, comparisons, and serialization.
 *
 * @param {number} value - The numeric value to normalize. If the value is +0 or
 * -0, returns +0; otherwise, returns the original value.
 * @returns {number} The normalized value, with all zeroes represented as +0.
 *
 * @example
 * normalizeZero(-0); // 0
 * normalizeZero(+0); // 0
 * normalizeZero(5);  // 5
 */
export function normalizeZero(value) {
  return value === 0 ? 0 : value;
}
