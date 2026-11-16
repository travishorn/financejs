import { expect, test } from "vitest";
import { calculatePrincipalPayment } from "../src/principal-payment.js";
import { ppmt } from "../src/excel/ppmt.js";

test.each(
  /** @type {[number, number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.02, 5, 5, -608926, 37115, 0],
    [0.0025, 9, 24, -62088, 16679, 0],
    [0.0075, 1, 36, -303575, 0, 1],
    [0.0083333333333333, 56, 240, -244184, 40099, 1],
    [0.05, 4, 8, -204252, 4793, 1],
    [0.00916666666666667, 10, 60, -276452, 0, 0],
    [0.0158333333333333, 98, 180, -740363, 1255, 1],
    [0.0225, 4, 16, -324779, 0, 1],
    [0.015, 36, 48, -518630, 39718, 0],
    [0.00333333333333333, 244, 360, -490152, 36758, 0],
    [0.1 / 12, 1, 2 * 12, 2000, undefined, undefined],
    [0.05, 1, 10, 0, 0, 1],
  ]),
)(
  "ppmt() and calculatePrincipalPayment() return identical results",
  (rate, per, nper, pv, fv, type) => {
    const excelResult = ppmt(rate, per, nper, pv, fv, type);
    const modernResult = calculatePrincipalPayment({
      rate,
      period: per,
      periods: nper,
      presentValue: pv,
      futureValue: fv ?? 0,
      timing: type === 1 ? "beginning" : "end",
    });

    expect(excelResult).toBe(modernResult);
  },
);
