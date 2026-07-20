/**
 * Catalog of budget tiers. The chosen tier is both a cost multiplier and a
 * quality lever (ADR-0008 §7): spending more improves the work but risks the
 * band's cash.
 */

/** Stable budget-tier identifiers. */
export const BUDGET_TIER_IDS = ["caseiro", "estudio", "grande"] as const;

/** A budget-tier identifier. */
export type BudgetTierId = (typeof BUDGET_TIER_IDS)[number];

/** Display + economic metadata for a budget tier. */
export interface BudgetTier {
  id: BudgetTierId;
  label: string;
  description: string;
  /** Multiplier applied to the format's base cost. */
  costMultiplier: number;
  /** Multiplier applied to quality (the `budgetBonus`). */
  qualityMultiplier: number;
}

/** The budget-tier catalog. */
export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "caseiro",
    label: "Caseiro",
    description: "Gravado em casa, no improviso. Barato, mas soa cru.",
    costMultiplier: 0.6,
    qualityMultiplier: 0.9,
  },
  {
    id: "estudio",
    label: "Estúdio",
    description: "Um estúdio de verdade, com um bom técnico. O equilíbrio.",
    costMultiplier: 1,
    qualityMultiplier: 1,
  },
  {
    id: "grande",
    label: "Grande Produção",
    description: "Produtor renomado e tempo de sobra. Caro, mas brilha.",
    costMultiplier: 1.8,
    qualityMultiplier: 1.15,
  },
];

/**
 * Finds a budget tier by id.
 *
 * @param id - The budget-tier id.
 * @returns The tier, or `undefined` when unknown.
 */
export function findBudgetTier(id: string): BudgetTier | undefined {
  return BUDGET_TIERS.find((tier) => tier.id === id);
}
