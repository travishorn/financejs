import { expect, test } from "vitest";
import { calculatePayment } from "../src/payment.js";
import { pmt } from "../src/excel/pmt.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.0525, 5, -10000, undefined, undefined],
    [0.006875, 60, -150000, 0, 1],
    [0.0275, 10, -25566, 500, undefined],
    [0.025 / 12, 180, -55555, 1000, 1],
    [0.22, 1, -15000, undefined, undefined],
    [0, 10, -10000, undefined, undefined],
    [0.08 / 12, 10, 10000, undefined, undefined],
    [0.05, 10, 0, 0, undefined],
    [0.1, 36, 25000, -5000, 1],
    [0.005, 360, -200000, 0, 0],
  ]),
)(
  "pmt() and calculatePayment() return identical results",
  (rate, nper, pv, fv, type) => {
    const excelResult = pmt(rate, nper, pv, fv, type);
    const modernResult = calculatePayment({
      rate,
      periods: nper,
      presentValue: pv,
      futureValue: fv ?? 0,
      timing: type === 1 ? "beginning" : "end",
    });

    expect(excelResult).toBe(modernResult);
  },
);
