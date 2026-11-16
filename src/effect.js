// Temporary compatibility shim. The canonical Excel-style `effect` now lives at
// ./excel/effect.js and delegates to the modern `calculateEffectiveRate`
// engine. This re-export keeps internal modules working untouched until they
// are migrated in a later increment.
export { effect } from "./excel/effect.js";
