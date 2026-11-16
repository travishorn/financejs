import { expect, test } from "vitest";
import { calculateEquivalentRate } from "../src/equivalent-rate.js";

test.each(
  /** @type {[number, number, number, number][]} */ ([
    [96, 10000, 11000, 0.00099331],
    [12, 1000, 2000, 0.05946309],
    [1, 100, 110, 0.1],
    [10, 5000, 10000, 0.07177346],
    [24, 10000, 8000, -0.00925456],
    [60, 15000, 30000, 0.01161944],
    [36, 1000, 1500, 0.01132659],
    [5, 100, 161.051, 0.1],
    [120, 10000, 10000, 0],
    [6, 1000, 500, -0.10910128],
  ]),
)(
  "calculateEquivalentRate() matches Excel to 8 decimal places",
  (periods, presentValue, futureValue, expected) => {
    expect(
      calculateEquivalentRate({ periods, presentValue, futureValue }),
    ).toBeCloseTo(expected, 8);
  },
);

test("calculateEquivalentRate() throws RangeError for periods <= 0", () => {
  expect(() =>
    calculateEquivalentRate({
      periods: 0,
      presentValue: 1000,
      futureValue: 2000,
    }),
  ).toThrow(RangeError);
  expect(() =>
    calculateEquivalentRate({
      periods: -5,
      presentValue: 1000,
      futureValue: 2000,
    }),
  ).toThrow(RangeError);
});

test("calculateEquivalentRate() throws RangeError for presentValue === 0", () => {
  expect(() =>
    calculateEquivalentRate({
      periods: 10,
      presentValue: 0,
      futureValue: 2000,
    }),
  ).toThrow(RangeError);
});
