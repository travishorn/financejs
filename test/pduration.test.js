import { expect, test } from "vitest";
import { pduration } from "../src/pduration.js";

test.each(
  /** @type {[number, number, number, number][]} */ ([
    [0.025, 2000, 2200, 3.85986616],
    [0.025 / 12, 1000, 1200, 87.60547642],
    [0.05, 1000, 2000, 14.20669908],
    [0.01, 5000, 10000, 69.66071689],
    [0.1, 100, 110, 1],
    [0.03, 10000, 8000, -7.54914051],
    [0.025, 15000, 30000, 28.07103453],
    [0.02, 1000, 1500, 20.47531886],
    [0.05, 100, 100, 0],
    [0.08, 1000, 500, -9.00646834],
  ]),
)("pduration() matches Excel to 8 decimal places", (nper, pv, fv, expected) => {
  expect(pduration(nper, pv, fv)).toBeCloseTo(expected, 8);
});

test("pduration() throws RangeError for rate <= 0", () => {
  expect(() => pduration(0, 1000, 2000)).toThrow(RangeError);
  expect(() => pduration(-0.01, 1000, 2000)).toThrow(RangeError);
});

test("pduration() throws RangeError for pv === 0", () => {
  expect(() => pduration(0.025, 0, 2000)).toThrow(RangeError);
});
