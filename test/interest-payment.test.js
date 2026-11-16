import { expect, test } from "vitest";
import { calculateInterestPayment } from "../src/interest-payment.js";

test.each(
  /** @type {[number, number, number, number, number | undefined, "end" | "beginning" | undefined, number][]} */ ([
    [0.02, 5, 5, -608926, 37115, "end", 3121.01575472915],
    [0.0025, 9, 24, -62088, 16679, "end", 118.13247244596],
    [0.0075, 1, 36, -303575, 0, "beginning", 0],
    [
      0.0083333333333333,
      56,
      240,
      -244184,
      40099,
      "beginning",
      1863.87630524189,
    ],
    [0.05, 4, 8, -204252, 4793, "beginning", 6590.64284869969],
    [0.00916666666666667, 10, 60, -276452, 0, "end", 2236.57965430518],
    [0.0158333333333333, 98, 180, -740363, 1255, "beginning", 8939.86781612986],
    [0.0225, 4, 16, -324779, 0, "beginning", 5993.04338111598],
    [0.015, 36, 48, -518630, 39718, "end", 3071.36493572514],
    [0.00333333333333333, 244, 360, -490152, 36758, "end", 820.609615385237],
  ]),
)(
  "calculateInterestPayment() matches Excel to 8 decimal places",
  (rate, period, periods, presentValue, futureValue, timing, expected) => {
    expect(
      calculateInterestPayment({
        rate,
        period,
        periods,
        presentValue,
        futureValue,
        timing,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number, number | undefined, "end" | "beginning" | undefined][]} */ ([
    [0.0525, 0, 24, -10000, undefined, undefined],
    [0.0525, 25, 24, -10000, undefined, undefined],
  ]),
)(
  "calculateInterestPayment() throws RangeError for invalid inputs",
  (rate, period, periods, presentValue, futureValue, timing) => {
    expect(() =>
      calculateInterestPayment({
        rate,
        period,
        periods,
        presentValue,
        futureValue,
        timing,
      }),
    ).toThrow(RangeError);
  },
);

test("calculateInterestPayment() defaults futureValue to 0 and timing to 'end'", () => {
  expect(
    calculateInterestPayment({
      rate: 0.1 / 12,
      period: 1,
      periods: 3,
      presentValue: 8000,
    }),
  ).toBe(
    calculateInterestPayment({
      rate: 0.1 / 12,
      period: 1,
      periods: 3,
      presentValue: 8000,
      futureValue: 0,
      timing: "end",
    }),
  );
});

test("calculateInterestPayment() returns 0 for first period with 'beginning' timing", () => {
  expect(
    calculateInterestPayment({
      rate: 0.0075,
      period: 1,
      periods: 36,
      presentValue: -303575,
      timing: "beginning",
    }),
  ).toBe(0);
});

test("calculateInterestPayment() handles 'beginning' timing", () => {
  expect(
    calculateInterestPayment({
      rate: 0.05,
      period: 4,
      periods: 8,
      presentValue: -204252,
      futureValue: 4793,
      timing: "beginning",
    }),
  ).toBeCloseTo(6590.64284869969, 8);
});

test("calculateInterestPayment() handles 'end' timing", () => {
  expect(
    calculateInterestPayment({
      rate: 0.02,
      period: 5,
      periods: 5,
      presentValue: -608926,
      futureValue: 37115,
      timing: "end",
    }),
  ).toBeCloseTo(3121.01575472915, 8);
});
