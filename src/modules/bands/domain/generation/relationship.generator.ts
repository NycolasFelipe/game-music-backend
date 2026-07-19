/**
 * Relationship generation — pure functions ported from the `game-music`
 * frontend. Levels use a weighted distribution centered on 0 (neutral).
 */

/** A canonical member pair with a level. */
export interface GeneratedRelationship {
  memberAId: string;
  memberBId: string;
  level: number;
}

/**
 * Orders two member ids canonically so that A-B and B-A map to the same pair.
 *
 * @param id1 - One member id.
 * @param id2 - The other member id.
 * @returns The pair as `[smaller, larger]`.
 */
export function canonicalPair(id1: string, id2: string): [string, string] {
  return id1 < id2 ? [id1, id2] : [id2, id1];
}

/**
 * Generates an initial relationship level using a distribution favoring
 * neutral relationships (same weighting as the frontend).
 *
 * @returns A level in -5..5.
 */
export function generateInitialLevel(): number {
  const rand = Math.random() * 100;
  if (rand < 30) return 0;
  if (rand < 50) return 1;
  if (rand < 70) return -1;
  if (rand < 78) return 2;
  if (rand < 86) return -2;
  if (rand < 90) return 3;
  if (rand < 94) return -3;
  if (rand < 96) return 4;
  if (rand < 98) return -4;
  if (rand < 99) return 5;
  return -5;
}

/**
 * Generates all pairwise relationships for a set of member ids.
 *
 * @param memberIds - The member ids to pair.
 * @returns One generated relationship per unique pair (canonical order).
 */
export function generateRelationshipsForMembers(
  memberIds: string[],
): GeneratedRelationship[] {
  const relationships: GeneratedRelationship[] = [];
  for (let i = 0; i < memberIds.length; i++) {
    for (let j = i + 1; j < memberIds.length; j++) {
      const [memberAId, memberBId] = canonicalPair(memberIds[i], memberIds[j]);
      relationships.push({
        memberAId,
        memberBId,
        level: generateInitialLevel(),
      });
    }
  }
  return relationships;
}
