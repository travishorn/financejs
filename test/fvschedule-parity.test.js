import { expect, test } from "vitest";
import { calculateFutureValueSchedule } from "../src/future-value-schedule.js";
import { fvschedule } from "../src/excel/fvschedule.js";

test.each(
  /** @type {[number, number[]][]} */ ([
    [1, [0.09, 0.11, 0.1]],
    [100, [0.05, 0.05, 0.05]],
    [1000, []],
    [500, [0]],
    [2, [null, 0.5]],
    [10, [0.1, null, 0.1]],
    [1, [-0.5, 1]],
    [1, [0.1, 0.2, -0.1]],
    [1, [0.01, 0.01, 0.01, 0.01, 0.01]],
    [0, [0.1, 0.2]],
  ]),
)(
  "fvschedule() and calculateFutureValueSchedule() return identical results",
  (principal, schedule) => {
    const excelResult = fvschedule(principal, schedule);
    const modernResult = calculateFutureValueSchedule({
      principal,
      schedule,
    });

    expect(excelResult).toBe(modernResult);
  },
);
