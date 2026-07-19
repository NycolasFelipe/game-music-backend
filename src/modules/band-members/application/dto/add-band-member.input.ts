import type { CreateBandMemberData } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Application input for adding a member to a band. Same shape as the
 * persistence data minus the band id, which the use case supplies.
 */
export type AddBandMemberInput = Omit<CreateBandMemberData, "bandId">;
