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
// 2325.7331680465

const periodicRate = rate(60, 500, -25000);
// 0.00618341316125388

const internalRate = irr([-1500, 500, 500, 500, 500]);
// 0.125898324962364
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

| Variable | Description                                                                           |
| -------- | ------------------------------------------------------------------------------------- |
| `pv`     | Present value                                                                         |
| `fv`     | Future value                                                                          |
| `pmt`    | Payment                                                                               |
| `nper`   | Total number of periods                                                               |
| `per`    | A specific period                                                                     |
| `rate`   | Rate for the period(s)                                                                |
| `type`   | When payments are due. `0` = end of period/arrears. `1` = beginning of period/advance |
| `guess`  | A guess at the rate                                                                   |
| `values` | A set of periodic cash flows                                                          |

### `pv(rate, nper, pmt, fv = 0, type = 0)`

Returns the present value of an investment, or the total amount that a series of
future payments is worth now.

### `fv(rate, nper, pmt, pv, type = 0)`

Returns the future value of an investment based on periodic, equal, payments and
a constant interest rate.

### `pmt(rate, nper, pv, fv = 0, type = 0)`

Calculates the payment for a loan based on a constant stream of equal payments
and a constant interest rate.

### `nper(rate, pmt, pv, fv = 0, type = 0)`

Number of periods.

### `ipmt(rate, per, nper, pv, fv = 0, type = 0)`

Returns the calculated interest portion of a payment for a specific period based
on a constant stream of equal payments and a constant interest rate.

### `ppmt(rate, per, nper, pv, fv = 0, type = 0)`

Returns the calculated principal portion of a payment for a specific period
based on a constant stream of equal payments and a constant interest rate.

### `rate(nper, pmt, pv, fv = 0, type = 0, guess = 0.1)`

Returns the interest rate per period for a loan or investment (iterative solve).

### `npv(rate, ...values)`

Returns the net present value of an investment based on a constant rate of
return and a series of future payments/investments (as negative values) and
income/return (as positive values).

### `irr(values, guess = 0.1)`

Returns the internal rate of return for a series of cash flows.

A couple of items to note about this formula:

- The variable values must be input as an array.
- There must be at least one negative and one positive value as part of the cash flow.
- Cash flows are assumed to be due in the same order they are arranged in the Array.

Example usage:

```javascript
returnIRR() {
  const values = [-1500, 500, 500, 500, 500];
  return Math.round(irr(values) * 100 ) / 100 * 100;
}
// returns 12.59
```

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
