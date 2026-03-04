import { expect, test } from "vitest";
import { xnpv } from "../src/xnpv.js";

test.each([
  [
    0.09,
    [-10000, 2750, 4250, 3250, 2750],
    [
      new Date("2008-01-01"),
      new Date("2008-03-01"),
      new Date("2008-10-30"),
      new Date("2009-02-15"),
      new Date("2009-04-01"),
    ],
    2086.64760203,
  ],
  [
    0.05,
    [-5000, 1000, 2000, 3000, 4000],
    [
      new Date("2020-01-01"),
      new Date("2020-06-01"),
      new Date("2021-01-01"),
      new Date("2021-06-01"),
      new Date("2022-01-01"),
    ],
    4311.7041355,
  ],
  [
    0.12,
    [-2000, 800, 900, 1000, 1100],
    [
      new Date("2015-01-01"),
      new Date("2015-07-01"),
      new Date("2016-01-01"),
      new Date("2016-07-01"),
      new Date("2017-01-01"),
    ],
    1280.29523812,
  ],
  [
    0.07,
    [-15000, 4000, 5000, 6000, 7000],
    [
      new Date("2010-01-01"),
      new Date("2010-04-01"),
      new Date("2010-07-01"),
      new Date("2010-10-01"),
      new Date("2011-01-01"),
    ],
    6014.82929701,
  ],
  [
    0.1,
    [-1000, 200, 300, 400, 500],
    [
      new Date("2018-01-01"),
      new Date("2018-04-01"),
      new Date("2018-07-01"),
      new Date("2018-10-01"),
      new Date("2019-01-01"),
    ],
    308.52878058,
  ],
  [
    0.08,
    [-8000, 2500, 3000, 3500, 4000],
    [
      new Date("2012-01-01"),
      new Date("2012-03-01"),
      new Date("2012-06-01"),
      new Date("2012-09-01"),
      new Date("2013-01-01"),
    ],
    4401.35597088,
  ],
  [
    0.11,
    [-12000, 3000, 4000, 5000, 6000],
    [
      new Date("2016-01-01"),
      new Date("2016-05-01"),
      new Date("2016-09-01"),
      new Date("2017-01-01"),
      new Date("2017-05-01"),
    ],
    4353.25664862,
  ],
  [
    0.06,
    [-7000, 1500, 2000, 2500, 3000],
    [
      new Date("2019-01-01"),
      new Date("2019-04-01"),
      new Date("2019-07-01"),
      new Date("2019-10-01"),
      new Date("2020-01-01"),
    ],
    1645.21343831,
  ],
  [
    0.13,
    [-9000, 2500, 3000, 3500, 4000],
    [
      new Date("2014-01-01"),
      new Date("2014-05-01"),
      new Date("2014-09-01"),
      new Date("2015-01-01"),
      new Date("2015-05-01"),
    ],
    2664.85869449,
  ],
  [
    0.04,
    [-6000, 1200, 1800, 2400, 3000],
    [
      new Date("2021-01-01"),
      new Date("2021-04-01"),
      new Date("2021-07-01"),
      new Date("2021-10-01"),
      new Date("2022-01-01"),
    ],
    2169.01477387,
  ],
])(
  "xnpv() matches Excel to 8 decimal places",
  (rate, values, dates, expected) => {
    expect(xnpv(rate, values, dates)).toBeCloseTo(expected, 8);
  },
);

test.each(
  /** @type {[number, number[], Date[]][]} */ (
    [
      [-1, [100, 200], [new Date("2020-01-01"), new Date("2020-01-02")]],
      [0.1, [], []],
      [0.1, [100], [new Date(NaN)]],
      [0.1, [100, 200], [new Date("2020-01-01"), new Date(NaN)]],
      [0.1, [100, 200], [new Date("2020-01-02"), new Date("2020-01-01")]],
    ]
  ),
)("xnpv() throws RangeError for invalid inputs", (rate, values, dates) => {
  expect(() => xnpv(rate, values, dates)).toThrow(RangeError);
});
