/**
 * Domain representation of a non-directional relationship between two band
 * members. The pair is stored in canonical order (`memberAId` < `memberBId`),
 * so A-B and B-A are the same relationship.
 */
export class MemberRelationshipEntity {
  constructor(
    public readonly id: string,
    /** Id of the band both members belong to. */
    public readonly bandId: string,
    /** Lexicographically smaller member id of the pair. */
    public readonly memberAId: string,
    /** Lexicographically larger member id of the pair. */
    public readonly memberBId: string,
    /** Relationship level, -5..5. */
    public readonly level: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
