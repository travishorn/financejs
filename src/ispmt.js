// Temporary compatibility shim. The canonical Excel-style `ispmt` now lives at
// ./excel/ispmt.js and delegates to the modern
// `calculateEvenPrincipalInterest` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { ispmt } from "./excel/ispmt.js";
