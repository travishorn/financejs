import { expect, test } from "vitest";
import { calculateEvenPrincipalInterest } from "../src/even-principal-interest.js";
import { ispmt } from "../src/excel/ispmt.js";

test.each(
  /** @type {[number, number, number, number][]} */ ([
    [0.1, 0, 4, 4000],
    [0.1, 1, 4, 4000],
    [0.05, 2, 6, 1200],
    [0.07, 3, 5, 10000],
    [0.12, 0, 12, 12000],
    [0.12, 11, 12, 12000],
    [0.08, 5, 10, 5000],
    [0.09, 4, 8, 8000],
    [0.06, 0, 1, 1000],
    [0.06, 0, 10, 0],
  ]),
)(
  "ispmt() and calculateEvenPrincipalInterest() return identical results",
  (rate, per, nper, pv) => {
    const excelResult = ispmt(rate, per, nper, pv);
    const modernResult = calculateEvenPrincipalInterest({
      rate,
      period: per,
      periods: nper,
      presentValue: pv,
    });

    expect(excelResult).toBe(modernResult);
  },
);
