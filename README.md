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

For full API documentation, visit
[https://travishorn.github.io/financejs/](https://travishorn.github.io/financejs/).

## Excel-style conventions

- Outputs are not rounded automatically.
- `pv` is typically negative for loans/investments (same convention as Excel).
- `type` means payment timing:
  - `0` = end of period (arrears)
  - `1` = beginning of period (advance)
- `rate` must match period frequency (e.g., annual rate divided by 12 for
  monthly periods).

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
- **Tier 2:** ✓ipmt, ✓ppmt, ✓cumipmt, ✓cumprinc, ✓sln, ✓db, ✓ddb, ✓effect,
  ✓nominal, ✓syd, ✓mirr
- **Tier 3:** ✓rri, ✓pduration, ✓vdb, ✓fvschedule, dollarde, dollarfr, ispmt
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
