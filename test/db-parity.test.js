import { expect, test } from "vitest";
import { calculateDecliningBalanceDepreciation } from "../src/declining-balance-depreciation.js";
import { db } from "../src/excel/db.js";

test.each(
  /** @type {[number, number, number, number, number][]} */ ([
    [1000000, 100000, 6, 1, 7],
    [1000000, 100000, 6, 2, 7],
    [1000000, 100000, 6, 6, 7],
    [1000000, 100000, 6, 7, 7],
    [50000, 5000, 5, 1, 12],
    [50000, 5000, 5, 2, 12],
    [50000, 5000, 5, 5, 12],
    [25000, 1000, 10, 1, 6],
    [25000, 1000, 10, 10, 6],
    [10000, 1000, 3, 2, 9],
  ]),
)(
  "db() and calculateDecliningBalanceDepreciation() return identical results",
  (cost, salvage, life, period, month) => {
    const excelResult = db(cost, salvage, life, period, month);
    const modernResult = calculateDecliningBalanceDepreciation({
      cost,
      salvage,
      life,
      period,
      month,
    });

    expect(excelResult).toBe(modernResult);
  },
);
