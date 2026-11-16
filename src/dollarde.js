// Temporary compatibility shim. The canonical Excel-style `dollarde` now lives
// at ./excel/dollarde.js and delegates to the modern `calculateDollarDecimal`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { dollarde } from "./excel/dollarde.js";
