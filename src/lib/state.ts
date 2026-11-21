/** Shared, non-reactive state written by the opening sequence and read by the cloud environment. */
export const env = { gl: 0 };

/** Programmatic jumps (menu, "skip intro") set this so the opening doesn't hold the visitor back. */
export const nav = { freeUntil: 0 };
