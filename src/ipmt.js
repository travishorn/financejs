// Temporary compatibility shim. The canonical Excel-style `ipmt` now lives at
// ./excel/ipmt.js and delegates to the modern `calculateInterestPayment`
// engine. This re-export keeps internal modules (ppmt, cumipmt, cumprinc)
// working untouched until they are migrated in a later increment.
export { ipmt } from "./excel/ipmt.js";
