import { expect, test } from "vitest";
import { calculateDatedInternalRateOfReturn } from "../src/dated-internal-rate-of-return.js";
import { xirr } from "../src/excel/xirr.js";

test.each([
  [
    [-10000, 2750, 4250, 3250, 2750],
    [
      new Date("2008-01-01"),
      new Date("2008-03-01"),
      new Date("2008-10-30"),
      new Date("2009-02-15"),
      new Date("2009-04-01"),
    ],
    0.1,
  ],
  [
    [-5000, 1000, 2000, 3000, 4000],
    [
      new Date("2020-01-01"),
      new Date("2020-06-01"),
      new Date("2021-01-01"),
      new Date("2021-06-01"),
      new Date("2022-01-01"),
    ],
    0.1,
  ],
  [
    [-2000, 800, 900, 1000, 1100],
    [
      new Date("2015-01-01"),
      new Date("2015-07-01"),
      new Date("2016-01-01"),
      new Date("2016-07-01"),
      new Date("2017-01-01"),
    ],
    0.1,
  ],
  [
    [-15000, 4000, 5000, 6000, 7000],
    [
      new Date("2010-01-01"),
      new Date("2010-04-01"),
      new Date("2010-07-01"),
      new Date("2010-10-01"),
      new Date("2011-01-01"),
    ],
    0.1,
  ],
  [
    [-1000, 200, 300, 400, 500],
    [
      new Date("2018-01-01"),
      new Date("2018-04-01"),
      new Date("2018-07-01"),
      new Date("2018-10-01"),
      new Date("2019-01-01"),
    ],
    0.1,
  ],
])(
  "xirr() and calculateDatedInternalRateOfReturn() return identical results",
  (values, dates, guess) => {
    const excelResult = xirr(values, dates, guess);
    const modernResult = calculateDatedInternalRateOfReturn({
      cashFlows: values,
      dates,
      guess: guess ?? 0.1,
    });

    expect(excelResult).toBe(modernResult);
  },
);
