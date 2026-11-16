import { expect, test } from "vitest";
import { calculateBondPrice } from "../src/bond-price.js";
import { price } from "../src/excel/price.js";

test.each(
  /** @type {[Date, Date, number, number, number, 1|2|4, 0|1|2|3|4 | undefined][]} */ ([
    [new Date("2008-02-15"), new Date("2017-11-15"), 0.0575, 0.065, 100, 2, 0],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 100, 1, 0],
    [new Date("2022-06-15"), new Date("2032-06-15"), 0.045, 0.04, 100, 2, 1],
    [new Date("2021-03-31"), new Date("2026-03-31"), 0.06, 0.055, 100, 4, 2],
    [new Date("2019-09-01"), new Date("2029-09-01"), 0.035, 0.037, 100, 2, 3],
    [new Date("2018-12-15"), new Date("2023-12-15"), 0.055, 0.06, 100, 4, 4],
    [new Date("2025-01-01"), new Date("2025-07-01"), 0.04, 0.05, 100, 2, 0],
    [new Date("2023-05-10"), new Date("2033-05-10"), 0.09, 0.12, 100, 1, 0],
    [new Date("2024-08-20"), new Date("2034-08-20"), 0.02, 0.01, 100, 2, 1],
    [new Date("2022-11-30"), new Date("2027-11-30"), 0.05, 0.06, 105, 2, 0],
    [
      new Date("2008-02-15"),
      new Date("2017-11-15"),
      0.0575,
      0.065,
      100,
      2,
      undefined,
    ],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 100, 2, 0],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 100, 2, 1],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 100, 2, 2],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 100, 2, 3],
    [new Date("2020-01-01"), new Date("2030-01-01"), 0.05, 0.06, 100, 2, 4],
    [
      new Date("2008-02-15"),
      new Date("2017-11-15"),
      0.0575,
      0.065,
      100,
      2,
      null,
    ],
  ]),
)(
  "price() and calculateBondPrice() return identical results",
  (settlement, maturity, rate, yld, redemption, frequency, basis) => {
    const excelResult = price(
      settlement,
      maturity,
      rate,
      yld,
      redemption,
      frequency,
      basis,
    );
    const modernResult = calculateBondPrice({
      settlement,
      maturity,
      rate,
      yield: yld,
      redemption,
      frequency,
      basis,
    });

    expect(excelResult).toBe(modernResult);
  },
);
