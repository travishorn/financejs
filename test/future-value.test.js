import { expect, test } from "vitest";
import { calculateFutureValue } from "../src/future-value.js";

test.each(
  /** @type {[number, number, number, number, "end" | "beginning" | undefined, number][]} */ ([
    [0.0525, 8, 6000, -15000, undefined, -35221.9995562398],
    [0.005625, 60, 500, -30000, "beginning", 6237.61889925798],
    [0.11 / 12, 24, 8025, -250000, undefined, 96870.8884079333],
    [0.125, 6, 58, -5000, "beginning", 9600.18907928466],
    [0.07 / 12, 240, 1500, -200000, undefined, 26357.7800581612],
    [0, 10, 500, -10000, undefined, 5000],
  ]),
)(
  "calculateFutureValue() matches Excel to 8 decimal places",
  (rate, periods, payment, presentValue, timing, expected) => {
    expect(
      calculateFutureValue({
        rate,
        periods,
        payment,
        presentValue,
        timing,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test("calculateFutureValue() defaults payment to 0, presentValue to 0, and timing to 'end'", () => {
  expect(
    calculateFutureValue({ rate: 0.05, periods: 10, presentValue: -1000 }),
  ).toBe(
    calculateFutureValue({
      rate: 0.05,
      periods: 10,
      presentValue: -1000,
      payment: 0,
      timing: "end",
    }),
  );
});

test("calculateFutureValue() supports omitted payment when presentValue is provided", () => {
  const rate = 0.05;
  const periods = 10;
  const presentValue = -1000;
  const expected = -presentValue * Math.pow(1 + rate, periods);

  expect(calculateFutureValue({ rate, periods, presentValue })).toBeCloseTo(
    expected,
    8,
  );
});

test("calculateFutureValue() supports omitted presentValue when payment is provided", () => {
  const rate = 0.05;
  const periods = 10;
  const payment = -100;
  const expected = -((payment / rate) * (Math.pow(1 + rate, periods) - 1));

  expect(calculateFutureValue({ rate, periods, payment })).toBeCloseTo(
    expected,
    8,
  );
});

test("calculateFutureValue() returns 0 when both payment and presentValue are omitted or zero", () => {
  expect(calculateFutureValue({ rate: 0.05, periods: 10 })).toBe(0);
  expect(
    calculateFutureValue({
      rate: 0.05,
      periods: 10,
      payment: 0,
      presentValue: 0,
    }),
  ).toBe(0);
});

test("calculateFutureValue() returns 0 for zero interest rate", () => {
  expect(
    calculateFutureValue({
      rate: 0,
      periods: 10,
      payment: 500,
      presentValue: -10000,
    }),
  ).toBe(5000);
});

test("calculateFutureValue() handles 'beginning' timing", () => {
  expect(
    calculateFutureValue({
      rate: 0.005625,
      periods: 60,
      payment: 500,
      presentValue: -30000,
      timing: "beginning",
    }),
  ).toBeCloseTo(6237.61889925798, 8);
});

test("calculateFutureValue() handles 'end' timing", () => {
  expect(
    calculateFutureValue({
      rate: 0.005625,
      periods: 60,
      payment: 500,
      presentValue: -30000,
      timing: "end",
    }),
  ).toBeCloseTo(6437.6763640914, 8);
});

test("calculateFutureValue() returns +0 for zero-valued result", () => {
  const result = calculateFutureValue({
    rate: 0.05,
    periods: 10,
    payment: 0,
    presentValue: 0,
  });

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
