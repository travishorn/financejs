// Temporary compatibility shim. The canonical Excel-style `ppmt` now lives at
// ./excel/ppmt.js and delegates to the modern `calculatePrincipalPayment`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { ppmt } from "./excel/ppmt.js";
