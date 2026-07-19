import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { BandView } from "@/modules/bands/application/dto/band.view";

/**
 * Public view of a band composed with its members.
 */
export class BandWithMembersView extends BandView {
  members: BandMemberView[];
}
