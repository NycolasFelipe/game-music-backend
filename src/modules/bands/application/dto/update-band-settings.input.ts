/**
 * Options of a save the player can change (ADR-0013). Omitted keys are left
 * untouched.
 */
export class UpdateBandSettingsInput {
  /**
   * Whether the game raises salaries to their target on every turn, within the
   * available cash.
   */
  autoSalaryAdjust?: boolean;
}
