// Temporary compatibility shim. The canonical Excel-style `fv` now lives at
// ./excel/fv.js and delegates to the modern `calculateFutureValue` engine.
// This re-export keeps internal modules (ipmt) working untouched until they
// are migrated in a later increment.
export { fv } from "./excel/fv.js";
