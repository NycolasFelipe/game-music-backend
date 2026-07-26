import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { calculateFameLevel } from "@/modules/bands/domain/fame/fame.calculator";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { GigResultView } from "@/modules/gigs/application/dto/gig-result.view";
import { PlayGigInput } from "@/modules/gigs/application/dto/play-gig.input";
import { toGigView } from "@/modules/gigs/application/mappers/gig.mapper";
import {
  GIG_SKILL_GAIN_WEIGHT,
  GIG_VARIANCE,
  STAGE_SKILL_WEIGHTS,
} from "@/modules/gigs/domain/constants/gig.constant";
import { findGigType } from "@/modules/gigs/domain/data/gig-types";
import { evaluateGig } from "@/modules/gigs/domain/gig/gig.calculator";
import {
  GIGS_REPOSITORY,
  type GigsRepository,
} from "@/modules/gigs/domain/repositories/gigs.repository";
import { grownSkill } from "@/modules/releases/domain/growth/growth.calculator";

/**
 * Plays the band's live season on a circuit (ADR-0016): checks the fame gate,
 * the turn's slot and the cash for the season's cost, then applies the fee, the
 * new fans, the mood the road left and the stage skill it built — all in one
 * atomic band-state change.
 */
@Injectable()
export class PlayGigUseCase {
  private readonly logger = new Logger(PlayGigUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(GIGS_REPOSITORY)
    private readonly gigsRepository: GigsRepository,
  ) {}

  /**
   * Plays one live season for a band the actor owns.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @param input - The circuit to play.
   * @returns The recorded season and the band's new state.
   * @throws {NotFoundException} When the band or the circuit does not exist.
   * @throws {ConflictException} When the band already played this turn.
   * @throws {BadRequestException} When fame or cash do not allow the circuit.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    input: PlayGigInput,
  ): Promise<GigResultView> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    if (!composed) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const gigType = findGigType(input.gigTypeId);
    if (!gigType) {
      throw new NotFoundException("Unknown gig type.");
    }

    const fameLevel = calculateFameLevel(composed.band.fanCount);
    if (fameLevel < gigType.minFameLevel) {
      throw new BadRequestException(
        `This circuit books bands from fame level ${gigType.minFameLevel} (the band is at ${fameLevel}).`,
      );
    }

    const alreadyPlayed = await this.gigsRepository.countByBandAndYear(
      bandId,
      composed.band.currentYear,
    );
    if (alreadyPlayed > 0) {
      throw new ConflictException(
        "The band already played its season this turn.",
      );
    }

    if (composed.band.balance < gigType.cost) {
      throw new BadRequestException(
        "Insufficient balance to cover this season's costs.",
      );
    }

    const variance = 1 + (Math.random() * 2 - 1) * GIG_VARIANCE;
    const evaluation = evaluateGig({
      gigType,
      members: composed.members.map((member) => ({
        id: member.id,
        skills: member.skills,
        happiness: member.happiness,
      })),
      currentFans: composed.band.fanCount,
      variance,
    });

    // The road builds stage skill (ADR-0016 §5), on the same curve a work uses.
    const skillGains: GigResultView["skillGains"] = [];
    const memberSkills = composed.members.flatMap((member) => {
      const skill = member.primarySkill;
      if (!(skill in STAGE_SKILL_WEIGHTS)) {
        return [];
      }
      const from = member.skills[skill];
      const to = grownSkill(
        from,
        evaluation.performance * 100,
        GIG_SKILL_GAIN_WEIGHT,
      );
      if (to <= from) {
        return [];
      }
      skillGains.push({
        memberId: member.id,
        name: member.name,
        skill,
        from,
        to,
      });
      return [
        { memberId: member.id, skills: { ...member.skills, [skill]: to } },
      ];
    });

    const newBalance =
      Math.round((composed.band.balance + evaluation.net) * 100) / 100;
    const newFans = composed.band.fanCount + evaluation.fansGained;

    await this.bandsRepository.applyBandStateChanges(bandId, {
      balance: newBalance,
      fanCount: newFans,
      memberHappiness: evaluation.memberHappiness,
      memberSkills,
    });

    const gig = await this.gigsRepository.create({
      bandId,
      gigTypeId: gigType.id,
      playedAtYear: composed.band.currentYear,
      fee: evaluation.fee,
      cost: evaluation.cost,
      fansGained: evaluation.fansGained,
      performance: evaluation.performance,
      happinessDelta: evaluation.happinessDelta,
    });

    this.logger.log(
      `Band ${bandId} played ${gigType.id} (performance ${evaluation.performance}): ` +
        `${evaluation.net} net, +${evaluation.fansGained} fans.`,
    );

    return {
      gig: toGigView(gig),
      balance: newBalance,
      fanCount: newFans,
      skillGains,
    };
  }
}
