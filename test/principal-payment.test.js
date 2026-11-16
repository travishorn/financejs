import { expect, test } from "vitest";
import { calculatePrincipalPayment } from "../src/principal-payment.js";

test.each(
  /** @type {[number, number, number, number, number | undefined, "end" | "beginning" | undefined, number][]} */ ([
    [0.02, 5, 5, -608926, 37115, "end", 118935.787736457],
    [0.0025, 9, 24, -62088, 16679, "end", 1875.2988823337],
    [0.0075, 1, 36, -303575, 0, "beginning", 9581.74078634391],
    [
      0.0083333333333333,
      56,
      240,
      -244184,
      40099,
      "beginning",
      420.708247831785,
    ],
    [0.05, 4, 8, -204252, 4793, "beginning", 23028.6983173609],
    [0.00916666666666667, 10, 60, -276452, 0, "end", 3774.15668897321],
    [0.0158333333333333, 98, 180, -740363, 1255, "beginning", 3324.09497421923],
    [0.0225, 4, 16, -324779, 0, "beginning", 17866.4226038686],
    [0.015, 36, 48, -518630, 39718, "end", 11592.444876619],
    [0.00333333333333333, 244, 360, -490152, 36758, "end", 1466.48935600409],
  ]),
)(
  "calculatePrincipalPayment() matches Excel to 8 decimal places",
  (rate, period, periods, presentValue, futureValue, timing, expected) => {
    expect(
      calculatePrincipalPayment({
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
  "calculatePrincipalPayment() throws RangeError for invalid inputs",
  (rate, period, periods, presentValue, futureValue, timing) => {
    expect(() =>
      calculatePrincipalPayment({
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

test("calculatePrincipalPayment() defaults futureValue to 0 and timing to 'end'", () => {
  expect(
    calculatePrincipalPayment({
      rate: 0.1 / 12,
      period: 1,
      periods: 2 * 12,
      presentValue: 2000,
    }),
  ).toBe(
    calculatePrincipalPayment({
      rate: 0.1 / 12,
      period: 1,
      periods: 2 * 12,
      presentValue: 2000,
      futureValue: 0,
      timing: "end",
    }),
  );
});

test("calculatePrincipalPayment() handles 'beginning' timing", () => {
  expect(
    calculatePrincipalPayment({
      rate: 0.05,
      period: 4,
      periods: 8,
      presentValue: -204252,
      futureValue: 4793,
      timing: "beginning",
    }),
  ).toBeCloseTo(23028.6983173609, 8);
});

test("calculatePrincipalPayment() handles 'end' timing", () => {
  expect(
    calculatePrincipalPayment({
      rate: 0.02,
      period: 5,
      periods: 5,
      presentValue: -608926,
      futureValue: 37115,
      timing: "end",
    }),
  ).toBeCloseTo(118935.787736457, 8);
});

test("calculatePrincipalPayment() returns +0 for zero-valued result", () => {
  const result = calculatePrincipalPayment({
    rate: 0.05,
    period: 1,
    periods: 10,
    presentValue: 0,
    futureValue: 0,
    timing: "beginning",
  });

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
