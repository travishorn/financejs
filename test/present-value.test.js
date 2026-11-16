import { expect, test } from "vitest";
import { calculatePresentValue } from "../src/present-value.js";

test.each(
  /** @type {[number, number, number, number | undefined, "end" | "beginning" | undefined, number][]} */ ([
    [0.0525, 5, 6000, undefined, undefined, -25798.316343571],
    [0.0688, 10, 150000, 10000, undefined, -1064546.96972161],
    [0.006875, 60, 3250, 0, "beginning", -160438.486624723],
    [0.11 / 12, 180, 525, 50, undefined, -46200.1919210731],
    [0.010625, 8, 32.5, 0, "beginning", -250.631442440053],
    [0, 10, 500, 1000, undefined, -6000],
  ]),
)(
  "calculatePresentValue() matches Excel to 8 decimal places",
  (rate, periods, payment, futureValue, timing, expected) => {
    expect(
      calculatePresentValue({
        rate,
        periods,
        payment,
        futureValue,
        timing,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test("calculatePresentValue() defaults payment to 0, futureValue to 0, and timing to 'end'", () => {
  expect(
    calculatePresentValue({ rate: 0.0525, periods: 5, payment: 6000 }),
  ).toBe(
    calculatePresentValue({
      rate: 0.0525,
      periods: 5,
      payment: 6000,
      futureValue: 0,
      timing: "end",
    }),
  );
});

test("calculatePresentValue() returns 0 for zero interest rate", () => {
  expect(
    calculatePresentValue({
      rate: 0,
      periods: 10,
      payment: 500,
      futureValue: 1000,
    }),
  ).toBe(-6000);
});

test("calculatePresentValue() handles 'beginning' timing", () => {
  expect(
    calculatePresentValue({
      rate: 0.006875,
      periods: 60,
      payment: 3250,
      timing: "beginning",
    }),
  ).toBeCloseTo(-160438.486624723, 8);
});

test("calculatePresentValue() handles 'end' timing", () => {
  expect(
    calculatePresentValue({
      rate: 0.006875,
      periods: 60,
      payment: 3250,
      timing: "end",
    }),
  ).toBeCloseTo(-159343.00347582728, 8);
});

test("calculatePresentValue() returns +0 for zero-valued result", () => {
  const result = calculatePresentValue({
    rate: 0.05,
    periods: 10,
    payment: 0,
    futureValue: 0,
  });

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
