import { expect, test } from "vitest";
import { calculateRate } from "../src/rate.js";

test.each(
  /** @type {[number, number, number, number | undefined, "end" | "beginning" | undefined, number | undefined, number][]} */ ([
    [48, -200, 8000, undefined, undefined, undefined, 0.007701472488210084],
    [60, 500, -25000, undefined, undefined, undefined, 0.006183413161254411],
    [312, 5113, -1501935, 2368, "end", 0.198, 0.00039826689551428196],
    [276, 1991, -446386, 3135, "beginning", 0.047, 0.0016051131093570657],
    [223, 13549, -2888300, 1933, "beginning", 0.092, 0.00041475010529662],
    [33, 5147, -146194, 1578, "end", 0.002, 0.00957576368703414],
    [4, 1727, -5869, 2511, "end", 0.05, 0.185406220575096],
    [2, 24990, -44133, 5111, "beginning", 0.181, 0.485204835437238],
    [10, 1000, -10000, 0, "end", 0, 0],
    [213, 5529, -967194, undefined, undefined, undefined, 0.00190596968998648],
  ]),
)(
  "calculateRate() matches Excel to 8 decimal places",
  (periods, payment, presentValue, futureValue, timing, guess, expected) => {
    expect(
      calculateRate({
        periods,
        payment,
        presentValue,
        futureValue,
        timing,
        guess,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number | undefined, "end" | "beginning" | undefined, number | undefined][]} */ ([
    [-1, 333, -1000, 22, undefined, undefined],
    [1, 0, 0, 0, "end", 0.1],
    [39, 21597, 4605776, undefined, "end", 0.11296164981663548],
  ]),
)(
  "calculateRate() throws RangeError for invalid inputs",
  (periods, payment, presentValue, futureValue, timing, guess) => {
    expect(() =>
      calculateRate({
        periods,
        payment,
        presentValue,
        futureValue,
        timing,
        guess,
      }),
    ).toThrow(RangeError);
  },
);

test("calculateRate() defaults futureValue to 0, timing to 'end', and guess to 0.1", () => {
  expect(
    calculateRate({ periods: 60, payment: 500, presentValue: -25000 }),
  ).toBe(
    calculateRate({
      periods: 60,
      payment: 500,
      presentValue: -25000,
      futureValue: 0,
      timing: "end",
      guess: 0.1,
    }),
  );
});

test("calculateRate() handles 'beginning' timing", () => {
  expect(
    calculateRate({
      periods: 60,
      payment: 500,
      presentValue: -25000,
      timing: "beginning",
    }),
  ).toBeCloseTo(0.006407985777784159, 8);
});

test("calculateRate() handles 'end' timing", () => {
  expect(
    calculateRate({
      periods: 60,
      payment: 500,
      presentValue: -25000,
      timing: "end",
    }),
  ).toBeCloseTo(0.006183413161254411, 8);
});

test("calculateRate() returns +0 for zero-valued solution", () => {
  const result = calculateRate({
    periods: 10,
    payment: -100,
    presentValue: 1000,
    guess: -0,
  });

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
