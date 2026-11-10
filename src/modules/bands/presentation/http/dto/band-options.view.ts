/** An id paired with its display label. */
export class LabeledOptionView {
  id: string;
  label: string;
}

/** A band theme with its label and a one-line pitch (ADR-0030). */
export class ThemeOptionView extends LabeledOptionView {
  /** What the style sounds like, in the game's voice. */
  description: string;
}

/** Options offered to the client when creating a band (new save). */
export class BandOptionsView {
  themes: ThemeOptionView[];
  origins: LabeledOptionView[];
  foundationYears: number[];
}
