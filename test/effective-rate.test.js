import { expect, test } from "vitest";
import { calculateEffectiveRate } from "../src/effective-rate.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [0.0525, 4, 0.05354267],
    [0.05, 1, 0.05],
    [0.05, 2, 0.050625],
    [0.05, 4, 0.05094533691406222],
    [0.05, 12, 0.0511619],
    [0.1, 2, 0.1025],
    [0.1, 4, 0.10381289],
    [0.1, 12, 0.10471307],
    [0.07, 2, 0.071225],
    [0.07, 12, 0.0722900808562359],
  ]),
)(
  "calculateEffectiveRate() matches Excel to 8 decimal places",
  (nominalRate, periodsPerYear, expected) => {
    expect(calculateEffectiveRate({ nominalRate, periodsPerYear })).toBeCloseTo(
      expected,
      8,
    );
  },
);

test("calculateEffectiveRate() throws TypeError for non-numeric input", () => {
  expect(() =>
    calculateEffectiveRate({
      // @ts-expect-error
      nominalRate: "foo",
      periodsPerYear: 4,
    }),
  ).toThrow(TypeError);
  expect(() =>
    calculateEffectiveRate({
      nominalRate: 0.05,
      // @ts-expect-error
      periodsPerYear: "bar",
    }),
  ).toThrow(TypeError);
  expect(() =>
    calculateEffectiveRate({ nominalRate: NaN, periodsPerYear: 4 }),
  ).toThrow(TypeError);
  expect(() =>
    calculateEffectiveRate({ nominalRate: 0.05, periodsPerYear: NaN }),
  ).toThrow(TypeError);
});

test("calculateEffectiveRate() throws RangeError for nominalRate <= 0", () => {
  expect(() =>
    calculateEffectiveRate({ nominalRate: 0, periodsPerYear: 4 }),
  ).toThrow(RangeError);
  expect(() =>
    calculateEffectiveRate({ nominalRate: -0.01, periodsPerYear: 4 }),
  ).toThrow(RangeError);
});

test("calculateEffectiveRate() throws RangeError for periodsPerYear < 1", () => {
  expect(() =>
    calculateEffectiveRate({ nominalRate: 0.05, periodsPerYear: 0 }),
  ).toThrow(RangeError);
  expect(() =>
    calculateEffectiveRate({ nominalRate: 0.05, periodsPerYear: -2 }),
  ).toThrow(RangeError);
});
