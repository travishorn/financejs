// Temporary compatibility shim. The canonical Excel-style `dollarfr` now lives
// at ./excel/dollarfr.js and delegates to the modern `calculateDollarFraction`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { dollarfr } from "./excel/dollarfr.js";
