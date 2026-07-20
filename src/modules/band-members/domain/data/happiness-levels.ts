/**
 * Happiness-level flavor metadata (emoji + name + description), ported verbatim
 * from the `game-music` frontend (read-only reference). Levels run from -5
 * (rock bottom) to 5 (nirvana). A member's decimal happiness is bucketed to the
 * nearest level for display.
 */

/** Display metadata for a single happiness level. */
export interface HappinessLevelInfo {
  level: number;
  emoji: string;
  name: string;
  description: string;
}

export const HAPPINESS_LEVELS: HappinessLevelInfo[] = [
  {
    level: -5,
    emoji: "💀",
    name: "No Fundo do Poço",
    description:
      "Se pudesse, pediria demissão da própria vida e ainda reclamaria do RH.",
  },
  {
    level: -4,
    emoji: "😭",
    name: "Devastado",
    description:
      "Tudo parece dar errado. Até o afinador desafina por solidariedade.",
  },
  {
    level: -3,
    emoji: "😞",
    name: "Muito Abalado",
    description:
      "A motivação sumiu e a paciência também. Qualquer coisinha vira tempestade.",
  },
  {
    level: -2,
    emoji: "😕",
    name: "Desanimado",
    description:
      "Vai empurrando com a barriga. O sorriso existe, mas está em turnê.",
  },
  {
    level: -1,
    emoji: "😒",
    name: "Irritado",
    description:
      "Não está péssimo, mas também não está ok. Responde “tá” com ponto final.",
  },
  {
    level: 0,
    emoji: "😐",
    name: "Neutro",
    description:
      "Nem feliz, nem triste. Só seguindo o setlist e esperando a próxima música.",
  },
  {
    level: 1,
    emoji: "🙂",
    name: "De Boa",
    description:
      "O dia está ok. Dá pra ensaiar sem drama e até rir de uma piada ruim.",
  },
  {
    level: 2,
    emoji: "😊",
    name: "Animado",
    description:
      "Energia boa. Topa ideias novas e encara o ensaio como parte da diversão.",
  },
  {
    level: 3,
    emoji: "😁",
    name: "Muito Feliz",
    description:
      "Tá brilhando. A vibe contagia e qualquer desafio parece possível.",
  },
  {
    level: 4,
    emoji: "🤩",
    name: "Eufórico",
    description:
      "A autoestima está no palco com holofote. Quer fazer tudo, agora.",
  },
  {
    level: 5,
    emoji: "🧘",
    name: "Nirvana",
    description: "Estado de clareza absoluta e paz inabalável.",
  },
];
