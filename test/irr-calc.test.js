import { expect, test } from "vitest";
import { calculateInternalRateOfReturn } from "../src/irr.js";

test.each(
  /** @type {[number[], number | undefined, number][]} */ ([
    [[-70000, 12000, 15000, 18000, 21000], undefined, -0.021244848272975403],
    [[-1500, 500, 500, 500, 500], undefined, 0.12589832495374934],
    [
      [
        -59984, 5868, 9728, 7261, 2716, 1010, 8531, 3481, 8906, 7035, 1800,
        2436, 6143, 9844, 1200, 1528, 848,
      ],
      0.05,
      0.03905013260704959,
    ],
    [
      [
        -2094, 4828, 4436, 5411, 3812, 3078, 8445, 1216, 5862, 719, 5185, 7802,
        7651, 7502, 2870, 9444, 8830,
      ],
      undefined,
      2.271496469739727,
    ],
    [
      [
        -74148, 7729, 9471, 7032, 9388, 1974, 4624, 3531, -7556, 8963, 4039,
        7658, 9455, 6329, 5379, 6585, 4527,
      ],
      undefined,
      0.0234271508456431,
    ],
    [[0, 0, -100, 50, 60], undefined, 0.06394102980498524],
    [[-12397, -11911, 11096, 16863], 0.6711104126967118, 0.0684525135361858],
  ]),
)(
  "calculateInternalRateOfReturn() matches Excel to 8 decimal places",
  (cashFlows, guess, expected) => {
    expect(calculateInternalRateOfReturn({ cashFlows, guess })).toBeCloseTo(
      expected,
      8,
    );
  },
);

test.each(
  /** @type {[number[], number | undefined][]} */ ([
    [
      [
        -16750, 6650, 6568, 1235, 2570, 4399, 2256, 8048, 9657, 3550, 7914,
        8798, -3760, 4433, 6288, 6484, 5936,
      ],
      -2,
    ],
    [[16750, 6650, 6568, 1235], undefined],
    [[-16750, -6650, -6568, -1235], undefined],
    [[], undefined],
    [[1], undefined],
    [[-1], undefined],
    [[-1, -1], -0.999995],
    [[8545, -6264, -9337, 5382, 1569, 2900], 0.17153122889491923],
  ]),
)(
  "calculateInternalRateOfReturn() throws RangeError for invalid inputs",
  (cashFlows, guess) => {
    expect(() => calculateInternalRateOfReturn({ cashFlows, guess })).toThrow(
      RangeError,
    );
  },
);

test("calculateInternalRateOfReturn() defaults guess to 0.1", () => {
  expect(
    calculateInternalRateOfReturn({
      cashFlows: [-1500, 500, 500, 500, 500],
    }),
  ).toBe(
    calculateInternalRateOfReturn({
      cashFlows: [-1500, 500, 500, 500, 500],
      guess: 0.1,
    }),
  );
});

test("calculateInternalRateOfReturn() skips leading zero cash flows", () => {
  expect(
    calculateInternalRateOfReturn({
      cashFlows: [0, 0, -100, 50, 60],
    }),
  ).toBeCloseTo(0.06394102980498524, 8);
});

test("calculateInternalRateOfReturn() handles mixed sign cash flows", () => {
  expect(
    calculateInternalRateOfReturn({
      cashFlows: [
        -74148, 7729, 9471, 7032, 9388, 1974, 4624, 3531, -7556, 8963, 4039,
        7658, 9455, 6329, 5379, 6585, 4527,
      ],
    }),
  ).toBeCloseTo(0.0234271508456431, 8);
});
