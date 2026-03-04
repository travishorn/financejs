import { expect, test } from "vitest";
import { pmt } from "../src/pmt.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined, number][]} */ ([
    [0.0525, 5, -10000, undefined, undefined, 2325.7331680465],
    [0.006875, 60, -150000, 0, 1, 3038.547734125],
    [0.0275, 10, -25566, 500, undefined, 2914.88183332968],
    [0.025 / 12, 180, -55555, 1000, 1, 365.089583010248],
    [0.22, 1, -15000, undefined, undefined, 18300.0],
    [0, 10, -10000, undefined, undefined, 1000],
  ]),
)(
  "pmt() matches Excel to 8 decimal places",
  (rate, nper, pv, fv, type, expected) => {
    expect(pmt(rate, nper, pv, fv, type)).toBeCloseTo(expected, 8);
  },
);

test("pmt() returns +0 for zero-valued result", () => {
  const result = pmt(0.05, 10, 0, 0);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
