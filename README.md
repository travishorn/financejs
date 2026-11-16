# financejs

Excel-style time value of money and cash-flow formulas. This is a modern rewrite
of [tvm-financejs](https://github.com/kgkars/tvm-financejs/) by
[kgkars](https://github.com/kgkars).

## Why this rewrite

This project keeps the functionality from the original library, but modernizes
the implementation and tooling:

- Native ESM
- Modern API
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
import {
  calculatePayment,
  calculateRate,
  calculateInternalRateOfReturn,
} from "@travishorn/financejs";

const payment = calculatePayment({
  rate: 0.08 / 12,
  periods: 10,
  presentValue: 10000,
});
// -1037.0320893591638

const periodicRate = calculateRate({
  periods: 4 * 12,
  payment: -200,
  presentValue: 8000,
});
// 0.007701472488210084

const internalRate = calculateInternalRateOfReturn({
  cashFlows: [-70000, 12000, 15000, 18000, 21000],
});
// -0.021244848272975403
```

For full API documentation, visit
[https://travishorn.github.io/financejs/](https://travishorn.github.io/financejs/).

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

This library matches Excel calculations closely (tests validate to 8 decimal
places), while using a modern JavaScript module API.

## License

The MIT License

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
