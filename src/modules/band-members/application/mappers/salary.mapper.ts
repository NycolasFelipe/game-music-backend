import { SalaryAgreementView } from "@/modules/band-members/application/dto/salary-agreement.view";
import type { SalaryAgreementEntity } from "@/modules/band-members/domain/entities/salary-agreement.entity";

/**
 * Maps a salary-agreement domain entity to its public view.
 *
 * @param agreement - The salary-agreement domain entity.
 * @returns The salary-agreement view.
 */
export function toSalaryAgreementView(
  agreement: SalaryAgreementEntity,
): SalaryAgreementView {
  return {
    amount: agreement.amount,
    effectiveYear: agreement.effectiveYear,
    reason: agreement.reason,
    createdAt: agreement.createdAt,
  };
}
