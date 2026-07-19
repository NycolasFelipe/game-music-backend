/**
 * Musical theme/style identifiers a band can have. Stable IDs used for
 * validation, name generation and event flavor. Display labels live in the
 * presentation layer.
 */
export const BAND_THEMES = [
  "indie-folk",
  "grunge",
  "rock-indie",
  "rock-sinfonico",
  "punk",
  "metal",
  "blues",
  "jazz",
  "synthwave",
  "cyberpunk",
  "steampunk",
  "rave-edm",
  "pop-urbano",
  "rap-hiphop",
  "funk-carioca",
  "kpop",
  "pop-mainstream",
  "samba-raiz",
  "sertanejo",
  "mpb",
  "reggae",
  "folk-rock",
  "egirl-eboy",
  "gotico",
  "emo-scene",
  "skate-streetwear",
] as const;

/** A band theme identifier. */
export type BandTheme = (typeof BAND_THEMES)[number];

/** Origin city identifiers a band can be founded in. */
export const ORIGIN_CITIES = [
  "sao-paulo",
  "rio-janeiro",
  "belo-horizonte",
  "curitiba",
  "porto-alegre",
  "recife",
  "salvador",
  "fortaleza",
  "manaus",
  "brasilia",
  "new-york",
  "los-angeles",
  "chicago",
  "nashville",
  "seattle",
  "austin",
  "detroit",
  "memphis",
  "san-francisco",
  "new-orleans",
] as const;

/** An origin city identifier. */
export type OriginCity = (typeof ORIGIN_CITIES)[number];

/** Foundation decades allowed for a band. */
export const FOUNDATION_YEARS = [1960, 1970, 1980, 1990, 2000, 2010] as const;

/** A foundation year (decade). */
export type FoundationYear = (typeof FOUNDATION_YEARS)[number];

/** Band membership size bounds enforced at creation. */
export const BAND_MEMBERS_MIN = 3;
export const BAND_MEMBERS_MAX = 6;
