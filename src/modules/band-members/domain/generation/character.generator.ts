import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import {
  SKILL_TYPES,
  type Skills,
  type SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type { CharacteristicCategory } from "@/modules/band-members/domain/constants/characteristic.constant";
import {
  areCharacteristicsCompatible,
  getCharacteristicsByCategory,
} from "@/modules/band-members/domain/data/characteristics";
import { BIOGRAPHIES } from "@/modules/band-members/domain/data/biographies";
import {
  FEMALE_NAMES,
  LAST_NAMES,
  MALE_NAMES,
} from "@/modules/band-members/domain/data/names";
import type { GeneratedBandMember } from "@/modules/band-members/domain/generation/generated-band-member";

/**
 * Character generator — pure functions ported from the `game-music` frontend
 * `characterGenerator`. Produces a member candidate; ids/persistence are
 * handled by the caller.
 */

/**
 * Returns a random integer in `[min, max]` (inclusive).
 *
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns The random integer.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Picks a random element from a non-empty array.
 *
 * @param array - The array to pick from.
 * @returns A random element.
 */
function pick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a full name for the given gender.
 *
 * @param gender - The member's gender.
 * @returns A "first last" name.
 */
function generateName(gender: Gender): string {
  const firstNames = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
  return `${pick(firstNames)} ${pick(LAST_NAMES)}`;
}

/** Fitzpatrick skin-tone modifiers. */
const SKIN_TONES = [
  "\u{1F3FB}",
  "\u{1F3FC}",
  "\u{1F3FD}",
  "\u{1F3FE}",
  "\u{1F3FF}",
];

/** Zero-width joiner used to attach a hair component to the person emoji. */
const ZWJ = "‍";

/** Hair components appended after the skin tone (empty = default hair). */
const HAIR = [
  "",
  `${ZWJ}\u{1F9B0}`, // red
  `${ZWJ}\u{1F9B1}`, // curly
  `${ZWJ}\u{1F9B3}`, // white
  `${ZWJ}\u{1F9B2}`, // bald
];

/**
 * Generates a persistent person emoji (gender + random skin tone + random hair)
 * so a member is identifiable by appearance.
 *
 * @param gender - The member's gender.
 * @returns The composed emoji string.
 */
function generateAvatar(gender: Gender): string {
  const base = gender === "male" ? "\u{1F468}" : "\u{1F469}";
  return `${base}${pick(SKIN_TONES)}${pick(HAIR)}`;
}

/**
 * Generates the skill set (each 0..3), guaranteeing at least one skill at 3.
 *
 * @returns The generated skills.
 */
function generateSkills(): Skills {
  const skills: Skills = {
    vocal: randomInt(0, 3),
    guitar: randomInt(0, 3),
    bass: randomInt(0, 3),
    drums: randomInt(0, 3),
    piano: randomInt(0, 3),
    lyrics: randomInt(0, 3),
  };

  const hasLevel3 = SKILL_TYPES.some((key) => skills[key] === 3);
  if (!hasLevel3) {
    skills[pick(SKILL_TYPES)] = 3;
  }

  return skills;
}

/**
 * Finds the highest skill, breaking ties at random.
 *
 * @param skills - The skill set.
 * @returns The primary skill type.
 */
function findPrimarySkill(skills: Skills): SkillType {
  const maxValue = Math.max(...SKILL_TYPES.map((key) => skills[key]));
  const topSkills = SKILL_TYPES.filter((key) => skills[key] === maxValue);
  return pick(topSkills);
}

/**
 * Generates 2..4 compatible characteristics using the slot system.
 *
 * @returns The selected characteristic ids.
 */
function generateCharacteristics(): string[] {
  const selected: string[] = [];

  // Slot 1: Personality (required)
  const slot1 = pick(getCharacteristicsByCategory("personality"));
  selected.push(slot1.id);

  // Slot 2: Professionalism (required, compatible with slot 1)
  const compatibleProf = getCharacteristicsByCategory("professionalism").filter(
    (c) => areCharacteristicsCompatible(slot1.id, c.id),
  );
  const slot2 = pick(compatibleProf);
  selected.push(slot2.id);

  // Slot 3: Fame OR Creative (required, 50/50), compatible with slots 1-2
  const slot3Category: CharacteristicCategory =
    Math.random() < 0.5 ? "fame" : "creative";
  const compatibleSlot3 = getCharacteristicsByCategory(slot3Category).filter(
    (c) =>
      areCharacteristicsCompatible(slot1.id, c.id) &&
      areCharacteristicsCompatible(slot2.id, c.id),
  );
  if (compatibleSlot3.length > 0) {
    selected.push(pick(compatibleSlot3).id);
  }

  // Slot 4: Social OR Situational (optional, 30%), compatible with all so far
  if (Math.random() < 0.3) {
    const slot4Category: CharacteristicCategory =
      Math.random() < 0.5 ? "social" : "situational";
    const compatibleSlot4 = getCharacteristicsByCategory(slot4Category).filter(
      (c) => selected.every((id) => areCharacteristicsCompatible(id, c.id)),
    );
    if (compatibleSlot4.length > 0) {
      selected.push(pick(compatibleSlot4).id);
    }
  }

  return selected;
}

/**
 * Generates an initial happiness value using a distribution centered on 0.
 *
 * @returns A happiness value in -5..5.
 */
function generateInitialHappiness(): number {
  const rand = Math.random() * 100;
  if (rand < 30) return 0;
  if (rand < 50) return 1;
  if (rand < 70) return -1;
  if (rand < 78) return 2;
  if (rand < 86) return -2;
  if (rand < 90) return 3;
  if (rand < 94) return -3;
  if (rand < 96) return 4;
  if (rand < 98) return -4;
  if (rand < 99) return 5;
  return -5;
}

/** Male gender-marker resolutions applied to biography templates. */
const MALE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\[o-a\]/g, "o"],
  [/\[e-a\]/g, "e"],
  [/\[ã\]o/g, "ão"],
  [/irm\[ã\]o/g, "irmão"],
];

/** Female gender-marker resolutions applied to biography templates. */
const FEMALE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\[o-a\]/g, "a"],
  [/\[e-a\]/g, "a"],
  [/irm\[ã\]o/g, "irmã"],
  [/\[ã\]o/g, "ã"],
];

/**
 * Occupation/role markers that resolve to a masculine or feminine form.
 * Each entry is `[marker, masculine, feminine]`.
 */
const ROLE_REPLACEMENTS: Array<[RegExp, string, string]> = [
  [/Professor\[a\]/g, "Professor", "Professora"],
  [/Criad\[o-a\]/g, "Criado", "Criada"],
  [/Antig\[o-a\]/g, "Antigo", "Antiga"],
  [/Autodidat\[a\]/g, "Autodidata", "Autodidata"],
  [/Formad\[o-a\]/g, "Formado", "Formada"],
  [/Conhecid\[o-a\]/g, "Conhecido", "Conhecida"],
  [/proibid\[o-a\]/g, "proibido", "proibida"],
  [/Treinad\[o-a\]/g, "Treinado", "Treinada"],
  [/sóci\[o-a\]/g, "sócio", "sócia"],
  [/nov\[o-a\]/g, "novo", "nova"],
  [/alun\[o-a\]/g, "aluno", "aluna"],
  [/suad\[o-a\]/g, "suado", "suada"],
  [/caix\[a\]/g, "caixa", "caixa"],
  [/instrutor\[a\]/g, "instrutor", "instrutora"],
  [/molhad\[o-a\]/g, "molhado", "molhada"],
  [/jogador\[a\]/g, "jogador", "jogadora"],
  [/digitador\[a\]/g, "digitador", "digitadora"],
  [/operador\[a\]/g, "operador", "operadora"],
  [/meteorologist\[a\]/g, "meteorologista", "meteorologista"],
  [/caçador\[a\]/g, "caçador", "caçadora"],
  [/organizador\[a\]/g, "organizador", "organizadora"],
  [/redator\[a\]/g, "redator", "redatora"],
  [/entregador\[a\]/g, "entregador", "entregadora"],
  [/fisc\[a\]/g, "fiscal", "fiscal"],
  [/tradutor\[a\]/g, "tradutor", "tradutora"],
  [/monitor\[a\]/g, "monitor", "monitora"],
  [/contador\[a\]/g, "contador", "contadora"],
  [/cozinheir\[o-a\]/g, "cozinheiro", "cozinheira"],
  [/tecnic\[o-a\]/g, "técnico", "técnica"],
  [/mecânic\[o-a\]/g, "mecânico", "mecânica"],
  [/plantador\[a\]/g, "plantador", "plantadora"],
  [/controlador\[a\]/g, "controlador", "controladora"],
  [/ignorad\[o-a\]/g, "ignorado", "ignorada"],
  [/especializad\[o-a\]/g, "especializado", "especializada"],
  [/animador\[a\]/g, "animador", "animadora"],
  [/vendedor\[a\]/g, "vendedor", "vendedora"],
  [/advogad\[o-a\]/g, "advogado", "advogada"],
  [/técnic\[o-a\]/g, "técnico", "técnica"],
  [/cuidador\[a\]/g, "cuidador", "cuidadora"],
];

/**
 * Resolves a biography template's name and gender markers.
 *
 * @param template - The raw template text.
 * @param name - The member's name to interpolate.
 * @param gender - The member's gender.
 * @returns The resolved biography text.
 */
function resolveBiography(
  template: string,
  name: string,
  gender: Gender,
): string {
  let bio = template.replace(/\[nome( do personagem)?\]/g, name);

  const generic = gender === "male" ? MALE_REPLACEMENTS : FEMALE_REPLACEMENTS;
  for (const [pattern, replacement] of generic) {
    bio = bio.replace(pattern, replacement);
  }

  for (const [pattern, male, female] of ROLE_REPLACEMENTS) {
    bio = bio.replace(pattern, gender === "male" ? male : female);
  }

  return bio;
}

/**
 * Generates a biography for a name/gender/skill.
 *
 * @param name - The member's name.
 * @param gender - The member's gender.
 * @param skill - The primary skill guiding the biography.
 * @returns The resolved biography text.
 */
function generateBiography(
  name: string,
  gender: Gender,
  skill: SkillType,
): string {
  const templates = BIOGRAPHIES.filter((b) => b.skill === skill);
  return resolveBiography(pick(templates).text, name, gender);
}

/**
 * Generates a complete band member candidate (name, age, gender, happiness,
 * skills, characteristics, primary skill and biography).
 *
 * @returns The generated member candidate.
 */
export function generateBandMember(): GeneratedBandMember {
  const gender: Gender = Math.random() < 0.5 ? "male" : "female";
  const name = generateName(gender);
  const skills = generateSkills();
  const primarySkill = findPrimarySkill(skills);

  return {
    name,
    age: randomInt(16, 30),
    gender,
    avatar: generateAvatar(gender),
    happiness: generateInitialHappiness(),
    characteristics: generateCharacteristics(),
    skills,
    biography: generateBiography(name, gender, primarySkill),
    primarySkill,
  };
}
