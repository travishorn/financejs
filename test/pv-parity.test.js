import { expect, test } from "vitest";
import { calculatePresentValue } from "../src/present-value.js";
import { pv } from "../src/excel/pv.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.0525, 5, 6000, undefined, undefined],
    [0.0688, 10, 150000, 10000, undefined],
    [0.006875, 60, 3250, 0, 1],
    [0.11 / 12, 180, 525, 50, undefined],
    [0.010625, 8, 32.5, 0, 1],
    [0, 10, 500, 1000, undefined],
    [0.08 / 12, 20 * 12, 500, undefined, undefined],
    [0.05, 10, 0, 0, undefined],
    [0.06 / 12, 10, -200, 0, 1],
    [0.005, 360, 1000, -5000, 0],
  ]),
)(
  "pv() and calculatePresentValue() return identical results",
  (rate, nper, pmt, fv, type) => {
    const excelResult = pv(rate, nper, pmt, fv, type);
    const modernResult = calculatePresentValue({
      rate,
      periods: nper,
      payment: pmt,
      futureValue: fv ?? 0,
      timing: type === 1 ? "beginning" : "end",
    });

    expect(excelResult).toBe(modernResult);
  },
);
