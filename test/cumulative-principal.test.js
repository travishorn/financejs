import { expect, test } from "vitest";
import { calculateCumulativePrincipal } from "../src/cumulative-principal.js";

test.each(
  /** @type {[number, number, number, number, number, "end" | "beginning", number][]} */ ([
    [0.09 / 12, 30 * 12, 125000, 13, 24, "end", -934.10712342],
    [0.05 / 12, 15 * 12, 200000, 1, 12, "end", -9187.701756554046],
    [0.07 / 12, 20 * 12, 150000, 25, 36, "end", -4102.996708754445],
    [0.04 / 12, 10 * 12, 100000, 1, 120, "end", -99999.9999999977],
    [0.06 / 12, 25 * 12, 300000, 100, 120, "end", -15664.259628339847],
    [0.08 / 12, 30 * 12, 250000, 13, 24, "beginning", -2246.7684918774785],
    [0.09 / 12, 30 * 12, 125000, 1, 12, "beginning", -1778.1601717552392],
    [0.05 / 12, 15 * 12, 200000, 13, 24, "beginning", -9617.688314281184],
    [0.07 / 12, 20 * 12, 150000, 1, 12, "end", -3568.425148501108],
    [0.04 / 12, 10 * 12, 100000, 13, 24, "beginning", -8609.970211961809],
  ]),
)(
  "calculateCumulativePrincipal() matches Excel to 8 decimal places",
  (rate, periods, presentValue, startPeriod, endPeriod, timing, expected) => {
    expect(
      calculateCumulativePrincipal({
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
  "calculateCumulativePrincipal() throws RangeError for invalid inputs",
  (rate, periods, presentValue, startPeriod, endPeriod, timing) => {
    expect(() =>
      calculateCumulativePrincipal({
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

test("calculateCumulativePrincipal() defaults timing to 'end'", () => {
  expect(
    calculateCumulativePrincipal({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 13,
      endPeriod: 24,
    }),
  ).toBe(
    calculateCumulativePrincipal({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 13,
      endPeriod: 24,
      timing: "end",
    }),
  );
});

test("calculateCumulativePrincipal() handles 'beginning' timing", () => {
  expect(
    calculateCumulativePrincipal({
      rate: 0.08 / 12,
      periods: 30 * 12,
      presentValue: 250000,
      startPeriod: 13,
      endPeriod: 24,
      timing: "beginning",
    }),
  ).toBeCloseTo(-2246.7684918774785, 8);
});

test("calculateCumulativePrincipal() handles 'end' timing", () => {
  expect(
    calculateCumulativePrincipal({
      rate: 0.09 / 12,
      periods: 30 * 12,
      presentValue: 125000,
      startPeriod: 13,
      endPeriod: 24,
      timing: "end",
    }),
  ).toBeCloseTo(-934.10712342, 8);
});
