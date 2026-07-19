import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import { AddBandMemberUseCase } from "@/modules/band-members/application/use-cases/add-band-member.use-case";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { AddBandMemberInput } from "@/modules/band-members/application/dto/add-band-member.input";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

const input = (characteristics: string[]): AddBandMemberInput => ({
  name: "João",
  age: 24,
  gender: "male",
  avatar: "👨🏽",
  happiness: 1,
  characteristics,
  skills: { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 },
  biography: "bio",
  primarySkill: "guitar",
});

describe("AddBandMemberUseCase", () => {
  let useCase: AddBandMemberUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: { countByBandId: jest.Mock; create: jest.Mock };
  let relationshipsRepository: { syncForMember: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = { countByBandId: jest.fn(), create: jest.fn() };
    relationshipsRepository = { syncForMember: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AddBandMemberUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
        {
          provide: MEMBER_RELATIONSHIPS_REPOSITORY,
          useValue: relationshipsRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(AddBandMemberUseCase);
  });

  it("adds a valid member and returns its view", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.countByBandId.mockResolvedValue(3);
    membersRepository.create.mockResolvedValue(
      new BandMemberEntity(
        "m-1",
        BAND_ID,
        "João",
        24,
        "male",
        "👨🏽",
        1,
        ["creative", "professional"],
        { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 },
        "bio",
        "guitar",
        null,
        new Date(),
        new Date(),
      ),
    );

    const result = await useCase.execute(
      actor,
      BAND_ID,
      input(["creative", "professional"]),
    );

    expect(result).toMatchObject({ id: "m-1", bandId: BAND_ID, name: "João" });
    expect(membersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ bandId: BAND_ID, name: "João" }),
    );
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);

    await expect(
      useCase.execute(actor, BAND_ID, input(["creative"])),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(membersRepository.create).not.toHaveBeenCalled();
  });

  it("throws Conflict when the band is already full", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.countByBandId.mockResolvedValue(6);

    await expect(
      useCase.execute(actor, BAND_ID, input(["creative"])),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(membersRepository.create).not.toHaveBeenCalled();
  });

  it("throws BadRequest for unknown characteristics", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.countByBandId.mockResolvedValue(3);

    await expect(
      useCase.execute(actor, BAND_ID, input(["creative", "not-a-real-trait"])),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(membersRepository.create).not.toHaveBeenCalled();
  });
});
