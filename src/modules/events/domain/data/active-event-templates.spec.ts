import { ACTIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/active-event-templates";
import { PASSIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/passive-event-templates";
import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";
import { CHARACTERISTIC_IDS } from "@/modules/band-members/domain/data/characteristics";
import { FOUNDATION_YEARS } from "@/modules/bands/domain/constants/band.constant";
import {
  RELATIONSHIP_LEVEL_MAX,
  RELATIONSHIP_LEVEL_MIN,
} from "@/modules/bands/domain/constants/relationship.constant";
import { TURN_STEP } from "@/modules/turns/domain/constants/turn.constant";

/**
 * Coverage floor of the active-event catalog per fame phase (ADR-0025).
 *
 * A phase is covered when, at every fan count inside it and every year a
 * typical game can reach, enough **universal** templates are eligible: any band
 * can draw them, whatever its traits, relationships or size.
 */

/** Typical game length in turns (ADR-0025 §1). */
const TYPICAL_GAME_TURNS = 80;
const FIRST_GAME_YEAR = Math.min(...FOUNDATION_YEARS);
const LAST_GAME_YEAR =
  Math.max(...FOUNDATION_YEARS) + TYPICAL_GAME_TURNS * TURN_STEP;

/** Categories the random generator draws (`active-event.generator.ts`). */
const DRAWN_CATEGORIES: ActiveEventType[] = [
  "conflito_membros",
  "oportunidade_externa",
  "decisao_criativa",
];
const MIN_SOLO = 2;
const MIN_PER_CATEGORY = 2;

interface CoveragePhase {
  name: string;
  minFans: number;
  maxFans: number;
  /** Universal templates required at any point of the phase. */
  target: number;
  /**
   * Whether the floor is enforced. Flip to `true` once the phase reaches its
   * target, so the catalog can never drop below it again (ADR-0025 §5).
   */
  enforced: boolean;
}

/** Phases and targets from ADR-0025 §2. */
const PHASES: CoveragePhase[] = [
  { name: "Garagem", minFans: 0, maxFans: 150, target: 6, enforced: true },
  { name: "Bares", minFans: 151, maxFans: 2000, target: 8, enforced: true },
  {
    name: "Casas",
    minFans: 2001,
    maxFans: 100000,
    target: 12,
    enforced: true,
  },
  {
    name: "Nacional",
    minFans: 100001,
    maxFans: 2000000,
    target: 15,
    enforced: true,
  },
];

const hasEntries = (lists?: string[] | string[][]): boolean =>
  (lists ?? []).some((entry) =>
    Array.isArray(entry) ? entry.length > 0 : true,
  );

/**
 * Whether a template can be drawn by any band (ADR-0025 §3): randomly drawable,
 * no trait requirement and, for pairs, no relationship bound narrower than the
 * whole scale. Fan and year bounds are checked separately, per point.
 *
 * @param t - The template.
 * @returns `true` when no band composition can make it ineligible.
 */
function isUniversal(t: ActiveEventTemplate): boolean {
  if (t.type === "confraternizacao") return false;
  if (
    hasEntries(t.requiredBandCharacteristics) ||
    hasEntries(t.requiredBandCharacteristicsAll) ||
    hasEntries(t.requiredInvolvedCharacteristics) ||
    hasEntries(t.requiredInvolvedCharacteristicsAll) ||
    hasEntries(t.requiredCharacterCharacteristics) ||
    hasEntries(t.requiredCharacterCharacteristicsAll)
  ) {
    return false;
  }
  if (t.requiredCharacters >= 2) {
    const min = t.minRelationshipLevel ?? RELATIONSHIP_LEVEL_MIN;
    const max = t.maxRelationshipLevel ?? RELATIONSHIP_LEVEL_MAX;
    if (min > RELATIONSHIP_LEVEL_MIN || max < RELATIONSHIP_LEVEL_MAX) {
      return false;
    }
  }
  // Every option is gated: a cast without the traits would see no choice.
  return t.options.some(
    (o) =>
      !hasEntries(o.visibleIfAnyInvolvedHas) &&
      !hasEntries(o.visibleIfAnyInvolvedHasAll) &&
      !hasEntries(o.visibleIfCharacterHas) &&
      !hasEntries(o.visibleIfCharacterHasAll),
  );
}

/**
 * The points where eligibility can change inside `[lo, hi]`: the range ends and
 * every template bound that falls inside it.
 *
 * @param lo - Range start (inclusive).
 * @param hi - Range end (inclusive).
 * @param bounds - Each template's `[min, max]` on that axis.
 * @returns The distinct points to test, sorted.
 */
function breakpoints(
  lo: number,
  hi: number,
  bounds: Array<[number | undefined, number | undefined]>,
): number[] {
  const points = new Set<number>([lo, hi]);
  for (const [min, max] of bounds) {
    if (min !== undefined && min > lo && min <= hi) points.add(min);
    if (max !== undefined && max >= lo && max < hi) points.add(max + 1);
  }
  return [...points].sort((a, b) => a - b);
}

const within = (value: number, min?: number, max?: number): boolean =>
  (min ?? -Infinity) <= value && value <= (max ?? Infinity);

/**
 * The fewest universal templates matching `filter` that are eligible at any
 * (fan count, year) point of the phase.
 *
 * @param phase - The fame phase.
 * @param filter - Extra condition on the template (category, cast size).
 * @param templates - The catalog to measure (the real one by default).
 * @returns The minimum count and the point where it happens.
 */
function minimumCoverage(
  phase: CoveragePhase,
  filter: (t: ActiveEventTemplate) => boolean = () => true,
  templates: ActiveEventTemplate[] = ACTIVE_EVENT_TEMPLATES,
): { count: number; fans: number; year: number } {
  const pool = templates.filter((t) => isUniversal(t) && filter(t));
  const fanPoints = breakpoints(
    phase.minFans,
    phase.maxFans,
    pool.map((t) => [t.minFanCount, t.maxFanCount]),
  );
  const yearPoints = breakpoints(
    FIRST_GAME_YEAR,
    LAST_GAME_YEAR,
    pool.map((t) => [t.minYear, t.maxYear]),
  );

  let worst = { count: Infinity, fans: phase.minFans, year: FIRST_GAME_YEAR };
  for (const fans of fanPoints) {
    for (const year of yearPoints) {
      const count = pool.filter(
        (t) =>
          within(fans, t.minFanCount, t.maxFanCount) &&
          within(year, t.minYear, t.maxYear),
      ).length;
      if (count < worst.count) worst = { count, fans, year };
    }
  }
  return worst;
}

/**
 * Every trait id a template references, in requirements or option gates.
 *
 * @param t - The template.
 * @returns The referenced trait ids (may repeat).
 */
function referencedTraits(t: ActiveEventTemplate): string[] {
  const lists: Array<string[] | string[][] | undefined> = [
    t.requiredBandCharacteristics,
    t.requiredBandCharacteristicsAll,
    t.requiredInvolvedCharacteristics,
    t.requiredInvolvedCharacteristicsAll,
    t.requiredCharacterCharacteristics,
    t.requiredCharacterCharacteristicsAll,
    ...t.options.flatMap((o) => [
      o.visibleIfAnyInvolvedHas,
      o.visibleIfAnyInvolvedHasAll,
      o.visibleIfCharacterHas,
      o.visibleIfCharacterHasAll,
    ]),
  ];
  return lists.flatMap((list) => (list ?? []).flat());
}

describe("ACTIVE_EVENT_TEMPLATES integrity", () => {
  it("has unique ids", () => {
    const ids = ACTIVE_EVENT_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ACTIVE_EVENT_TEMPLATES.map((t) => [t.id, t] as const))(
    "%s only uses placeholders for its own cast",
    (_id, t) => {
      const used = [
        ...JSON.stringify(t).matchAll(/\{character(\d+)(?:_id)?\}/g),
      ].map((m) => Number(m[1]));
      expect(Math.max(0, ...used)).toBeLessThanOrEqual(t.requiredCharacters);
    },
  );

  it.each(ACTIVE_EVENT_TEMPLATES.map((t) => [t.id, t] as const))(
    "%s writes every gendered fragment in three forms for its own cast (ADR-0027)",
    (_id, t) => {
      const text = JSON.stringify(t);
      const opened = [...text.matchAll(/\{character\d+:/g)].length;
      const complete = [
        ...text.matchAll(/\{character(\d+):[^|{}]*\|[^|{}]*\|[^|{}]*\}/g),
      ];
      expect(complete).toHaveLength(opened);
      for (const match of complete) {
        expect(Number(match[1])).toBeLessThanOrEqual(t.requiredCharacters);
      }
    },
  );

  it.each(ACTIVE_EVENT_TEMPLATES.map((t) => [t.id, t] as const))(
    "%s only references known traits",
    (_id, t) => {
      expect(
        referencedTraits(t).filter((id) => !CHARACTERISTIC_IDS.has(id)),
      ).toEqual([]);
    },
  );

  it.each(ACTIVE_EVENT_TEMPLATES.map((t) => [t.id, t] as const))(
    "%s has weighted outcomes that add up to 100",
    (_id, t) => {
      for (const option of t.options) {
        if (Array.isArray(option.consequence)) {
          const total = option.consequence.reduce((s, c) => s + c.chance, 0);
          expect(total).toBe(100);
        }
      }
    },
  );
});

describe("gendered text in the event catalogs (ADR-0027)", () => {
  /** Slash-style inflection such as "calado(a)" or "professor(o)". */
  const SLASH_INFLECTION = /\((a|o)\)/;

  it.each(ACTIVE_EVENT_TEMPLATES.map((t) => [t.id, t] as const))(
    "%s never inflects with (a) or (o)",
    (_id, t) => {
      expect(JSON.stringify(t)).not.toMatch(SLASH_INFLECTION);
    },
  );

  it("never inflects the news with (a) or (o)", () => {
    const offenders = PASSIVE_EVENT_TEMPLATES.filter((t) =>
      SLASH_INFLECTION.test(JSON.stringify(t)),
    );
    expect(offenders).toEqual([]);
  });
});

describe("ACTIVE_EVENT_TEMPLATES coverage (ADR-0025)", () => {
  describe("universal-template rule", () => {
    const byId = (id: string): ActiveEventTemplate => {
      const t = ACTIVE_EVENT_TEMPLATES.find((x) => x.id === id);
      if (!t) throw new Error(`missing template ${id}`);
      return t;
    };

    it("counts a solo template with no trait requirement (its relationship bound does not apply)", () => {
      expect(isUniversal(byId("0002-o-roubo-do-microfone"))).toBe(true);
    });

    it("excludes templates that require a trait", () => {
      expect(isUniversal(byId("0001-melodia-familiar"))).toBe(false);
      expect(isUniversal(byId("0005-caos-no-churrasco"))).toBe(false);
    });

    it("excludes activity fallout, which the random draw never picks", () => {
      expect(isUniversal(byId("9001-copo-a-mais"))).toBe(false);
    });

    it("finds the lowest point of a phase, not the best one", () => {
      const phase: CoveragePhase = {
        name: "Teste",
        minFans: 1000,
        maxFans: 3000,
        target: 0,
        enforced: false,
      };
      const solo = byId("0002-o-roubo-do-microfone");
      const catalog: ActiveEventTemplate[] = [
        { ...solo, id: "a", minFanCount: 1000, maxFanCount: 3000 },
        { ...solo, id: "b", minFanCount: 2001, maxFanCount: undefined },
        { ...solo, id: "c", minFanCount: undefined, maxFanCount: 1500 },
      ];
      // 1000–1500: a + c; 1501–2000: only a; 2001–3000: a + b.
      expect(minimumCoverage(phase, undefined, catalog)).toMatchObject({
        count: 1,
        fans: 1501,
      });
    });

    it("ignores templates that only cover part of the game's years", () => {
      const phase: CoveragePhase = {
        name: "Teste",
        minFans: 0,
        maxFans: 100,
        target: 0,
        enforced: false,
      };
      const solo = byId("0002-o-roubo-do-microfone");
      const catalog: ActiveEventTemplate[] = [
        { ...solo, id: "a", minFanCount: undefined, minYear: 2010 },
      ];
      expect(minimumCoverage(phase, undefined, catalog)).toMatchObject({
        count: 0,
        year: FIRST_GAME_YEAR,
      });
    });
  });

  describe.each(PHASES)("phase $name ($minFans–$maxFans fans)", (phase) => {
    const check = phase.enforced ? it : it.skip;

    check(`has at least ${phase.target} universal templates`, () => {
      expect(minimumCoverage(phase).count).toBeGreaterThanOrEqual(phase.target);
    });

    check(`has at least ${MIN_SOLO} universal solo templates`, () => {
      expect(
        minimumCoverage(phase, (t) => t.requiredCharacters === 1).count,
      ).toBeGreaterThanOrEqual(MIN_SOLO);
    });

    check.each(DRAWN_CATEGORIES)(
      `has at least ${MIN_PER_CATEGORY} universal templates of category %s`,
      (category) => {
        expect(
          minimumCoverage(phase, (t) => t.type === category).count,
        ).toBeGreaterThanOrEqual(MIN_PER_CATEGORY);
      },
    );
  });
});
