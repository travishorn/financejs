import { expect, test } from "vitest";
import { calculateCumulativePrincipal } from "../src/cumulative-principal.js";
import { cumprinc } from "../src/excel/cumprinc.js";

test.each(
  /** @type {[number, number, number, number, number, 0 | 1][]} */ ([
    [0.09 / 12, 30 * 12, 125000, 13, 24, 0],
    [0.05 / 12, 15 * 12, 200000, 1, 12, 0],
    [0.07 / 12, 20 * 12, 150000, 25, 36, 0],
    [0.04 / 12, 10 * 12, 100000, 1, 120, 0],
    [0.06 / 12, 25 * 12, 300000, 100, 120, 0],
    [0.08 / 12, 30 * 12, 250000, 13, 24, 1],
    [0.09 / 12, 30 * 12, 125000, 1, 12, 1],
    [0.05 / 12, 15 * 12, 200000, 13, 24, 1],
    [0.07 / 12, 20 * 12, 150000, 1, 12, 0],
    [0.04 / 12, 10 * 12, 100000, 13, 24, 1],
  ]),
)(
  "cumprinc() and calculateCumulativePrincipal() return identical results",
  (rate, nper, pv, startPeriod, endPeriod, type) => {
    const excelResult = cumprinc(rate, nper, pv, startPeriod, endPeriod, type);
    const modernResult = calculateCumulativePrincipal({
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
