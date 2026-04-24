import { expect, test } from "vitest";
import {
  actualDays,
  addMonthsUtc,
  couponsRemaining,
  days360Eu,
  days360Us,
  getCouponBounds,
  lastDayOfMonthUtc,
  normalizeZero,
  toUtcDate,
} from "../src/util.js";

test("lastDayOfMonthUtc() returns the last day in month", () => {
  expect(lastDayOfMonthUtc(new Date("2024-02-10"))).toBe(29);
  expect(lastDayOfMonthUtc(new Date("2023-02-10"))).toBe(28);
});

test("addMonthsUtc() preserves end-of-month behavior", () => {
  expect(addMonthsUtc(new Date("2021-01-31"), 1).toISOString()).toBe(
    "2021-02-28T00:00:00.000Z",
  );
  expect(addMonthsUtc(new Date("2024-01-31"), 1).toISOString()).toBe(
    "2024-02-29T00:00:00.000Z",
  );
});

test("addMonthsUtc() handles non-end-of-month and negative offsets", () => {
  expect(addMonthsUtc(new Date("2021-03-15"), -1).toISOString()).toBe(
    "2021-02-15T00:00:00.000Z",
  );
  expect(addMonthsUtc(new Date("2021-10-30"), 5).toISOString()).toBe(
    "2022-03-30T00:00:00.000Z",
  );
});

test("days360Us() handles NASD special cases", () => {
  // February month-end start and end in February
  expect(days360Us(new Date("2024-02-29"), new Date("2024-02-29"))).toBe(0);
  // d2 = 31 with d1 >= 30
  expect(days360Us(new Date("2024-01-30"), new Date("2024-03-31"))).toBe(60);
  // d1 = 31 normalization
  expect(days360Us(new Date("2024-01-31"), new Date("2024-02-29"))).toBe(29);
});

test("days360Eu() handles 31st-day normalization", () => {
  expect(days360Eu(new Date("2024-01-31"), new Date("2024-02-28"))).toBe(28);
  expect(days360Eu(new Date("2024-01-31"), new Date("2024-03-31"))).toBe(60);
});

test("actualDays() returns elapsed day count", () => {
  expect(actualDays(new Date("2024-01-01"), new Date("2024-01-11"))).toBe(10);
});

test("getCouponBounds() finds bounds by stepping backward from maturity", () => {
  const { previousCouponDate, nextCouponDate } = getCouponBounds(
    new Date("2021-01-15"),
    new Date("2022-01-31"),
    6,
  );

  expect(previousCouponDate.toISOString()).toBe("2020-07-31T00:00:00.000Z");
  expect(nextCouponDate.toISOString()).toBe("2021-01-31T00:00:00.000Z");
});

test("getCouponBounds() advances when settlement is on/after next coupon date", () => {
  const { previousCouponDate, nextCouponDate } = getCouponBounds(
    new Date("2023-01-01"),
    new Date("2022-01-31"),
    6,
  );

  expect(previousCouponDate.toISOString()).toBe("2022-01-31T00:00:00.000Z");
  expect(nextCouponDate.toISOString()).toBe("2022-07-31T00:00:00.000Z");
});

test("couponsRemaining() counts coupon dates through maturity", () => {
  expect(
    couponsRemaining(new Date("2025-01-01"), new Date("2025-01-01"), 6),
  ).toBe(1);
  expect(
    couponsRemaining(new Date("2025-01-01"), new Date("2026-01-01"), 6),
  ).toBe(3);
});

test("toUtcDate() normalizes valid Date instances to UTC midnight", () => {
  const value = new Date("2024-04-03T15:45:12.250Z");
  const result = toUtcDate(value);

  expect(result.toISOString()).toBe("2024-04-03T00:00:00.000Z");
});

test("toUtcDate() throws on invalid Date values", () => {
  expect(() => toUtcDate(new Date("invalid"))).toThrow(RangeError);
  expect(() => toUtcDate(/** @type {any} */ ("2024-04-03"))).toThrow(
    RangeError,
  );
});

test("normalizeZero() converts -0 to +0", () => {
  const result = normalizeZero(-0);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});

test("normalizeZero() keeps +0 as +0", () => {
  const result = normalizeZero(0);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});

test.each([
  1,
  -1,
  123.45,
  -987.65,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  Number.NaN,
])("normalizeZero() leaves non-zero value unchanged: %p", (value) => {
  const result = normalizeZero(value);

  if (Number.isNaN(value)) {
    expect(Number.isNaN(result)).toBe(true);
  } else {
    expect(result).toBe(value);
  }
});
