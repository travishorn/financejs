import { expect, test } from "vitest";
import { calculatePeriods } from "../src/periods.js";
import { nper } from "../src/excel/nper.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.00166666666666667, 500, -25000, undefined, undefined],
    [0.0025, 564, -25000, undefined, undefined],
    [0.0075, 5848, -50000, 564654, 1],
    [0.00833333333333333, 313, -33000, 0, 1],
    [0.05, 2500, -15330, 456, 1],
    [0.00916666666666667, 1654, -13546, undefined, undefined],
    [0.0158333333333333, 515615, -854893, 0, 1],
    [0.0225, 6566, -551321, 9654564, 1],
    [0.015, 6468, -56544, undefined, undefined],
    [0.00333333333333333, 1566, -65448, 546, undefined],
    [0, 500, -10000, 0, undefined],
    [0.12 / 12, -100, -1000, 10000, 1],
    [0, 100, 500, -500, undefined],
  ]),
)(
  "nper() and calculatePeriods() return identical results",
  (rate, pmt, pv, fv, type) => {
    const excelResult = nper(rate, pmt, pv, fv, type);
    const modernResult = calculatePeriods({
      rate,
      payment: pmt,
      presentValue: pv,
      futureValue: fv ?? 0,
      timing: type === 1 ? "beginning" : "end",
    });

    expect(excelResult).toBe(modernResult);
  },
);
