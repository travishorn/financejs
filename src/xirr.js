// Temporary compatibility shim. The canonical Excel-style `xirr` now lives at
// ./excel/xirr.js and delegates to the modern
// `calculateDatedInternalRateOfReturn` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { xirr } from "./excel/xirr.js";
