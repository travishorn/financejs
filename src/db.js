// Temporary compatibility shim. The canonical Excel-style `db` now lives at
// ./excel/db.js and delegates to the modern
// `calculateDecliningBalanceDepreciation` engine. This re-export keeps internal
// modules working untouched until they are migrated in a later increment.
export { db } from "./excel/db.js";
