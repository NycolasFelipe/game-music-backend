/** A member characteristic (trait) with its display data. */
export class CharacteristicView {
  id: string;
  name: string;
  description: string;
  category: string;
  /** Rarity tier (common | uncommon | rare | …), used for display coloring. */
  rarity: string;
}
