import { expect, test } from "vitest";
import { calculateModifiedInternalRateOfReturn } from "../src/modified-internal-rate-of-return.js";
import { mirr } from "../src/excel/mirr.js";

test.each(
  /** @type {[number[], number, number][]} */ ([
    [[-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.12],
    [[-120000, 39000, 30000, 21000], 0.1, 0.12],
    [[-120000, 39000, 30000, 21000, 37000, 46000], 0.1, 0.14],
    [[-50000, 15000, 20000, 25000, 30000], 0.15, 0.18],
    [[-10000, 4000, 4000, 4000], 0.05, 0.07],
    [[-10000, 1000, 1000, 1000], 0.08, 0.1],
    [[-200000, 50000, 60000, 70000, 80000], 0.03, 0.04],
    [[-1000, 0, 0, 0, 2000], 0.06, 0.08],
    [[-5000, 0, 2000, 2000, 2000], 0.09, 0.11],
  ]),
)(
  "mirr() and calculateModifiedInternalRateOfReturn() return identical results",
  (values, financeRate, reinvestRate) => {
    const excelResult = mirr(values, financeRate, reinvestRate);
    const modernResult = calculateModifiedInternalRateOfReturn({
      cashFlows: values,
      financeRate,
      reinvestRate,
    });

    expect(excelResult).toBe(modernResult);
  },
);
