import { expect, test } from "vitest";
import { xirr } from "../src/xirr.js";

import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.doUnmock("../src/xnpv.js");
  vi.resetModules();
  vi.restoreAllMocks();
});

/** @type {[number[], Date[], number | undefined, number][]} */
const xirrSuccessCases = [
  [
    [-10000, 2750, 4250, 3250, 2750],
    [
      new Date("2008-01-01"),
      new Date("2008-03-01"),
      new Date("2008-10-30"),
      new Date("2009-02-15"),
      new Date("2009-04-01"),
    ],
    0.1,
    0.37336254,
  ],
  [
    [-5000, 1000, 2000, 3000, 4000],
    [
      new Date("2020-01-01"),
      new Date("2020-06-01"),
      new Date("2021-01-01"),
      new Date("2021-06-01"),
      new Date("2022-01-01"),
    ],
    0.1,
    0.64138002652,
  ],
  [
    [-2000, 800, 900, 1000, 1100],
    [
      new Date("2015-01-01"),
      new Date("2015-07-01"),
      new Date("2016-01-01"),
      new Date("2016-07-01"),
      new Date("2017-01-01"),
    ],
    0.1,
    0.682179821086,
  ],
  [
    [-15000, 4000, 5000, 6000, 7000],
    [
      new Date("2010-01-01"),
      new Date("2010-04-01"),
      new Date("2010-07-01"),
      new Date("2010-10-01"),
      new Date("2011-01-01"),
    ],
    0.1,
    0.790676465886,
  ],
  [
    [-1000, 200, 300, 400, 500],
    [
      new Date("2018-01-01"),
      new Date("2018-04-01"),
      new Date("2018-07-01"),
      new Date("2018-10-01"),
      new Date("2019-01-01"),
    ],
    0.1,
    0.62292200293,
  ],
  [
    [-8000, 2500, 3000, 3500, 4000],
    [
      new Date("2012-01-01"),
      new Date("2012-03-01"),
      new Date("2012-06-01"),
      new Date("2012-09-01"),
      new Date("2013-01-01"),
    ],
    0.1,
    1.322346384968,
  ],
  [
    [-12000, 3000, 4000, 5000, 6000],
    [
      new Date("2016-01-01"),
      new Date("2016-05-01"),
      new Date("2016-09-01"),
      new Date("2017-01-01"),
      new Date("2017-05-01"),
    ],
    0.1,
    0.572066317694,
  ],
  [
    [-7000, 1500, 2000, 2500, 3000],
    [
      new Date("2019-01-01"),
      new Date("2019-04-01"),
      new Date("2019-07-01"),
      new Date("2019-10-01"),
      new Date("2020-01-01"),
    ],
    0.1,
    0.448288048838,
  ],
  [
    [-9000, 2500, 3000, 3500, 4000],
    [
      new Date("2014-01-01"),
      new Date("2014-05-01"),
      new Date("2014-09-01"),
      new Date("2015-01-01"),
      new Date("2015-05-01"),
    ],
    0.1,
    0.528967465759,
  ],
  [
    [-6000, 1200, 1800, 2400, 3000],
    [
      new Date("2021-01-01"),
      new Date("2021-04-01"),
      new Date("2021-07-01"),
      new Date("2021-10-01"),
      new Date("2022-01-01"),
    ],
    0.1,
    0.622922,
  ],
];

/** @type {[number[], Date[], number | undefined][]} */
const xirrErrorCases = [
  [[-100, 200], [new Date("2020-01-01")], 0.1],
  [[-100, 200], [new Date("2020-01-01"), new Date("2020-01-02")], -1],
  [[100, 200], [new Date("2020-01-01"), new Date("2020-01-02")], 0.1],
  [[-100, 200], [new Date(NaN), new Date("2020-01-02")], 0.1],
  [[-100, 200], [new Date("2020-01-02"), new Date("2020-01-01")], 0.1],
  [[-100, 100], [new Date("2020-01-01"), new Date("2020-01-01")], 0.1],
  [[-1000, 1], [new Date("2020-01-01"), new Date("2020-01-01")], -0.999999],
];

test.each(xirrSuccessCases)(
  "xirr() matches Excel to 8 decimal places",
  (values, dates, guess, expected) => {
    expect(xirr(values, dates, guess)).toBeCloseTo(expected, 8);
  },
);

test.each(xirrErrorCases)(
  "xirr() throws an error for invalid inputs",
  (values, dates, guess) => {
    expect(() => xirr(values, dates, guess)).toThrow(RangeError);
  },
);

test("xirr() throws when a non-first date is invalid", () => {
  const values = [-100, 200];
  const dates = [new Date("2020-01-01"), new Date(NaN)];
  expect(() => xirr(values, dates, 0.1)).toThrow(
    "All dates must be valid Date objects.",
  );
});

test("xirr() throws 'Invalid values for XIRR.' when npv1 === npv0 after adjustment", () => {
  const values = [-100, 100];
  const date = new Date("2020-01-01");
  const dates = [date, date];
  expect(() => xirr(values, dates, 0.1)).toThrow("Invalid values for XIRR.");
});

test("xirr() throws 'Maximum iterations exceeded while calculating XIRR.' for non-converging input", () => {
  const values = [-10000, 1];
  const dates = [new Date("2000-01-01"), new Date("2100-01-01")];
  expect(() => xirr(values, dates, 0.1)).toThrow(
    "Maximum iterations exceeded while calculating XIRR.",
  );
});

test("xirr() handles equal NPV once, then continues secant iteration", async () => {
  const xnpvMock = vi
    .fn()
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(2)
    .mockReturnValueOnce(0);

  vi.doMock("../src/xnpv.js", () => ({ xnpv: xnpvMock }));
  const { xirr } = await import("../src/xirr.js");

  const values = [-100, 200];
  const dates = [new Date("2020-01-01"), new Date("2020-02-01")];
  const result = xirr(values, dates, 0.1);

  expect(result).toBeCloseTo(0.100030002, 12);
});

test("xirr() returns a negative rate for a losing investment", async () => {
  const { xirr } = await import("../src/xirr.js");

  const values = [-1000, 900];
  const dates = [new Date("2020-01-01"), new Date("2021-01-01")];
  const result = xirr(values, dates, 0.1);

  expect(result).toBeLessThan(0);
  expect(result).toBeCloseTo(-0.1, 2);
});
