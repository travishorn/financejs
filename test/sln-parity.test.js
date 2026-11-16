import { expect, test } from "vitest";
import { calculateStraightLineDepreciation } from "../src/straight-line-depreciation.js";
import { sln } from "../src/excel/sln.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [30000, 7500, 10],
    [10000, 1000, 5],
    [50000, 5000, 15],
    [120000, 20000, 20],
    [25000, 0, 10],
    [8000, 2000, 4],
    [60000, 10000, 8],
    [15000, 5000, 5],
    [9000, 1000, 2],
    [200000, 50000, 25],
  ]),
)(
  "sln() and calculateStraightLineDepreciation() return identical results",
  (cost, salvage, life) => {
    const excelResult = sln(cost, salvage, life);
    const modernResult = calculateStraightLineDepreciation({
      cost,
      salvage,
      life,
    });

    expect(excelResult).toBe(modernResult);
  },
);
