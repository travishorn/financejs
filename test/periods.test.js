import { expect, test } from "vitest";
import { calculatePeriods } from "../src/periods.js";

test.each(
  /** @type {[number, number, number, number | undefined, "end" | "beginning" | undefined, number][]} */ ([
    [0.00166666666666667, 500, -25000, undefined, undefined, 52.2503198074182],
    [0.0025, 564, -25000, undefined, undefined, 47.0389585221301],
    [0.0075, 5848, -50000, 564654, "beginning", -160.977634983543],
    [0.00833333333333333, 313, -33000, 0, "beginning", 247.087289465708],
    [0.05, 2500, -15330, 456, "beginning", 6.89867591269445],
    [0.00916666666666667, 1654, -13546, undefined, undefined, 8.55253223758902],
    [0.0158333333333333, 515615, -854893, 0, "beginning", 1.66668098571988],
    [0.0225, 6566, -551321, 9654564, "beginning", 162.27277971901],
    [0.015, 6468, -56544, undefined, undefined, 9.44102400572401],
    [0.00333333333333333, 1566, -65448, 546, undefined, 44.7319121056356],
    [0, 500, -10000, 0, undefined, 20],
  ]),
)(
  "calculatePeriods() matches Excel to 8 decimal places",
  (rate, payment, presentValue, futureValue, timing, expected) => {
    expect(
      calculatePeriods({
        rate,
        payment,
        presentValue,
        futureValue,
        timing,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number | undefined, "end" | "beginning" | undefined][]} */ ([
    [0.025, 0, -2344, undefined, undefined],
    [0, 0, -2000, undefined, undefined],
  ]),
)(
  "calculatePeriods() throws RangeError for invalid inputs",
  (rate, payment, presentValue, futureValue, timing) => {
    expect(() =>
      calculatePeriods({
        rate,
        payment,
        presentValue,
        futureValue,
        timing,
      }),
    ).toThrow(RangeError);
  },
);

test("calculatePeriods() defaults futureValue to 0 and timing to 'end'", () => {
  expect(
    calculatePeriods({
      rate: 0.00166666666666667,
      payment: 500,
      presentValue: -25000,
    }),
  ).toBe(
    calculatePeriods({
      rate: 0.00166666666666667,
      payment: 500,
      presentValue: -25000,
      futureValue: 0,
      timing: "end",
    }),
  );
});

test("calculatePeriods() handles 'beginning' timing", () => {
  expect(
    calculatePeriods({
      rate: 0.00833333333333333,
      payment: 313,
      presentValue: -33000,
      timing: "beginning",
    }),
  ).toBeCloseTo(247.087289465708, 8);
});

test("calculatePeriods() handles 'end' timing", () => {
  expect(
    calculatePeriods({
      rate: 0.00166666666666667,
      payment: 500,
      presentValue: -25000,
      timing: "end",
    }),
  ).toBeCloseTo(52.2503198074182, 8);
});

test("calculatePeriods() returns +0 for zero-valued result", () => {
  const result = calculatePeriods({
    rate: 0,
    payment: 100,
    presentValue: 500,
    futureValue: -500,
  });

  expect(result).toBe(0);
  expect(Object.is(result, -0)).toBe(false);
});
