import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";

/** The band state a turn forecast is simulated from (ADR-0022). */
export class ForecastTurnInput {
  /** The band id (its releases still earning royalties are loaded by id). */
  bandId: string;
  /** Cash now. */
  balance: number;
  /** Fan count (drives each member's salary target). */
  fanCount: number;
  /** Whether the save raises salaries automatically (ADR-0013). */
  autoSalaryAdjust: boolean;
  /** The band's current members. */
  members: BandMemberEntity[];
}
