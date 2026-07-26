import type { SkillType } from "@/modules/band-members/domain/constants/skill.constant";

/**
 * Live-show rules (ADR-0016). A "gig" is the band's **season** on a circuit —
 * a turn is half a year — so the fees are seasonal, not per night. Starting
 * constants, subject to playtesting balance.
 */

/**
 * The skills that go on stage, with how much each weighs in the band's live
 * performance. Lyrics do not play live.
 */
export const STAGE_SKILL_WEIGHTS: Readonly<Partial<Record<SkillType, number>>> =
  {
    vocal: 0.3,
    guitar: 0.25,
    drums: 0.2,
    bass: 0.15,
    piano: 0.1,
  };

/** Fraction of the base fee a band earns regardless of how well it plays. */
export const GIG_FEE_FLOOR = 0.5;

/** How strongly average happiness lifts (or drags) the live performance. */
export const GIG_MOOD_WEIGHT = 0.2;

/**
 * How much the band's own draw adds to the fee/audience via
 * `1 + log10(1 + fans) × WEIGHT`. Weaker than a release's reach: the venue caps
 * how many people fit.
 */
export const GIG_FAME_WEIGHT = 0.2;

/** Half-width of the random variance applied to a season's performance (±10%). */
export const GIG_VARIANCE = 0.1;

/**
 * How far a great (or dull) season swings the band's mood on top of the
 * circuit's wear: at a perfect performance it adds half of this.
 */
export const GIG_TRIUMPH_SWING = 0.6;

/**
 * Learning weight of a live season, fed into the release growth curve
 * (ADR-0012). The road teaches less than a record, but it teaches.
 */
export const GIG_SKILL_GAIN_WEIGHT = 0.25;
