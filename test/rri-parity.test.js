import { expect, test } from "vitest";
import { calculateEquivalentRate } from "../src/equivalent-rate.js";
import { rri } from "../src/excel/rri.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [96, 10000, 11000],
    [12, 1000, 2000],
    [1, 100, 110],
    [10, 5000, 10000],
    [24, 10000, 8000],
    [60, 15000, 30000],
    [36, 1000, 1500],
    [5, 100, 161.051],
    [120, 10000, 10000],
    [6, 1000, 500],
  ]),
)(
  "rri() and calculateEquivalentRate() return identical results",
  (nper, pv, fv) => {
    const excelResult = rri(nper, pv, fv);
    const modernResult = calculateEquivalentRate({
      periods: nper,
      presentValue: pv,
      futureValue: fv,
    });

    expect(excelResult).toBe(modernResult);
  },
);
