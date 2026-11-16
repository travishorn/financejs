import { expect, test } from "vitest";
import { calculateDoubleDecliningBalanceDepreciation } from "../src/double-declining-balance-depreciation.js";
import { ddb } from "../src/excel/ddb.js";

test.each(
  /** @type {[number, number, number, number, number][]} */ ([
    [2400, 300, 10 * 365, 1, 2],
    [10000, 1000, 5, 1, 2],
    [10000, 1000, 5, 2, 2],
    [10000, 1000, 5, 5, 2],
    [50000, 5000, 10, 1, 2],
    [50000, 5000, 10, 10, 2],
    [25000, 0, 8, 3, 2],
    [25000, 1000, 8, 8, 2],
    [12000, 0, 6, 4, 1.5],
    [12000, 0, 6, 6, 1.5],
  ]),
)(
  "ddb() and calculateDoubleDecliningBalanceDepreciation() return identical results",
  (cost, salvage, life, period, factor) => {
    const excelResult = ddb(cost, salvage, life, period, factor);
    const modernResult = calculateDoubleDecliningBalanceDepreciation({
      cost,
      salvage,
      life,
      period,
      factor,
    });

    expect(excelResult).toBe(modernResult);
  },
);
