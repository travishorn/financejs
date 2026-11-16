import { expect, test } from "vitest";
import { calculateDatedNetPresentValue } from "../src/dated-net-present-value.js";
import { xnpv } from "../src/excel/xnpv.js";

test.each([
  [
    0.09,
    [-10000, 2750, 4250, 3250, 2750],
    [
      new Date("2008-01-01"),
      new Date("2008-03-01"),
      new Date("2008-10-30"),
      new Date("2009-02-15"),
      new Date("2009-04-01"),
    ],
  ],
  [
    0.05,
    [-5000, 1000, 2000, 3000, 4000],
    [
      new Date("2020-01-01"),
      new Date("2020-06-01"),
      new Date("2021-01-01"),
      new Date("2021-06-01"),
      new Date("2022-01-01"),
    ],
  ],
  [
    0.12,
    [-2000, 800, 900, 1000, 1100],
    [
      new Date("2015-01-01"),
      new Date("2015-07-01"),
      new Date("2016-01-01"),
      new Date("2016-07-01"),
      new Date("2017-01-01"),
    ],
  ],
  [
    0.07,
    [-15000, 4000, 5000, 6000, 7000],
    [
      new Date("2010-01-01"),
      new Date("2010-04-01"),
      new Date("2010-07-01"),
      new Date("2010-10-01"),
      new Date("2011-01-01"),
    ],
  ],
  [
    0.1,
    [-1000, 200, 300, 400, 500],
    [
      new Date("2018-01-01"),
      new Date("2018-04-01"),
      new Date("2018-07-01"),
      new Date("2018-10-01"),
      new Date("2019-01-01"),
    ],
  ],
])(
  "xnpv() and calculateDatedNetPresentValue() return identical results",
  (rate, values, dates) => {
    const excelResult = xnpv(rate, values, dates);
    const modernResult = calculateDatedNetPresentValue({
      rate,
      cashFlows: values,
      dates,
    });

    expect(excelResult).toBe(modernResult);
  },
);
