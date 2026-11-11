import {
  adj2,
  adjO,
  fem,
  masc,
  onlyBefore,
  type EnglishNoun,
} from "@/common/language/lexicon";
import type {
  EnglishTitleWords,
  RomanceTitleWords,
} from "@/modules/releases/domain/generation/release-title.lexicon";

/**
 * Word banks for release titles. Every word carries gender and number so the
 * generator can make adjectives and contractions agree ("Cinzas Eternas",
 * "Saudade do Verão", "La Memoria de la Ceniza").
 *
 * The words are timeless on purpose: titles appear in the Gazeta and in the
 * reviews of any year from 1960 to 2050 (ADR-0024, ADR-0026).
 */
export const PT_RELEASE_TITLE_WORDS: RomanceTitleWords = {
  adjectives: [
    onlyBefore(adjO("Último")),
    adjO("Eterno", true),
    adj2("Selvagem", "Selvagens"),
    adjO("Silencioso", true),
    adjO("Infinito", true),
    adjO("Perdido"),
    { ms: "Nu", fs: "Nua", mp: "Nus", fp: "Nuas" },
    adj2("Distante", "Distantes", true),
    { ms: "Cru", fs: "Crua", mp: "Crus", fp: "Cruas" },
    adjO("Elétrico"),
    adjO("Sagrado", true),
    adj2("Frágil", "Frágeis", true),
    adjO("Amargo"),
    adjO("Barato"),
  ],
  nouns: [
    masc("Eco"),
    masc("Fogo"),
    fem("Cinza"),
    masc("Verão", "Verões"),
    masc("Abismo"),
    masc("Concreto", null),
    masc("Neon", null),
    masc("Vento"),
    masc("Espelho"),
    masc("Ruído"),
    masc("Fantasma"),
    masc("Refúgio"),
    fem("Estrada"),
    fem("Chuva"),
    fem("Madrugada"),
    fem("Neblina", null),
  ],
  abstracts: [
    fem("Saudade"),
    fem("Vertigem", "Vertigens"),
    fem("Insônia"),
    masc("Delírio"),
    fem("Memória"),
    fem("Ausência"),
    fem("Euforia", null),
    masc("Colapso"),
    fem("Redenção", null),
    fem("Ruína"),
    fem("Febre"),
    fem("Ressaca"),
    fem("Glória"),
    fem("Desordem", null),
  ],
};

export const ES_RELEASE_TITLE_WORDS: RomanceTitleWords = {
  adjectives: [
    onlyBefore(adjO("Último")),
    adjO("Eterno", true),
    adj2("Salvaje", "Salvajes"),
    adjO("Silencioso", true),
    adjO("Infinito", true),
    adjO("Perdido"),
    adjO("Desnudo"),
    adj2("Distante", "Distantes", true),
    adjO("Crudo"),
    adjO("Eléctrico"),
    adjO("Sagrado", true),
    adj2("Frágil", "Frágiles", true),
    adjO("Amargo"),
    adjO("Barato"),
  ],
  nouns: [
    masc("Eco"),
    masc("Fuego"),
    fem("Ceniza"),
    masc("Verano"),
    masc("Abismo"),
    masc("Concreto", null),
    masc("Neón", null),
    masc("Viento"),
    masc("Espejo"),
    masc("Ruido"),
    masc("Fantasma"),
    masc("Refugio"),
    fem("Carretera"),
    fem("Lluvia"),
    fem("Madrugada"),
    fem("Niebla", null),
  ],
  abstracts: [
    fem("Añoranza"),
    masc("Vértigo"),
    masc("Insomnio"),
    masc("Delirio"),
    fem("Memoria"),
    fem("Ausencia"),
    fem("Euforia", null),
    masc("Colapso"),
    fem("Redención", null),
    fem("Ruina"),
    fem("Fiebre"),
    fem("Resaca"),
    fem("Gloria"),
    masc("Desorden", null),
  ],
};

/**
 * Builds a countable English noun with a regular or given plural.
 *
 * @param sg - Singular form.
 * @param pl - Plural form.
 * @returns The noun entry.
 */
function noun(sg: string, pl = `${sg}s`): EnglishNoun {
  return { sg, pl };
}

/**
 * Builds an English mass noun (no plural, no "a/an").
 *
 * @param sg - The only form.
 * @returns The noun entry.
 */
function mass(sg: string): EnglishNoun {
  return { sg, pl: null };
}

export const EN_RELEASE_TITLE_WORDS: EnglishTitleWords = {
  adjectives: [
    "Last",
    "Eternal",
    "Wild",
    "Silent",
    "Endless",
    "Lost",
    "Naked",
    "Distant",
    "Raw",
    "Electric",
    "Sacred",
    "Fragile",
    "Bitter",
    "Cheap",
  ],
  nouns: [
    noun("Echo", "Echoes"),
    mass("Fire"),
    mass("Ashes"),
    noun("Summer"),
    noun("Abyss", "Abysses"),
    mass("Concrete"),
    mass("Neon"),
    noun("Wind"),
    noun("Mirror"),
    mass("Noise"),
    noun("Ghost"),
    noun("Shelter"),
    noun("Road"),
    mass("Rain"),
    noun("Night"),
    mass("Fog"),
  ],
  abstracts: [
    "Longing",
    "Vertigo",
    "Insomnia",
    "Delirium",
    "Memory",
    "Absence",
    "Euphoria",
    "Collapse",
    "Redemption",
    "Ruin",
    "Fever",
    "Glory",
    "Disorder",
  ],
};
