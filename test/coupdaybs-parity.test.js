import { expect, test } from "vitest";
import { calculateCouponDaysBeforeSettlement } from "../src/coupon-days-before-settlement.js";
import { coupdaybs } from "../src/excel/coupdaybs.js";

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
  "coupdaybs() and calculateCouponDaysBeforeSettlement() return identical results",
  (settlement, maturity, frequency, basis) => {
    const excelResult = coupdaybs(settlement, maturity, frequency, basis);
    const modernResult = calculateCouponDaysBeforeSettlement({
      settlement,
      maturity,
      frequency,
      basis,
    });

    expect(excelResult).toBe(modernResult);
  },
);
