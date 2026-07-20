/**
 * Relationship-level flavor metadata (emoji + name + description), ported
 * verbatim from the `game-music` frontend (read-only reference). Levels run
 * from -5 (mortal enemies) to 5 (inseparable).
 */

/** Display metadata for a single relationship level. */
export interface RelationshipLevelInfo {
  level: number;
  emoji: string;
  name: string;
  description: string;
}

export const RELATIONSHIP_LEVELS: RelationshipLevelInfo[] = [
  {
    level: -5,
    emoji: "👹",
    name: "Inimigo Mortal",
    description:
      "Se este fosse um filme de terror, um de nós já estaria enterrado no jardim.",
  },
  {
    level: -4,
    emoji: "😠",
    name: "Rivalidade Tóxica",
    description:
      "Prefiro lamber um corrimão de metrô do que admitir que sua ideia é boa.",
  },
  {
    level: -3,
    emoji: "👎",
    name: "Aversão Profunda",
    description:
      "Se um navio estivesse afundando, discutiriam sobre quem entra no bote salva-vidas primeiro.",
  },
  {
    level: -2,
    emoji: "😒",
    name: "Desgosto Moderado",
    description: "Dividimos o palco, mas não dividimos a pizza.",
  },
  {
    level: -1,
    emoji: "🙄",
    name: "Tolerância Forçada",
    description:
      "Nosso contrato nos obriga a fingir que não nos irritamos mutuamente.",
  },
  {
    level: 0,
    emoji: "😐",
    name: "Indiferença",
    description:
      "Sabemos os nomes um do outro (checamos a agenda para ter certeza).",
  },
  {
    level: 1,
    emoji: "🙂",
    name: "Colega Amigável",
    description:
      "Compartilhamos o palco e, ocasionalmente, um pacote de salgadinhos.",
  },
  {
    level: 2,
    emoji: "😊",
    name: "Companheiros de Banda",
    description:
      "Já nos confundimos o suficiente para saber que o café do outro é com duas de açúcar.",
  },
  {
    level: 3,
    emoji: "🤝",
    name: "Amizade Sólida",
    description:
      "Já vimos um ao outro chorar por término namoro e vomitar depois de comer sushi duvidoso.",
  },
  {
    level: 4,
    emoji: "💖",
    name: "Melhores Amigos",
    description:
      "Nossas mães marcam jantar juntas e comparam fotos de nós bebês.",
  },
  {
    level: 5,
    emoji: "🤘",
    name: "Irmãos de Outra Mãe",
    description:
      "Nossa química é tão boa que suspeitamos de reencarnação em vidas passadas.",
  },
];
