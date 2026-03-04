import { expect, test } from "vitest";
import { fv } from "../src/fv.js";

test.each(
  /** @type {[number, number, number, number, 0 | 1 | undefined, number][]} */ ([
    [0.0525, 8, 6000, -15000, undefined, -35221.9995562398],
    [0.005625, 60, 500, -30000, 1, 6237.61889925798],
    [0.11 / 12, 24, 8025, -250000, undefined, 96870.8884079333],
    [0.125, 6, 58, -5000, 1, 9600.18907928466],
    [0.07 / 12, 240, 1500, -200000, undefined, 26357.7800581612],
    [0, 10, 500, -10000, undefined, 5000],
  ]),
)(
  "fv() matches Excel to 8 decimal places",
  (rate, nper, pmt, pv, type, expected) => {
    expect(fv(rate, nper, pmt, pv, type)).toBeCloseTo(expected, 8);
  },
);

test("fv() supports omitted pmt when pv is provided", () => {
  const rate = 0.05;
  const nper = 10;
  const pv = -1000;
  const expected = -pv * Math.pow(1 + rate, nper);

  expect(fv(rate, nper, undefined, pv)).toBeCloseTo(expected, 8);
});

test("fv() supports omitted pv when pmt is provided", () => {
  const rate = 0.05;
  const nper = 10;
  const pmt = -100;
  const expected = -((pmt / rate) * (Math.pow(1 + rate, nper) - 1));

  expect(fv(rate, nper, pmt)).toBeCloseTo(expected, 8);
});

test("fv() returns 0 when both pmt and pv are omitted or zero", () => {
  const rate = 0.05;
  const nper = 10;

  expect(fv(rate, nper, undefined, undefined)).toBe(0);
  expect(fv(rate, nper, 0, 0)).toBe(0);
});
