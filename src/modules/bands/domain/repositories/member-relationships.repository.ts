import type { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";

/** DI token for the member-relationships repository implementation. */
export const MEMBER_RELATIONSHIPS_REPOSITORY = Symbol(
  "MEMBER_RELATIONSHIPS_REPOSITORY",
);

/**
 * Persistence contract for member relationships (part of the band aggregate).
 * All operations are scoped by band.
 */
export interface MemberRelationshipsRepository {
  /**
   * Lists all relationships of a band.
   *
   * @param bandId - The band id.
   * @returns The band's relationships.
   */
  findByBandId(bandId: string): Promise<MemberRelationshipEntity[]>;

  /**
   * Creates any missing pairwise relationships between the given member and the
   * other members of the band (idempotent).
   *
   * @param bandId - The band id.
   * @param memberId - The member to sync relationships for.
   * @returns A promise that resolves once syncing completes.
   */
  syncForMember(bandId: string, memberId: string): Promise<void>;

  /**
   * Sets (upserts) the level of the relationship between two members of a band.
   *
   * @param bandId - The band id.
   * @param memberId1 - One member id.
   * @param memberId2 - The other member id.
   * @param level - The new level (-5..5).
   * @returns The updated relationship, or `null` when either member is not in
   * the band.
   */
  setLevel(
    bandId: string,
    memberId1: string,
    memberId2: string,
    level: number,
  ): Promise<MemberRelationshipEntity | null>;
}
