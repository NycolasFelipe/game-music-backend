import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";
import {
  SALARY_MAX,
  SALARY_MIN,
} from "@/modules/band-members/domain/constants/salary.constant";

/**
 * HTTP request body for adjusting a member's salary (ADR-0010 §7). Salaries are
 * whole numbers only (no decimals).
 */
export class SetMemberSalaryDto {
  @ApiProperty({ minimum: SALARY_MIN, maximum: SALARY_MAX, example: 500 })
  @IsInt()
  @Min(SALARY_MIN)
  @Max(SALARY_MAX)
  amount: number;
}
