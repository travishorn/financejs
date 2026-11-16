import { expect, test } from "vitest";
import { calculateMacaulayDuration } from "../src/macaulay-duration.js";
import { duration } from "../src/excel/duration.js";

test.each(
  /** @type {[Date, Date, number, number, 1|2|4, 0|1|2|3|4 | undefined][]} */ ([
    [new Date("2018-07-01"), new Date("2048-01-01"), 0.08, 0.09, 2, 1],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 1, 0],
    [new Date("2008-02-15"), new Date("2017-11-15"), 0.0575, 0.065, 2, 0],
    [new Date("2022-06-15"), new Date("2032-06-15"), 0.045, 0.04, 4, 1],
    [new Date("2021-03-31"), new Date("2026-03-31"), 0.06, 0.055, 2, 2],
    [new Date("2019-09-01"), new Date("2029-09-01"), 0.035, 0.037, 2, 3],
    [new Date("2018-12-15"), new Date("2023-12-15"), 0.055, 0.06, 4, 4],
    [new Date("2025-01-01"), new Date("2035-01-01"), 0.04, 0.05, 2, undefined],
    [new Date("2026-10-01"), new Date("2026-12-31"), 0.05, 0.06, 2, 0],
  ]),
)(
  "duration() and calculateMacaulayDuration() return identical results",
  (settlement, maturity, coupon, yld, frequency, basis) => {
    const excelResult = duration(
      settlement,
      maturity,
      coupon,
      yld,
      frequency,
      basis,
    );
    const modernResult = calculateMacaulayDuration({
      settlement,
      maturity,
      coupon,
      yield: yld,
      frequency,
      basis,
    });

    expect(excelResult).toBe(modernResult);
  },
);
