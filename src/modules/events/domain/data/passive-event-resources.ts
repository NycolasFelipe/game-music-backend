/**
 * Filler resources for passive-event templates, ported from the frontend.
 */

export const SINGLE_NAMES = [
  "Vida Louca",
  "Amor Eterno",
  "Noites de Verão",
  "Coração Partido",
  "Dança da Chuva",
  "Sons do Coração",
  "Mar de Emoções",
  "Céu Aberto",
  "Flor do Deserto",
  "Rua da Saudade",
  "Tempo Perdido",
  "Olhos Verdes",
  "Pé na Estrada",
  "Vento no Litoral",
  "Lua Cheia",
];

export const ALBUM_NAMES = [
  "Renascimento",
  "Ecos da Alma",
  "Horizontes",
  "Raízes",
  "Tempo",
  "Essência",
  "Fragmentos",
  "Caminhos",
  "Destino",
  "Universo Paralelo",
];

export const TOUR_NAMES = [
  "Tour Mundial",
  "A Turnê da Reconexão",
  "De Volta aos Palcos",
  "A Jornada Continua",
  "Histórias para Contar",
  "Encontro de Gerações",
];

export const CANCELLATION_REASONS = [
  "problemas de saúde",
  "questões logísticas, segundo um comunicado de duas linhas",
  "condições climáticas adversas",
  "problemas técnicos que ninguém soube explicar",
  "um conflito de agenda descoberto na véspera",
  "recomendação médica",
];

/** A filler phrase, optionally only from a given game year on. */
export interface DatedPhrase {
  text: string;
  /** First game year in which the phrase makes sense; absent means any year. */
  desde?: number;
}

export const PUBLIC_REVIEWS: Record<
  "positivas" | "neutras" | "negativas",
  DatedPhrase[]
> = {
  positivas: [
    {
      text: "O público adora, e as rádios tocam a música até ninguém aguentar mais.",
    },
    {
      text: "Em uma semana, a música está em todas as rádios, inclusive nas que juravam não tocar esse tipo de coisa.",
    },
    {
      text: 'A crítica elogia a parceria "inovadora", palavra que usa uma vez por mês.',
    },
    {
      text: "A música viraliza nas redes sociais, quase sempre acompanhada de uma dancinha que os artistas fingem aprovar.",
      desde: 2010,
    },
  ],
  neutras: [
    {
      text: "A recepção é mista: metade do público gosta, a outra metade ainda está tentando entender.",
    },
    {
      text: "A música não impressiona nem desagrada, o que no rádio é quase um elogio.",
    },
    { text: "Alguns fãs gostam; outros escrevem cartas." },
  ],
  negativas: [
    {
      text: "O público recebe a música com a frieza reservada a jingles de banco.",
    },
    {
      text: "Os fãs mais antigos detestam, e fazem questão de explicar por quê.",
    },
    {
      text: "A crítica chama a parceria de forçada, e a parceria parece concordar.",
    },
  ],
};
