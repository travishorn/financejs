import { expect, test } from "vitest";
import { pv } from "../src/pv.js";

test.each(
  /** @type {[number, number, number, number | undefined, 0 | 1 | undefined, number][]} */ ([
    [0.0525, 5, 6000, undefined, undefined, -25798.316343571],
    [0.0688, 10, 150000, 10000, undefined, -1064546.96972161],
    [0.006875, 60, 3250, 0, 1, -160438.486624723],
    [0.11 / 12, 180, 525, 50, undefined, -46200.1919210731],
    [0.010625, 8, 32.5, 0, 1, -250.631442440053],
    [0, 10, 500, 1000, undefined, -6000],
  ]),
)(
  "pv() matches Excel to 8 decimal places",
  (rate, nper, pmt, fv, type, expected) => {
    expect(pv(rate, nper, pmt, fv, type)).toBeCloseTo(expected, 8);
  },
);

test("pv() returns +0 for zero-valued result", () => {
  const result = pv(0.05, 10, 0, 0);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
