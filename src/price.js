// Temporary compatibility shim. The canonical Excel-style `price` now lives at
// ./excel/price.js and delegates to the modern `calculateBondPrice` engine.
// This re-export keeps internal modules working untouched until they are
// migrated in a later increment.
export { price } from "./excel/price.js";
