import { expect, test } from "vitest";
import { calculateCumulativeInterest } from "../src/cumulative-interest.js";

test.each(
  /** @type {[number, number, number, number, number, "end" | "beginning", number][]} */ ([
    [0.09 / 12, 30 * 12, 125000, 13, 24, "end", -11135.232130750845],
    [0.09 / 12, 30 * 12, 125000, 1, 1, "end", -937.5],
    [0.05, 10, 10000, 1, 10, "end", -2950.45749654567],
    [0.05, 10, 10000, 1, 5, "end", -2082.099108801883],
    [0.05, 10, 10000, 6, 10, "end", -868.3583877437869],
    [0.07 / 12, 12, 5000, 1, 12, "end", -191.60476588828374],
    [0.07 / 12, 12, 5000, 1, 6, "end", -139.42084606271757],
    [0.07 / 12, 12, 5000, 7, 12, "end", -52.18391982556619],
    [0.09 / 12, 30 * 12, 125000, 1, 12, "beginning", -10201.33288449],
    [0.09 / 12, 30 * 12, 125000, 13, 24, "beginning", -11052.33958387],
  ]),
)(
  "calculateCumulativeInterest() matches Excel to 8 decimal places",
  (rate, periods, presentValue, startPeriod, endPeriod, timing, expected) => {
    expect(
      calculateCumulativeInterest({
        rate,
        periods,
        presentValue,
        startPeriod,
        endPeriod,
        timing,
      }),
    ).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number, number, number, number, "end" | "beginning"][]} */ ([
    // rate/periods/presentValue validation
    [0, 360, 125000, 1, 12, "end"],
    // start/end period validation
    [0.09 / 12, 360, 125000, 13, 12, "end"],
  ]),
)(
  "calculateCumulativeInterest() throws RangeError for invalid inputs",
  (rate, periods, presentValue, startPeriod, endPeriod, timing) => {
    expect(() =>
      calculateCumulativeInterest({
        rate,
        periods,
        presentValue,
        startPeriod,
        endPeriod,
        timing,
      }),
    ).toThrow(RangeError);
  },
);

test("calculateCumulativeInterest() defaults timing to 'end'", () => {
  expect(
    calculateCumulativeInterest({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 13,
      endPeriod: 24,
    }),
  ).toBe(
    calculateCumulativeInterest({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 13,
      endPeriod: 24,
      timing: "end",
    }),
  );
});

test("calculateCumulativeInterest() handles 'beginning' timing", () => {
  expect(
    calculateCumulativeInterest({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 1,
      endPeriod: 12,
      timing: "beginning",
    }),
  ).toBeCloseTo(-10201.33288449, 8);
});

test("calculateCumulativeInterest() handles 'end' timing", () => {
  expect(
    calculateCumulativeInterest({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 13,
      endPeriod: 24,
      timing: "end",
    }),
  ).toBeCloseTo(-11135.232130750845, 8);
});
