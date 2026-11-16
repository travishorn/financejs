// Temporary compatibility shim. The canonical Excel-style `rri` now lives at
// ./excel/rri.js and delegates to the modern `calculateEquivalentRate` engine.
// This re-export keeps internal modules working untouched until they are
// migrated in a later increment.
export { rri } from "./excel/rri.js";
