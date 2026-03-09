import { expect, test } from "vitest";
import { dollarfr } from "../src/dollarfr.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [1.125, 16, 1.02],
    [1.125, 32, 1.04],
    [2.1, 8, 2.08],
    [0.625, 4, 0.25],
    [6.125, 16, 6.02],
    [10.99, 100, 10.99],
    [0, 16, 0],
    [5, 8, 5.0],
    [8.875, 4, 8.35],
    [7.1875, 16, 7.03],
    [-2.3125, 8, -2.25],
  ]),
)(
  "dollarfr() matches Excel to 8 decimal places",
  (fractionalDollar, fraction, expected) => {
    expect(dollarfr(fractionalDollar, fraction)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[any, any][]} */ ([
    [1.02, -1],
    [1.02, 0],
    [1.02, NaN],
    [1.02, Infinity],
    [1.02, -Infinity],
    [1.02, undefined],
    [1.02, null],
    [1.02, "16"],
    [1.02, {}],
    [1.02, []],
  ]),
)(
  "dollarfr() throws RangeError for invalid inputs",
  (fractionalDollar, fraction) => {
    expect(() => dollarfr(fractionalDollar, fraction)).toThrow(RangeError);
  },
);
