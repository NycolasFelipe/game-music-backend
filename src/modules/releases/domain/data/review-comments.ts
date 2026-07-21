/**
 * Review comment pools (ADR-0011): flavor blurbs picked to accompany the critic
 * and public scores of a finished work. Three critic comments + three public
 * comments per release, plus a format-specific note — selected deterministically
 * per release (seeded by its id) so they are stable across reads, without
 * persisting them. Tone: lightly humorous, tycoon-game flavor.
 */

/** Critic comment band (five bands, from worst to masterpiece). */
export type CriticBand =
  "negativa" | "mista" | "boa" | "excelente" | "obra_prima";

/** Public comment band (five bands, one per star). */
export type PublicBand =
  "muito_negativa" | "negativa" | "mista" | "positiva" | "muito_positiva";

/** Specialized-critic blurbs per band. */
export const CRITIC_COMMENTS: Record<CriticBand, string[]> = {
  negativa: [
    "A banda parece confortável demais em repetir fórmulas conhecidas — tão confortável que dá para ouvir o bocejo entre as faixas.",
    "Apesar da boa produção, as composições têm a personalidade de uma sala de espera de dentista.",
    "Os refrões escapam da memória mais rápido que promessa de campanha.",
    "A tentativa de experimentar novos estilos compromete a coesão do disco — é colocar abacaxi em tudo só para provar que pode.",
    "Um álbum corajoso: corajoso o bastante para testar a paciência de quem aperta o play.",
    "Há ambição aqui, mas ela ficou presa no elevador entre o estúdio e a masterização.",
    "Se o objetivo era soar genérico, parabéns: missão cumprida com louvor.",
    "O disco tem começo, meio e fim — pena que os três soem exatamente iguais.",
    "A banda claramente investiu no equipamento. No repertório, nem tanto.",
    "Uma coletânea de ideias que pediram demissão antes de bater o ponto.",
    "Ouvir na íntegra é um exercício de resiliência que merecia crédito acadêmico.",
  ],
  mista: [
    "Há boas ideias espalhadas pelo álbum, mas a execução às vezes chega atrasada e pedindo desculpas.",
    "O início é promissor; a segunda metade parece ter sido gravada numa segunda-feira.",
    "As letras evoluíram, mas a produção ficou tão polida que escorregou e levou a personalidade junto.",
    "Um lançamento competente — o tipo de disco que você elogia e esquece no mesmo dia.",
    "Metade genial, metade enrolação: um sanduíche de recheio ótimo e pão dormido.",
    "A banda acerta o alvo com frequência, só que às vezes mira no alvo do vizinho.",
    "Tem música para a playlist e música para treinar o dedo no botão de pular.",
    "Ambicioso na intenção, econômico na entrega — faltou um cafezinho a mais no estúdio.",
    "Você sai satisfeito, mas com a leve sensação de que pediu tamanho família e veio individual.",
    "Um passo à frente e meio passo de lado: dança interessante, coreografia confusa.",
    "Momentos brilhantes convivem com faixas que claramente entraram de penetra.",
  ],
  boa: [
    "Não reinventa o gênero, mas cumpre o combinado com um sorriso profissional no rosto.",
    "A banda demonstra segurança na proposta, mesmo arriscando tanto quanto um gato numa poltrona quentinha.",
    "Um trabalho sólido que vai agradar os fãs e conquistar alguns curiosos de plantão.",
    "Produção competente, refrões honestos e zero vergonha alheia — já é mais do que muita gente entrega.",
    "É o tipo de disco que você recomenda sem medo de perder amizades.",
    "Falta o hit para a posteridade, mas sobra ofício e boa vontade.",
    "A banda encontrou a zona de conforto e a decorou com bom gosto.",
    "Nada aqui vai mudar o mundo, mas certamente melhora o trânsito da tarde.",
    "Consistente do começo ao fim, como um bom plano de fundo para uma vida ocupada.",
    "Faz tudo certo — só não faz nada de errado o suficiente para virar assunto.",
    "Bem-acabado e sincero: a banda entrega o dever de casa com letra caprichada.",
  ],
  excelente: [
    "Um álbum ambicioso e maduro na composição: melodias marcantes e arranjos que enfim pararam de pedir desculpas.",
    "O single mostra evolução clara — produção limpa, refrões grudentos e a identidade sonora intacta e desfilando.",
    "Consegue soar moderno sem trair as influências; poucos unem criatividade e acessibilidade com tanta naturalidade.",
    "A banda achou o ponto exato entre o cérebro e o pé que bate no chão.",
    "Cada faixa parece saber exatamente por que foi convidada para a festa.",
    "É o tipo de disco que faz o crítico guardar o sarcasmo para outra ocasião.",
    "Ambição e execução finalmente assinaram o mesmo contrato — e o resultado brilha.",
    "Um trabalho que respeita o ouvinte e ainda paga o estacionamento.",
    "Difícil não se impressionar: a banda subiu o nível sem perder a graça.",
    "Refrões que se instalam na sua cabeça e cobram aluguel — dos bons.",
    "A prova de que dá para ser inteligente e cativante sem escolher um dos dois.",
  ],
  obra_prima: [
    "Um marco na carreira da banda e, provavelmente, no orçamento da gravadora: cada faixa é indispensável e o conjunto beira a perfeição.",
    "Raramente ambição, execução e emoção batem o ponto no mesmo horário. Aqui, bateram e ainda fizeram hora extra.",
    "Difícil apontar um defeito sem parecer implicância. Um clássico instantâneo, daqueles que envelhecem melhor que o crítico.",
    "A banda entregou o disco definitivo da discografia — a nova régua para quem vier depois suar frio.",
    "Se música fosse esporte, isto seria pódio, hino e volta olímpica ao mesmo tempo.",
    "Uma obra que faz o gênero inteiro rever as próprias metas de vida.",
    "Do primeiro ao último segundo, é aula: anote, emoldure, repita.",
    "Perfeição é palavra perigosa para um crítico. Pois passem a conta.",
    "O tipo de lançamento que transforma fã casual em evangelista de plantão.",
    "Ambiciosa, coesa e emocionante — miraram nas estrelas e trouxeram uma de lembrança.",
    "Reservem espaço nas listas de fim de ano; este aqui já chegou chegando.",
  ],
};

/** Public (fan) blurbs per band. */
export const PUBLIC_COMMENTS: Record<PublicBand, string[]> = {
  muito_negativa: [
    "O pior lançamento da banda. E olha que eu já perdoei bastante coisa.",
    "Nenhuma música me chamou atenção. Nem o silêncio entre elas.",
    "Soa completamente genérico, tipo música de espera do plano de saúde.",
    "Vou continuar ouvindo os álbuns antigos, obrigado.",
    "Coloquei no fone e o fone pediu demissão.",
    "Paguei streaming pra isso? Quero meu domingo de volta.",
    "Dei play por educação e tirei por instinto de sobrevivência.",
    "Achei que era a intro. Era o álbum inteiro.",
    "Meu pet saiu da sala. Ele tem bom gosto.",
    "Prefiro o som do micro-ondas terminando a pipoca.",
    "Uma decepção tão redonda que dá para jogar boliche.",
  ],
  negativa: [
    "Não consegui terminar de ouvir. Fiz três pausas para tomar coragem.",
    "Parece tudo igual — se tirar uma faixa, ninguém nota.",
    "A produção está boa, mas as músicas não me prenderam nem com fita crepe.",
    "Depois do último álbum, esperava bem mais. Bem mais mesmo.",
    "Tem potencial, mas ficou no 'quase' o disco inteiro.",
    "Ouvi uma vez por respeito. Não haverá segunda.",
    "Salvei uma música. Depois desfavoritei sem dó.",
    "É daqueles que tocam de fundo e você esquece que estão tocando.",
    "Faltou um empurrãozinho — e uns três refrões decentes.",
    "Não é ruim ruim, é aquele morno que irrita mais que o ruim.",
    "Enchi a expectativa e voltei com o troco em decepção.",
  ],
  mista: [
    "Algumas faixas são ótimas, outras eu provavelmente vou pular (tá, várias).",
    "A produção melhorou, mas cadê a energia dos primeiros trabalhos?",
    "Bom álbum, só não achei tão marcante. Já esqueci metade.",
    "Esperava algo mais ousado — veio na medida do seguro.",
    "Tem dia que eu amo, tem dia que eu dou de ombros.",
    "Metade playlist, metade 'próxima, por favor'.",
    "Não é o melhor nem o pior — é o famoso 'tá ok'.",
    "Gostei o suficiente para repetir, não o suficiente para recomendar.",
    "Uns acertos honestos e uns enchimentos igualmente honestos.",
    "Serve bem para um dia comum. Extraordinário que é bom, nada.",
    "Salvei duas músicas e uma dúvida sobre o resto.",
  ],
  positiva: [
    "Gostei bastante. Tem duas ou três músicas que vão ficar comigo por um bom tempo.",
    "O single é muito bom. Já fiquei animado para o próximo álbum.",
    "Achei melhor que o lançamento anterior — evolução clara.",
    "Entrou direto na minha playlist de rotina.",
    "Não é perfeito, mas acerta muito mais do que erra.",
    "Toquei três vezes seguidas sem reclamar. Isso já diz muito.",
    "Aquele disco que você coloca e deixa rolar até o fim.",
    "A banda tá afiada. Faltou só um hit gigante para fechar.",
    "Recomendei para dois amigos. Um já virou fã.",
    "Ótimo trabalho — daqueles que melhoram o dia sem pedir muito.",
    "Dá para sentir carinho e capricho em cada faixa.",
  ],
  muito_positiva: [
    "Não consigo parar de ouvir esse álbum. Socorro (não me salvem).",
    "Melhor lançamento da banda até agora, e olha que a barra estava alta.",
    "Todas as músicas entraram na minha playlist. Todas mesmo.",
    "Valeu cada minuto de espera e mais alguns de bônus.",
    "Já ouvi cinco vezes seguidas e comecei a sexta.",
    "Disco do ano com folga. Podem guardar o troféu.",
    "Chorei, dancei e mandei no grupo da família. Nessa ordem.",
    "Cada faixa é um single em potencial. Como assim?",
    "A banda entregou tudo e ainda deu troco. Obra de arte.",
    "Coloquei no repeat e esqueci que o mundo lá fora existia.",
    "Instantaneamente favorito. Já é trilha sonora da minha vida.",
  ],
};

/** Format-specific editorial notes, keyed by release format id. */
export const FORMAT_COMMENTS: Record<string, string[]> = {
  single: [
    "Um ótimo cartão de visitas para a nova fase da banda.",
    "Escolha perfeita para abrir a divulgação do álbum.",
    "O single entrega mais do que promete — raro nos dias de hoje.",
    "Curto, certeiro e já sai grudando.",
    "Do tamanho ideal para viciar sem cansar.",
    "Se a ideia era abrir o apetite, conseguiram.",
    "Uma isca e tanto para fisgar novos ouvintes.",
    "Prova de que dá para dizer muito em poucos minutos.",
    "O tipo de faixa feita para o repeat automático.",
    "Aposta segura para o rádio e para a playlist.",
  ],
  ep: [
    "Curto, direto e sem faixas descartáveis.",
    "O EP explora novas ideias sem perder a identidade.",
    "Deixa aquele gostinho de quero mais.",
    "Compacto na duração, generoso nas ideias.",
    "Um aperitivo caprichado antes do prato principal.",
    "Faz em poucos minutos o que muito álbum não faz em uma hora.",
    "Tamanho de bolso, ambição de estádio.",
    "Nenhuma gordura para cortar — só músculo.",
    "Ideal para quem tem pressa e bom gosto.",
    "Curto o suficiente para repetir sem culpa.",
  ],
  album: [
    "Uma obra coesa do início ao fim.",
    "Cada faixa parece ter seu lugar dentro do conjunto.",
    "Um álbum feito para ser ouvido na íntegra.",
    "Tem começo, meio e fim — e todos valem a pena.",
    "Uma jornada bem planejada, com direito a paisagem.",
    "O tipo de disco que pede sofá, fone e nenhuma pressa.",
    "Ambicioso na medida e caprichado no acabamento.",
    "Um conjunto que é maior que a soma das faixas.",
    "Feito para durar mais que a próxima tendência.",
    "A banda pensou o álbum como um todo — e se ouve.",
  ],
  live: [
    "As músicas ganharam uma energia completamente diferente no palco.",
    "A performance supera as versões de estúdio.",
    "A interação com o público torna a experiência memorável.",
    "Dá para sentir o suor e o sorriso em cada faixa.",
    "O registro que faz você se arrepender de ter perdido o show.",
    "A plateia é praticamente o sexto integrante aqui.",
    "Erros? Poucos. Emoção? Toneladas.",
    "Estúdio é perfeição; palco é verdade — e aqui sobra verdade.",
    "Sobe o volume e a sala vira arena.",
    "Prova de que algumas músicas só nascem de verdade ao vivo.",
  ],
  acoustic: [
    "A versão acústica revela a essência das composições.",
    "Menos camadas, mais emoção: as canções respiram melhor aqui.",
    "Um registro intimista que valoriza melodia e letra.",
    "Sem os efeitos, sobra o que importa: a canção.",
    "O formato que transforma sala de estar em templo.",
    "Despido de exageros, o repertório mostra a que veio.",
    "Perfeito para ouvir baixinho e sentir alto.",
    "A prova de fogo de qualquer música — e passou.",
    "Simples no arranjo, gigante no clima.",
    "Cordas, voz e nenhum lugar para se esconder.",
  ],
};

/**
 * Returns the critic comment band for a critic score (0..100).
 *
 * @param score - The critic score.
 * @returns The matching band.
 */
export function criticBandFor(score: number): CriticBand {
  if (score >= 92) return "obra_prima";
  if (score >= 75) return "excelente";
  if (score >= 55) return "boa";
  if (score >= 40) return "mista";
  return "negativa";
}

/**
 * Returns the public comment band for a public score (0..100). Aligned with the
 * five review-tier thresholds (one band per star).
 *
 * @param score - The public score.
 * @returns The matching band.
 */
export function publicBandFor(score: number): PublicBand {
  if (score >= 85) return "muito_positiva";
  if (score >= 70) return "positiva";
  if (score >= 55) return "mista";
  if (score >= 40) return "negativa";
  return "muito_negativa";
}

/**
 * Returns the format comment pool for a format id (LP shares the album pool;
 * unknown formats have no note).
 *
 * @param formatId - The release format id.
 * @returns The matching pool (possibly empty).
 */
export function formatCommentsFor(formatId: string): string[] {
  if (formatId === "lp") return FORMAT_COMMENTS.album;
  return FORMAT_COMMENTS[formatId] ?? [];
}

/** Fictional specialized-critic outlets that sign the critic reviews. */
export const CRITIC_OUTLETS: string[] = [
  "Revista Distorção",
  "Portal Acorde",
  "Blog Grave & Agudo",
  "Coluna Vinil Quente",
  "Canal Contrabaixo",
  "Fanzine Feedback",
  "Palco Central",
  "Podcast Sem Refrão",
  "O Amplificador",
  "Revista Timbre",
  "Rádio Onda Média",
  "Gazeta do Groove",
  "Sonoridade",
  "Revista Clave",
  "Portal Dissonância",
  "Caderno B7",
];

/** Names that sign the public reviews. */
export const PUBLIC_REVIEWER_NAMES: string[] = [
  "Caio Silva",
  "Marina Rocha",
  "Bruno Alves",
  "Letícia Nunes",
  "Rafael Costa",
  "Aline Souza",
  "Gustavo Lima",
  "Bianca Farias",
  "Diego Martins",
  "Camila Torres",
  "Thiago Ramos",
  "Júlia Mendes",
  "Felipe Araújo",
  "Larissa Pinto",
  "Vinícius Barros",
  "Patrícia Gomes",
  "Lucas Carvalho",
  "Fernanda Dias",
  "André Moraes",
  "Sofia Ribeiro",
];

/** Platforms a public review was posted on (e.g. "no X"). */
export const PUBLIC_PLATFORMS: string[] = [
  "no X",
  "no Instagram",
  "no TikTok",
  "no YouTube",
  "no Threads",
  "no fórum",
  "no Reddit",
];

/** A review blurb paired with the author who signed it. */
export interface ReviewComment {
  text: string;
  author: string;
}

/** The comments selected to accompany a work's reviews. */
export interface SelectedReviewComments {
  critic: ReviewComment[];
  public: ReviewComment[];
  format: string | null;
}

/**
 * FNV-1a hash of a string → 32-bit unsigned int, for deterministic seeding.
 *
 * @param value - The string to hash.
 * @returns A 32-bit unsigned hash.
 */
function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Picks `count` distinct entries from a pool, deterministically from a seed
 * (a small LCG). Returns the whole pool when it is not larger than `count`.
 *
 * @param pool - The candidate strings.
 * @param count - How many to pick.
 * @param seed - The deterministic seed.
 * @returns The picked entries (order determined by the seed).
 */
function pickDistinct(pool: string[], count: number, seed: number): string[] {
  if (pool.length <= count) {
    return [...pool];
  }
  const picked: string[] = [];
  const used = new Set<number>();
  let state = seed || 1;
  while (picked.length < count) {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    const index = state % pool.length;
    if (!used.has(index)) {
      used.add(index);
      picked.push(pool[index]);
    }
  }
  return picked;
}

/**
 * Selects the three critic comments, three public comments and one format note
 * for a finished work — deterministically from its id (ADR-0011).
 *
 * @param input - The release id, its critic/public scores and format.
 * @returns The selected comments.
 */
export function selectReviewComments(input: {
  id: string;
  criticScore: number;
  publicScore: number;
  format: string;
}): SelectedReviewComments {
  const criticPool = CRITIC_COMMENTS[criticBandFor(input.criticScore)];
  const publicPool = PUBLIC_COMMENTS[publicBandFor(input.publicScore)];
  const formatPool = formatCommentsFor(input.format);

  const criticTexts = pickDistinct(
    criticPool,
    3,
    hashString(`${input.id}:critic`),
  );
  const criticOutlets = pickDistinct(
    CRITIC_OUTLETS,
    3,
    hashString(`${input.id}:critic-outlet`),
  );

  const publicTexts = pickDistinct(
    publicPool,
    3,
    hashString(`${input.id}:public`),
  );
  const publicNames = pickDistinct(
    PUBLIC_REVIEWER_NAMES,
    3,
    hashString(`${input.id}:public-name`),
  );

  return {
    critic: criticTexts.map((text, index) => ({
      text,
      author: criticOutlets[index] ?? criticOutlets[0],
    })),
    public: publicTexts.map((text, index) => ({
      text,
      author: `${publicNames[index] ?? publicNames[0]}, ${
        PUBLIC_PLATFORMS[
          hashString(`${input.id}:public-platform:${index}`) %
            PUBLIC_PLATFORMS.length
        ]
      }`,
    })),
    format: formatPool.length
      ? pickDistinct(formatPool, 1, hashString(`${input.id}:format`))[0]
      : null,
  };
}
