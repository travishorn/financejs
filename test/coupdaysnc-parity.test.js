import { expect, test } from "vitest";
import { calculateCouponDaysToNextCoupon } from "../src/coupon-days-to-next-coupon.js";
import { coupdaysnc } from "../src/excel/coupdaysnc.js";

test.each(
  /** @type {[Date, Date, 1|2|4, 0|1|2|3|4 | undefined][]} */ ([
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 1],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 0],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 2],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 3],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, 4],
    [new Date("2026-01-25"), new Date("2026-11-15"), 1, 0],
    [new Date("2026-01-25"), new Date("2026-11-15"), 4, 0],
    [new Date("2026-04-10"), new Date("2027-06-15"), 4, 1],
    [new Date("2026-01-25"), new Date("2026-11-15"), 2, undefined],
  ]),
)(
  "coupdaysnc() and calculateCouponDaysToNextCoupon() return identical results",
  (settlement, maturity, frequency, basis) => {
    const excelResult = coupdaysnc(settlement, maturity, frequency, basis);
    const modernResult = calculateCouponDaysToNextCoupon({
      settlement,
      maturity,
      frequency,
      basis,
    });

    expect(excelResult).toBe(modernResult);
  },
);
