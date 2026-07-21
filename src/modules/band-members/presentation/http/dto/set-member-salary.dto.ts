import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";
import {
  SALARY_MAX,
  SALARY_MIN,
} from "@/modules/band-members/domain/constants/salary.constant";

/**
 * HTTP request body for adjusting a member's salary (ADR-0010 §7).
 */
export class SetMemberSalaryDto {
  @ApiProperty({ minimum: SALARY_MIN, maximum: SALARY_MAX, example: 500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(SALARY_MIN)
  @Max(SALARY_MAX)
  amount: number;
}
