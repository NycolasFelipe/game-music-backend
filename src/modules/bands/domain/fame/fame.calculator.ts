import {
  FAME_LEVEL_DESCRIPTIONS,
  FAME_LEVEL_MAX_FANS,
  MAX_FAME_LEVEL,
  type FameLevelDescription,
} from "@/modules/bands/domain/fame/fame.constant";

/** A fully described fame standing derived from a fan count. */
export interface FameDescription {
  /** Fame level, `0..30`. */
  level: number;
  title: string;
  subtitle: string;
  /** `true` when at the top level (no further progression). */
  isMaxLevel: boolean;
  /** Inclusive minimum fans for the current level. */
  currentLevelMinFans: number;
  /** Inclusive maximum fans for the current level (`null` at max level). */
  currentLevelMaxFans: number | null;
  /** Fans required to reach the next level (`null` at max level). */
  nextLevelAtFans: number | null;
}

/**
 * Computes the fame level for a fan count. Ported from the frontend: the level
 * is the first whose inclusive upper bound the fan count does not exceed.
 *
 * @param fanCount - The band's fan count.
 * @returns The fame level, `0..30`.
 */
export function calculateFameLevel(fanCount: number): number {
  const safe = Number.isFinite(fanCount) ? fanCount : 0;

  for (let level = 0; level < FAME_LEVEL_MAX_FANS.length; level += 1) {
    if (safe <= FAME_LEVEL_MAX_FANS[level]) {
      return level;
    }
  }

  return MAX_FAME_LEVEL;
}

/** Inclusive fan range for a fame level (`max` is `null` at the top level). */
interface FameFanCountRange {
  min: number;
  max: number | null;
}

/**
 * Returns the inclusive fan range associated with a fame level.
 *
 * @param fameLevel - The fame level.
 * @returns The `{ min, max }` range (`max` is `null` for the uncapped top).
 */
export function getFameFanCountRange(fameLevel: number): FameFanCountRange {
  const level = Math.max(0, Math.min(MAX_FAME_LEVEL, Math.floor(fameLevel)));
  if (level === 0) {
    return { min: 0, max: FAME_LEVEL_MAX_FANS[0] };
  }

  const prevMax = FAME_LEVEL_MAX_FANS[level - 1];
  const min = prevMax + 1;
  const max = FAME_LEVEL_MAX_FANS[level] ?? null;

  return { min, max };
}

/**
 * Returns the title/subtitle for a fame level, with a safe fallback.
 *
 * @param fameLevel - The fame level.
 * @returns The level's description.
 */
export function getFameDescription(fameLevel: number): FameLevelDescription {
  return (
    FAME_LEVEL_DESCRIPTIONS[fameLevel.toString()] ?? {
      title: "Desconhecido",
      subtitle: "",
    }
  );
}

/**
 * Derives the full fame standing for a fan count: level, description and the
 * progression bounds towards the next level.
 *
 * @param fanCount - The band's fan count.
 * @returns The described fame standing.
 */
export function describeFame(fanCount: number): FameDescription {
  const level = calculateFameLevel(fanCount);
  const { title, subtitle } = getFameDescription(level);
  const range = getFameFanCountRange(level);
  const isMaxLevel = level >= MAX_FAME_LEVEL;

  return {
    level,
    title,
    subtitle,
    isMaxLevel,
    currentLevelMinFans: range.min,
    currentLevelMaxFans: range.max,
    nextLevelAtFans: isMaxLevel || range.max === null ? null : range.max + 1,
  };
}
