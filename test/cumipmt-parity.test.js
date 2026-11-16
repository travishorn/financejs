import { expect, test } from "vitest";
import { calculateCumulativeInterest } from "../src/cumulative-interest.js";
import { cumipmt } from "../src/excel/cumipmt.js";

test.each(
  /** @type {[number, number, number, number, number, 0 | 1][]} */ ([
    [0.09 / 12, 30 * 12, 125000, 13, 24, 0],
    [0.09 / 12, 30 * 12, 125000, 1, 1, 0],
    [0.05, 10, 10000, 1, 10, 0],
    [0.05, 10, 10000, 1, 5, 0],
    [0.05, 10, 10000, 6, 10, 0],
    [0.07 / 12, 12, 5000, 1, 12, 0],
    [0.07 / 12, 12, 5000, 1, 6, 0],
    [0.07 / 12, 12, 5000, 7, 12, 0],
    [0.09 / 12, 30 * 12, 125000, 1, 12, 1],
    [0.09 / 12, 30 * 12, 125000, 13, 24, 1],
  ]),
)(
  "cumipmt() and calculateCumulativeInterest() return identical results",
  (rate, nper, pv, startPeriod, endPeriod, type) => {
    const excelResult = cumipmt(rate, nper, pv, startPeriod, endPeriod, type);
    const modernResult = calculateCumulativeInterest({
      rate,
      periods: nper,
      presentValue: pv,
      startPeriod,
      endPeriod,
      timing: type === 1 ? "beginning" : "end",
    });

    expect(excelResult).toBe(modernResult);
  },
);
