/** Allowed genders for a band member (ADR-0027). */
export const GENDERS = ["male", "female", "neutral"] as const;

/** A band member's gender. */
export type Gender = (typeof GENDERS)[number];

/**
 * Share of generated candidates that come out neutral (ADR-0027). The rest is
 * split evenly between male and female.
 */
export const NEUTRAL_CANDIDATE_SHARE = 0.1;
