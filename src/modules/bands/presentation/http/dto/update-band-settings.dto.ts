import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

/**
 * HTTP request body for changing a save's options (ADR-0013). Every option is
 * optional: omitted keys keep their current value.
 */
export class UpdateBandSettingsDto {
  @ApiPropertyOptional({
    description:
      "Raise salaries to their target every turn, whenever the cash covers the new payroll.",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  autoSalaryAdjust?: boolean;
}
