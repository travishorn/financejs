import { expect, test } from "vitest";
import { nper } from "../src/nper.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined, number][]} */ ([
    [0.00166666666666667, 500, -25000, undefined, undefined, 52.2503198074182],
    [0.0025, 564, -25000, undefined, undefined, 47.0389585221301],
    [0.0075, 5848, -50000, 564654, 1, -160.977634983543],
    [0.00833333333333333, 313, -33000, 0, 1, 247.087289465708],
    [0.05, 2500, -15330, 456, 1, 6.89867591269445],
    [0.00916666666666667, 1654, -13546, undefined, undefined, 8.55253223758902],
    [0.0158333333333333, 515615, -854893, 0, 1, 1.66668098571988],
    [0.0225, 6566, -551321, 9654564, 1, 162.27277971901],
    [0.015, 6468, -56544, undefined, undefined, 9.44102400572401],
    [0.00333333333333333, 1566, -65448, 546, undefined, 44.7319121056356],
    [0, 500, -10000, 0, undefined, 20],
  ]),
)(
  "nper() matches Excel to 8 decimal places",
  (rate, pmt, pv, fv, type, expected) => {
    expect(nper(rate, pmt, pv, fv, type)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined][]} */ ([
    [0.025, 0, -2344, undefined, undefined],
    [0, 0, -2000, undefined, undefined],
  ]),
)("nper() throws RangeError for invalid inputs", (rate, pmt, pv, fv, type) => {
  expect(() => nper(rate, pmt, pv, fv, type)).toThrow(RangeError);
});

test("nper() returns +0 for zero-valued result", () => {
  const result = nper(0, 100, 500, -500);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
