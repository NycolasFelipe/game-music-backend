import type { SkillType } from "@/modules/band-members/domain/constants/skill.constant";
import type { BandTheme } from "@/modules/bands/domain/constants/band.constant";

/**
 * Per-genre skill-weight profiles: how much each of the six aspects matters to a
 * work of a given style (ADR-0008 §5). Weights sum to 1 within a profile. Themes
 * are grouped into archetypes to keep the table maintainable while still being
 * per-`BandTheme`.
 */

/** A weight per skill; the values sum to 1. */
export type SkillWeights = Record<SkillType, number>;

const BAND: SkillWeights = {
  guitar: 0.28,
  drums: 0.22,
  vocal: 0.22,
  bass: 0.12,
  lyrics: 0.12,
  piano: 0.04,
};

const METAL: SkillWeights = {
  guitar: 0.3,
  drums: 0.26,
  bass: 0.16,
  vocal: 0.16,
  lyrics: 0.08,
  piano: 0.04,
};

const VOCAL_POP: SkillWeights = {
  vocal: 0.34,
  lyrics: 0.2,
  piano: 0.16,
  drums: 0.14,
  guitar: 0.1,
  bass: 0.06,
};

const ELECTRONIC: SkillWeights = {
  piano: 0.3,
  drums: 0.24,
  vocal: 0.18,
  bass: 0.16,
  lyrics: 0.08,
  guitar: 0.04,
};

const SONGWRITER: SkillWeights = {
  lyrics: 0.3,
  vocal: 0.24,
  guitar: 0.18,
  piano: 0.16,
  bass: 0.08,
  drums: 0.04,
};

const RAP: SkillWeights = {
  lyrics: 0.34,
  vocal: 0.26,
  drums: 0.2,
  bass: 0.12,
  piano: 0.05,
  guitar: 0.03,
};

const ROOTS: SkillWeights = {
  guitar: 0.24,
  vocal: 0.2,
  piano: 0.2,
  lyrics: 0.16,
  bass: 0.12,
  drums: 0.08,
};

const RHYTHM: SkillWeights = {
  drums: 0.26,
  bass: 0.22,
  vocal: 0.2,
  guitar: 0.14,
  lyrics: 0.12,
  piano: 0.06,
};

/** Skill-weight profile for every band theme. */
export const RELEASE_GENRE_PROFILES: Record<BandTheme, SkillWeights> = {
  "indie-folk": SONGWRITER,
  grunge: BAND,
  "rock-indie": BAND,
  "rock-sinfonico": BAND,
  punk: BAND,
  metal: METAL,
  blues: ROOTS,
  jazz: ROOTS,
  synthwave: ELECTRONIC,
  cyberpunk: ELECTRONIC,
  steampunk: ELECTRONIC,
  "rave-edm": ELECTRONIC,
  "pop-urbano": VOCAL_POP,
  "rap-hiphop": RAP,
  "funk-carioca": RHYTHM,
  kpop: VOCAL_POP,
  "pop-mainstream": VOCAL_POP,
  "samba-raiz": RHYTHM,
  sertanejo: SONGWRITER,
  mpb: SONGWRITER,
  reggae: RHYTHM,
  "folk-rock": SONGWRITER,
  "egirl-eboy": ELECTRONIC,
  gotico: BAND,
  "emo-scene": BAND,
  "skate-streetwear": BAND,
};

/** Default profile used when a theme is somehow missing (defensive). */
export const DEFAULT_GENRE_PROFILE: SkillWeights = BAND;

/**
 * Returns the skill-weight profile for a band theme.
 *
 * @param theme - The band theme.
 * @returns The matching profile (falls back to {@link DEFAULT_GENRE_PROFILE}).
 */
export function genreProfileFor(theme: string): SkillWeights {
  return RELEASE_GENRE_PROFILES[theme as BandTheme] ?? DEFAULT_GENRE_PROFILE;
}
