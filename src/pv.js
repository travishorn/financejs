// Temporary compatibility shim. The canonical Excel-style `pv` now lives at
// ./excel/pv.js and delegates to the modern `calculatePresentValue` engine.
// This re-export keeps internal modules working untouched until they are
// migrated in a later increment.
export { pv } from "./excel/pv.js";
