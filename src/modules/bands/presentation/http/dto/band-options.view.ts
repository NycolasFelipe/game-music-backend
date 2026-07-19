/** An id paired with its display label. */
export class LabeledOptionView {
  id: string;
  label: string;
}

/** Options offered to the client when creating a band (new save). */
export class BandOptionsView {
  themes: LabeledOptionView[];
  origins: LabeledOptionView[];
  foundationYears: number[];
}
