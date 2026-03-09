import { expect, test } from "vitest";
import { ispmt } from "../src/ispmt.js";

test.each(
  /** @type {[number, number, number, number, number][]} */ ([
    [0.1, 0, 4, 4000, -400],
    [0.1, 1, 4, 4000, -300],
    [0.05, 2, 6, 1200, -40],
    [0.07, 3, 5, 10000, -280],
    [0.12, 0, 12, 12000, -1440],
    [0.12, 11, 12, 12000, -120],
    [0.08, 5, 10, 5000, -200],
    [0.09, 4, 8, 8000, -360],
    [0.06, 0, 1, 1000, -60],
    [0.06, 0, 10, 0, 0],
  ]),
)(
  "ispmt() matches Excel to 8 decimal places",
  (rate, per, nper, pv, expected) => {
    expect(ispmt(rate, per, nper, pv)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number][]} */ ([
    [NaN, 0, 4, 4000],
    [0.1, NaN, 4, 4000],
    [0.1, 0, NaN, 4000],
    [0.1, 0, 4, NaN],
    [Infinity, 0, 4, 4000],
    [0.1, Infinity, 4, 4000],
    [0.1, 0, Infinity, 4000],
    [0.1, 0, 4, Infinity],
    [0.1, -1, 4, 4000],
    [0.1, 4, 4, 4000],
    [0.1, 0, 0, 4000],
    [0.1, 0, -2, 4000],
    [0.1, 0, 4, undefined],
    [undefined, 0, 4, 4000],
    [0.1, undefined, 4, 4000],
    [0.1, 0, undefined, 4000],
    [0.1, 0, 4, null],
    [null, 0, 4, 4000],
    [0.1, null, 4, 4000],
    [0.1, 0, null, 4000],
  ]),
)("ispmt() throws RangeError for invalid inputs", (rate, per, nper, pv) => {
  expect(() => ispmt(rate, per, nper, pv)).toThrow(RangeError);
});
