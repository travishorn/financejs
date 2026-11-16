import { expect, test } from "vitest";
import { calculateDollarFraction } from "../src/dollar-fraction.js";
import { dollarfr } from "../src/excel/dollarfr.js";

test.each(
  /** @type {[number, number][]} */ ([
    [1.125, 16],
    [1.125, 32],
    [2.1, 8],
    [0.625, 4],
    [6.125, 16],
    [10.99, 100],
    [0, 16],
    [5, 8],
    [8.875, 4],
    [7.1875, 16],
    [-2.3125, 8],
  ]),
)(
  "dollarfr() and calculateDollarFraction() return identical results",
  (decimalDollar, fraction) => {
    const excelResult = dollarfr(decimalDollar, fraction);
    const modernResult = calculateDollarFraction({
      decimalDollar,
      fraction,
    });

    expect(excelResult).toBe(modernResult);
  },
);
