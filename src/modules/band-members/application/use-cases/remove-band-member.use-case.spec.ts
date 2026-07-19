import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { RemoveBandMemberUseCase } from "@/modules/band-members/application/use-cases/remove-band-member.use-case";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("RemoveBandMemberUseCase", () => {
  let useCase: RemoveBandMemberUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: { deleteByIdAndBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = { deleteByIdAndBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        RemoveBandMemberUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(RemoveBandMemberUseCase);
  });

  it("removes the member when it exists in the owner's band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.deleteByIdAndBandId.mockResolvedValue(true);

    await expect(
      useCase.execute(actor, BAND_ID, "m-1"),
    ).resolves.toBeUndefined();
    expect(membersRepository.deleteByIdAndBandId).toHaveBeenCalledWith(
      "m-1",
      BAND_ID,
    );
  });

  it("throws NotFound when the member is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.deleteByIdAndBandId.mockResolvedValue(false);
    await expect(useCase.execute(actor, BAND_ID, "m-x")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
