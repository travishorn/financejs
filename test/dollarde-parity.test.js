import { expect, test } from "vitest";
import { calculateDollarDecimal } from "../src/dollar-decimal.js";
import { dollarde } from "../src/excel/dollarde.js";

test.each(
  /** @type {[number, number][]} */ ([
    [1.02, 16],
    [1.1, 32],
    [2.08, 8],
    [0.25, 4],
    [3.5, 16],
    [10.99, 100],
    [0, 16],
    [5.0, 8],
    [7.75, 4],
    [1.99, 16],
    [-2.25, 8],
  ]),
)(
  "dollarde() and calculateDollarDecimal() return identical results",
  (fractionalDollar, fraction) => {
    const excelResult = dollarde(fractionalDollar, fraction);
    const modernResult = calculateDollarDecimal({
      fractionalDollar,
      fraction,
    });

    expect(excelResult).toBe(modernResult);
  },
);
