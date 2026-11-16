import { expect, test } from "vitest";
import { calculateNominalRate } from "../src/nominal-rate.js";

test.each(
  /** @type {[number, number, number][]} */ ([
    [0.053543, 4, 0.05250032],
    [0.05, 1, 0.05],
    [0.05094533691406222, 4, 0.05],
    [0.0511619, 12, 0.05],
    [0.1, 2, 0.0976176963],
    [0.10381289, 4, 0.1],
    [0.10471306744155207, 12, 0.1],
    [0.071225, 2, 0.06999999999999999],
    [0.0722900808562359, 12, 0.07],
    [0.15, 2, 0.14476105895272173],
  ]),
)(
  "calculateNominalRate() matches Excel to 8 decimal places",
  (effectiveRate, periodsPerYear, expected) => {
    expect(calculateNominalRate({ effectiveRate, periodsPerYear })).toBeCloseTo(
      expected,
      8,
    );
  },
);

test("calculateNominalRate() throws TypeError for non-numeric input", () => {
  expect(() =>
    calculateNominalRate({
      // @ts-expect-error
      effectiveRate: "foo",
      periodsPerYear: 4,
    }),
  ).toThrow(TypeError);
  expect(() =>
    calculateNominalRate({
      effectiveRate: 0.05,
      // @ts-expect-error
      periodsPerYear: "bar",
    }),
  ).toThrow(TypeError);
  expect(() =>
    calculateNominalRate({ effectiveRate: NaN, periodsPerYear: 4 }),
  ).toThrow(TypeError);
  expect(() =>
    calculateNominalRate({ effectiveRate: 0.05, periodsPerYear: NaN }),
  ).toThrow(TypeError);
});

test("calculateNominalRate() throws RangeError for effectiveRate <= 0", () => {
  expect(() =>
    calculateNominalRate({ effectiveRate: 0, periodsPerYear: 4 }),
  ).toThrow(RangeError);
  expect(() =>
    calculateNominalRate({ effectiveRate: -0.01, periodsPerYear: 4 }),
  ).toThrow(RangeError);
});

test("calculateNominalRate() throws RangeError for periodsPerYear < 1", () => {
  expect(() =>
    calculateNominalRate({ effectiveRate: 0.05, periodsPerYear: 0 }),
  ).toThrow(RangeError);
  expect(() =>
    calculateNominalRate({ effectiveRate: 0.05, periodsPerYear: -2 }),
  ).toThrow(RangeError);
});
