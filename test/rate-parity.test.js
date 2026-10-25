import { expect, test } from "vitest";
import { calculateRate } from "../src/rate.js";
import { rate } from "../src/excel/rate.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined, number | undefined][]} */ ([
    [60, 500, -25000, undefined, undefined, undefined],
    [312, 5113, -1501935, 2368, 0, 0.198],
    [276, 1991, -446386, 3135, 1, 0.047],
    [223, 13549, -2888300, 1933, 1, 0.092],
    [33, 5147, -146194, 1578, 0, 0.002],
    [4, 1727, -5869, 2511, 0, 0.05],
    [2, 24990, -44133, 5111, 1, 0.181],
    [10, 1000, -10000, 0, 0, 0],
    [213, 5529, -967194, undefined, undefined, undefined],
    [48, -200, 8000, undefined, undefined, undefined],
  ]),
)(
  "rate() and calculateRate() return identical results",
  (nper, pmt, pv, fv, type, guess) => {
    const excelResult = rate(nper, pmt, pv, fv, type, guess);
    const modernResult = calculateRate({
      periods: nper,
      payment: pmt,
      presentValue: pv,
      futureValue: fv ?? 0,
      timing: type === 1 ? "beginning" : "end",
      guess: guess ?? 0.1,
    });

    expect(excelResult).toBe(modernResult);
  },
);
