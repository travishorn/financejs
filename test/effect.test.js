import { expect, test } from "vitest";
import { effect } from "../src/effect.js";

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
  "effect() matches Excel to 8 decimal places",
  (nominalRate, npery, expected) => {
    expect(effect(nominalRate, npery)).toBeCloseTo(expected, 8);
  },
);

test("effect() throws TypeError for non-numeric input", () => {
  // @ts-expect-error
  expect(() => effect("foo", 4)).toThrow(TypeError);
  // @ts-expect-error
  expect(() => effect(0.05, "bar")).toThrow(TypeError);
  expect(() => effect(NaN, 4)).toThrow(TypeError);
  expect(() => effect(0.05, NaN)).toThrow(TypeError);
});

test("effect() throws RangeError for nominalRate <= 0", () => {
  expect(() => effect(0, 4)).toThrow(RangeError);
  expect(() => effect(-0.01, 4)).toThrow(RangeError);
});

test("effect() throws RangeError for npery < 1", () => {
  expect(() => effect(0.05, 0)).toThrow(RangeError);
  expect(() => effect(0.05, -2)).toThrow(RangeError);
});
