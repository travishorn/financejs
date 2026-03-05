import { expect, test } from "vitest";
import { nominal } from "../src/nominal.js";

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
  "nominal() matches Excel to 8 decimal places",
  (nominalRate, npery, expected) => {
    expect(nominal(nominalRate, npery)).toBeCloseTo(expected, 8);
  },
);

test("nominal() throws TypeError for non-numeric input", () => {
  // @ts-expect-error
  expect(() => nominal("foo", 4)).toThrow(TypeError);
  // @ts-expect-error
  expect(() => nominal(0.05, "bar")).toThrow(TypeError);
  expect(() => nominal(NaN, 4)).toThrow(TypeError);
  expect(() => nominal(0.05, NaN)).toThrow(TypeError);
});

test("nominal() throws RangeError for effectRate <= 0", () => {
  expect(() => nominal(0, 4)).toThrow(RangeError);
  expect(() => nominal(-0.01, 4)).toThrow(RangeError);
});

test("nominal() throws RangeError for npery < 1", () => {
  expect(() => nominal(0.05, 0)).toThrow(RangeError);
  expect(() => nominal(0.05, -2)).toThrow(RangeError);
});
