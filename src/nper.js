// Temporary compatibility shim. The canonical Excel-style `nper` now lives at
// ./excel/nper.js and delegates to the modern `calculatePeriods` engine. This
// re-export keeps internal modules working untouched until they are migrated
// in a later increment.
export { nper } from "./excel/nper.js";
