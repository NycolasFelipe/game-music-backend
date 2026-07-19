import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import type { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import type { BandEntity } from "@/modules/bands/domain/entities/band.entity";

/**
 * Read model composing a band with its members and their relationships.
 * Assembled by the bands repository (the aggregate root) for composed
 * reads/writes, avoiding a cross-module cycle in the pure domain entities.
 */
export interface BandWithMembers {
  band: BandEntity;
  members: BandMemberEntity[];
  relationships: MemberRelationshipEntity[];
}
