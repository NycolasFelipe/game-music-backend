/**
 * User-level preferences (ADR-0018). These belong to the **account**, not to a
 * save: how someone likes to look at a band is the same taste in every game.
 */

/** Ways of looking at the band's people. */
export const PEOPLE_VIEW_MODES = ["cards", "graph"] as const;

/** A people-view mode identifier. */
export type PeopleViewMode = (typeof PEOPLE_VIEW_MODES)[number];

/** The preferences a user carries across every save. */
export interface UserPreferences {
  /**
   * Cards or the relationship circle — used by the relationships section and by
   * the guest picker, which draw the same people the same two ways.
   */
  peopleView: PeopleViewMode;
}

/** What a user gets before ever touching a setting. */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  peopleView: "cards",
};

/**
 * Merges a partial update onto the stored preferences, dropping anything the
 * schema does not know. The column is a `jsonb` blob, so this whitelist is what
 * keeps it from silently accumulating junk (ADR-0018 §2).
 *
 * @param current - The preferences as stored (possibly partial or empty).
 * @param patch - The incoming partial update.
 * @returns A complete, valid preferences object.
 */
export function mergeUserPreferences(
  current: Partial<UserPreferences> | null | undefined,
  patch: Partial<UserPreferences>,
): UserPreferences {
  const merged = { ...DEFAULT_USER_PREFERENCES, ...(current ?? {}) };

  if (patch.peopleView && PEOPLE_VIEW_MODES.includes(patch.peopleView)) {
    merged.peopleView = patch.peopleView;
  }

  return { peopleView: merged.peopleView };
}
