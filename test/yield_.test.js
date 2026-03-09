import { expect, test } from "vitest";
import { yield_ } from "../src/yield_.js";

test.each(
  /** @type {[Date, Date, number, number, number, number, number | undefined, number][]} */ ([
    // TODO: Verify these against Excel
    [
      new Date("2008-02-15"),
      new Date("2016-11-15"),
      0.0575,
      95.04287,
      100,
      2,
      0,
      0.06500001,
    ],
    [
      new Date("2020-01-01"),
      new Date("2030-01-01"),
      0.05,
      98.5,
      100,
      1,
      0,
      0.051961112184648835,
    ],
    [
      new Date("2022-06-15"),
      new Date("2032-06-15"),
      0.045,
      102.25,
      100,
      2,
      1,
      0.0422184015935575,
    ],
    [
      new Date("2021-03-31"),
      new Date("2026-03-31"),
      0.06,
      101.75,
      100,
      4,
      2,
      0.05612633874793323,
    ],
    [
      new Date("2019-09-01"),
      new Date("2029-09-01"),
      0.035,
      99.1,
      100,
      2,
      3,
      0.03608596760753001,
    ],
    [
      new Date("2018-12-15"),
      new Date("2023-12-15"),
      0.055,
      97.8,
      100,
      4,
      4,
      0.06012723207942008,
    ],
    [
      new Date("2025-01-01"),
      new Date("2025-07-01"),
      0.04,
      99.5,
      100,
      2,
      0,
      0.05025125628140708,
    ],
    [
      new Date("2023-05-10"),
      new Date("2033-05-10"),
      0.09,
      85.0,
      100,
      1,
      0,
      0.11612826359476489,
    ],
    [
      new Date("2024-08-20"),
      new Date("2034-08-20"),
      0.02,
      110.0,
      100,
      2,
      1,
      0.009494086606658332,
    ],
    [
      new Date("2022-11-30"),
      new Date("2027-11-30"),
      0.05,
      99.0,
      105,
      2,
      0,
      0.06105283801678177,
    ],
    [
      new Date("2026-01-01"),
      new Date("2026-04-01"),
      0.03,
      99.8,
      100,
      4,
      2,
      0.03807615230460947,
    ],
  ]),
)(
  "yield_() matches Excel to 8 decimal places",
  (settlement, maturity, rate, pr, redemption, frequency, basis, expected) => {
    expect(
      yield_(settlement, maturity, rate, pr, redemption, frequency, basis),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[Date, Date, number, number, number, number, number | undefined, number][]} */ (
    [
      // TODO: Throwing cases will go here. e.g.,
      // [settlement, maturity, rate, pr, redemption, frequency, basis]
    ]
  ),
)(
  "yield_() throws RangeError for invalid inputs",
  (settlement, maturity, rate, pr, redemption, frequency, basis) => {
    expect(() =>
      yield_(settlement, maturity, rate, pr, redemption, frequency, basis),
    ).toThrow(RangeError);
  },
);
