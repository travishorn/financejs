import { expect, test } from "vitest";
import { calculatePayment } from "../src/payment.js";

test.each(
  /** @type {[number, number, number, number | undefined, "end" | "beginning" | undefined, number][]} */ ([
    [0.08 / 12, 10, 10000, undefined, undefined, -1037.0320893591638],
    [0.006875, 60, -150000, 0, "end", 3059.4377497971213],
    [0.025 / 12, 180, -55555, 1000, "end", 365.8501863081711],
    [0.0275, 10, -25566, 500, "end", 2914.881833329675],
    [0.22, 1, -15000, undefined, undefined, 18300.0],
    [0, 10, -10000, undefined, undefined, 1000],
  ]),
)(
  "calculatePayment() matches Excel to 8 decimal places",
  (rate, periods, presentValue, futureValue, timing, expected) => {
    expect(
      calculatePayment({
        rate,
        periods,
        presentValue,
        futureValue,
        timing,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test("calculatePayment() defaults futureValue to 0 and timing to 'end'", () => {
  expect(
    calculatePayment({ rate: 0.08 / 12, periods: 10, presentValue: 10000 }),
  ).toBe(
    calculatePayment({
      rate: 0.08 / 12,
      periods: 10,
      presentValue: 10000,
      futureValue: 0,
      timing: "end",
    }),
  );
});

test("calculatePayment() returns 0 for zero interest rate", () => {
  expect(
    calculatePayment({
      rate: 0,
      periods: 10,
      presentValue: -10000,
    }),
  ).toBe(1000);
});

test("calculatePayment() returns 0 for zero interest rate with future value", () => {
  expect(
    calculatePayment({
      rate: 0,
      periods: 10,
      presentValue: -10000,
      futureValue: 5000,
    }),
  ).toBe(500);
});

test("calculatePayment() handles 'beginning' timing", () => {
  expect(
    calculatePayment({
      rate: 0.006875,
      periods: 60,
      presentValue: -150000,
      timing: "beginning",
    }),
  ).toBeCloseTo(3038.547734125, 8);
});

test("calculatePayment() handles 'end' timing", () => {
  expect(
    calculatePayment({
      rate: 0.006875,
      periods: 60,
      presentValue: -150000,
      timing: "end",
    }),
  ).toBeCloseTo(3059.4377497971213, 8);
});

test("calculatePayment() returns +0 for zero-valued result", () => {
  const result = calculatePayment({
    rate: 0.05,
    periods: 10,
    presentValue: 0,
    futureValue: 0,
  });

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
