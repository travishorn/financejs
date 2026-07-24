import { expect, test } from "vitest";
import { mduration } from "../src/mduration.js";

test.each(
  /** @type {[Date, Date, number, number, 1|2|4, 0|1|2|3|4 | undefined, number][]} */ ([
    // Microsoft example from docs
    [
      new Date("2008-01-01"),
      new Date("2016-01-01"),
      0.08,
      0.09,
      2,
      1,
      5.73566981,
    ],
    // Annual coupon
    [
      new Date("2020-01-01"),
      new Date("2030-01-01"),
      0.05,
      0.06,
      1,
      0,
      7.56842797,
    ],
    // Semiannual, US 30/360
    [
      new Date("2008-02-15"),
      new Date("2017-11-15"),
      0.0575,
      0.065,
      2,
      0,
      7.18303603,
    ],
    // Quarterly, actual/actual
    [
      new Date("2022-06-15"),
      new Date("2032-06-15"),
      0.045,
      0.04,
      4,
      1,
      8.07219173,
    ],
    // Actual/360 basis
    [
      new Date("2021-03-31"),
      new Date("2026-03-31"),
      0.06,
      0.055,
      2,
      2,
      4.28298592,
    ],
    // Actual/365 basis
    [
      new Date("2019-09-01"),
      new Date("2029-09-01"),
      0.035,
      0.037,
      2,
      3,
      8.35333045,
    ],
    // European 30/360
    [
      new Date("2018-12-15"),
      new Date("2023-12-15"),
      0.055,
      0.06,
      4,
      4,
      4.33224395,
    ],
    // Default basis (undefined -> 0)
    [
      new Date("2025-01-01"),
      new Date("2035-01-01"),
      0.04,
      0.05,
      2,
      undefined,
      8.05423106,
    ],
    // Single coupon period (n <= 1) — settlement within 6 months of maturity
    [
      new Date("2026-10-01"),
      new Date("2026-12-31"),
      0.05,
      0.06,
      2,
      0,
      0.240021575,
    ],
  ]),
)(
  "mduration(%s, %s, %s, %s, %s, %s) should return %s",
  (settlement, maturity, coupon, yld, frequency, basis, expected) => {
    const result = mduration(
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

test.each(
  /** @type {[Date, Date, number, number, 1|2|4, 0|1|2|3|4 | undefined][]} */ ([
    [new Date("invalid"), new Date("2016-01-01"), 0.08, 0.09, 2, 0],
    [new Date("2008-01-01"), new Date("invalid"), 0.08, 0.09, 2, 0],
    [new Date("2008-01-01"), new Date("2016-01-01"), -0.01, 0.09, 2, 0],
    [new Date("2008-01-01"), new Date("2016-01-01"), 0.08, -0.01, 2, 0],
    [new Date("2008-01-01"), new Date("2016-01-01"), 0.08, 0.09, 3, 0],
    [new Date("2008-01-01"), new Date("2016-01-01"), 0.08, 0.09, 2, -1],
    [new Date("2008-01-01"), new Date("2016-01-01"), 0.08, 0.09, 2, 5],
    [new Date("2008-01-01"), new Date("2008-01-01"), 0.08, 0.09, 2, 0],
    [new Date("2016-01-01"), new Date("2008-01-01"), 0.08, 0.09, 2, 0],
  ]),
)(
  "mduration() throws RangeError for invalid inputs",
  (settlement, maturity, coupon, yld, frequency, basis) => {
    expect(() =>
      mduration(settlement, maturity, coupon, yld, frequency, basis),
    ).toThrow(RangeError);
  },
);
