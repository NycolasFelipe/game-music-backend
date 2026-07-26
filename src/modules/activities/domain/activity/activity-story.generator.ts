import type { Activity } from "@/modules/activities/domain/data/activities";
import {
  ACTIVITY_GOOD_CLOSINGS,
  ACTIVITY_SATURATION_BEATS,
  ACTIVITY_SCENES,
  ACTIVITY_TROUBLE_CLOSINGS,
} from "@/modules/activities/domain/data/activity-scenes";

/**
 * Turns an activity's outcome into the story of the night (ADR-0017 §6). Pure:
 * the caller supplies the randomness as a `seed`, like every other generator
 * here, so the same night always tells the same story in a test.
 */

/** A pair of names the middle beat can be about. */
export interface StoryPair {
  a: string;
  b: string;
  /** Their relationship level *before* the activity. */
  level: number;
}

/** Everything the story needs to know about the night. */
export interface ActivityStoryInput {
  activity: Activity;
  /** Names of who went, in guest-list order. */
  participantNames: string[];
  /** The most hostile pair present, or `null` when they share no bond. */
  weakestPair: StoryPair | null;
  /** Whether the night went wrong (ADR-0017 §3). */
  trouble: boolean;
  /** Effect multiplier applied — below 1 means the turn already saw one. */
  saturation: number;
  /** Randomness, `0..1`, supplied by the caller. */
  seed: number;
}

/** Joins names the way a person would: "Ana, Beto e Caio". */
export function formatNames(names: string[]): string {
  if (names.length === 0) return "a banda";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

/** Picks one entry deterministically from a seed and an offset. */
function pick<T>(list: readonly T[], seed: number, offset: number): T {
  const index = Math.floor(seed * 997 + offset * 131) % list.length;
  return list[Math.abs(index)];
}

/** Fills `{grupo}`, `{a}` and `{b}` in a beat. */
function fill(text: string, group: string, pair: StoryPair | null): string {
  return text
    .replace(/\{grupo\}/g, group)
    .replace(/\{a\}/g, pair?.a ?? "alguém")
    .replace(/\{b\}/g, pair?.b ?? "outro");
}

/**
 * Writes the night as a handful of beats: how it opened, what happened between
 * the two people who mattered most, and how it ended.
 *
 * @param input - The activity, who went, the pair at stake and how it turned out.
 * @returns The story, one paragraph per entry.
 */
export function generateActivityStory(input: ActivityStoryInput): string[] {
  const scene = ACTIVITY_SCENES[input.activity.id];
  const group = formatNames(input.participantNames);
  const pair = input.weakestPair;

  const beats: string[] = [
    fill(pick(scene.openings, input.seed, 0), group, pair),
  ];

  // The middle beat follows the pair the night was really about.
  if (pair && pair.level < 0) {
    beats.push(fill(pick(scene.tense, input.seed, 1), group, pair));
  } else if (pair && pair.level >= 3) {
    beats.push(fill(pick(scene.warm, input.seed, 1), group, pair));
  } else {
    beats.push(fill(pick(scene.neutral, input.seed, 1), group, pair));
  }

  if (input.saturation < 1) {
    beats.push(pick(ACTIVITY_SATURATION_BEATS, input.seed, 2));
  }

  beats.push(
    pick(
      input.trouble ? ACTIVITY_TROUBLE_CLOSINGS : ACTIVITY_GOOD_CLOSINGS,
      input.seed,
      3,
    ),
  );

  return beats;
}
