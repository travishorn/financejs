import { expect, test } from "vitest";
import { calculateCouponDays } from "../src/coupon-days.js";

test.each(
  /** @type {[Date, Date, 1|2|4, 0|1|2|3|4 | undefined, number][]} */ ([
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 1, 181],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 0, 180],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 2, 180],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 3, 182.5],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 4, 180],
    [new Date("2026-01-25"), new Date("2026-11-15"), 1, 0, 360],
    [new Date("2026-01-25"), new Date("2026-11-15"), 4, 0, 90],
    [new Date("2026-04-10"), new Date("2027-06-15"), 4, 1, 92],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, undefined, 180],
  ]),
)(
  "calculateCouponDays() matches Excel to 8 decimal places",
  (settlement, maturity, frequency, basis, expected) => {
    expect(
      calculateCouponDays({ settlement, maturity, frequency, basis }),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[Date, Date, 1|2|4, 0|1|2|3|4 | undefined][]} */ ([
    [new Date("invalid"), new Date("2026-11-15"), 2, 0],
    [new Date("2026-01-25"), new Date("invalid"), 2, 0],
    [new Date("2026-01-25"), new Date("2026-11-15"), 3, 0],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, -1],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 5],
    [new Date("2026-11-15"), new Date("2026-11-15"), 2, 0],
    [new Date("2027-01-01"), new Date("2026-11-15"), 2, 0],
  ]),
)(
  "calculateCouponDays() throws RangeError for invalid inputs",
  (settlement, maturity, frequency, basis) => {
    expect(() =>
      calculateCouponDays({ settlement, maturity, frequency, basis }),
    ).toThrow(RangeError);
  },
);
