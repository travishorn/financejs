import { expect, test } from "vitest";
import { calculatePeriodsToTarget } from "../src/periods-to-target.js";
import { pduration } from "../src/excel/pduration.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [0.025, 2000, 2200],
    [0.025 / 12, 1000, 1200],
    [0.05, 1000, 2000],
    [0.01, 5000, 10000],
    [0.1, 100, 110],
    [0.03, 10000, 8000],
    [0.025, 15000, 30000],
    [0.02, 1000, 1500],
    [0.05, 100, 100],
    [0.08, 1000, 500],
  ]),
)(
  "pduration() and calculatePeriodsToTarget() return identical results",
  (rate, pv, fv) => {
    const excelResult = pduration(rate, pv, fv);
    const modernResult = calculatePeriodsToTarget({
      rate,
      presentValue: pv,
      futureValue: fv,
    });

    expect(excelResult).toBe(modernResult);
  },
);
