/** Allowed genders for a band member. */
export const GENDERS = ["male", "female"] as const;

/** A band member's gender. */
export type Gender = (typeof GENDERS)[number];
