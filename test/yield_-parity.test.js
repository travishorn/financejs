import { expect, test } from "vitest";
import { calculateBondYield } from "../src/bond-yield.js";
import { yield_ } from "../src/excel/yield_.js";

test.each(
  /** @type {[Date, Date, number, number, number, 1|2|4, 0|1|2|3|4 | undefined][]} */ ([
    [
      new Date("2008-02-15"),
      new Date("2016-11-15"),
      0.0575,
      95.04287,
      100,
      2,
      0,
    ],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 98.5, 100, 1, 0],
    [new Date("2022-06-15"), new Date("2032-06-15"), 0.045, 102.25, 100, 2, 1],
    [new Date("2021-03-31"), new Date("2026-03-31"), 0.06, 101.75, 100, 4, 2],
    [new Date("2019-09-01"), new Date("2029-09-01"), 0.035, 99.1, 100, 2, 3],
    [new Date("2018-12-15"), new Date("2023-12-15"), 0.055, 97.8, 100, 4, 4],
    [new Date("2025-01-01"), new Date("2025-07-01"), 0.04, 99.5, 100, 2, 0],
    [new Date("2023-05-10"), new Date("2033-05-10"), 0.09, 85.0, 100, 1, 0],
    [new Date("2024-08-20"), new Date("2034-08-20"), 0.02, 110.0, 100, 2, 1],
    [new Date("2022-11-30"), new Date("2027-11-30"), 0.05, 99.0, 105, 2, 0],
    [new Date("2026-01-01"), new Date("2026-04-01"), 0.03, 99.8, 100, 4, 2],
  ]),
)(
  "yield_() and calculateBondYield() return identical results",
  (settlement, maturity, rate, pr, redemption, frequency, basis) => {
    const excelResult = yield_(
      settlement,
      maturity,
      rate,
      pr,
      redemption,
      frequency,
      basis,
    );
    const modernResult = calculateBondYield({
      settlement,
      maturity,
      rate,
      price: pr,
      redemption,
      frequency,
      basis,
    });

    expect(excelResult).toBe(modernResult);
  },
);
