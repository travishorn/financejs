// Temporary compatibility shim. The canonical Excel-style `yield_` now lives
// at ./excel/yield_.js and delegates to the modern `calculateBondYield` engine.
// This re-export keeps internal modules working untouched until they are
// migrated in a later increment.
export { yield_ } from "./excel/yield_.js";
