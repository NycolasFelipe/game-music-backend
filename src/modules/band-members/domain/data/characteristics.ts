import type {
  Characteristic,
  CharacteristicCategory,
} from "@/modules/band-members/domain/constants/characteristic.constant";

/**
 * Static catalog of personality traits, ported from the `game-music` frontend.
 * Keyed by trait id.
 */
export const CHARACTERISTICS: Record<string, Characteristic> = {
  // Personality (Core) - Slot 1
  friendly: {
    id: "friendly",
    name: "Amigável",
    description:
      "Distribui abraços como se fossem flyers de show grátis. Melhora o clima, mas pode chorar ao demitir alguém.",
    category: "personality",
    opposites: ["envious", "manipulator"],
    rarity: "common",
  },
  conciliator: {
    id: "conciliator",
    name: "Conciliador",
    description:
      'A paz custa caro - especialmente quando ele propõe fazer uma "reunião de descompressão" no meio da gravação do hit do ano.',
    category: "personality",
    opposites: ["hothead", "manipulator"],
    rarity: "common",
  },
  hothead: {
    id: "hothead",
    name: "Cabeça Quente",
    description:
      "Sua guitarra não é o único instrumento que ele sabe incendiar. Performances elétricas e conflitos garantidos!",
    category: "personality",
    opposites: ["conciliator", "friendly"],
    rarity: "uncommon",
  },
  creative: {
    id: "creative",
    name: "Criativo",
    description:
      'Tem ideias brilhantes, como gravar o próximo álbum usando apenas barulhos de liquidificador. 10% genial, 90% "isso é mesmo uma música?".',
    category: "personality",
    opposites: ["plagiarist"],
    rarity: "common",
  },
  erratic: {
    id: "erratic",
    name: "Errático",
    description:
      "Hoje é um gênio incompreendido, amanhã esquece como segurar um microfone. Nunca um tédio!",
    category: "personality",
    opposites: ["professional", "stable"],
    rarity: "rare",
  },
  genius: {
    id: "genius",
    name: "Genial",
    description:
      "Faz solos de guitarra que desafiam a física, mas também exige que o backstage tenha velas aromáticas específicas da região do Himalaia.",
    category: "personality",
    opposites: [],
    rarity: "rare",
  },
  playful: {
    id: "playful",
    name: "Brincalhão",
    description:
      "Passa mais tempo fazendo pegadinhas do que ensaiando. Mantém o moral alto, desde que ninguém tire seu saco de bolinhas de gude.",
    category: "personality",
    opposites: ["perfectionist"],
    rarity: "common",
  },
  romantic: {
    id: "romantic",
    name: "Romântico",
    description:
      "Compõe baladas que derretem corações... quando não está tendo um bloqueio criativo porque a cafeteria favorita ficou sem croissant.",
    category: "personality",
    opposites: ["greedy"],
    rarity: "uncommon",
  },
  confident: {
    id: "confident",
    name: "Confiante",
    description:
      "Tem uma autoestima tão alta que poderia vender um pouco. Críticas rolam como água no óleo de guitarra.",
    category: "personality",
    opposites: ["insecure"],
    rarity: "common",
  },
  envious: {
    id: "envious",
    name: "Invejoso",
    description:
      'Conta os holofotes que cada membro da banda recebe e acha que o tecladista está roubando sua "energia cósmica".',
    category: "personality",
    opposites: ["friendly", "loyal"],
    rarity: "uncommon",
  },

  // Professionalism - Slot 2
  perfectionist: {
    id: "perfectionist",
    name: "Perfeccionista",
    description:
      'Gravar uma música com ele leva 3 meses e 47 takes. "Apenas mais um, desta vez com mais alma... e 2dB menos no agudo".',
    category: "professionalism",
    opposites: ["lazy", "informal"],
    rarity: "uncommon",
  },
  lazy: {
    id: "lazy",
    name: "Preguiçoso",
    description:
      'Considera "ensaiar" como assistir clipes no YouTube. Seu lema: "Por que fazer em 5 takes se podemos aceitar o primeiro?"',
    category: "professionalism",
    opposites: ["perfectionist", "professional", "workaholic"],
    rarity: "uncommon",
  },
  professional: {
    id: "professional",
    name: "Profissional",
    description:
      "Chega no horário, sabe todas as partes e ainda traz café para a equipe. Chato? Talvez. O braço direito que você precisa? Definitivamente.",
    category: "professionalism",
    opposites: ["lazy", "erratic"],
    rarity: "common",
  },
  informal: {
    id: "informal",
    name: "Informal",
    description:
      'Acha que "deadline" é sugestão e reuniões são opcionais. Mas quando a pressão vem, produz mais que uma máquina de café expresso.',
    category: "professionalism",
    opposites: ["perfectionist"],
    rarity: "common",
  },

  // Fame/Success - Slot 3
  greedy: {
    id: "greedy",
    name: "Ganancioso",
    description:
      "Vê cada fã como uma nota de dólar andante. Renegocia contratos mais vezes do que troca de corda.",
    category: "fame",
    opposites: ["purist", "romantic", "spiritual"],
    rarity: "uncommon",
  },
  purist: {
    id: "purist",
    name: "Artista Purista",
    description:
      'Acha que sucesso comercial é uma doença contagiosa. Prefere tocar para 3 pessoas em um porão do que "vender a alma".',
    category: "fame",
    opposites: ["greedy"],
    rarity: "uncommon",
  },
  validation_seeker: {
    id: "validation_seeker",
    name: "Carente de Validação",
    description:
      "Vive pelos likes. Uma crítica de um desconhecido no fórum pode mandá-lo para terapia por uma semana.",
    category: "fame",
    opposites: ["shy"],
    rarity: "common",
  },
  dazzled: {
    id: "dazzled",
    name: "Deslumbrado",
    description:
      "O primeiro sinal de sucesso e ele já está comprando um helicóptero de pelúcia. Lida com fama tão bem como um peixe com um guarda-chuva.",
    category: "fame",
    opposites: ["stable"],
    rarity: "rare",
  },
  stable: {
    id: "stable",
    name: "Estável",
    description:
      "Poderia ganhar um Grammy e ainda assim aparecer no ensaio no dia seguinte como se nada tivesse acontecido. Chato e previsível, mas necessário.",
    category: "fame",
    opposites: ["dazzled", "erratic"],
    rarity: "common",
  },

  // Creative/Vision - Slot 3
  experimental: {
    id: "experimental",
    name: "Experimental",
    description:
      'Quer incorporar sons de animais da floresta amazônica no próximo álbum. "Confia, vai ser o novo dubstep!"',
    category: "creative",
    opposites: ["conservative"],
    rarity: "common",
  },
  conservative: {
    id: "conservative",
    name: "Conservador",
    description:
      "Acredita que se funcionou em 1975, funciona agora. Inovações são permitidas apenas se forem aprovações pelo conselho de vintage.",
    category: "creative",
    opposites: ["experimental"],
    rarity: "common",
  },
  plagiarist: {
    id: "plagiarist",
    name: "Plagiador",
    description:
      '"Empresta" riffs como se fossem guardanapos. Sua inspiração favorita? Qualquer banda que você não conheça.',
    category: "creative",
    opposites: ["creative", "visionary"],
    rarity: "rare",
  },
  visionary: {
    id: "visionary",
    name: "Visionário",
    description:
      "Tem lampejos de genialidade entre longos períodos de olhar fixamente para a parede. 1% visão, 99% confusão para os colegas.",
    category: "creative",
    opposites: ["plagiarist"],
    rarity: "uncommon",
  },

  // Social/Emotional - Slot 4 (optional)
  manipulator: {
    id: "manipulator",
    name: "Manipulador",
    description:
      "Sabe mais alianças do que um político em ano eleitoral. Forma facções mais rápido do que acordes de power metal.",
    category: "social",
    opposites: ["friendly", "conciliator", "loyal"],
    rarity: "rare",
  },
  jealous: {
    id: "jealous",
    name: "Ciumento",
    description:
      "Se outro membro receber um elogio, ele precisa de um abraço e um aumento de salário. Celebra o sucesso alheio como celebra dentista.",
    category: "social",
    opposites: ["loyal", "friendly"],
    rarity: "uncommon",
  },
  loyal: {
    id: "loyal",
    name: "Leal",
    description:
      "Vê a banda como família - aquele primo chato que você não escolheu, mas defende em qualquer briga de bar.",
    category: "social",
    opposites: ["individualist", "manipulator", "envious"],
    rarity: "common",
  },
  individualist: {
    id: "individualist",
    name: "Individualista",
    description:
      "Já tem o nome da carreira solo escolhido desde o primeiro ensaio. A banda é só um trampolim... disfarçado de sofá confortável.",
    category: "social",
    opposites: ["loyal"],
    rarity: "uncommon",
  },
  insecure: {
    id: "insecure",
    name: "Inseguro",
    description:
      'Precisa de um "muito bom!" após cada nota que toca. Um olhar torto pode mandá-lo para uma crise existencial de 3 horas.',
    category: "social",
    opposites: ["confident"],
    rarity: "common",
  },

  // Situational - Slot 4 (optional)
  paranoid: {
    id: "paranoid",
    name: "Paranoico",
    description:
      "Acredita que o roadie está roubando seus riffs através de telepatia. E que o empresário é um agente duplo.",
    category: "situational",
    opposites: ["stable"],
    rarity: "rare",
  },
  spiritual: {
    id: "spiritual",
    name: "Espiritual",
    description:
      "Insiste que as músicas devem ser gravadas apenas durante o alinhamento planetário correto. Os atrasos são apenas energia cósmica se ajustando.",
    category: "situational",
    opposites: ["greedy", "professional"],
    rarity: "common",
  },
  workaholic: {
    id: "workaholic",
    name: "Workaholic",
    description:
      "Ensaia enquanto dorme e compõe no banho. Já tentou gravar um solo de guitarra durante uma endoscopia.",
    category: "situational",
    opposites: ["lazy"],
    rarity: "uncommon",
  },
  shy: {
    id: "shy",
    name: "Tímido",
    description:
      "No palco é um deus do rock, na entrevista parece um hamster assustado. Lida com jornalistas pior do que com críticas.",
    category: "situational",
    opposites: ["validation_seeker", "playful"],
    rarity: "common",
  },
};

/** Set of all valid characteristic ids, for fast membership checks. */
export const CHARACTERISTIC_IDS: ReadonlySet<string> = new Set(
  Object.keys(CHARACTERISTICS),
);

/**
 * Returns the characteristics in a given category.
 *
 * @param category - The category to filter by.
 * @returns The matching characteristics.
 */
export function getCharacteristicsByCategory(
  category: CharacteristicCategory,
): Characteristic[] {
  return Object.values(CHARACTERISTICS).filter((c) => c.category === category);
}

/**
 * Checks whether two characteristics are compatible (not opposites).
 *
 * @param char1Id - The first trait id.
 * @param char2Id - The second trait id.
 * @returns `true` when the traits are compatible.
 */
export function areCharacteristicsCompatible(
  char1Id: string,
  char2Id: string,
): boolean {
  const char1 = CHARACTERISTICS[char1Id];
  if (!char1) {
    return true;
  }
  return !char1.opposites.includes(char2Id);
}

/**
 * Returns the subset of ids that are not present in the catalog.
 *
 * @param ids - Candidate characteristic ids.
 * @returns The ids that do not exist in the catalog (empty when all valid).
 */
export function getUnknownCharacteristicIds(ids: string[]): string[] {
  return ids.filter((id) => !CHARACTERISTIC_IDS.has(id));
}
