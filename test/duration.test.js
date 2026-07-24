import { expect, test } from "vitest";
import { duration } from "../src/duration.js";

test.each(
  /** @type {[Date, Date, number, number, 1|2|4, 0|1|2|3|4 | undefined, number][]} */ ([
    // Microsoft example from docs
    [
      new Date("2018-07-01"),
      new Date("2048-01-01"),
      0.08,
      0.09,
      2,
      1,
      10.91914528,
    ],
    // Annual coupon
    [
      new Date("2020-01-01"),
      new Date("2030-01-01"),
      0.05,
      0.06,
      1,
      0,
      8.02253365,
    ],
    // Semiannual, US 30/360
    [
      new Date("2008-02-15"),
      new Date("2017-11-15"),
      0.0575,
      0.065,
      2,
      0,
      7.4164847,
    ],
    // Quarterly, actual/actual
    [
      new Date("2022-06-15"),
      new Date("2032-06-15"),
      0.045,
      0.04,
      4,
      1,
      8.15291365,
    ],
    // Actual/360 basis
    [
      new Date("2021-03-31"),
      new Date("2026-03-31"),
      0.06,
      0.055,
      2,
      2,
      4.40076803,
    ],
    // Actual/365 basis
    [
      new Date("2019-09-01"),
      new Date("2029-09-01"),
      0.035,
      0.037,
      2,
      3,
      8.50786706,
    ],
    // European 30/360
    [
      new Date("2018-12-15"),
      new Date("2023-12-15"),
      0.055,
      0.06,
      4,
      4,
      4.39722761,
    ],
    // Default basis (undefined -> 0)
    [
      new Date("2025-01-01"),
      new Date("2035-01-01"),
      0.04,
      0.05,
      2,
      undefined,
      8.25558684,
    ],
  ]),
)(
  "duration(%s, %s, %s, %s, %s, %s) should return %s",
  (settlement, maturity, coupon, yld, frequency, basis, expected) => {
    const result = duration(
      settlement,
      maturity,
      coupon,
      yld,
      frequency,
      basis,
    );
    expect(result).toBeCloseTo(expected, 2);
  },
);
