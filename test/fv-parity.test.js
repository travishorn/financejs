import { expect, test } from "vitest";
import { calculateFutureValue } from "../src/future-value.js";
import { fv } from "../src/excel/fv.js";

test.each(
  /** @type {[number, number, number, number, 0 | 1 | undefined][]} */ ([
    [0.0525, 8, 6000, -15000, undefined],
    [0.005625, 60, 500, -30000, 1],
    [0.11 / 12, 24, 8025, -250000, undefined],
    [0.125, 6, 58, -5000, 1],
    [0.07 / 12, 240, 1500, -200000, undefined],
    [0, 10, 500, -10000, undefined],
    [0.06 / 12, 10, -200, -500, 1],
    [0.05, 10, 0, 0, undefined],
    [0.05, 10, -100, 0, 0],
    [0.005, 360, 1000, -5000, 1],
  ]),
)(
  "fv() and calculateFutureValue() return identical results",
  (rate, nper, pmt, pv, type) => {
    const excelResult = fv(rate, nper, pmt, pv, type);
    const modernResult = calculateFutureValue({
      rate,
      periods: nper,
      payment: pmt,
      presentValue: pv,
      timing: type === 1 ? "beginning" : "end",
    });

    expect(excelResult).toBe(modernResult);
  },
);
