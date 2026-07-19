import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { MemberRelationshipView } from "@/modules/bands/application/dto/member-relationship.view";
import { BandView } from "@/modules/bands/application/dto/band.view";

/**
 * Public view of a band composed with its members and their relationships.
 */
export class BandWithMembersView extends BandView {
  members: BandMemberView[];
  relationships: MemberRelationshipView[];
}
