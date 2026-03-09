import { expect, test } from "vitest";
import { dollarde } from "../src/dollarde.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [1.02, 16, 1.125],
    [1.1, 32, 1.3125],
    [2.08, 8, 2.1],
    [0.25, 4, 0.625],
    [3.5, 16, 6.125],
    [10.99, 100, 10.99],
    [0, 16, 0],
    [5.0, 8, 5],
    [7.75, 4, 8.875],
    [1.99, 16, 7.1875],
    [-2.25, 8, -2.3125],
  ]),
)(
  "dollarde() matches Excel to 8 decimal places",
  (fractionalDollar, fraction, expected) => {
    expect(dollarde(fractionalDollar, fraction)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[any, any][]} */ ([
    [1.02, -1],
    [1.02, 0.5],
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
  "dollarde() throws RangeError for invalid inputs",
  (fractionalDollar, fraction) => {
    expect(() => dollarde(fractionalDollar, fraction)).toThrow(RangeError);
  },
);
