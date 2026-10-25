// Temporary compatibility shim. The canonical Excel-style `pmt` now lives at
// ./excel/pmt.js and delegates to the modern `calculatePayment` engine. This
// re-export keeps internal modules (ipmt, ppmt, cumprinc) working untouched
// until they are migrated in a later increment.
export { pmt } from "./excel/pmt.js";
