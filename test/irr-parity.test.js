import { expect, test } from "vitest";
import { calculateInternalRateOfReturn } from "../src/irr.js";
import { irr } from "../src/excel/irr.js";

test.each(
  /** @type {[number[], number | undefined][]} */ ([
    [[-70000, 12000, 15000, 18000, 21000], undefined],
    [[-1500, 500, 500, 500, 500], undefined],
    [
      [
        -59984, 5868, 9728, 7261, 2716, 1010, 8531, 3481, 8906, 7035, 1800,
        2436, 6143, 9844, 1200, 1528, 848,
      ],
      0.05,
    ],
    [
      [
        -2094, 4828, 4436, 5411, 3812, 3078, 8445, 1216, 5862, 719, 5185, 7802,
        7651, 7502, 2870, 9444, 8830,
      ],
      undefined,
    ],
    [
      [
        -74148, 7729, 9471, 7032, 9388, 1974, 4624, 3531, -7556, 8963, 4039,
        7658, 9455, 6329, 5379, 6585, 4527,
      ],
      undefined,
    ],
    [[0, 0, -100, 50, 60], undefined],
    [[-12397, -11911, 11096, 16863], 0.6711104126967118],
    [[-7e-293, 6.99999e-318, 8e-304], 0.8543147851879355],
  ]),
)(
  "irr() and calculateInternalRateOfReturn() return identical results",
  (values, guess) => {
    const excelResult = irr(values, guess);
    const modernResult = calculateInternalRateOfReturn({
      cashFlows: values,
      guess: guess ?? 0.1,
    });

    expect(excelResult).toBe(modernResult);
  },
);
