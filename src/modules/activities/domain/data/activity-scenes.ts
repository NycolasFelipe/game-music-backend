import type { ActivityId } from "@/modules/activities/domain/data/activities";

/**
 * Narrative material for what happens during a confraternização (ADR-0017 §6).
 * Content only — no logic. Placeholders: `{grupo}` for the guest list, `{a}` and
 * `{b}` for the pair the scene is about.
 *
 * Variety is the point: the same activity is bought many times over a campaign,
 * and a night that reads identically to the last one stops feeling like a night.
 */

/** The beats available for one activity. */
export interface ActivityScene {
  /** How the night opens. Mentions the whole guest list. */
  openings: string[];
  /** Used when the guest list holds someone who cannot stand someone else. */
  tense: string[];
  /** Used when the closest pair present already gets along. */
  warm: string[];
  /** Used when the guests are on neutral terms — or when there is no pair. */
  neutral: string[];
}

/** Scene material per activity. */
export const ACTIVITY_SCENES: Record<ActivityId, ActivityScene> = {
  jantar: {
    openings: [
      "{grupo} numa mesa de canto, cardápio grande demais e ninguém com pressa de pedir.",
      "Um restaurante barulhento o suficiente para ninguém precisar falar baixo. {grupo} chegam com fome e sem pauta.",
      "O tipo de lugar com foto do prato no cardápio. {grupo} escolhem em cinco minutos e ficam três horas.",
      "{grupo} num japonês que alguém jurou ser bom. Era razoável, mas ninguém reclamou.",
      "Mesa reservada às oito, gente chegando até as nove e meia. {grupo} completos só na hora da sobremesa.",
      "Um boteco de esquina com mesa de plástico e cerveja gelada. {grupo} pediram porção antes de sentar.",
    ],
    tense: [
      "{a} escolhe a cadeira mais longe possível de {b}. A mesa inteira nota e finge que não.",
      "Entre um prato e outro, {b} faz uma piada que só {a} não acha graça — e o silêncio dura dois segundos a mais do que devia.",
      "{a} passa o jantar falando com todo mundo menos com {b}, num esforço que dava trabalho de assistir.",
      "Quando {b} conta a história pela terceira vez, {a} corrige um detalhe. Não era sobre o detalhe.",
      "{a} sai para atender um telefonema que ninguém ouviu tocar, logo depois de {b} sentar ao lado.",
    ],
    warm: [
      "{a} e {b} passam metade do jantar contando a mesma história ao mesmo tempo, discordando dos detalhes e rindo dos dois.",
      "{a} pede o prato de {b} sem perguntar, e acerta. Não é pouca coisa saber isso de alguém.",
      "{a} e {b} ficam por último na mesa, com o garçom já empilhando cadeiras em volta.",
    ],
    neutral: [
      "A conversa vai de aluguel a bateria nova sem passar por nada importante, que é exatamente do que todo mundo precisava.",
      "Metade da mesa discute um filme que a outra metade não viu, e a discussão dura mais que o jantar.",
      "Falaram de tudo, menos de música. Foi a melhor parte.",
      "A conta veio errada, alguém conferiu item por item, e aquilo virou o assunto da noite.",
    ],
  },
  festa: {
    openings: [
      "A casa de alguém, o som alto e uma geladeira que não ia durar a noite. {grupo} chegam antes das dez.",
      "Ninguém combinou nada: {grupo} apareceram, e às onze já tinha gente demais para caber na sala.",
      "{grupo} numa festa de aniversário de um conhecido de um conhecido. Ficaram até o dono da casa dormir.",
      "Alguém arrumou um projetor, alguém arrumou um pen drive, e a sala de {grupo} virou pista até de manhã.",
      "Uma laje, uma caixa de som emprestada e vista para a cidade inteira. {grupo} subiram com gelo e sem plano.",
      "{grupo} comemorando alguma coisa que ninguém soube explicar direito no dia seguinte.",
      "Começou como um ensaio e terminou como festa por volta da terceira música. {grupo} não resistiram.",
    ],
    tense: [
      "Lá pela terceira dose, {a} decide que aquele era o momento de resolver as coisas com {b}. Não era.",
      "{a} e {b} passam a noite inteira do lado oposto da sala, com uma precisão que só existe quando é de propósito.",
      "Alguém coloca uma música que {a} e {b} escreveram juntos, num tempo em que se falavam. Os dois saem para fumar.",
      "{b} chega perto, {a} lembra de repente que precisava buscar gelo. O gelo estava cheio.",
      "Por volta das duas, {a} começa a falar de {b} para quem quisesse ouvir. Muita gente ouviu.",
    ],
    warm: [
      "{a} e {b} monopolizam a caixa de som e ninguém tem coragem de reclamar do repertório.",
      "{a} e {b} inventam uma coreografia ridícula que a banda inteira vai lembrar por anos.",
      "Às quatro da manhã sobraram {a}, {b} e uma conversa que valeu a festa toda.",
    ],
    neutral: [
      "Em algum momento a conversa vira sobre a banda, e por meia hora todo mundo fala junto sobre o próximo disco.",
      "Um vizinho reclamou do barulho às duas. Baixaram o som por sete minutos.",
      "Ninguém lembra quem trouxe o violão, mas às três da manhã tinha um.",
      "A festa acabou porque a bebida acabou, que é o único jeito honesto de uma festa acabar.",
    ],
  },
  viagem: {
    openings: [
      "Quatro horas de estrada, uma van com ar-condicionado duvidoso e {grupo} dividindo o mesmo playlist ruim.",
      "{grupo} numa casa alugada longe de tudo, com sinal de celular ruim o bastante para funcionar como terapia.",
      "Uma praia fora de temporada, fria e vazia. {grupo} tiveram o lugar inteiro para eles.",
      "{grupo} num sítio emprestado, com fogão a lenha que ninguém sabia acender e uma noite estrelada demais.",
      "A van quebrou a setenta quilômetros do destino. {grupo} acabaram gostando mais da parada forçada.",
      "Uma pousada barata numa cidade pequena, com café da manhã às sete e {grupo} descendo às onze.",
    ],
    tense: [
      "{a} e {b} ficam com os quartos mais distantes. Ninguém precisou combinar isso.",
      "Na volta, {a} dorme no banco de trás só para não ter que puxar assunto com {b}.",
      "Numa discussão sobre o caminho, {a} e {b} descobrem que ainda dá para brigar por mapa.",
      "{b} propõe um passeio; {a} decide ficar. Passaram o dia mais bonito da viagem separados.",
      "Durante o jantar, {a} responde a {b} em monossílabos por uma hora inteira. Um recorde.",
    ],
    warm: [
      "{a} e {b} ficam acordados até o sol nascer, na varanda, falando de coisas que não têm nada a ver com música.",
      "{a} e {b} sequestram a van uma tarde inteira e voltam com uma história que ninguém acredita.",
      "{a} ensina {b} a fazer a única receita que sabe. Ficou horrível e os dois comeram tudo.",
    ],
    neutral: [
      "No segundo dia já ninguém lembrava de checar o telefone, e foi aí que a viagem começou de verdade.",
      "Choveu os três dias. Jogaram baralho, dormiram demais e ninguém reclamou.",
      "A comida era ruim, a cama era dura e todo mundo voltou dizendo que precisava repetir.",
      "Alguém sugeriu escrever uma música sobre a viagem. Nunca escreveram.",
    ],
  },
  retiro: {
    openings: [
      "Uma casa no meio do nada, instrumentos encostados na parede e {grupo} sem desculpa para não tocar.",
      "{grupo} isolados por três dias, com a regra tácita de que ninguém fala de prazo nem de dinheiro.",
      "Um galpão alugado no interior, com eco demais e {grupo} dispostos a aproveitar isso.",
      "{grupo} numa fazenda sem vizinho num raio de dois quilômetros — podiam tocar às quatro da manhã, e tocaram.",
      "Uma casa de praia fora de temporada, virada em estúdio improvisado. {grupo} levaram mais cabo que roupa.",
      "{grupo} sem internet por decisão coletiva. Nos primeiros dois dias, quase se arrependeram.",
    ],
    tense: [
      "{a} propõe uma ideia; {b} responde com um silêncio que dizia tudo. Tocaram outra coisa.",
      "{a} e {b} evitam ensaiar no mesmo cômodo, e o resto da banda passa o dia servindo de ponte.",
      "{b} sugere cortar uma parte que {a} tinha escrito. A discussão que veio não era sobre a parte.",
      "{a} grava sozinho de madrugada para não precisar dividir a sala com {b}.",
      "No último dia, {a} e {b} tocam juntos pela primeira vez — e sai bom, o que irrita os dois.",
    ],
    warm: [
      "{a} e {b} descobrem um riff por acidente às três da manhã e acordam a casa inteira para mostrar.",
      "{a} e {b} passam a tarde só improvisando, sem gravar nada, como quem conversa.",
      "{b} termina uma letra que {a} tinha abandonado havia dois anos. Ficou melhor.",
    ],
    neutral: [
      "Ninguém compôs nada aproveitável, mas todo mundo lembrou por que gostava de tocar junto.",
      "Saíram de lá com onze ideias pela metade e uma que valia o retiro inteiro.",
      "Passaram um dia inteiro discutindo o som da caixa. Não chegaram a lugar nenhum e foi ótimo.",
      "Alguém trouxe um gravador velho, e as melhores coisas da semana ficaram em fita.",
    ],
  },
  terapia: {
    openings: [
      "Uma sala neutra, cadeiras em círculo e uma profissional que já tinha visto banda demais. {grupo} sentam sem saber onde colocar as mãos.",
      "{grupo} numa sessão marcada com semanas de antecedência, cada um convencido de que o problema era outro.",
      "Uma sala com plantas de plástico e caixa de lenços na mesa de centro. {grupo} olham para a caixa e desviam.",
      "{grupo} chegam separados, em horários diferentes, cada um querendo não ser o primeiro.",
      "A terapeuta pede que cada um diga por que está ali. {grupo} levam quarenta minutos nessa pergunta.",
      "{grupo} numa sala pequena demais para o que precisava ser dito ali.",
    ],
    tense: [
      "Quando chega a vez de {a} falar sobre {b}, a sala inteira aprende algo que preferia não saber.",
      "{b} escuta {a} até o fim sem interromper — e é a primeira vez em muito tempo que isso acontece.",
      "{a} diz que não é nada pessoal. A terapeuta pergunta se é. {a} demora para responder.",
      "{b} chora, e {a} não sabe o que fazer com as mãos. Ninguém sabia.",
      "A terapeuta pede que {a} repita, com as próprias palavras, o que {b} acabou de dizer. {a} não consegue.",
    ],
    warm: [
      "{a} e {b} descobrem, meio sem graça, que estavam preocupados exatamente um com o outro.",
      "{a} agradece {b} por uma coisa de anos atrás que {b} nem lembrava ter feito.",
      "No fim da sessão, {a} e {b} saem juntos e ficam mais uma hora no café da esquina.",
    ],
    neutral: [
      "Ninguém chora, ninguém grita. Só falam devagar sobre coisas que costumavam gritar.",
      "A hora acaba no meio de uma frase importante. Marcam outra sessão que nunca vão marcar.",
      "Falaram sobre a banda o tempo todo para não falar sobre eles. A terapeuta deixou.",
      "Saíram de lá cansados de um jeito diferente do cansaço de ensaio.",
    ],
  },
};

/** Beats for when the turn has already seen a get-together. */
export const ACTIVITY_SATURATION_BEATS = [
  "Fazia pouco tempo desde a última vez. A graça de novidade já não estava lá.",
  "Todo mundo já tinha feito aquilo havia pouco, e dava para sentir na energia da coisa.",
  "A segunda vez no mesmo semestre tem sempre um quê de repetição, e essa teve.",
  "Alguém comentou que estavam saindo demais. Ninguém discordou com muita convicção.",
];

/** How a night that went well ends. */
export const ACTIVITY_GOOD_CLOSINGS = [
  "Voltaram melhores do que foram. Não é pouco.",
  "No dia seguinte ninguém falou sobre a noite, mas o ensaio rendeu.",
  "Foi dinheiro bem gasto, e todo mundo sabia disso sem precisar dizer.",
  "Nada de extraordinário aconteceu, e era exatamente disso que a banda precisava.",
  "Terminou cedo, terminou bem, e ninguém saiu de lá com nada entalado.",
  "Ficou aquela sensação boa de ter escolhido estar ali.",
];

/** How a night that went wrong ends — it hands off to a pending decision. */
export const ACTIVITY_TROUBLE_CLOSINGS = [
  "Só que a noite não terminou aí — e o que veio depois vai precisar da sua palavra.",
  "O problema é que alguma coisa quebrou no meio do caminho, e agora sobrou para você.",
  "Todo mundo foi dormir achando que tinha acabado. Não tinha — e a decisão é sua.",
  "O estrago só apareceu no fim, e não é do tipo que se resolve sozinho.",
];
