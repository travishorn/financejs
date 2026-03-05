# financejs

Excel-style time value of money and cash-flow formulas. This is a modern rewrite
of [tvm-financejs](https://github.com/kgkars/tvm-financejs/) by
[kgkars](https://github.com/kgkars).

## Why this rewrite

This project keeps the formula behavior and conventions from the original
library, but modernizes the implementation and tooling:

- Native ESM
- Named function exports (no class wrapper)
- Native error handling
- Strict type-checking
- JSDoc documentation
- Vitest-based test suite
- 100% test coverage
- ESLint + Prettier setup

## Installation

```bash
npm install @travishorn/financejs
```

## Usage

```js
import { pmt, rate, irr } from "@travishorn/financejs";

const payment = pmt(0.0525, 5, -10000);
// 2325.733168046526

const periodicRate = rate(60, 500, -25000);
// 0.006183413161254404

const internalRate = irr([-1500, 500, 500, 500, 500]);
// 0.12589832495374934
```

## Excel-style conventions

- Outputs are not rounded automatically.
- `pv` is typically negative for loans/investments (same convention as Excel).
- `type` means payment timing:
  - `0` = end of period (arrears)
  - `1` = beginning of period (advance)
- `rate` must match period frequency (e.g., annual rate divided by 12 for
  monthly periods).

## API

### Input Variables

| Variable      | Description                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cost`        | The initial cost of the asset.                                                                                                                                                                                                                                                                                                                                                                                        |
| `dates`       | A schedule of payment dates that corresponds to the cash flow payments. The first payment date indicates the beginning of the schedule of payments. All other dates must be later than this date, but they may occur in any order.                                                                                                                                                                                    |
| `endPeriod`   | The last period in the calculation.                                                                                                                                                                                                                                                                                                                                                                                   |
| `fv`          | The future value or a cash balance you want to attain after the last payment is made. If `fv` is omitted, it is assumed to be `0` (the future value of a loan, for example, is 0). For example, if you want to save $50,000 to pay for a special project in 18 years, then $50,000 is the future value. You could then make a conservative guess at an interest rate and determine how much you must save each month. |
| `guess`       | A number that you guess is close to the result. In most cases you do not need to provide `guess` for the calculation to succeeed. If a RangeError is thrown, or if the result is not close to what you expected, try again with a different value for `guess`.                                                                                                                                                        |
| `life`        | The number of periods over which the asset is depreciated (sometimes called the useful life of the asset).                                                                                                                                                                                                                                                                                                            |
| `nper`        | The total number of payment periods in an annuity. For example, if you get a four-year car loan and make monthly payments, your loan has 4 \* 12 (or 48) periods. You would enter `48` for `per`.                                                                                                                                                                                                                     |
| `per`         | The period for which you want to find the interest and must be in the range `1` to `nper`.                                                                                                                                                                                                                                                                                                                            |
| `pmt`         | The payment made each period and cannot change over the life of the annuity. Typically, `pmt` includes principal and interest but no other fees or taxes. For example, the monthly payments on a $10,000, four-year car loan at 12 percent are $263.33. You would enter `-263.33` as the `pmt`.                                                                                                                       |
| `pv`          | The present value, or the lump-sum amount that a series of future payments is worth right now.                                                                                                                                                                                                                                                                                                                        |
| `rate`        | The interest rate per period. For example, if you obtain an automobile loan at a 10 percent annual interest rate and make monthly payments, your interest rate per month is 10% / 12, or 0.83%. You would enter `0.10 / 12` or `0.0083`, into the formula as the rate.                                                                                                                                                |
| `salvage`     | The value at the end of the depreciation (sometimes called the salvage value of the asset).                                                                                                                                                                                                                                                                                                                           |
| `startPeriod` | The first period in the calculation. Payment periods are numbered beginning with 1.                                                                                                                                                                                                                                                                                                                                   |
| `type`        | The number `0` or `1` and indicates when payments are due. Set `type` equal to `0` or omitted if payments are due at the end of the period. Set `type` equal to `1` if payments are due at the beginning of the period.                                                                                                                                                                                               |
| `values`      | Array of cash flows, where each entry represents a payment (negative) or income (positive) at a regular interval.                                                                                                                                                                                                                                                                                                     |

### `cumipmt(rate, nper, pv, startPeriod, endPeriod, type)`

Calculates the the cumulative interest paid on a loan between a start period and
an end period.

### `cumprinc(rate, nper, pv, startPeriod, endPeriod, type)`

Calculates the cumulative principal paid on a loan between a start period and an
end period.

### `fv(rate, nper, pmt, pv, type = 0)`

Calculates the future value of an investment based on a constant interest rate.
You can use FV with either periodic, constant payments, or a single lump sum
payment.

### `ipmt(rate, per, nper, pv, fv = 0, type = 0)`

Returns the interest payment for a given period for an investment based on
periodic, constant payments and a constant interest rate.

### `irr(values, guess = 0.1)`

Calculates the internal rate of return for a series of cash flows represented by
the numbers in `values`. These cash flows do not have to be even, as they would
be for an annuity. However, the cash flows must occur at regular intervals, such
as monthly or annually. The internal rate of return is the interest rate
received for an investment consisting of payments (negative values) and income
(positive values) that occur at regular periods.

### `nper(rate, pmt, pv, fv = 0, type = 0)`

Calculates the number of periods for an investment based on periodic, constant
payments and a constant interest rate.

### `npv(rate, ...values)`

Calculates the net present value of an investment by using a discount rate and a
series of future payments (negative values) and income (positive values).

### `pmt(rate, nper, pv, fv = 0, type = 0)`

Calculates the payment for a loan based on constant payments and a constant
interest rate.

### `ppmt(rate, per, nper, pv, fv = 0, type = 0)`

Calculates the payment on the principal for a given period for an investment
based on periodic, constant payments and a constant interest rate.

### `pv(rate, nper, pmt, fv = 0, type = 0)`

Calculates the present value of a loan or an investment, based on a constant
interest rate. You can use PV with either periodic, constant payments (such as a
mortgage or other loan), or a future value that's your investment goal.

### `rate(nper, pmt, pv, fv = 0, type = 0, guess = 0.1)`

Calculates the interest rate per period of an annuity. The rate is calculated by
iteration and can have zero or more solutions. If the successive results of this
function do not converge to within 0.0000001 after 128 iterations, a RangeError
is thrown.

### `sln(cost, salvage, life)`

Calculates the straight-line depreciation of an asset for one period.

### `xirr(values, dates, guess = 0.1)`

Calculates the internal rate of return for a schedule of cash flows that is
not necessarily periodic. To calculate the internal rate of return for a
series of periodic cash flows, use the `irr()` function.

### `xnpv(rate, values, dates)`

Calculates the net present value for a schedule of cash flows that is not
necessarily periodic.

## Error behavior

All functions will either return a number, or throw `RangeError` for invalid
inputs or non-convergent iterative solves.

## Development

Clone the repository:

```bash
git clone https://github.com/travishorn/financejs
```

Change into the directory:

```bash
cd financejs
```

Run tests:

```bash
npm test
```

Lint with ESLint:

```bash
npm run lint
```

Check types:

```bash
npm run lint:types
```

Format with Prettier:

```bash
npm run format
```

## Notes on compatibility

This rewrite is intended to match Excel-style formulas closely (tests validate
to 8 decimal places), while using a modern JavaScript module API.

## Roadmap

I want to add more [Excel financial
functions](https://support.microsoft.com/en-us/office/financial-functions-reference-5658d81e-6035-4f24-89c1-fbf124c2b1d8)
to the project. Since there are over 50 functions, I'll break them into "tiers."

- **Tier 1:** ✓pmt, ✓pv, ✓fv, ✓npv, ✓irr, ✓rate, ✓nper, ✓xnpv, ✓xirr
- **Tier 2:** ✓ipmt, ✓ppmt, ✓cumipmt, ✓cumprinc, ✓sln, db, ddb, effect, nominal, syd,
  mirr
- **Tier 3:** rri, pduration, vdb, fvschedule, dollarde, dollarfr, ispmt
- **Tier 4:** yield, price, duration, mduration, disc, intrate, received,
  pricedisc, pricemat, yielddisc, yieldmat
- **Tier 5:** all others

## License

The MIT License

Copyright 2020 kgkars  
Copyright 2026 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
