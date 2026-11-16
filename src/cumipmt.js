// Temporary compatibility shim. The canonical Excel-style `cumipmt` now lives
// at ./excel/cumipmt.js and delegates to the modern
// `calculateCumulativeInterest` engine. This re-export keeps internal modules
// working untouched until they are migrated in a later increment.
export { cumipmt } from "./excel/cumipmt.js";
