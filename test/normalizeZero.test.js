import { expect, test } from "vitest";
import { normalizeZero } from "../src/normalizeZero.js";

test("normalizeZero() converts -0 to +0", () => {
  const result = normalizeZero(-0);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});

test("normalizeZero() keeps +0 as +0", () => {
  const result = normalizeZero(0);

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});

test.each([
  1,
  -1,
  123.45,
  -987.65,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  Number.NaN,
])("normalizeZero() leaves non-zero value unchanged: %p", (value) => {
  const result = normalizeZero(value);

  if (Number.isNaN(value)) {
    expect(Number.isNaN(result)).toBe(true);
  } else {
    expect(result).toBe(value);
  }
});
