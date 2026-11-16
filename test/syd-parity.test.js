import { expect, test } from "vitest";
import { calculateSumOfYearsDepreciation } from "../src/sum-of-years-depreciation.js";
import { syd } from "../src/excel/syd.js";

test.each(
  /** @type {[number, number, number, number][]} */ ([
    [30000, 7500, 10, 1],
    [30000, 7500, 10, 10],
    [10000, 1000, 5, 1],
    [10000, 1000, 5, 5],
    [50000, 5000, 8, 1],
    [50000, 5000, 8, 8],
    [25000, 0, 4, 2],
    [25000, 1000, 4, 3],
    [12000, 2000, 6, 4],
    [12000, 0, 6, 6],
  ]),
)(
  "syd() and calculateSumOfYearsDepreciation() return identical results",
  (cost, salvage, life, per) => {
    const excelResult = syd(cost, salvage, life, per);
    const modernResult = calculateSumOfYearsDepreciation({
      cost,
      salvage,
      life,
      period: per,
    });

    expect(excelResult).toBe(modernResult);
  },
);
