import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Universal templates for the "Casas" fame phase (2,001 to 100,000 fans,
 * ADR-0025): no trait requirement nor relationship bound; traits only unlock
 * an extra option.
 */
export const CASAS_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "0301-divisao-do-cache",
    type: "conflito_membros",
    title: "Divisão do cachê",
    descriptionTemplate:
      "Depois de uma casa lotada, {character1} faz as contas no camarim e conclui que {character2} deveria receber menos, já que quase não toca nas músicas novas. É a primeira vez que alguém na banda faz conta.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter a divisão igual",
        description:
          "Encerrar o assunto: todo mundo recebe a mesma parte, como sempre foi e como ninguém questionava enquanto não havia dinheiro.",
        consequence: {
          resultLabel: "A contragosto",
          descriptionTemplate:
            "{character1} aceita, mas passa a noite {character1:calado|calada|em silêncio}, fazendo contas no guardanapo.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Dividir por participação",
        description:
          "Quem toca mais, recebe mais. {character2} vai ter que engolir, de preferência em silêncio.",
        consequence: [
          {
            resultLabel: "Aceito",
            descriptionTemplate:
              "{character2} aceita a nova regra e passa a tocar notas extras em todas as músicas. Por precaução.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 60,
          },
          {
            resultLabel: "Ultimato",
            descriptionTemplate:
              "{character2} anuncia que, se for assim, procura outra banda. Uma onde não se cobre por nota.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: -10,
            chance: 40,
          },
        ],
      },
      {
        label: "Conversa franca no ensaio",
        description:
          "Colocar os dois frente a frente antes do próximo show. Com um juiz, se possível.",
        consequence: [
          {
            resultLabel: "Entendimento",
            descriptionTemplate:
              "{character2} promete se envolver mais nos arranjos e {character1} recua. Ninguém anota a promessa, por via das dúvidas.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Bate-boca",
            descriptionTemplate:
              "A conversa vira gritaria e o ensaio acaba mais cedo. É o ensaio mais curto e mais barulhento da história da banda.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Propor um fundo comum",
        description:
          "[{character1}] Separar uma parte do cachê para equipamento e dividir o resto igual. Assim ninguém ganha mais, e a culpa passa a ser do amplificador.",
        visibleIfAnyInvolvedHas: ["conciliator"],
        consequence: {
          resultLabel: "Acordo",
          descriptionTemplate:
            "A ideia agrada aos dois e o assunto morre ali. O fundo comum dura até a primeira pizza.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
          happinessChangePercent: 6,
        },
      },
    ],
  },
  {
    id: "0302-holofote-dividido",
    type: "conflito_membros",
    title: "Holofote dividido",
    descriptionTemplate:
      "Uma rádio da região quer entrevistar só {character1}. {character2} sente que virou banda de apoio da própria banda.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mandar só {character1}",
        description:
          "Rádio é rádio. Uma entrevista com uma pessoa ainda é mais do que a banda tinha ontem.",
        consequence: {
          resultLabel: "No ar",
          descriptionTemplate:
            "A entrevista vai bem. {character2} não liga o rádio para ouvir, mas sabe de cor tudo o que foi dito.",
          fanCountChange: 3,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Exigir a banda toda",
        description:
          "Ou vai todo mundo, ou ninguém vai. A rádio adora ultimatos.",
        consequence: [
          {
            resultLabel: "A rádio cede",
            descriptionTemplate:
              "O programa abre espaço para a banda inteira, e a conversa rende. Rende tanto que o locutor precisa cortar para os comerciais.",
            fanCountChange: 2,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "A rádio desiste",
            descriptionTemplate:
              "A produção agradece com educação e chama outra banda, com menos integrantes e menos exigências.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "{character1} recusa em solidariedade",
        description:
          "Abrir mão da entrevista para não rachar a banda. Gesto nobre, audiência zero.",
        consequence: {
          resultLabel: "Gesto",
          descriptionTemplate:
            "{character2} fica sabendo e agradece em público no show seguinte, com um discurso mais longo do que a entrevista teria sido.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
          happinessChangePercent: 2,
        },
      },
      {
        label: "Falar só de si",
        description:
          "[{character1}] Aproveitar o microfone para contar a própria história. A banda aparece, se der tempo.",
        visibleIfCharacterHas: [["validation_seeker"], []],
        consequence: {
          resultLabel: "Estrela",
          descriptionTemplate:
            "A entrevista faz sucesso. A banda ouve no carro, calada, e descobre que {character1} fundou o grupo {character1:sozinho|sozinha|sem ajuda de ninguém}.",
          fanCountChange: 4,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -3,
            },
          ],
          happinessChangePercent: -6,
        },
      },
    ],
  },
  {
    id: "0303-ensaio-as-oito",
    type: "conflito_membros",
    title: "Ensaio às oito",
    descriptionTemplate:
      "{character1} chega {character1:atrasado|atrasada|com atraso} ao ensaio pela terceira vez na semana, sempre com uma desculpa nova e criativa. {character2} perde a paciência na frente da equipe técnica, que adora.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dar uma advertência",
        description:
          "Deixar claro que o próximo atraso vai ter consequência, seja ela qual for.",
        consequence: {
          resultLabel: "Recado dado",
          descriptionTemplate:
            "{character1} se desculpa, meio sem graça, e chega no horário por quase uma semana inteira.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Deixar passar",
        description:
          "Todo mundo tem semanas ruins. {character1} tem anos ruins.",
        consequence: [
          {
            resultLabel: "Esfriou",
            descriptionTemplate:
              "O assunto morre e o ensaio segue. O atraso, também.",
            happinessChangePercent: 0,
            chance: 60,
          },
          {
            resultLabel: "Explosão",
            descriptionTemplate:
              "{character2} larga o instrumento no meio da música e vai embora. Pontualmente.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Mudar o horário do ensaio",
        description:
          "Talvez o problema seja o horário, não a pessoa. Não custa testar.",
        consequence: {
          resultLabel: "Ajuste",
          descriptionTemplate:
            "O ensaio passa para a tarde e {character1} começa a chegar antes de todo mundo. Ninguém sabe o que fazer com essa informação.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 4,
        },
      },
      {
        label: "Assumir a agenda da banda",
        description:
          "[{character2}] Organizar horários, transporte e lembretes para todo mundo, com planilha e cara de poucos amigos.",
        visibleIfCharacterHas: [[], ["professional"]],
        consequence: {
          resultLabel: "Organização",
          descriptionTemplate:
            "Com tudo anotado, os atrasos param e o ensaio rende mais. A banda descobre que tinha um gerente e não sabia.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 6,
        },
      },
    ],
  },
  {
    id: "0304-quem-escreveu",
    type: "conflito_membros",
    title: "Quem escreveu?",
    descriptionTemplate:
      "Num jornal da região, {character1} diz que compôs {character1:sozinho|sozinha|sem ajuda} o maior sucesso da banda. {character2} lembra muito bem de ter escrito metade, inclusive a metade boa.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pedir correção ao jornal",
        description:
          "Mandar uma nota com os créditos certos. Jornal adora publicar correção na página que ninguém lê.",
        consequence: [
          {
            resultLabel: "Corrigido",
            descriptionTemplate:
              "O jornal publica a correção ao lado do horóscopo, e {character2} {character2:se sente reconhecido|se sente reconhecida|aceita o reconhecimento} mesmo assim.",
            fanCountChange: -1,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 70,
          },
          {
            resultLabel: "Ignorado",
            descriptionTemplate:
              "O jornal não publica nada, e {character1} fica com a fama. E com metade de uma música que não escreveu.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 30,
          },
        ],
      },
      {
        label: "Resolver entre os dois",
        description:
          "Roupa suja se lava em casa, de preferência longe da imprensa.",
        consequence: {
          resultLabel: "Mágoa",
          descriptionTemplate:
            "{character1} pede desculpas. {character2} aceita e anota a data, para usar depois.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Dar os créditos no palco",
        description: "No próximo show, apresentar a música como obra dos dois.",
        consequence: {
          resultLabel: "Aplausos",
          descriptionTemplate:
            "O público aplaude os dois, e a paz volta ao camarim, onde sempre foi provisória.",
          fanCountChange: 2,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 4,
        },
      },
      {
        label: "Dar a própria versão a outro jornal",
        description:
          "[{character2}] Contar a história verdadeira para o jornal concorrente, que agradece a exclusividade.",
        visibleIfCharacterHas: [[], ["envious", "jealous"]],
        consequence: [
          {
            resultLabel: "Escândalo",
            descriptionTemplate:
              "A briga vira assunto na cidade, e a banda nunca foi tão comentada. Ninguém comenta a música.",
            fanCountChange: 4,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
          {
            resultLabel: "Feio para todos",
            descriptionTemplate:
              "Os leitores acham a briga mesquinha e escrevem cartas dizendo isso. Muitas cartas.",
            fanCountChange: -3,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -4,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0305-abrir-para-os-grandes",
    type: "oportunidade_externa",
    title: "Abrir para os grandes",
    descriptionTemplate:
      "Uma banda famosa passa pela região e convida a banda para abrir o show. O empresário deles, porém, só quer um set acústico com {character1} e {character2}, porque o palco já está cheio de ego.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar no formato deles",
        description:
          "Palco grande é palco grande, mesmo que seja só um banquinho e um violão.",
        consequence: {
          resultLabel: "Plateia nova",
          descriptionTemplate:
            "O set curto agrada, e muita gente pergunta o nome da banda. Metade anota errado.",
          fanCountChange: 5,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 6,
        },
      },
      {
        label: "Negociar a banda completa",
        description:
          "Pedir para tocar com todo mundo, nem que seja por menos tempo.",
        consequence: [
          {
            resultLabel: "Topam",
            descriptionTemplate:
              "O empresário cede, e a banda inteira sobe ao palco. Ele passa o show olhando o relógio.",
            fanCountChange: 7,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Desistem",
            descriptionTemplate:
              "O empresário acha que a banda deu trabalho demais e chama outra, que aceita banquinho e violão sem discutir.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Recusar",
        description: "Ou a banda toca como banda, ou não toca.",
        consequence: {
          resultLabel: "Orgulho",
          descriptionTemplate:
            "A banda fica em casa, com a consciência tranquila, e ouve pelo rádio quem aceitou o banquinho.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Pedir o palco inteiro",
        description:
          "[{character1}] Convencer o empresário de que a banda segura a abertura sozinha. Confiança não custa nada; o convite, talvez.",
        visibleIfAnyInvolvedHas: ["confident"],
        consequence: [
          {
            resultLabel: "Lenda local",
            descriptionTemplate:
              "O empresário compra a ideia, e a abertura vira o assunto da noite. A atração principal finge que não ouviu.",
            fanCountChange: 9,
            happinessChangePercent: 10,
            chance: 50,
          },
          {
            resultLabel: "Convite cancelado",
            descriptionTemplate:
              "O empresário acha arrogante e cancela o convite. Arrogância, ele explica, é privilégio da atração principal.",
            fanCountChange: -2,
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0306-proposta-solo",
    type: "oportunidade_externa",
    title: "Proposta solo",
    descriptionTemplate:
      "Depois do show, um empresário da capital procura {character1} no camarim e oferece um contrato para carreira solo. Ele tem cartão de visita dourado e nenhum interesse pelo resto da banda.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Recusar na hora",
        description: "[{character1}] Agradecer e dizer que o lugar é na banda.",
        consequence: {
          resultLabel: "Fiel",
          descriptionTemplate:
            "{character1} recusa e passa a semana imaginando a capa do disco solo que nunca vai existir.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Pedir um tempo para pensar",
        description:
          "[{character1}] Guardar o cartão no bolso e não dar resposta. Mistério valoriza o passe.",
        consequence: [
          {
            resultLabel: "Esquecido",
            descriptionTemplate:
              "O empresário não liga de volta. O cartão dourado vai parar na máquina de lavar.",
            happinessChangePercent: -4,
            chance: 50,
          },
          {
            resultLabel: "Insistência",
            descriptionTemplate:
              "O empresário insiste, e {character1} passa a andar pelo camarim como quem tem opções.",
            happinessChangePercent: 8,
            chance: 50,
          },
        ],
      },
      {
        label: "Contar para a imprensa",
        description:
          "Deixar vazar que até empresário da capital anda rondando a banda.",
        consequence: {
          resultLabel: "Assunto",
          descriptionTemplate:
            "A notícia corre, e mais gente vai ver a banda que a capital quer roubar.",
          fanCountChange: 3,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Levar o empresário para conhecer a banda",
        description:
          "[{character1}] Recusar o solo e oferecer a banda inteira no lugar, como num pacote promocional.",
        visibleIfAnyInvolvedHas: ["loyal"],
        consequence: [
          {
            resultLabel: "Interesse",
            descriptionTemplate:
              "O empresário assiste ao ensaio e promete indicar a banda para casas maiores. Promessa de empresário, mas desta vez ele cumpre.",
            fanCountChange: 6,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Educado, mas não",
            descriptionTemplate:
              "O empresário agradece, mas só queria {character1}. A banda fica sabendo e adora o gesto, embora fique se perguntando o que tem de errado com ela.",
            fanCountChange: 1,
            happinessChangePercent: 10,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0307-o-jingle",
    type: "oportunidade_externa",
    title: "O jingle",
    descriptionTemplate:
      "Uma loja de departamentos da região quer {character1} cantando o jingle da campanha de fim de ano, uma obra-prima de quatro versos sobre parcelamento sem juros.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar",
        description:
          "[{character1}] Gravar o jingle. A voz vai tocar em todo intervalo comercial, a cidade queira ou não.",
        consequence: {
          resultLabel: "Refrão grudento",
          descriptionTemplate:
            "A cidade inteira passa a cantar o jingle, e alguns descobrem a banda por causa dele. Ninguém consegue tirar a melodia da cabeça, nem {character1}.",
          fanCountChange: 3,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Aceitar com o nome da banda",
        description:
          "Gravar, desde que o nome da banda apareça no fim do comercial.",
        consequence: [
          {
            resultLabel: "Propaganda grátis",
            descriptionTemplate:
              'A loja aceita, e o nome da banda passa a tocar todo dia, logo depois de "parcelamos em dez vezes".',
            fanCountChange: 5,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Sem acordo",
            descriptionTemplate:
              "A loja prefere outro cantor, que cobra menos e não exige nada. Ele está ótimo, obrigado.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar",
        description: "[{character1}] Música da banda não vende sofá.",
        consequence: {
          resultLabel: "Coerência",
          descriptionTemplate:
            "{character1} recusa e segue em paz com a própria arte e com o próprio sofá velho.",
          happinessChangePercent: 4,
        },
      },
      {
        label: "Recusar com um discurso no palco",
        description:
          "[{character1}] Contar no próximo show que recusou o jingle por respeito ao público.",
        visibleIfAnyInvolvedHas: ["purist"],
        consequence: [
          {
            resultLabel: "Ovação",
            descriptionTemplate:
              "O público adora a história e grita o nome da banda. O gerente da loja, na plateia, toma nota.",
            fanCountChange: 4,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Soou arrogante",
            descriptionTemplate:
              "Parte da plateia acha o discurso pedante. A outra parte queria mesmo era ouvir o jingle.",
            fanCountChange: -2,
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0308-programa-de-auditorio",
    type: "oportunidade_externa",
    title: "Programa de auditório",
    descriptionTemplate:
      "A TV regional chama a banda para um programa de auditório, entre o sorteio de um liquidificador e um concurso de dança. Só cabe uma música, com playback. {character1} topa na hora; {character2} acha uma vergonha.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Ir com playback",
        description:
          "Sorrir, fingir que toca e aproveitar a audiência. Ninguém em casa vai notar; os músicos da plateia, sim.",
        consequence: {
          resultLabel: "No ar",
          descriptionTemplate:
            "A apresentação passa para a região inteira, e {character2} dubla a própria música com a cara de quem assina uma confissão.",
          fanCountChange: 6,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Exigir tocar ao vivo",
        description: "Se é para aparecer, que seja tocando de verdade.",
        consequence: [
          {
            resultLabel: "Ao vivo",
            descriptionTemplate:
              "A produção aceita, e a banda faz a melhor apresentação da história do programa. Considerando o liquidificador, não era difícil.",
            fanCountChange: 8,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Cortados",
            descriptionTemplate:
              "A produção corta a banda do programa e estica o concurso de dança por mais cinco minutos.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar",
        description: "Playback não é com a banda.",
        consequence: {
          resultLabel: "Princípios",
          descriptionTemplate:
            "{character2} agradece. {character1} assiste ao programa em casa e conta quantas vezes teria aparecido.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Transformar o playback numa piada",
        description:
          "[{character1}] Errar de propósito, trocar instrumentos no meio da música e fazer o auditório rir.",
        visibleIfAnyInvolvedHas: ["playful"],
        consequence: [
          {
            resultLabel: "Inesquecível",
            descriptionTemplate:
              "A cena vira o momento mais comentado do programa, mais até que o liquidificador.",
            fanCountChange: 9,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Constrangimento",
            descriptionTemplate:
              "O apresentador não acha graça, e a banda sai sob vaias de um auditório que aplaude até propaganda.",
            fanCountChange: -3,
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0309-musica-nova-no-show",
    type: "decisao_criativa",
    title: "Música nova no show",
    descriptionTemplate:
      "{character1} quer estrear no sábado uma música que ainda não tem final. {character2} acha arriscado diante da maior plateia que a banda já teve, e da mais exigente.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Estrear assim mesmo",
        description:
          "Música boa se prova no palco. Música ruim também, só que mais rápido.",
        consequence: [
          {
            resultLabel: "Arrepio",
            descriptionTemplate:
              "A plateia canta o refrão na segunda vez. Nasceu um hino, e ninguém sabe ainda como ele termina.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Desencontro",
            descriptionTemplate:
              "A banda se perde na ponte da música e fica por lá um tempo. {character2} passa o resto do show olhando feio para {character1}.",
            fanCountChange: -3,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Guardar para o disco",
        description:
          "Tocar o repertório de sempre e lapidar a música com calma.",
        consequence: {
          resultLabel: "Prudência",
          descriptionTemplate:
            "O show é seguro e previsível. {character1} toca a noite toda como quem espera um ônibus.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Ensaiar a semana inteira",
        description: "Estrear, mas só depois de cinco ensaios seguidos.",
        consequence: {
          resultLabel: "Pronta",
          descriptionTemplate:
            "A música sai redonda, e a banda chega ao sábado com a disposição de quem fez cinco ensaios seguidos.",
          fanCountChange: 2,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Reescrever o arranjo de madrugada",
        description:
          "[{character2}] Passar a noite acertando cada compasso antes do show.",
        visibleIfAnyInvolvedHas: ["perfectionist"],
        consequence: [
          {
            resultLabel: "Lapidada",
            descriptionTemplate:
              "O arranjo novo funciona, e os dois saem do palco abraçados, o que deixa o resto da banda desconfiado.",
            fanCountChange: 6,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 70,
          },
          {
            resultLabel: "Esgotamento",
            descriptionTemplate:
              "A noite em claro cobra o preço no palco: {character2} toca o arranjo perfeito com dez segundos de atraso.",
            happinessChangePercent: -10,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0310-visual-novo",
    type: "decisao_criativa",
    title: "Visual novo",
    descriptionTemplate:
      "Uma revista de música vai fotografar a banda, e {character1} quer aparecer com um visual completamente diferente, inspirado em algo que ninguém na banda consegue identificar.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Apoiar a ideia",
        description: "Banda que não muda, cansa.",
        consequence: [
          {
            resultLabel: "Capa",
            descriptionTemplate:
              "A foto chama atenção e vira a capa da edição. O resto da banda aparece no canto, pequeno.",
            fanCountChange: 4,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Estranhamento",
            descriptionTemplate:
              "Os leitores não reconhecem a banda na foto, e alguns escrevem para perguntar quem é a pessoa no meio.",
            fanCountChange: -2,
            happinessChangePercent: 2,
            chance: 50,
          },
        ],
      },
      {
        label: "Pedir algo mais discreto",
        description:
          "A banda tem uma imagem, e ela está funcionando. Mais ou menos.",
        consequence: {
          resultLabel: "Contido",
          descriptionTemplate:
            '{character1} obedece, mas sai {character1:emburrado|emburrada|de cara fechada} em todas as fotos. A revista chama de "ar misterioso".',
          happinessChangePercent: -6,
        },
      },
      {
        label: "Deixar a revista decidir",
        description:
          "O fotógrafo entende do assunto, ou pelo menos tem a câmera.",
        consequence: {
          resultLabel: "Profissional",
          descriptionTemplate:
            "O fotógrafo encontra um meio-termo, e as fotos ficam boas. Ninguém gosta muito, que é o sinal de um bom meio-termo.",
          fanCountChange: 2,
          happinessChangePercent: 0,
        },
      },
      {
        label: "Contratar um figurinista caro",
        description:
          "[{character1}] Se é para mudar, que seja com roupa de artista de verdade.",
        visibleIfAnyInvolvedHas: ["dazzled"],
        consequence: [
          {
            resultLabel: "Ícone",
            descriptionTemplate:
              "O visual vira referência na cena da região, e três bandas aparecem vestidas igual no mês seguinte.",
            fanCountChange: 6,
            happinessChangePercent: 10,
            chance: 50,
          },
          {
            resultLabel: "Fantasia",
            descriptionTemplate:
              "A roupa vira piada nas cartas dos leitores, e uma delas vem com desenho.",
            fanCountChange: -3,
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0311-sucessos-ou-novas",
    type: "decisao_criativa",
    title: "Os sucessos ou as novas",
    descriptionTemplate:
      "A casa de show pede um repertório só de sucessos, porque sucesso vende cerveja. {character1} quer tocar o disco novo inteiro; {character2} concorda com a casa.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Só os sucessos",
        description: "Dar ao público o que ele veio ouvir.",
        consequence: {
          resultLabel: "Garantido",
          descriptionTemplate:
            "A casa vibra do começo ao fim, e {character1} toca no automático, pensando no disco novo.",
          fanCountChange: 3,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "O disco novo inteiro",
        description:
          "Quem gosta da banda vai gostar do que ela faz agora. Em teoria.",
        consequence: [
          {
            resultLabel: "Conquista",
            descriptionTemplate:
              "O público estranha no começo e termina pedindo bis. De uma música antiga, mas pedindo.",
            fanCountChange: 6,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Casa fria",
            descriptionTemplate:
              "Metade da plateia vai embora antes do fim. A outra metade fica porque a casa é perto do ponto de ônibus.",
            fanCountChange: -3,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Metade de cada",
        description:
          "Intercalar uma nova a cada dois sucessos. O bar agradece os intervalos.",
        consequence: {
          resultLabel: "Equilíbrio",
          descriptionTemplate:
            "O show flui e os dois saem satisfeitos. O dono da casa também: nas músicas novas, o bar encheu.",
          fanCountChange: 1,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 4,
        },
      },
      {
        label: "Montar um show conceitual",
        description:
          "[{character1}] Contar uma história do primeiro ao último acorde, com os sucessos no meio.",
        visibleIfCharacterHas: [["visionary"], []],
        consequence: [
          {
            resultLabel: "Espetáculo",
            descriptionTemplate:
              "A crítica local chama de o show do ano. O público concorda, mesmo sem ter entendido a história.",
            fanCountChange: 8,
            happinessChangePercent: 10,
            chance: 50,
          },
          {
            resultLabel: "Pretensioso",
            descriptionTemplate:
              "O público não entende a história, e a casa não chama de novo. Nem para explicar.",
            fanCountChange: -4,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0312-cidade-natal",
    type: "decisao_criativa",
    title: "A cidade natal",
    descriptionTemplate:
      'A prefeitura da cidade natal de {character1} convida a banda para um show gratuito na praça, no mesmo fim de semana de uma data paga em outra cidade. O prefeito promete um palanque "quase novo".',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar na cidade natal",
        description:
          "[{character1}] Voltar para casa e tocar para quem viu tudo começar, e para quem duvidou.",
        consequence: {
          resultLabel: "Festa",
          descriptionTemplate:
            "A praça lota, o palanque aguenta, e {character1} chora no último refrão. O prefeito também, por motivos eleitorais.",
          fanCountChange: 3,
          happinessChangePercent: 10,
        },
      },
      {
        label: "Cumprir a data paga",
        description: "Compromisso é compromisso, principalmente quando paga.",
        consequence: {
          resultLabel: "Saudade",
          descriptionTemplate:
            "O show pago vai bem. {character1} passa a noite pensando na praça e na tia que vai cobrar isso no Natal.",
          fanCountChange: 1,
          happinessChangePercent: -6,
        },
      },
      {
        label: "Fazer os dois",
        description:
          "Tocar na praça à tarde e viajar a noite inteira para a outra cidade.",
        consequence: [
          {
            resultLabel: "Maratona",
            descriptionTemplate:
              "As duas datas acontecem, e a banda vira notícia pelo esforço. Ninguém comenta a música, só as olheiras.",
            fanCountChange: 5,
            happinessChangePercent: -6,
            chance: 60,
          },
          {
            resultLabel: "Atraso",
            descriptionTemplate:
              "A van chega tarde, e o segundo show começa com uma hora de atraso e uma banda dormindo em pé.",
            fanCountChange: -2,
            happinessChangePercent: -12,
            chance: 40,
          },
        ],
      },
      {
        label: "Planejar as duas datas nos mínimos detalhes",
        description:
          "[{character1}] Montar a logística da viagem hora a hora, com mapa, horários e tolerância zero.",
        visibleIfAnyInvolvedHas: ["workaholic"],
        consequence: {
          resultLabel: "Precisão",
          descriptionTemplate:
            "Tudo sai no horário, e a banda faz os dois shows descansada. Ninguém entende como, e {character1} não explica.",
          fanCountChange: 5,
          happinessChangePercent: 4,
        },
      },
    ],
  },
  {
    id: "0313-o-pedido-de-camarim",
    type: "conflito_membros",
    title: "O pedido de camarim",
    descriptionTemplate:
      '{character1} mandou para a casa de shows uma lista de camarim com toalhas brancas, uvas sem semente e água "em temperatura ambiente, mas não muito". O produtor lê a lista em voz alta na chegada, e {character2} finge que não conhece ninguém ali.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cortar a lista pela metade",
        description:
          "Ficar com a água e as toalhas e devolver as uvas à natureza.",
        consequence: {
          resultLabel: "Lista enxuta",
          descriptionTemplate:
            "O camarim chega com água e duas toalhas. {character1} come o sanduíche da casa olhando para o lugar onde as uvas deveriam estar.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Manter a lista inteira",
        description:
          "Banda que enche casa pode pedir uva. Pelo menos é o que diz {character1}.",
        consequence: [
          {
            resultLabel: "Uvas entregues",
            descriptionTemplate:
              'A casa atende tudo e desconta do cachê, uva por uva. {character2} passa a chamar o camarim de "a quitanda".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Fama de difícil",
            descriptionTemplate:
              'O produtor conta a história aos outros produtores da região. Em três cidades, a banda vira "aquela da água morna".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Deixar {character2} reescrever o pedido",
        description: "Quem passou a vergonha escolhe o cardápio.",
        consequence: [
          {
            resultLabel: "Pedido sensato",
            descriptionTemplate:
              "{character2} pede água, café e um espelho. O produtor aprova, e {character1} passa a noite reparando que o espelho é pequeno.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -2,
            chance: 60,
          },
          {
            resultLabel: "Vingança",
            descriptionTemplate:
              "{character2} acrescenta à lista um pedido de silêncio absoluto durante o aquecimento de {character1}. O produtor atende só esse item.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Explicar cada item ao produtor",
        description:
          "[{character1}] Justificar as uvas, as toalhas e a temperatura da água como partes do processo artístico, com detalhes técnicos.",
        visibleIfCharacterHas: [["genius"]],
        consequence: [
          {
            resultLabel: "Convencido",
            descriptionTemplate:
              "O produtor ouve tudo, atende tudo e ainda acrescenta uma vela aromática por conta da casa. {character2} anota a explicação para usar depois.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Folclore",
            descriptionTemplate:
              "O produtor pede bis da parte da água e repete a explicação no balcão do bar a noite inteira. A casa ri, e a lista fica sem uva.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0314-a-faixa-amarela",
    type: "conflito_membros",
    title: "A faixa amarela",
    descriptionTemplate:
      "Na abertura para uma banda famosa, a equipe dela pinta uma faixa amarela no meio do palco: dali para a frente, só a atração principal. {character1} jura que vai cruzar a faixa no solo; {character2} quer que a banda seja convidada de novo.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar atrás da faixa",
        description:
          "Vinte minutos no fundo do palco, encostados na bateria dos outros.",
        consequence: {
          resultLabel: "Disciplina",
          descriptionTemplate:
            "A banda toca sem pisar no amarelo. A equipe da atração principal agradece com um aceno que também serve para apressar a saída.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Deixar {character1} cruzar a faixa no solo",
        description: "Um passo para a frente e vinte minutos de consequências.",
        consequence: [
          {
            resultLabel: "Passo à frente",
            descriptionTemplate:
              "{character1} cruza a faixa, a plateia grita, e o solo vira o assunto do bar. A banda famosa não convida de novo, mas decora o nome.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Cabo puxado",
            descriptionTemplate:
              "O técnico da atração principal desliga o amplificador de {character1} no segundo passo. O solo termina em mímica, aplaudido por educação.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Cruzar com a banda inteira na última música",
        description:
          "Se é para quebrar a regra, que seja em grupo e no fim, quando já não dá para expulsar ninguém.",
        consequence: [
          {
            resultLabel: "Invasão",
            descriptionTemplate:
              "A banda inteira avança, e a plateia avança junto. A equipe da atração principal repinta a faixa mais para trás antes do show deles.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Luzes apagadas",
            descriptionTemplate:
              "A luz do palco apaga no primeiro passo e só volta para a atração principal. A banda termina a música no escuro, que é onde vai ficar na próxima turnê deles.",
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
      {
        label: "Exigir que a faixa seja apagada",
        description:
          "[{character1}] Ir até o produtor da atração principal antes do show e explicar, em volume de palco, que tinta não manda em banda.",
        visibleIfCharacterHas: [["hothead"]],
        consequence: [
          {
            resultLabel: "Faixa apagada",
            descriptionTemplate:
              "O produtor, cansado, manda passar um pano na faixa. {character1} conta a história em todas as entrevistas dos próximos dez anos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 30,
          },
          {
            resultLabel: "Fora da escalação",
            descriptionTemplate:
              "O produtor ouve tudo e troca a banda de abertura por um mágico da cidade. O mágico respeita a faixa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -10,
            chance: 70,
          },
        ],
      },
    ],
  },
  {
    id: "0315-o-onibus-das-seis",
    type: "conflito_membros",
    title: "O ônibus das seis",
    descriptionTemplate:
      'O ônibus sai às seis da manhã para a próxima cidade, e {character1} sumiu depois do show com uma turma que prometeu "o melhor pastel do estado". {character2} está com a lista de passageiros na mão, e o motorista está com pressa.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Partir sem {character1}",
        description:
          "{character1} conhece o roteiro. Em tese, conhece também a rodoviária.",
        consequence: {
          resultLabel: "Passagem própria",
          descriptionTemplate:
            "{character1} chega à próxima cidade de ônibus de linha, na hora da passagem de som, com um saco de pastel frio que ninguém aceita.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Esperar {character1}",
        description: "Atrasar a viagem e torcer para que o pastel fique perto.",
        consequence: [
          {
            resultLabel: "Chegou",
            descriptionTemplate:
              "{character1} aparece às sete e meia, com pastel para todo mundo. O atraso custa a passagem de som, e o pastel quase compensa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Atraso em cadeia",
            descriptionTemplate:
              "{character1} aparece às dez. A banda chega à próxima cidade com o público já na porta e monta o palco na frente dele.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Mandar {character2} procurar {character1}",
        description:
          "Rodar a cidade às cinco da manhã, de pastelaria em pastelaria.",
        consequence: [
          {
            resultLabel: "Achado",
            descriptionTemplate:
              "{character2} encontra {character1} dormindo no balcão da terceira pastelaria. O ônibus sai às seis e quinze, com um passageiro a mais e um bom humor a menos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 60,
          },
          {
            resultLabel: "Desencontro",
            descriptionTemplate:
              "{character2} roda a cidade inteira e volta ao hotel no momento em que {character1} entra no ônibus, {character1:descansado|descansada|com cara de descanso}. Quem atrasa a viagem agora é {character2}.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Segurar o ônibus até {character1} voltar",
        description:
          "[{character2}] Sentar na porta do ônibus e avisar ao motorista que ninguém sai sem a banda inteira.",
        visibleIfCharacterHas: [[], ["loyal"]],
        consequence: [
          {
            resultLabel: "Família",
            descriptionTemplate:
              "O motorista resmunga, {character1} aparece às sete, e o ônibus parte com todo mundo. {character1} passa a viagem oferecendo pastel a {character2}, que aceita todos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Hora extra",
            descriptionTemplate:
              "{character1} só aparece às nove, e o motorista cobra a espera por hora, como manda o contrato que ninguém leu. {character2} paga e não comenta, o que é pior.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0316-o-quarto-do-letreiro",
    type: "conflito_membros",
    title: "O quarto do letreiro",
    descriptionTemplate:
      "O hotel da estrada tem dois quartos livres: um com ventilador e janela para o pátio, outro de frente para o letreiro luminoso, que pisca o nome do hotel a noite inteira. É a terceira noite seguida em que {character1} pega primeiro a chave do quarto bom.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pegar a chave antes de {character1}",
        description:
          "Descer do ônibus primeiro e chegar ao balcão antes da discussão.",
        consequence: {
          resultLabel: "Troca forçada",
          descriptionTemplate:
            "{character2} dorme no quarto do ventilador. {character1} passa a noite contando as piscadas do letreiro e, no café, informa o total a todos.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Dividir o quarto bom",
        description: "Duas camas, um ventilador e nenhuma privacidade.",
        consequence: [
          {
            resultLabel: "Rodízio",
            descriptionTemplate:
              "Os dois dividem o ventilador em turnos de meia hora. Ninguém dorme muito, mas ninguém dorme com raiva.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Ronco",
            descriptionTemplate:
              "{character1} ronca no ritmo do letreiro do quarto ao lado. {character2} termina a noite no ônibus, com o motorista.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Pagar um hotel melhor na cidade",
        description:
          "Sair da estrada e gastar o que sobrou do cachê numa noite decente.",
        consequence: [
          {
            resultLabel: "Lençol combinando",
            descriptionTemplate:
              "A banda dorme no hotel da praça, com lençol que combina com a fronha. O cachê da noite vai inteiro para o lençol.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Lotado",
            descriptionTemplate:
              "O hotel da praça está lotado por causa de um congresso de dentistas. A banda volta à estrada às duas da manhã, e o quarto bom já foi alugado.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Ficar com o quarto do letreiro sem reclamar",
        description:
          "[{character2}] Deitar, virar para a parede e dormir, como em qualquer outro lugar do mundo.",
        visibleIfCharacterHas: [[], ["stable"]],
        consequence: {
          resultLabel: "Sono pesado",
          descriptionTemplate:
            "{character2} dorme nove horas seguidas sob o letreiro. {character1} acorda no quarto bom com olheiras de culpa.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 4,
        },
      },
    ],
  },
  {
    id: "0317-a-caixa-das-camisetas",
    type: "conflito_membros",
    title: "A caixa das camisetas",
    descriptionTemplate:
      "Quem vende as camisetas nos shows é o primo de {character1}. Em três noites, a caixa fechou com doze camisetas a menos e nenhum dinheiro a mais, e {character2} contou as doze.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Demitir o primo",
        description: "Equipe é equipe. Família é no almoço de domingo.",
        consequence: {
          resultLabel: "Banca vazia",
          descriptionTemplate:
            "O primo vai embora e leva o crachá de lembrança. Na noite seguinte ninguém vende camiseta, e a caixa fecha exata: zero.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Dar mais uma chance ao primo",
        description:
          "Contar as camisetas antes e depois de cada show, sem avisar ninguém.",
        consequence: [
          {
            resultLabel: "Engano",
            descriptionTemplate:
              "As contas batem. As doze camisetas estavam numa caixa esquecida no bagageiro, junto com um pé de tênis de ninguém.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Mais quatro",
            descriptionTemplate:
              "Faltam mais quatro camisetas. O primo jura que deu todas para fãs que choraram na fila.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Pôr {character1} para vender camiseta",
        description: "Quem trouxe o primo cobre o turno do primo.",
        consequence: [
          {
            resultLabel: "Balcão novo",
            descriptionTemplate:
              "{character1} vende camiseta até a última fila ir embora e toca o show seguinte sem voz de tanto anunciar tamanho.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -4,
            chance: 60,
          },
          {
            resultLabel: "Desconto de fã",
            descriptionTemplate:
              "{character1} dá desconto para cada fã que elogia o show. A caixa fecha com menos dinheiro que a do primo.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Assumir a banca e subir o preço",
        description:
          "[{character2}] Vender as camisetas pessoalmente, com preço novo e conferência peça por peça.",
        visibleIfCharacterHas: [[], ["greedy"]],
        consequence: [
          {
            resultLabel: "Lucro",
            descriptionTemplate:
              "{character2} vende a camiseta pelo dobro e anota cada venda num caderno de capa dura. A caixa nunca rendeu tanto, e a fila nunca andou tão devagar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Encalhe",
            descriptionTemplate:
              "Pelo dobro, ninguém compra. {character2} volta para o ônibus com oitenta camisetas e a certeza de que o público não sabe o que perde.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0318-a-lista-de-convidados",
    type: "conflito_membros",
    title: "A lista de convidados",
    descriptionTemplate:
      "{character1} pôs dezenove nomes na lista de convidados do show. A casa aceita seis e desconta o resto do cachê, e o nome que ficou de fora foi o da mãe de {character2}.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cortar os amigos de {character1}",
        description:
          "Seis lugares, prioridade para quem tem parentesco comprovado.",
        consequence: {
          resultLabel: "Lista nova",
          descriptionTemplate:
            "{character1} risca treze nomes com a caneta da bilheteria. Treze amigos descobrem na porta que eram só conhecidos.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Pagar os ingressos extras com o cachê",
        description:
          "Dezenove convidados, um cachê menor e uma plateia que aplaude qualquer coisa.",
        consequence: [
          {
            resultLabel: "Claque",
            descriptionTemplate:
              "Os dezenove aplaudem até a afinação. A banda volta com metade do cachê e o melhor público da turnê.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Conta salgada",
            descriptionTemplate:
              "A casa cobra os ingressos pelo preço da porta, mais a cerveja que os convidados de {character1} pediram em nome da banda.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Deixar a lista como está",
        description: "Seis entram. Os outros resolvem na porta.",
        consequence: [
          {
            resultLabel: "Mãe pagante",
            descriptionTemplate:
              "A mãe de {character2} paga o ingresso, assiste ao show na primeira fila e conta a todos em volta quanto custou.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
          {
            resultLabel: "Porteiro gentil",
            descriptionTemplate:
              "O porteiro reconhece o sobrenome da mãe de {character2} e deixa entrar. Ela passa a noite contando que entrou de graça, perto demais do produtor.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
        ],
      },
      {
        label: "Passar os convidados como equipe técnica",
        description:
          '[{character1}] Fazer crachás de papel com "EQUIPE" escrito à mão e entrar com os dezenove pela porta dos fundos.',
        visibleIfCharacterHas: [["playful"]],
        consequence: [
          {
            resultLabel: "Equipe numerosa",
            descriptionTemplate:
              "Os dezenove entram carregando um cabo cada um. O produtor elogia o tamanho da equipe e pergunta por que ninguém ajuda a montar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Crachá de papel",
            descriptionTemplate:
              'O segurança lê o primeiro crachá contra a luz. A banda paga os dezenove ingressos e uma multa por "tentativa de equipe".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0319-as-paradas-do-motorista",
    type: "conflito_membros",
    title: "As paradas do motorista",
    descriptionTemplate:
      "O motorista que {character1} contratou para a turnê, amigo da família, para em todo restaurante de estrada para provar o café do lugar. A banda chegou atrasada às últimas três passagens de som, e {character2} já tem opinião sobre o café de seis cidades.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Demitir o motorista",
        description: "A turnê segue, mas alguém precisa dirigir.",
        consequence: [
          {
            resultLabel: "Motorista novo",
            descriptionTemplate:
              "A agência manda um motorista que não para nem para abastecer. A banda chega no horário, com fome e um pouco de medo.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Sem volante",
            descriptionTemplate:
              "Não há motorista livre na região. A banda perde uma data esperando o substituto, que chega elogiando o café da rodoviária.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Manter o motorista e sair mais cedo",
        description:
          "Duas horas de antecedência, uma delas reservada para o café.",
        consequence: {
          resultLabel: "Madrugada",
          descriptionTemplate:
            "A banda passa a sair às cinco da manhã. Chega a tempo da passagem de som e dorme durante ela.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Mandar {character1} falar com o motorista",
        description:
          "Quem contratou o amigo da família que dê a notícia ao amigo da família.",
        consequence: [
          {
            resultLabel: "Combinado",
            descriptionTemplate:
              "O motorista promete uma parada só por viagem e cumpre. Ela dura uma hora e quarenta.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Mágoa na estrada",
            descriptionTemplate:
              "O motorista se ofende e dirige a viagem seguinte a quarenta por hora, em silêncio. {character1} pede desculpas no primeiro posto, com um café na mão.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Assumir o volante nas viagens longas",
        description:
          "[{character2}] Dirigir de madrugada, logo depois do show, e deixar o motorista dormindo no banco de trás.",
        visibleIfCharacterHas: [[], ["workaholic"]],
        consequence: [
          {
            resultLabel: "Pontualidade",
            descriptionTemplate:
              "A banda chega a todas as cidades antes do sol. {character2} toca os shows com a cara de quem acabou de dirigir quinhentos quilômetros, porque acabou.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Acostamento",
            descriptionTemplate:
              "{character2} cochila ao volante e para no acostamento às quatro da manhã, a tempo. O motorista acorda, assume a direção e para no primeiro café.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0320-os-vinte-e-seis-minutos",
    type: "conflito_membros",
    title: "Os vinte e seis minutos",
    descriptionTemplate:
      "A casa dá trinta minutos de passagem de som para a banda inteira. {character1} gastou vinte e seis no próprio instrumento, e {character2} ficou com quatro minutos e um técnico olhando o relógio.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cortar o tempo de {character1}",
        description:
          "Dez minutos para cada um nas próximas casas, cronometrados pelo técnico.",
        consequence: {
          resultLabel: "Cronômetro",
          descriptionTemplate:
            "Cada um tem seus dez minutos. {character1} passa o show inteiro mexendo no botão de volume, como quem procura uma estação de rádio.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Tocar com o som como está",
        description: "Quatro minutos dão para ligar o cabo. O resto é fé.",
        consequence: [
          {
            resultLabel: "Razoável",
            descriptionTemplate:
              "O som de {character2} sai razoável, por sorte. {character1} sai do palco elogiando o som do próprio instrumento, que estava perfeito.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Microfonia",
            descriptionTemplate:
              "O retorno de {character2} apita a noite inteira. A plateia acha que é parte do arranjo e aplaude no apito.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Pagar mais uma hora de passagem de som",
        description:
          "O técnico fica, desde que alguém pague o jantar e a hora extra.",
        consequence: [
          {
            resultLabel: "Som redondo",
            descriptionTemplate:
              "Com uma hora a mais, todo mundo acerta o som, e o show sai como deveria. O técnico cobra o jantar e uma sobremesa que não estava no combinado.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Mais do mesmo",
            descriptionTemplate:
              "{character1} usa cinquenta minutos da hora extra. {character2} passa o som enquanto o técnico janta.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Passar o som de {character2} também",
        description:
          "[{character1}] Usar os quatro minutos restantes para ajustar o som de {character2} com a mesma obsessão.",
        visibleIfCharacterHas: [["perfectionist"]],
        consequence: [
          {
            resultLabel: "Ouvido absoluto",
            descriptionTemplate:
              "{character1} acerta o som de {character2} em quatro minutos e meio. O técnico da casa pede o endereço para mandar trabalho.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Quadragésima vez",
            descriptionTemplate:
              "{character1} pede que {character2} toque a mesma nota quarenta vezes. Na quadragésima, o público já está entrando e escolhendo lugar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0321-a-clausula-da-pagina-quatro",
    type: "oportunidade_externa",
    title: "A cláusula da página quatro",
    descriptionTemplate:
      'Uma casa de shows da capital do estado oferece o maior cachê que a banda já viu. {character1} vai assinar pela banda e chega à página quatro, onde uma letra bem pequena fala em "eventuais danos ao patrimônio" e em energia elétrica cobrada depois das onze.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Assinar como está",
        description: "Cachê grande não se lê. Se agradece.",
        consequence: [
          {
            resultLabel: "Noite limpa",
            descriptionTemplate:
              "O show acaba às dez e cinquenta, e nada quebra. {character1} guarda a cópia do contrato como quem guarda uma multa que não veio.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Danos ao patrimônio",
            descriptionTemplate:
              "Um amplificador cai e trinca uma tábua do palco que já estava trincada. A casa desconta a tábua, a pintura e a energia de um bis de doze minutos.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Pedir para riscar a cláusula",
        description:
          "Uma caneta, uma linha e o risco de o produtor lembrar que existem outras bandas.",
        consequence: [
          {
            resultLabel: "Riscada",
            descriptionTemplate:
              "O produtor risca a cláusula com um suspiro e rubrica ao lado. A banda toca até a meia-noite por esporte.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Próxima da lista",
            descriptionTemplate:
              "O produtor agradece o interesse e liga para a próxima banda da lista, que assina sem ler.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Assinar e parar às onze em ponto",
        description:
          "Tocar com o relógio da casa à vista e o último refrão em risco.",
        consequence: {
          resultLabel: "Pontualidade",
          descriptionTemplate:
            "A banda para no meio do último refrão, às onze em ponto. A plateia vaia o relógio, e o cachê chega inteiro.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Ler o contrato inteiro com lupa",
        description:
          "[{character1}] Levar o contrato para o hotel e procurar, cláusula por cláusula, o que mais a letra pequena esconde.",
        visibleIfCharacterHas: [["paranoid"]],
        consequence: [
          {
            resultLabel: "Página sete",
            descriptionTemplate:
              "{character1} encontra na página sete uma exclusividade de dois anos na região. O produtor diz que é padrão e risca na frente de todos, com cara de quem foi pego.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Noite em claro",
            descriptionTemplate:
              "{character1} passa a noite com a lupa e não encontra mais nada. Chega ao show {character1:convencido|convencida|com a certeza} de que a cláusula perigosa é a que não está escrita.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0322-o-tecnico-das-tres-bandas",
    type: "oportunidade_externa",
    title: "O técnico das três bandas",
    descriptionTemplate:
      "Depois de um show no interior, um técnico de som oferece os serviços à banda. Diz que já trabalhou com três bandas famosas, cujos nomes prefere não citar, e pede salário fixo e a poltrona da janela no ônibus.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Contratar com salário fixo",
        description:
          "Ter técnico próprio é coisa de banda grande. Pagar um também.",
        consequence: [
          {
            resultLabel: "Ouvido bom",
            descriptionTemplate:
              "O técnico sabe o que faz, e o som da banda melhora em todas as casas. Ele só não larga a poltrona da janela nem para descer no posto.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Currículo",
            descriptionTemplate:
              "Na primeira casa, o técnico pergunta para que serve um dos botões da mesa. As três bandas famosas continuam sem nome.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Contratar só para as datas grandes",
        description: "Meio técnico, meio salário, meia poltrona.",
        consequence: {
          resultLabel: "Meio período",
          descriptionTemplate:
            "O técnico aceita e aparece nas datas grandes, sempre de cara fechada. Nas pequenas, a banda volta ao retorno da casa, que apita em lá.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Seguir com o técnico de cada casa",
        description: "Cada cidade, um técnico novo e uma surpresa nova.",
        consequence: {
          resultLabel: "Loteria",
          descriptionTemplate:
            "A banda dispensa a oferta. Na cidade seguinte, o técnico da casa é o sobrinho do dono, e o show sai no volume que ele considera educado.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Contratar o técnico e o assistente dele",
        description:
          "[{character1}] Deixar-se levar pelas histórias das bandas famosas e contratar também o assistente, que carrega a maleta.",
        visibleIfCharacterHas: [["dazzled"]],
        consequence: [
          {
            resultLabel: "Equipe própria",
            descriptionTemplate:
              'O técnico e o assistente montam um som que a banda nunca teve. {character1} passa a dizer "minha equipe" em voz alta em todas as casas.',
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Maleta vazia",
            descriptionTemplate:
              "O assistente carrega a maleta por três semanas. Quando alguém finalmente a abre, encontra um sanduíche e o contrato de outra banda.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0323-a-casa-da-frente",
    type: "oportunidade_externa",
    title: "A casa da frente",
    descriptionTemplate:
      "Numa cidade do interior, duas casas de shows disputam o fim de semana na mesma rua. A banda já fechou com uma, e o dono da casa da frente procura {character1} e {character2} com o dobro do cachê e uma condição: cancelar a outra.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cumprir o contrato fechado",
        description: "Palavra dada, cachê menor.",
        consequence: {
          resultLabel: "Palavra",
          descriptionTemplate:
            "A banda toca na casa combinada e ouve, da janela do camarim, a casa da frente lotar com outra banda.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Cancelar e tocar na casa da frente",
        description:
          "O dobro do cachê, e a casa abandonada do outro lado da calçada.",
        consequence: [
          {
            resultLabel: "Dobro",
            descriptionTemplate:
              "O dono da casa da frente paga o dobro, em dinheiro, ainda no palco. A casa abandonada põe na porta um cartaz com o nome da banda e uma palavra que não se repete aqui.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Fama na região",
            descriptionTemplate:
              "A casa abandonada avisa a todas as casas da região. A banda recebe o dobro uma vez e metade das propostas no resto do semestre.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Propor tocar nas duas",
        description:
          "Sexta numa casa, sábado na outra, e que os donos não se cruzem na calçada.",
        consequence: [
          {
            resultLabel: "Fim de semana cheio",
            descriptionTemplate:
              "Os dois donos aceitam, cada um achando que venceu o outro. A banda toca duas noites e almoça no meio da rua, em território neutro.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 40,
          },
          {
            resultLabel: "Fim de semana vazio",
            descriptionTemplate:
              "Os dois donos se ofendem com a mesma ideia e cancelam na mesma tarde. A banda passa o sábado na praça, entre as duas casas.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
      {
        label: "Contar a cada dono a proposta do outro",
        description:
          "[{character1}] Subir o preço nas duas casas ao mesmo tempo, com números que ninguém vai conferir.",
        visibleIfCharacterHas: [["manipulator"]],
        consequence: [
          {
            resultLabel: "Leilão",
            descriptionTemplate:
              "Os donos cobrem as ofertas um do outro até a casa original pagar o triplo. {character2} assiste a tudo e passa a conferir as contas de {character1}.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Cunhados",
            descriptionTemplate:
              "Os dois donos são cunhados e almoçam juntos todo domingo. No domingo seguinte, comparam as propostas e cancelam a banda nas duas casas.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -10,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0324-setenta-por-cento-da-porta",
    type: "oportunidade_externa",
    title: "Setenta por cento da porta",
    descriptionTemplate:
      "O produtor de uma casa nova propõe trocar o cachê fixo por setenta por cento da bilheteria. A casa abre no sábado, tem seiscentos lugares e, até agora, quarenta ingressos vendidos. {character1} e {character2} decidem na mesa do escritório dele.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Ficar com o cachê fixo",
        description: "Dinheiro certo, por pouco que seja.",
        consequence: {
          resultLabel: "Garantido",
          descriptionTemplate:
            "A banda recebe o combinado. A casa lota no sábado, e o produtor passa a noite sorrindo para a bilheteria.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Aceitar a porcentagem da bilheteria",
        description:
          "Apostar no público, a única coisa que a banda nunca conseguiu prever.",
        consequence: [
          {
            resultLabel: "Casa cheia",
            descriptionTemplate:
              "Os seiscentos lugares esgotam até sábado. O produtor conta o dinheiro da banda duas vezes, devagar, como se doesse.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Quarenta e três",
            descriptionTemplate:
              "A bilheteria vende mais três ingressos. Os setenta por cento cabem no bolso da camisa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Pedir metade fixa e metade da bilheteria",
        description:
          "Um pouco de certeza, um pouco de aposta e um produtor fazendo conta.",
        consequence: [
          {
            resultLabel: "Meio a meio",
            descriptionTemplate:
              "O produtor aceita depois de rabiscar dois guardanapos. A casa enche pela metade, e a banda ganha exatamente o que ganharia com o cachê fixo, com mais trabalho.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 70,
          },
          {
            resultLabel: "Proposta retirada",
            descriptionTemplate:
              "O produtor diz que meio a meio é coisa de banda pequena e retira as duas propostas. A banda sai do escritório sem data e sem guardanapo.",
            happinessChangePercent: -6,
            chance: 30,
          },
        ],
      },
      {
        label: "Trocar a bilheteria por uma parte do bar",
        description:
          "[{character1}] Pedir uma parte de cada cerveja vendida durante o show, porque público com sede é mais garantido que público com ingresso.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Noite quente",
            descriptionTemplate:
              "O sábado é quente e o show é longo. A banda ganha mais com o bar do que ganharia com a porta, e {character1} passa a escolher o repertório pelo efeito na sede.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Noite fria",
            descriptionTemplate:
              "Faz frio no sábado, e o público pede café. A casa não vende café.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0325-o-fa-clube-no-onibus",
    type: "oportunidade_externa",
    title: "O fã-clube no ônibus",
    descriptionTemplate:
      "O fã-clube que segue a banda de cidade em cidade já foi a sete shows seguidos, sempre na grade e sempre com a mesma bandeira pintada à mão. A presidente pede a {character1} e {character2} lugar no ônibus da turnê para ela e mais onze sócios.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dar carona ao fã-clube",
        description:
          "Doze fãs, um ônibus e nenhum minuto de silêncio até o fim da turnê.",
        consequence: [
          {
            resultLabel: "Coro na estrada",
            descriptionTemplate:
              "O fã-clube canta o repertório inteiro em cada viagem, na ordem certa. A banda nunca ensaiou tanto sem querer.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Fã de perto",
            descriptionTemplate:
              "Na terceira viagem, o fã-clube descobre como a banda é de manhã. Dois sócios pedem para descer no posto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar e dar ingressos de graça",
        description: "Lugar na grade, sim. Lugar no ônibus, não.",
        consequence: {
          resultLabel: "Distância segura",
          descriptionTemplate:
            "O fã-clube agradece os ingressos e segue a banda num carro alugado, a cem metros do ônibus, pela estrada inteira.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Dar carona em troca de trabalho na banca",
        description:
          "O fã-clube viaja de graça e vende as camisetas da banda em cada cidade.",
        consequence: [
          {
            resultLabel: "Equipe voluntária",
            descriptionTemplate:
              'O fã-clube vende camiseta como quem defende a família. A banca nunca vendeu tanto, e a presidente já diz "a nossa banda".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Sindicato",
            descriptionTemplate:
              "No terceiro dia, o fã-clube pede comissão, folga no domingo e o nome nos agradecimentos do próximo disco.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Viajar no carro do fã-clube",
        description:
          "[{character1}] Trocar o ônibus da banda pelo carro do fã-clube, onde cada música recebe aplauso.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Aplauso contínuo",
            descriptionTemplate:
              "{character1} chega a cada cidade com a autoestima recarregada. O fã-clube aplaude até quando {character1} espirra.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Banco de trás",
            descriptionTemplate:
              "No segundo dia, um sócio comenta que preferia a banda no começo. {character1} faz o resto da viagem {character1:calado|calada|sem dizer uma palavra}, olhando a estrada.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0326-o-casamento-na-praca",
    type: "oportunidade_externa",
    title: "O casamento na praça",
    descriptionTemplate:
      "O ônibus quebra numa cidade pequena, a duzentos quilômetros do próximo show, e a peça só chega amanhã. Na praça, uma festa de casamento sem banda descobre quem acabou de chegar, e o pai da noiva procura {character1} e {character2} com um cachê e uma lista de valsas.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar no casamento",
        description:
          "Cachê extra, plateia emocionada e três valsas que ninguém sabe tocar.",
        consequence: [
          {
            resultLabel: "Festa",
            descriptionTemplate:
              "A banda toca a noite inteira, valsas incluídas, de ouvido. O pai da noiva paga, chora e pede o telefone da banda para o próximo casamento da família.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Valsa errada",
            descriptionTemplate:
              "A banda erra a valsa na entrada da noiva e emenda num sucesso próprio. Os noivos dançam, e o pai da noiva paga metade.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar e esperar na oficina",
        description:
          "Passar a noite ao lado do ônibus e garantir que a peça chegue mesmo.",
        consequence: {
          resultLabel: "Oficina",
          descriptionTemplate:
            "A banda passa a noite na oficina ouvindo de longe o sobrinho da noiva, que toca teclado e transforma tudo em valsa. A peça chega às dez da manhã.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Alugar um carro e seguir viagem",
        description:
          "Deixar o ônibus no mecânico e levar só o equipamento que couber.",
        consequence: [
          {
            resultLabel: "Bumbo no colo",
            descriptionTemplate:
              "A banda chega ao próximo show com metade do equipamento e o bumbo no colo de quem perdeu o par ou ímpar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
          {
            resultLabel: "Locadora fechada",
            descriptionTemplate:
              "A única locadora da cidade está fechada. O dono é o pai da noiva.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Improvisar o repertório da festa",
        description:
          "[{character1}] Tocar tudo o que a festa pedir, valsas incluídas, sem ensaio nem lista.",
        visibleIfCharacterHas: [["informal"]],
        consequence: [
          {
            resultLabel: "Banda da cidade",
            descriptionTemplate:
              "{character1} toca valsa, bolero, marchinha e o hino do time do noivo, tudo de ouvido. A cidade decide que a banda é dela.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Valsa de oito minutos",
            descriptionTemplate:
              "{character1} começa uma valsa e termina num rock de oito minutos. A avó da noiva aprova; os noivos, não.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0327-vinte-e-tres-ingressos",
    type: "decisao_criativa",
    title: "Vinte e três ingressos",
    descriptionTemplate:
      "A casa de shows tem seiscentos lugares e vendeu vinte e três ingressos. O produtor pergunta a {character1} se a banda toca assim mesmo, enquanto o garçom recolhe as cadeiras que não vão ser usadas.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar o show completo",
        description:
          "Duas horas de repertório, como se a casa estivesse cheia.",
        consequence: [
          {
            resultLabel: "Vinte e três fiéis",
            descriptionTemplate:
              "A banda toca tudo, bis incluído, para vinte e três pessoas que cantam como seiscentas. Dez delas voltam no próximo show, com amigos.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Eco",
            descriptionTemplate:
              "A banda toca duas horas para vinte e três pessoas e um eco. Na metade do show, são dezenove.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Chamar o público para perto do palco",
        description:
          "Descer do palco, puxar as cadeiras e fazer um show acústico para quem veio.",
        consequence: {
          resultLabel: "Sala de estar",
          descriptionTemplate:
            "Vinte e três pessoas sentam em roda, e a banda toca sem amplificador. O produtor apaga as luzes da casa para economizar e chama isso de clima.",
          happinessChangePercent: 4,
        },
      },
      {
        label: "Cancelar e devolver os ingressos",
        description: "Guardar a voz para a cidade seguinte.",
        consequence: {
          resultLabel: "Porta fechada",
          descriptionTemplate:
            "A banda devolve vinte e três ingressos e janta cedo. O produtor anota o nome da banda num caderno, numa página que não é a das próximas datas.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Tocar as músicas mais difíceis do repertório",
        description:
          "[{character1}] Aproveitar a casa vazia para tocar o que nenhuma casa cheia aceitaria.",
        visibleIfCharacterHas: [["purist"]],
        consequence: [
          {
            resultLabel: "Público certo",
            descriptionTemplate:
              "Os vinte e três ouvem em silêncio absoluto e aplaudem de pé no fim. {character1} declara que foi o melhor show da turnê, e pela primeira vez ninguém na banda discorda.",
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Público qualificado",
            descriptionTemplate:
              "Na terceira música sem refrão, sobram onze. {character1} considera o show um sucesso de público qualificado.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0328-o-mapa-rodoviario",
    type: "decisao_criativa",
    title: "O mapa rodoviário",
    descriptionTemplate:
      "{character1} abre o mapa rodoviário do estado na mesa do bar para fechar a turnê do semestre. Um agente de shows da região ofereceu onze cidades em catorze dias, todas com casa garantida e nenhuma com hotel garantido.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Fechar as onze cidades",
        description: "Catorze dias, onze palcos e o ônibus como endereço fixo.",
        consequence: [
          {
            resultLabel: "Estado inteiro",
            descriptionTemplate:
              "A banda cumpre as onze datas e volta conhecida no estado inteiro. Ninguém lembra em qual cidade foi qual show.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Cidade número nove",
            descriptionTemplate:
              "Na nona cidade, a banda erra a letra do próprio sucesso e o nome da cidade, nessa ordem.",
            happinessChangePercent: -10,
            chance: 50,
          },
        ],
      },
      {
        label: "Fechar só as cidades maiores",
        description: "Seis datas, mais descanso e menos estrada para contar.",
        consequence: {
          resultLabel: "Turnê enxuta",
          descriptionTemplate:
            "A banda faz seis shows bem tocados e dorme em camas de verdade. O agente passa as outras cinco cidades para outra banda, que agradece.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Trocar a turnê por uma noite na capital",
        description:
          "Um show só, numa casa maior, e o resto do semestre para ensaiar.",
        consequence: [
          {
            resultLabel: "Noite grande",
            descriptionTemplate:
              "A casa da capital lota, e a banda descobre que uma noite cheia rende mais do que cinco vazias.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Noite de chuva",
            descriptionTemplate:
              "Chove na noite do show, e a capital fica em casa. A banda tem o resto do semestre para pensar nisso.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Riscar as cidades longe de casa",
        description:
          "[{character1}] Cortar do mapa toda cidade a mais de duas horas de estrada e chamar o resto de turnê.",
        visibleIfCharacterHas: [["lazy"]],
        consequence: [
          {
            resultLabel: "Turnê de bairro",
            descriptionTemplate:
              'A banda faz cinco shows e dorme em casa todas as noites. {character1} chama isso de "gestão de energia", e ninguém tem energia para discordar.',
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Plateia repetida",
            descriptionTemplate:
              "Nas cinco cidades, a plateia é praticamente a mesma. No terceiro show, ela já pede música nova.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0329-a-maquina-de-fumaca",
    type: "decisao_criativa",
    title: "A máquina de fumaça",
    descriptionTemplate:
      "O iluminador recém-contratado chega com uma máquina de fumaça e um refletor que pisca, comprados com o próprio dinheiro. {character1} quer usar tudo no show de sábado; {character2} lembra que, no último ensaio com fumaça, ninguém achou a saída.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Usar a fumaça no show inteiro",
        description:
          "Duas horas de neblina e clarão para a casa lembrar da banda.",
        consequence: [
          {
            resultLabel: "Espetáculo",
            descriptionTemplate:
              "A casa vira uma nuvem colorida, e o público sai falando do show como de um sonho. Ninguém sabe dizer que músicas a banda tocou.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Neblina",
            descriptionTemplate:
              "A fumaça cobre o palco na segunda música. {character2} toca o resto do show de frente para a parede errada.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Usar só na abertura e no bis",
        description: "Mistério no começo e no fim, e banda à vista no meio.",
        consequence: {
          resultLabel: "Na medida",
          descriptionTemplate:
            "A fumaça sobe na entrada e no bis, e o resto do show tem banda à vista. O iluminador acha pouco e pede, por escrito, mais neblina na próxima.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 2,
        },
      },
      {
        label: "Devolver a máquina ao iluminador",
        description: "Luz é para iluminar. O espetáculo é a banda.",
        consequence: {
          resultLabel: "Palco limpo",
          descriptionTemplate:
            "O show acontece sob as luzes de sempre. O iluminador passa a noite de braços cruzados ao lado da máquina desligada.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Sincronizar a fumaça com o arranjo",
        description:
          "[{character1}] Marcar a fumaça e as luzes compasso por compasso na música mais lenta, sem ensaio prévio.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Obra completa",
            descriptionTemplate:
              "Fumaça, luz e música entram juntas no refrão, e a casa fica três segundos em silêncio antes de aplaudir. O iluminador chora atrás da mesa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Alarme",
            descriptionTemplate:
              "A fumaça dispara o alarme de incêndio no refrão. A banda termina a música na calçada, com o público e os bombeiros.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0330-viagens-sol-nascente",
    type: "decisao_criativa",
    title: "Viagens Sol Nascente",
    descriptionTemplate:
      'A banda não cabe mais na van. {character1} vai à garagem de uma empresa de excursões ver o ônibus disponível: quarenta lugares, cortina de franja, um banheiro que não abre e "Viagens Sol Nascente" pintado na lateral.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Fretar o ônibus",
        description:
          "Espaço para a banda, a equipe e os instrumentos, e uma lateral que fala por eles.",
        consequence: [
          {
            resultLabel: "Estrada de banda grande",
            descriptionTemplate:
              'A banda e a equipe viajam esticadas, e o equipamento chega inteiro. Nas cidades, o público espera o "Sol Nascente" na porta da casa.',
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Substituto",
            descriptionTemplate:
              "O ônibus quebra na segunda semana, e a empresa manda um micro-ônibus escolar, ainda com o horário das aulas colado no vidro.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Continuar com a van",
        description: "Apertada, mas paga e conhecida.",
        consequence: {
          resultLabel: "Van lotada",
          descriptionTemplate:
            "A van segue com a banda, a equipe e os instrumentos empilhados por tamanho. O iluminador viaja abraçado ao bumbo.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Fretar e alugar a lateral",
        description:
          "Pintar por cima o anúncio de uma borracharia da região, que paga parte do frete.",
        consequence: [
          {
            resultLabel: "Patrocínio",
            descriptionTemplate:
              'A borracharia paga metade do frete, e a banda chega a todas as cidades sob a frase "Pneu bom é pneu calibrado". O público canta a frase junto com o refrão.',
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Anúncio grátis",
            descriptionTemplate:
              "A borracharia aprova a pintura, mas não o pagamento. A banda passa a turnê anunciando de graça um pneu que nem usa.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Escolher o ônibus pela energia",
        description:
          "[{character1}] Sentar em todas as poltronas de todos os ônibus da garagem e ficar com o que tiver a vibração certa, não o banheiro funcionando.",
        visibleIfCharacterHas: [["spiritual"]],
        consequence: [
          {
            resultLabel: "Vibração boa",
            descriptionTemplate:
              "{character1} escolhe um ônibus velho e azul, com banheiro funcionando por acaso. A turnê passa sem um pneu furado, e {character1} não aceita outra explicação.",
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Vibração cara",
            descriptionTemplate:
              "{character1} sente a energia certa no ônibus mais caro da garagem. O frete leva o cachê do semestre, mas a poltrona sete, segundo {character1}, é um portal.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0331-a-banda-de-abertura",
    type: "decisao_criativa",
    title: "A banda de abertura",
    descriptionTemplate:
      "Agora é a banda que tem banda de abertura: um grupo de estudantes da cidade que, para agradar, fecha o próprio set com o maior sucesso da banda principal, mais rápido e mais afinado. A plateia pede bis da versão deles. {character1} acha um desrespeito; {character2} acha uma homenagem.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Proibir a música no set da abertura",
        description:
          "Cada banda toca o próprio repertório. Principalmente o próprio.",
        consequence: {
          resultLabel: "Repertório próprio",
          descriptionTemplate:
            "A banda de abertura troca o sucesso por uma música dela e toca para uma casa que conversa. {character2} passa o show inteiro balançando a cabeça, e não é no ritmo.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Deixar tocarem a música",
        description:
          "Homenagem é homenagem, mesmo quando sai melhor que o original.",
        consequence: [
          {
            resultLabel: "Aquecimento",
            descriptionTemplate:
              "A plateia recebe a banda principal cantando o sucesso. A banda só precisa continuar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Votação no bar",
            descriptionTemplate:
              "No bar, depois do show, a plateia discute qual versão é melhor. A banda principal perde por quatro votos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Chamar os estudantes para o bis",
        description: "Juntar as duas bandas no palco e dividir o refrão.",
        consequence: [
          {
            resultLabel: "Palco cheio",
            descriptionTemplate:
              "As duas bandas tocam juntas, e o palco nunca pareceu tão cheio. Os estudantes saem com o telefone da banda e a certeza de que um dia serão os principais.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Dois andamentos",
            descriptionTemplate:
              "A banda de abertura toca no andamento dela, e a principal no dela. O refrão termina em dois lugares diferentes.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Reescrever o arranjo para superar a abertura",
        description:
          "[{character1}] Refazer o arranjo do sucesso na passagem de som, mais rápido e mais difícil que o dos estudantes.",
        visibleIfCharacterHas: [["envious"]],
        consequence: [
          {
            resultLabel: "Revanche",
            descriptionTemplate:
              "A versão nova arranca a maior ovação da noite. {character1} vai ao camarim da banda de abertura agradecer, que é o jeito de garantir que ouviram.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Corrida",
            descriptionTemplate:
              "A versão nova sai tão rápida que a banda termina o sucesso trinta segundos antes da plateia. Os estudantes aplaudem da coxia, por educação.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0332-novecentos-ingressos",
    type: "decisao_criativa",
    title: "Novecentos ingressos",
    descriptionTemplate:
      "O produtor vendeu novecentos ingressos para uma casa de seiscentos lugares e conta isso no camarim, com orgulho. {character1} quer subir ao palco antes que alguém mude de ideia; {character2} conta as saídas de emergência e encontra uma.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar com a casa abarrotada",
        description: "Novecentas pessoas, seiscentos lugares e uma saída.",
        consequence: [
          {
            resultLabel: "Noite histórica",
            descriptionTemplate:
              "A casa ferve, o público canta mais alto que o som, e ninguém se machuca, por sorte. O produtor já fala em vender mil na próxima.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Bombeiros",
            descriptionTemplate:
              "Os bombeiros chegam na quinta música e esvaziam metade da casa. A banda termina o show com trezentas pessoas na calçada cantando o refrão com atraso.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Exigir que a casa feche a porta",
        description:
          "Entram seiscentos. Os outros trezentos, o produtor que explique.",
        consequence: [
          {
            resultLabel: "Porta fechada",
            descriptionTemplate:
              "O produtor fecha a porta e devolve trezentos ingressos, de cara amarrada. O show sai seguro, e a fila da calçada vai embora xingando a casa, não a banda.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Calçada revoltada",
            descriptionTemplate:
              "Os trezentos de fora batem na porta o show inteiro, fora do ritmo. O produtor desconta do cachê o vidro da bilheteria.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Fazer duas sessões na mesma noite",
        description: "Um show às nove, outro à meia-noite, pelo mesmo cachê.",
        consequence: [
          {
            resultLabel: "Sessão dupla",
            descriptionTemplate:
              "As duas sessões lotam na medida certa. A banda toca quatro horas e janta às três da manhã o salgado que sobrou do bar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Voz emprestada",
            descriptionTemplate:
              "Na sessão da meia-noite, a voz de {character1} acaba na quarta música. O público canta o resto, como quem já sabia a letra melhor.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Organizar a entrada pessoalmente",
        description:
          "[{character2}] Descer até a porta com a planta da casa e dividir o público entre a pista, o mezanino e a calçada com caixa de som.",
        visibleIfCharacterHas: [[], ["professional"]],
        consequence: [
          {
            resultLabel: "Ordem na porta",
            descriptionTemplate:
              "{character2} acomoda as novecentas pessoas sem empurrão e põe uma caixa de som na calçada para quem sobrou. O produtor tenta contratar {character2} para a noite seguinte.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Show atrasado",
            descriptionTemplate:
              "A organização funciona, mas leva uma hora e meia. A banda sobe ao palco às onze, depois de {character1} aquecer a voz três vezes.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0333-o-selo-ou-a-gravadora",
    type: "conflito_membros",
    title: "O selo ou a gravadora",
    descriptionTemplate:
      "Duas propostas chegam na mesma semana. O selo independente oferece um contrato de uma página, escrito à mão; a gravadora grande oferece um de sessenta, com uma caneta dourada de brinde. {character1} já testou a caneta, e {character2} ainda está lendo a página.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Assinar com a gravadora grande",
        description:
          "Distribuição em vários estados, adiantamento de verdade e um departamento jurídico inteiro do outro lado da mesa.",
        consequence: [
          {
            resultLabel: "Distribuição",
            descriptionTemplate:
              "O disco chega às lojas de três estados, e a gravadora manda flores para {character1}. {character2} recebe um cartão impresso com o nome errado.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Letra miúda",
            descriptionTemplate:
              "Na página quarenta e dois, a banda descobre que a gravadora decide a capa, o repertório e a data de lançamento. A caneta dourada para de escrever no mesmo dia.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Assinar com o selo independente",
        description:
          "Liberdade total e um orçamento que cabe no bolso do dono do selo, junto com as chaves do carro.",
        consequence: [
          {
            resultLabel: "Liberdade",
            descriptionTemplate:
              "O selo deixa a banda gravar o que quiser, como quiser. Só não consegue levar o disco além da divisa do estado, que é até onde vai o carro do dono.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Sem verba",
            descriptionTemplate:
              "O selo paga a gravação em três parcelas, a terceira em caixas de disco. {character1} passa a chamar o dono do selo de mecenas, num tom que ninguém acha carinhoso.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Usar uma proposta para subir a outra",
        description:
          "Levar o contrato de uma página até a gravadora e descobrir quanto ele vale numa mesa de sessenta.",
        consequence: [
          {
            resultLabel: "Leilão",
            descriptionTemplate:
              "A gravadora melhora a oferta e acrescenta uma cláusula de liberdade artística, em letra bem pequena. {character1} e {character2} assinam juntos, cada um convencido de que venceu.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Duas portas fechadas",
            descriptionTemplate:
              "A gravadora acha a manobra amadora e desiste. O selo fica sabendo e desiste também, por orgulho, que é o que selo independente tem de sobra.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Recusar as duas e lançar o disco por conta própria",
        description:
          "[{character2}] Gravar sem dono nenhum e vender o disco numa banca montada na porta de cada show.",
        visibleIfCharacterHas: [[], ["purist"]],
        consequence: [
          {
            resultLabel: "Banca vazia",
            descriptionTemplate:
              "{character2} vende os discos um a um na porta da casa, e a banca esvazia no terceiro show. A banda ganha menos do que ganharia com a gravadora e fala disso muito mais.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Caixas na sala",
            descriptionTemplate:
              "Sobram mil e duzentos discos, empilhados até o teto na sala de {character2}. Viram mesa de centro, aparador e assunto proibido.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0334-o-primo-da-agenda",
    type: "conflito_membros",
    title: "O primo da agenda",
    descriptionTemplate:
      "Desde o primeiro show, quem marca as datas da banda é o primo de {character1}, com um caderno de capa dura e o telefone da padaria. Agora um empresário profissional, com escritório e secretária, quer o trabalho, desde que o primo saia. {character2} já serviu café ao empresário.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Contratar o empresário profissional",
        description:
          "Escritório, contatos na capital e vinte por cento de tudo, inclusive do que o primo conseguia de graça.",
        consequence: [
          {
            resultLabel: "Agenda cheia",
            descriptionTemplate:
              "O empresário fecha doze datas em um mês, todas com camarim. {character1} comemora em silêncio, porque o primo está sentado na mesma mesa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Vinte por cento",
            descriptionTemplate:
              "As casas são melhores, mas a comissão come o que sobrava. No fim do semestre a banda ganha o mesmo que antes, agora com recibo.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Manter o primo",
        description:
          "Ninguém conhece a banda melhor do que ele, nem o caderno de capa dura.",
        consequence: {
          resultLabel: "Caderno fiel",
          descriptionTemplate:
            "O primo segue marcando as mesmas casas de sempre, com o mesmo entusiasmo e o mesmo telefone da padaria. {character2} guarda o cartão do empresário na carteira, num lugar onde todo mundo consegue ver.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pôr o primo de assistente do empresário",
        description:
          "Juntar os dois no mesmo escritório e torcer para o caderno caber na mesa nova.",
        consequence: [
          {
            resultLabel: "Dupla improvável",
            descriptionTemplate:
              "O primo aprende a usar a agenda do escritório, e o empresário aprende quais casas não pagam. Os dois passam a almoçar juntos, para surpresa geral.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Guerra fria",
            descriptionTemplate:
              "Em duas semanas, os dois marcam a banda para o mesmo sábado, em cidades diferentes. A banda vai a uma, e a outra cidade vai ao jornal.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Defender o primo na frente do empresário",
        description:
          "[{character1}] Dizer ao empresário, com o café ainda quente, que a banda não troca família por escritório.",
        visibleIfCharacterHas: [["loyal"]],
        consequence: [
          {
            resultLabel: "Respeito",
            descriptionTemplate:
              "O empresário se impressiona e oferece representar a banda com o primo junto, por quinze por cento. O primo chora em cima do caderno.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Porta fechada",
            descriptionTemplate:
              "O empresário deixa o café pela metade e vai embora. {character2} passa a semana recitando as casas que ele tinha na agenda, uma por ensaio.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0335-uma-palavra-metade-da-musica",
    type: "conflito_membros",
    title: "Uma palavra, metade da música",
    descriptionTemplate:
      'A editora manda o formulário de registro do maior sucesso da banda, com um campo para a porcentagem de cada autor. {character1} fez a melodia e quase toda a letra. {character2} trocou "amor" por "ardor" no segundo verso e escreveu cinquenta por cento no campo, a caneta.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Registrar a música só no nome de {character1}",
        description:
          "Quem escreveu, assina. A palavra trocada entra na conta da gentileza.",
        consequence: {
          resultLabel: "Assinatura única",
          descriptionTemplate:
            '{character1} assina {character1:sozinho|sozinha|sem mais ninguém}. Desde então, {character2} canta o segundo verso com "amor", bem alto, em todo show.',
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Aceitar os cinquenta por cento",
        description:
          "Pagar metade da música por uma palavra e comprar a paz, que nunca sai barata.",
        consequence: [
          {
            resultLabel: "Paz cara",
            descriptionTemplate:
              "{character2} assina feliz e passa a sugerir palavras para todas as músicas novas, uma por verso.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -2,
            chance: 60,
          },
          {
            resultLabel: "Precedente",
            descriptionTemplate:
              "Na semana seguinte, o técnico de som pede vinte por cento por ter contado até quatro no começo da gravação. A banda inteira faz as contas.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Deixar o advogado da editora decidir",
        description:
          "Pôr um especialista para dizer quanto vale uma palavra, por uma taxa que vale várias.",
        consequence: [
          {
            resultLabel: "Dez por cento",
            descriptionTemplate:
              'O advogado decide que "ardor" vale dez por cento e cobra o equivalente a quinze. Os dois saem da sala igualmente insatisfeitos, que é como o advogado sabe que acertou.',
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Metade da metade",
            descriptionTemplate:
              "O advogado dá vinte e cinco por cento a {character2} e um sermão a {character1} sobre registrar as coisas antes que fiquem famosas.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Propor uma música nova assinada pelos dois",
        description:
          "[{character1}] Registrar o sucesso sem dividir e escrever com {character2} a próxima música, do primeiro ao último verso, meio a meio.",
        visibleIfCharacterHas: [["conciliator"]],
        consequence: [
          {
            resultLabel: "Parceria",
            descriptionTemplate:
              "Os dois escrevem a música nova em três tardes e brigam por cada palavra, agora em pé de igualdade. É a melhor briga que a banda já teve.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Ninguém assina",
            descriptionTemplate:
              "A música nova sai tão ruim que nenhum dos dois quer o nome nela. É o primeiro acordo da dupla em meses.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0336-o-nome-em-letra-maior",
    type: "conflito_membros",
    title: "O nome em letra maior",
    descriptionTemplate:
      "No cartaz do próximo show, o nome de {character1} aparece logo abaixo do nome da banda, numa letra quase do mesmo tamanho. {character1} pagou a gráfica do próprio bolso, e {character2} só descobriu quando viu o cartaz colado no poste da esquina.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mandar refazer os cartazes",
        description:
          "Imprimir tudo de novo, só com o nome da banda, e pagar a gráfica pela segunda vez.",
        consequence: {
          resultLabel: "Cartaz novo",
          descriptionTemplate:
            "Os cartazes novos ficam prontos na véspera do show. {character1} cola os dois últimos pessoalmente, de cabeça baixa e com cola demais.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Deixar o cartaz como está",
        description: "Nome grande não toca nada, e a gráfica já foi paga.",
        consequence: [
          {
            resultLabel: "Banda de apoio",
            descriptionTemplate:
              "Metade da plateia acha que a banda virou o grupo de apoio de {character1}. {character1} não corrige ninguém.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
          {
            resultLabel: "Ninguém repara",
            descriptionTemplate:
              "Ninguém repara no nome, a não ser quem pagou por ele, que repara em todos os postes da cidade.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
        ],
      },
      {
        label: "Pôr o nome de todos no cartaz",
        description:
          "Se é para ter nome, que tenha o de todo mundo, em ordem alfabética e no mesmo tamanho.",
        consequence: [
          {
            resultLabel: "Lista de chamada",
            descriptionTemplate:
              "O cartaz novo parece lista de chamada, mas ninguém reclama. {character1} só pergunta, uma vez, se a ordem alfabética não podia ser pelo sobrenome.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Cartaz lotado",
            descriptionTemplate:
              "Com todos os nomes, a data e o endereço, o cartaz fica tão cheio que o público não acha o horário. A casa enche pela metade.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Imprimir o próprio nome ainda maior",
        description:
          "[{character2}] Mandar fazer um cartaz com o nome de {character2} um tamanho acima e colar por cima do outro, poste a poste.",
        visibleIfCharacterHas: [[], ["envious"]],
        consequence: [
          {
            resultLabel: "Trégua",
            descriptionTemplate:
              "Na terceira rodada de cartazes, os dois descobrem quanto custa uma gráfica e assinam juntos um pedido novo: o nome da banda, sozinho, em letra enorme.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 40,
          },
          {
            resultLabel: "Guerra dos postes",
            descriptionTemplate:
              "A cidade amanhece com três camadas de cartaz em cada poste. A prefeitura multa a banda, e a multa vem só com o nome da banda, bem grande.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0337-o-primeiro-dinheiro-de-verdade",
    type: "conflito_membros",
    title: "O primeiro dinheiro de verdade",
    descriptionTemplate:
      "A editora paga o primeiro semestre de direitos da banda, e pela primeira vez o valor tem mais de três dígitos antes da vírgula. {character1} quer gastar tudo num equipamento de som decente. {character2} já prometeu a própria parte ao dono do apartamento.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Investir tudo no equipamento",
        description:
          "Mesa de som nova, caixas que não chiam e nenhum dinheiro no bolso de ninguém.",
        consequence: {
          resultLabel: "Som novo",
          descriptionTemplate:
            "A banda passa a soar como banda grande. {character2} paga o aluguel com atraso e olha demoradamente para as caixas novas, que custaram exatamente três aluguéis.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Dividir tudo entre os integrantes",
        description:
          "Cada um pega a sua parte e decide por conta própria como desperdiçar.",
        consequence: [
          {
            resultLabel: "Contas pagas",
            descriptionTemplate:
              "O aluguel é pago, e a mesa de som velha continua chiando no mesmo canal de sempre. {character1} aponta o chiado em todo ensaio, com o dedo.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Evaporou",
            descriptionTemplate:
              "Em duas semanas ninguém sabe onde foi parar o dinheiro, mas metade da banda aparece de jaqueta nova. O som continua chiando.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Dividir meio a meio",
        description:
          "Metade para o equipamento, metade para as pessoas, e ninguém satisfeito com nenhuma das metades.",
        consequence: {
          resultLabel: "Meio-termo",
          descriptionTemplate:
            "A banda compra as caixas novas, sem a mesa para ligá-las. Cada integrante recebe o suficiente para meio aluguel.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Contratar um contador para a banda",
        description:
          "[{character1}] Entregar o dinheiro a um contador, abrir uma conta da banda e pagar cada um com recibo.",
        visibleIfCharacterHas: [["professional"]],
        consequence: [
          {
            resultLabel: "Organização",
            descriptionTemplate:
              "O contador separa os impostos, adianta o aluguel de {character2} e compra o equipamento em seis parcelas. Fica com a parte dele, a única que nunca atrasa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Impostos",
            descriptionTemplate:
              "O contador descobre que a banda deve impostos de três anos de cachê em dinheiro vivo. O primeiro dinheiro de verdade vai inteiro para o governo, que nem foi ao show.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0338-o-musico-de-estudio",
    type: "conflito_membros",
    title: "O músico de estúdio",
    descriptionTemplate:
      "O produtor que a gravadora contratou ouve a base do disco e decide regravar a parte de {character2} com um músico de estúdio, um senhor de colete que acerta tudo na primeira vez. {character1} acha a ideia excelente e disse isso em voz alta.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o músico de estúdio",
        description:
          "Disco certo, prazo cumprido e {character2} na foto da capa, segurando o que não gravou.",
        consequence: [
          {
            resultLabel: "Disco limpo",
            descriptionTemplate:
              "O senhor de colete grava tudo em duas horas, cobra por quatro e vai embora sem tirar o colete. {character2} aprende a própria parte ouvindo o disco.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 60,
          },
          {
            resultLabel: "Correto",
            descriptionTemplate:
              'O disco sai perfeito e sem graça, e a crítica chama a música de "correta". {character2} recorta a crítica e cola na parede do ensaio, na altura dos olhos de {character1}.',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Manter a gravação original",
        description:
          "Bancar a parte de {character2} contra o produtor, que cobra por dia e não esquece desaforo.",
        consequence: [
          {
            resultLabel: "Humano",
            descriptionTemplate:
              'O produtor desiste resmungando, e a gravação original fica, com os tropeços. Um crítico escreve que a banda soa "humana", e {character1} prefere não comentar.',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Volume baixo",
            descriptionTemplate:
              "O produtor mixa a parte de {character2} tão baixa que é preciso encostar o ouvido na caixa para escutar. {character1} encosta e acha que ficou bom.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Pagar uma aula com o músico de estúdio",
        description:
          "Contratar uma tarde do senhor de colete para mostrar a {character2} como ele tocaria. Humildade cobra por hora.",
        consequence: [
          {
            resultLabel: "Aula particular",
            descriptionTemplate:
              "O senhor de colete ensina dois truques, toma três cafés e vai embora. {character2} grava a parte de novo, melhor, e jura que foi coincidência.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Aula pública",
            descriptionTemplate:
              "A aula acontece na frente da banda inteira e do técnico de som, que toma notas. {character2} passa a semana sem falar com ninguém de colete.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Regravar a parte durante a madrugada",
        description:
          "[{character2}] Pedir uma noite no estúdio, sem testemunhas, e tentar quantas vezes for preciso.",
        visibleIfCharacterHas: [[], ["perfectionist"]],
        consequence: [
          {
            resultLabel: "Tentativa 47",
            descriptionTemplate:
              "Na quadragésima sétima tentativa, às seis da manhã, {character2} grava a parte melhor que o senhor de colete. O produtor ouve, concorda com a cabeça e cobra a noite de estúdio.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Amanheceu",
            descriptionTemplate:
              "Às seis da manhã, {character2} está na sexagésima tentativa e ainda acha que dá para melhorar. O produtor chega, ouve e telefona para o senhor de colete.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0339-o-cache-por-semana",
    type: "conflito_membros",
    title: "O cachê por semana",
    descriptionTemplate:
      "Uma cantora famosa de rádio convida {character1} para tocar no disco novo dela e nos programas de televisão que vêm depois. Paga por semana, coisa que a banda nunca fez, e os ensaios dela caem nas mesmas tardes dos ensaios da banda. {character2} soube porque a cantora ligou para o telefone do ensaio.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o convite",
        description:
          "Dinheiro certo, vitrine em rede nacional e os ensaios da banda espremidos nas noites de domingo.",
        consequence: [
          {
            resultLabel: "Vitrine",
            descriptionTemplate:
              "{character1} aparece na televisão atrás da cantora, de terno emprestado. A banda ganha assunto e perde os ensaios de terça.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Ausência",
            descriptionTemplate:
              "A banda ensaia três semanas sem {character1}, e o som melhora um pouco. Ninguém tem coragem de dizer isso, a não ser {character2}, que diz duas vezes.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar o convite",
        description:
          "Ficar na banda e no aperto. Lealdade não paga o aluguel, mas rende uma boa história.",
        consequence: {
          resultLabel: "Recusado",
          descriptionTemplate:
            "{character1} recusa e passa a ouvir a cantora no rádio da cozinha com uma atenção que ninguém pediu. A cada nota errada, {character1} comenta.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Aceitar só a gravação do disco",
        description:
          "Gravar as faixas, receber e voltar aos ensaios antes que alguém sinta falta, inclusive a cantora.",
        consequence: [
          {
            resultLabel: "Bico limpo",
            descriptionTemplate:
              "{character1} grava em quatro tardes e paga um almoço para a banda com o cachê. É o primeiro almoço em que ninguém divide a conta.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Cantora insistente",
            descriptionTemplate:
              "A cantora gosta tanto que liga para o telefone do ensaio toda semana com um convite novo. {character2} passa a atender dizendo que é engano.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
      {
        label: "Fazer as duas coisas",
        description:
          "[{character1}] Tocar com a cantora de dia, ensaiar com a banda à noite e dormir no intervalo, se houver intervalo.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Duas agendas",
            descriptionTemplate:
              "{character1} cumpre as duas agendas o semestre inteiro e ainda compõe duas músicas no banco de trás do táxi. A banda fica com medo de pedir mais alguma coisa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Pane",
            descriptionTemplate:
              "Na quarta semana, {character1} dorme em cima do instrumento no meio do programa, ao vivo. A cantora troca de músico, e a banda recebe {character1} de volta, com olheiras.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0340-o-piano-do-adiantamento",
    type: "conflito_membros",
    title: "O piano do adiantamento",
    descriptionTemplate:
      "A gravadora deposita o adiantamento do disco, e {character1} chega ao ensaio com um piano de cauda alugado para as gravações, pago com um terço do dinheiro. {character2} lembra que adiantamento se devolve com as vendas, e que a banda nunca vendeu um terço de nada.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Devolver o piano à loja",
        description:
          "Desfazer o aluguel e engolir a multa, que a loja calculou com carinho.",
        consequence: {
          resultLabel: "Multa",
          descriptionTemplate:
            "A loja leva o piano de volta e fica com o sinal. {character1} passa a semana tocando as partes de piano num teclado de brinquedo, com cara de velório.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Ficar com o piano e gravar com ele",
        description:
          "Se já foi pago, que ao menos apareça no disco, em todas as faixas.",
        consequence: [
          {
            resultLabel: "Som de disco caro",
            descriptionTemplate:
              "O piano dá ao disco um som de gente importante, e o produtor elogia pela primeira vez. {character2} calcula quantos discos vão pagar o elogio.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Dívida",
            descriptionTemplate:
              "O disco sai bonito e vende o esperado. No fim do semestre, a gravadora manda a conta: a banda deve um piano, mais juros.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Descontar o piano da parte de {character1}",
        description:
          "Quem alugou, paga. O resto do adiantamento fica com a banda.",
        consequence: [
          {
            resultLabel: "Vale assinado",
            descriptionTemplate:
              "{character1} assina um vale e passa o semestre sem receber nada. O piano fica, e só {character1} tem a chave da tampa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "{character1:Ofendido|Ofendida|Ofensa}",
            descriptionTemplate:
              "{character1} paga e desconta a mágoa em cada ensaio, com acordes de piano no volume máximo. A banda descobre que piano de cauda também irrita o vizinho.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Convencer a banda de que o piano foi exigência da gravadora",
        description:
          "[{character1}] Mostrar um bilhete em papel timbrado, de procedência discutível, em que a gravadora exige o piano.",
        visibleIfCharacterHas: [["manipulator"]],
        consequence: [
          {
            resultLabel: "Colou",
            descriptionTemplate:
              "A banda acredita e passa a reclamar da gravadora em vez de {character1}. {character1} reclama junto, com mais vigor que todos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Descoberto",
            descriptionTemplate:
              "{character2} liga para a gravadora para reclamar do piano. A gravadora não sabe de piano nenhum, e agora a banda também sabe do bilhete.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0341-a-festa-da-radio",
    type: "oportunidade_externa",
    title: "A festa da rádio",
    descriptionTemplate:
      'A maior rádio do estado faz vinte anos e convida a banda para tocar na festa, de graça. Em troca, o programador promete tocar a música nova "com carinho", sem dizer em que horário. {character1} já aceitou de cabeça, e {character2} pergunta quem paga a gasolina até a capital.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar de graça na festa",
        description:
          "Um palco no estacionamento da rádio, três mil pessoas e nenhum cachê.",
        consequence: [
          {
            resultLabel: "Hora nobre",
            descriptionTemplate:
              "A música nova passa a tocar todo dia às sete da manhã, entre a previsão do tempo e o trânsito. Meio estado acorda com a banda, e parte reclama.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Madrugada",
            descriptionTemplate:
              "O programador cumpre a promessa: a música toca toda noite, às três e quinze da manhã. Os vigias noturnos do estado viram fãs fiéis.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Cobrar cachê da rádio",
        description:
          "Lembrar ao programador que festa com banda tem preço, mesmo quando a banda é o presente.",
        consequence: [
          {
            resultLabel: "Cachê simbólico",
            descriptionTemplate:
              "A rádio paga, de má vontade, um cachê simbólico e um lanche menos simbólico. A música toca de vez em quando, sem carinho nenhum.",
            happinessChangePercent: 2,
            chance: 40,
          },
          {
            resultLabel: "Trocados",
            descriptionTemplate:
              "O programador troca a banda por um grupo que aceitou tocar de graça e de camiseta da rádio. A música nova some da programação no mesmo dia.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Recusar o convite",
        description:
          "Guardar a gasolina e a dignidade para um show que pague as duas.",
        consequence: {
          resultLabel: "Fora do ar",
          descriptionTemplate:
            'A banda passa o fim de semana em casa. A festa é transmitida ao vivo, e o locutor agradece às bandas que "não faltaram", com ênfase.',
          happinessChangePercent: -2,
        },
      },
      {
        label: "Passar a festa inteira nos bastidores da rádio",
        description:
          "[{character1}] Chegar cedo, cumprimentar o porteiro, os locutores e a moça do café, e só ir embora com todos os nomes anotados.",
        visibleIfCharacterHas: [["friendly"]],
        consequence: [
          {
            resultLabel: "Amigos no ar",
            descriptionTemplate:
              "Na semana seguinte, três locutores tocam a música nova sem ninguém pedir, e a moça do café manda lembranças no ar. {character1} ganha um crachá permanente.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Abraço demais",
            descriptionTemplate:
              "{character1} abraça o diretor da rádio no meio de uma reunião com anunciantes. O diretor sorri, ajeita o paletó e manda tirar a música da programação até segunda ordem.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0342-o-caderno-de-domingo",
    type: "oportunidade_externa",
    title: "O caderno de domingo",
    descriptionTemplate:
      'O maior jornal da capital quer {character1} na capa do caderno de cultura de domingo. O repórter avisa que só publica se sair "uma frase forte" e trouxe três prontas, por via das dúvidas.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Dar a entrevista e falar o que pensa",
        description:
          "[{character1}] Responder com sinceridade e torcer para a sinceridade render manchete.",
        consequence: [
          {
            resultLabel: "Capa",
            descriptionTemplate:
              "A entrevista sai inteira, com uma foto de {character1} olhando para longe. O título é uma frase que {character1} não lembra de ter dito, mas que ficou boa.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Página doze",
            descriptionTemplate:
              "O repórter acha as respostas mornas, e a entrevista vai para a página doze, ao lado das palavras cruzadas. As palavras cruzadas, pelo menos, todo mundo lê.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Usar uma das frases prontas do repórter",
        description:
          "[{character1}] Escolher a menos ofensiva das três e assinar embaixo.",
        consequence: [
          {
            resultLabel: "Manchete",
            descriptionTemplate:
              "A frase sai em letras enormes, e o jornal vende bem no domingo. Na segunda, três bandas da região escrevem cartas ao jornal, que publica as três, encantado.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Resposta",
            descriptionTemplate:
              "A frase ofende uma banda veterana, que responde na edição seguinte com uma foto antiga de {character1} na plateia de um show dela, pedindo autógrafo.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar a entrevista",
        description:
          "[{character1}] Dispensar a capa de domingo e o repórter, com frases e tudo.",
        consequence: {
          resultLabel: "Não quis falar",
          descriptionTemplate:
            'O jornal publica uma nota curta dizendo que {character1} "não quis falar". Na cidade, isso soa como algo muito sério, e ninguém sabe o quê.',
          happinessChangePercent: 0,
        },
      },
      {
        label: "Responder tudo com uma palavra só",
        description:
          "[{character1}] Enfrentar o repórter com monossílabos, porque é o que sai.",
        visibleIfCharacterHas: [["shy"]],
        consequence: [
          {
            resultLabel: "Enigma",
            descriptionTemplate:
              'O repórter interpreta o silêncio como profundidade e escreve três páginas sobre o "enigma" de {character1}, que lê a matéria e descobre muita coisa sobre si.',
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Monossílabos",
            descriptionTemplate:
              'O repórter publica as respostas como foram dadas: "Sim.", "Não.", "Talvez.". O caderno de cultura ganha meia página em branco.',
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0343-o-refrao-da-funeraria",
    type: "oportunidade_externa",
    title: "O refrão da funerária",
    descriptionTemplate:
      'A maior funerária da região quer comprar o refrão do maior sucesso da banda para o comercial de rádio, com a letra trocada. Onde {character1} cantava "vou te levar comigo", a funerária quer "nós levamos com carinho". Paga o equivalente a dez shows.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Vender o refrão",
        description:
          "[{character1}] Pegar o dinheiro de dez shows e nunca mais cantar o refrão sem pensar em caixão.",
        consequence: [
          {
            resultLabel: "Aluguel pago",
            descriptionTemplate:
              "O comercial toca em todos os intervalos da rádio, e o dinheiro paga dois meses de aluguel. No show seguinte, a plateia canta a versão da funerária, inteira.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Música da funerária",
            descriptionTemplate:
              'O comercial pega tanto que o sucesso da banda passa a ser conhecido como "a música da funerária". {character1} canta o refrão de olhos fechados, e não é emoção.',
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a proposta",
        description:
          "[{character1}] O sucesso da banda não vai embalar velório.",
        consequence: {
          resultLabel: "Refrão intacto",
          descriptionTemplate:
            "A funerária encomenda um jingle original, que gruda menos. {character1} fica com a música intacta e com a lembrança de dez shows que não aconteceram.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pedir o dobro",
        description:
          "[{character1}] Se é para enterrar a música, que o enterro seja de primeira classe.",
        consequence: [
          {
            resultLabel: "Dobro aceito",
            descriptionTemplate:
              "A funerária paga o dobro sem pestanejar, o que diz muito sobre o ramo. {character1} compra um amplificador novo e não comenta de onde veio.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Concorrência",
            descriptionTemplate:
              "A funerária fecha com a banda rival, que cobra metade e ainda oferece uma música sobre flores. {character1} ouve o comercial todo dia, no rádio do táxi.",
            happinessChangePercent: -4,
            chance: 60,
          },
        ],
      },
      {
        label: "Compor um jingle novo para a funerária",
        description:
          "[{character1}] Salvar o refrão e oferecer uma obra inédita, em compasso de valsa, sobre o descanso eterno.",
        visibleIfCharacterHas: [["creative"]],
        consequence: [
          {
            resultLabel: "Valsa",
            descriptionTemplate:
              "A funerária adora a valsa e paga o mesmo valor. O jingle ganha um prêmio de publicidade da região, que {character1} guarda no fundo do armário.",
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Nove minutos",
            descriptionTemplate:
              "{character1} entrega uma peça de nove minutos, com coro e sinos. A funerária agradece, recusa e compra o jingle de um sobrinho do dono.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0344-a-regravacao-com-orquestra",
    type: "oportunidade_externa",
    title: "A regravação com orquestra",
    descriptionTemplate:
      'Uma cantora veterana, dessas que a rádio toca há trinta anos, quer regravar uma música antiga de {character1}, do tempo em que a banda tocava em bar. Ela quer trocar o arranjo por uma orquestra de cordas e a palavra "cerveja" por "saudade".',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Autorizar a regravação como ela quer",
        description:
          "[{character1}] Deixar a cantora mudar o que quiser e receber os direitos de autor, que são a parte que não muda.",
        consequence: [
          {
            resultLabel: "Direitos em dia",
            descriptionTemplate:
              "A regravação toca em todas as rádios românticas do estado. {character1} recebe os direitos todo semestre e não reconhece a própria música.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "A música dela",
            descriptionTemplate:
              'A versão nova pega tanto que, nos shows, a plateia pede a música "da cantora". {character1} toca, avisa que escreveu a música, e ninguém acredita.',
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Autorizar só com a letra original",
        description: "[{character1}] A orquestra pode vir. A cerveja fica.",
        consequence: [
          {
            resultLabel: "Cerveja com cordas",
            descriptionTemplate:
              "A cantora aceita a cerveja, a contragosto, e grava com a orquestra. O resultado é estranho e toca muito em bar.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Outro compositor",
            descriptionTemplate:
              "A cantora desiste e regrava a música de outro compositor, que aceitou trocar até o título. A rádio toca a regravação dele o semestre inteiro.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a regravação",
        description:
          "[{character1}] A música é da banda, e quem canta é a banda.",
        consequence: {
          resultLabel: "Intacta",
          descriptionTemplate:
            'A música antiga fica como estava, tocada só pela banda. A cantora comenta numa entrevista que "tentou ajudar".',
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pedir para cantar junto na regravação",
        description:
          "[{character1}] Aceitar tudo, desde que a cantora divida o microfone e o nome na capa.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Dueto",
            descriptionTemplate:
              "A cantora aceita, e {character1} aparece na capa, em letra menor, mas aparece. {character1} compra vinte exemplares e dá um para cada parente.",
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Coro",
            descriptionTemplate:
              "A cantora aceita {character1} no coro, numa faixa com doze vozes. No encarte, o nome sai entre o dos violinistas e o do afinador de piano.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0345-o-envelope-do-programador",
    type: "oportunidade_externa",
    title: "O envelope do programador",
    descriptionTemplate:
      "O programador de uma rádio de alcance estadual chama {character1} e {character2} para um café e explica, com toda a calma, que a música nova tem chance. A chance custa um envelope por mês, com desconto à vista.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar o envelope",
        description:
          "Entrar na programação pela porta dos fundos, que é por onde entra quase todo mundo.",
        consequence: [
          {
            resultLabel: "Na programação",
            descriptionTemplate:
              "A música entra na programação três vezes por dia, e o envelope some todo dia primeiro. A banda passa a conhecer a rádio por dentro e se arrepende.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Programador demitido",
            descriptionTemplate:
              "O programador recebe o envelope e é demitido na semana seguinte, por excesso de envelopes. O substituto também tem uma tabela.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar o acordo",
        description:
          "Confiar que música boa toca sozinha, uma teoria que nenhum programador confirmou.",
        consequence: {
          resultLabel: "Fora da rádio",
          descriptionTemplate:
            "O programador agradece o café e passa a tocar a banda concorrente, que pagou. {character1} e {character2} começam a ouvir a rádio juntos, só para odiar.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Pechinchar o envelope",
        description:
          "Negociar o preço da chance como quem negocia tomate na feira.",
        consequence: [
          {
            resultLabel: "Meio horário",
            descriptionTemplate:
              "O programador aceita metade do valor e toca a música em metade dos horários: os da madrugada.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Tabela é tabela",
            descriptionTemplate:
              "O programador se ofende com a proposta e avisa que tabela é tabela. A banda sai sem acordo e com a conta do café.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Denunciar o programador ao vivo",
        description:
          "[{character2}] Ir à rádio no horário de um programa ao vivo e contar a história do envelope ao microfone.",
        visibleIfCharacterHas: [[], ["hothead"]],
        consequence: [
          {
            resultLabel: "Escândalo",
            descriptionTemplate:
              "O jornal da capital publica a história, e a banda ganha fama de honesta, que não toca no rádio mas enche casa. O programador é transferido para uma rádio do interior.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Lista negra",
            descriptionTemplate:
              "Nenhum jornal publica nada, e a banda some de todas as rádios do grupo. {character1} pede, com educação, que {character2} nunca mais entre numa rádio sem acompanhante.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0346-a-oferta-da-editora",
    type: "oportunidade_externa",
    title: "A oferta da editora",
    descriptionTemplate:
      'Uma editora de músicas oferece a {character1} um valor fechado, pago numa tarde, por metade dos direitos de tudo o que {character1} já compôs. O contrato vale "para sempre", e o advogado da editora diz isso sorrindo.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Vender metade dos direitos",
        description:
          "[{character1}] Trocar o futuro por dinheiro na mão, que pelo menos é dinheiro.",
        consequence: [
          {
            resultLabel: "Bolso cheio",
            descriptionTemplate:
              "{character1} compra um instrumento novo e paga as dívidas da banda. Nos semestres seguintes, assina os recibos de direitos com metade da alegria.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Para sempre",
            descriptionTemplate:
              "Seis meses depois, uma das músicas estoura no rádio. {character1} acompanha o sucesso pelo extrato da editora, que manda lembranças.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a oferta",
        description:
          "[{character1}] Ficar com os direitos e com a conta no vermelho.",
        consequence: {
          resultLabel: "Direitos guardados",
          descriptionTemplate:
            "{character1} sai da reunião com todos os direitos e sem o dinheiro do táxi. Volta para casa a pé, compondo.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Vender só as músicas antigas",
        description:
          "[{character1}] Entregar as músicas que ninguém toca e guardar as que ainda podem dar dinheiro.",
        consequence: [
          {
            resultLabel: "Sapato velho",
            descriptionTemplate:
              "A editora paga um terço do valor pelas músicas antigas e as esquece numa gaveta. {character1} fica com o dinheiro e com a sensação de ter vendido sapato velho.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Margarina",
            descriptionTemplate:
              "Uma das músicas antigas vira tema de um comercial de margarina e toca no país inteiro. A editora manda um cartão de agradecimento.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Negociar porcentagem em vez de valor fechado",
        description:
          "[{character1}] Recusar o pagamento único e brigar por cada ponto percentual, de calculadora na mão.",
        visibleIfCharacterHas: [["greedy"]],
        consequence: [
          {
            resultLabel: "Negociação dura",
            descriptionTemplate:
              "Depois de quatro reuniões e onze contrapropostas, a editora aceita pagar adiantamento mais porcentagem. O advogado da editora para de sorrir.",
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Oferta retirada",
            descriptionTemplate:
              "Na sexta contraproposta, a editora encerra a conversa e retira a oferta. {character1} guarda a calculadora na gaveta, ainda ligada.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0347-a-pasta-do-conceito",
    type: "decisao_criativa",
    title: "A pasta do conceito",
    descriptionTemplate:
      'O departamento de marketing da gravadora manda uma pasta com o "novo conceito" da banda: todo mundo de branco, fotos num deserto de papelão e uma frase de efeito para cada integrante. A frase de {character1} é "a alma da banda". A de {character2} é "também está na banda".',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o conceito inteiro",
        description:
          "Vestir o branco, posar no deserto de papelão e repetir a frase de efeito em toda entrevista.",
        consequence: [
          {
            resultLabel: "Vende",
            descriptionTemplate:
              "As fotos saem em todas as revistas da região, e a gravadora fica feliz. {character2} passa as entrevistas repetindo que também está na banda, como manda a pasta.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Casamento",
            descriptionTemplate:
              'A banda sobe de branco ao palco no primeiro show, e a plateia pergunta quem vai casar. A gravadora explica que o conceito é "de longo prazo".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a pasta inteira",
        description:
          "Devolver a pasta à gravadora com um bilhete educado e o risco de nunca mais ver o departamento de marketing.",
        consequence: [
          {
            resultLabel: "Respeito",
            descriptionTemplate:
              "A gravadora aceita a recusa e libera a banda para posar como quiser. A banda posa como sempre: encostada num muro.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Verba cortada",
            descriptionTemplate:
              "A gravadora aceita a recusa e corta a verba de divulgação do semestre, por coincidência.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Aceitar só as roupas brancas",
        description:
          "Vestir o figurino e cortar as frases de efeito, que ninguém conseguiria dizer sem rir.",
        consequence: {
          resultLabel: "Meio conceito",
          descriptionTemplate:
            "A banda posa de branco e sem frases. O fotógrafo diz que parece anúncio de sabão em pó, e a gravadora gosta tanto que manda fazer camisetas.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Reescrever o conceito do zero",
        description:
          "[{character1}] Devolver a pasta com trinta páginas de ideias próprias, uma delas com um cavalo.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Cavalo contratado",
            descriptionTemplate:
              "A gravadora adora metade das ideias e contrata o cavalo. A sessão de fotos vira assunto em todo jornal da região, e {character2} sai na foto ao lado do cavalo, em pé de igualdade.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Vinte e oito páginas",
            descriptionTemplate:
              "O marketing lê duas páginas e devolve as outras vinte e oito sem comentário. A banda posa no deserto de papelão, com {character1} de cara amarrada.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0348-a-musica-de-trabalho",
    type: "decisao_criativa",
    title: "A música de trabalho",
    descriptionTemplate:
      "A gravadora escolhe a música de trabalho do disco novo, a que vai para as rádios. É a faixa sete, que {character1} escreveu em dez minutos esperando o ônibus. {character2} passou um ano lapidando a faixa um.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar a escolha da gravadora",
        description:
          "Quem paga a divulgação escolhe a música, e quem escreveu em dez minutos vira compositor de sucesso.",
        consequence: [
          {
            resultLabel: "Dez minutos",
            descriptionTemplate:
              'A faixa sete toca no estado inteiro. {character1} dá entrevistas sobre o "processo criativo", que durou o tempo de um ônibus atrasado.',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Não pegou",
            descriptionTemplate:
              "A faixa sete não pega, e a gravadora culpa a banda. {character2} não diz nada, mas toca a faixa um em todos os ensaios, duas vezes.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Brigar pela faixa um",
        description:
          "Ir à gravadora defender um ano de trabalho contra dez minutos de ponto de ônibus.",
        consequence: [
          {
            resultLabel: "Faixa um",
            descriptionTemplate:
              "A gravadora cede, de má vontade, e a faixa um vai para as rádios. Pega devagar, mas pega, e {character2} conta a história em toda entrevista.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Verba pela metade",
            descriptionTemplate:
              "A gravadora cede e corta a verba de divulgação pela metade, por precaução. A faixa um toca duas vezes por semana numa rádio de cidade pequena.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 60,
          },
        ],
      },
      {
        label: "Pedir duas músicas de trabalho",
        description:
          "Lançar a faixa sete e a faixa um ao mesmo tempo e deixar as rádios resolverem a briga.",
        consequence: [
          {
            resultLabel: "Placar",
            descriptionTemplate:
              "As rádios tocam as duas, e cada uma arruma seu público. {character1} e {character2} passam a contar quantas vezes cada música toca por dia, num papel colado na geladeira.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Foco",
            descriptionTemplate:
              'A verba se divide em duas, e nenhuma das músicas pega. A gravadora manda um memorando sobre "foco".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Oferecer mais cinco músicas iguais à faixa sete",
        description:
          "[{character1}] Se dez minutos venceram um ano, voltar ao mesmo ponto de ônibus e escrever mais cinco.",
        visibleIfCharacterHas: [["lazy"]],
        consequence: [
          {
            resultLabel: "Ponto de ônibus",
            descriptionTemplate:
              "{character1} entrega cinco músicas numa tarde, e a gravadora adora três. {character2} sai do ensaio sem dizer nada, para não dar ideia.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Ônibus pontual",
            descriptionTemplate:
              "O ônibus passa no horário, e {character1} só consegue escrever meia música. A gravadora recusa a meia e pede, por favor, o ônibus atrasado de volta.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0349-a-biografia-oficial",
    type: "decisao_criativa",
    title: "A biografia oficial",
    descriptionTemplate:
      "O assessor de imprensa da gravadora entrega a biografia oficial da banda. Nela, {character1} e {character2} se conheceram num navio cargueiro, fugindo de uma tempestade. Os dois se conheceram na fila do banco.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aprovar a biografia do assessor",
        description:
          "Assinar embaixo do cargueiro e da tempestade, e torcer para nenhum jornalista perguntar sobre o mar.",
        consequence: [
          {
            resultLabel: "Lenda",
            descriptionTemplate:
              "A história do cargueiro sai em três jornais, e todo mundo adora. {character2} passa a fingir enjoo nas entrevistas, por coerência.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Desmentido",
            descriptionTemplate:
              "Um colega da fila do banco escreve ao jornal contando a verdade, com data e número da agência. A banda vira a banda que mentiu sobre o banco.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Exigir a história verdadeira",
        description:
          "Contar a fila do banco, que é real, sem tempestade e sem graça.",
        consequence: {
          resultLabel: "Fila do banco",
          descriptionTemplate:
            "O assessor reescreve a biografia com a fila, o caixa e o número da senha. Nenhum jornal publica, mas está tudo correto.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Deixar cada um contar a sua versão",
        description:
          "Liberar {character1} e {character2} para responder como quiserem e deixar a imprensa montar o quebra-cabeça.",
        consequence: [
          {
            resultLabel: "Contradição",
            descriptionTemplate:
              '{character1} fala do cargueiro, {character2} fala do banco, e a imprensa adora a contradição. Um jornal escreve que a banda "esconde algo".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Bate-boca no ar",
            descriptionTemplate:
              "Numa entrevista ao vivo, os dois discutem em qual fila foi, e o locutor deixa correr, porque nunca teve tanta audiência.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Aumentar a história a cada entrevista",
        description:
          "[{character1}] Aceitar o cargueiro e acrescentar um detalhe novo por entrevista, até alguém desconfiar.",
        visibleIfCharacterHas: [["playful"]],
        consequence: [
          {
            resultLabel: "Folclore",
            descriptionTemplate:
              "Na quinta entrevista, o cargueiro já tem um papagaio, um motim e um tesouro. Os jornalistas disputam a versão mais absurda, e a banda vira assunto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Naufrágio duplo",
            descriptionTemplate:
              "Um jornalista resolve conferir e descobre que, segundo {character1}, o cargueiro afundou duas vezes. O assessor pede demissão e leva a biografia junto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0350-a-carta-registrada",
    type: "decisao_criativa",
    title: "A carta registrada",
    descriptionTemplate:
      "Um advogado manda uma carta registrada: um compositor aposentado garante que o maior sucesso da banda copia uma valsa que ele gravou há quarenta anos. Na carta vêm a partitura, uma fotografia dele mais jovem e o valor da indenização.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Pagar um acordo",
        description:
          "[{character1}] Pagar para o assunto morrer antes de chegar aos jornais.",
        consequence: {
          resultLabel: "Acordo",
          descriptionTemplate:
            "O compositor aposentado recebe, assina e manda um bilhete elogiando o arranjo. {character1} paga em três parcelas e passa a ouvir valsas com desconfiança.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Brigar na Justiça",
        description:
          "[{character1}] Contratar um advogado e provar que a música é original, custe o que custar. E custa.",
        consequence: [
          {
            resultLabel: "Três notas",
            descriptionTemplate:
              "O perito ouve as duas músicas e conclui que elas só têm em comum três notas e a vontade de ganhar dinheiro. {character1} sai do tribunal com a música e com a conta do advogado.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Coautor",
            descriptionTemplate:
              "O juiz acha as músicas parecidas o bastante. O compositor aposentado passa a receber parte dos direitos e manda um cartão de aniversário para {character1} todo ano.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
      {
        label: "Ignorar a carta",
        description:
          "[{character1}] Guardar a carta numa gaveta e torcer para o advogado ter outros clientes.",
        consequence: [
          {
            resultLabel: "Gaveta",
            descriptionTemplate:
              "O advogado não escreve mais, provavelmente ocupado com outra banda. A carta fica na gaveta, com a fotografia do compositor olhando para cima.",
            happinessChangePercent: 2,
            chance: 40,
          },
          {
            resultLabel: "Ladrão de valsas",
            descriptionTemplate:
              'O compositor aposentado leva a história a um jornal da capital, com a fotografia. A manchete chama {character1} de "o ladrão de valsas".',
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Provar que a valsa também foi copiada",
        description:
          "[{character1}] Lembrar de onde a melodia veio de verdade: uma cantiga popular de cem anos atrás, que ninguém registrou.",
        visibleIfCharacterHas: [["plagiarist"]],
        consequence: [
          {
            resultLabel: "Domínio público",
            descriptionTemplate:
              "{character1} encontra a cantiga num livro da biblioteca e manda uma cópia ao advogado. O compositor aposentado retira a carta e some, levando a fotografia.",
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Segunda carta",
            descriptionTemplate:
              "A cantiga existe, mas o refrão {character1} tirou de outra música, bem mais recente, e o advogado também acha essa. Agora são dois compositores com carta registrada.",
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0351-a-clausula-do-nome",
    type: "decisao_criativa",
    title: "A cláusula do nome",
    descriptionTemplate:
      'Na página trinta e oito do contrato novo, uma cláusula diz que o nome da banda passa a pertencer à gravadora "para fins de proteção". {character1} quer assinar hoje, antes que a gravadora mude de ideia. {character2} quer saber de quem a gravadora está protegendo a banda.',
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Assinar o contrato como está",
        description:
          "Contrato de gravadora grande não se discute, se assina, de preferência rápido.",
        consequence: [
          {
            resultLabel: "Assinado",
            descriptionTemplate:
              "A banda assina, a gravadora comemora, e o nome segue tocando nas rádios. Nas conversas de bar, por enquanto, ele ainda é da banda.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Banda gêmea",
            descriptionTemplate:
              "No mês seguinte, a gravadora lança outra banda com o mesmo nome, para tocar em outros estados. A banda descobre pelo cartaz.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Exigir que a cláusula saia",
        description:
          "Bater o pé contra o departamento jurídico, que tem mais pés.",
        consequence: [
          {
            resultLabel: "Cláusula riscada",
            descriptionTemplate:
              "A gravadora risca a cláusula sem discutir, como se nunca tivesse importado. {character1} e {character2} passam a semana relendo as outras trinta e sete páginas.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Em estudo",
            descriptionTemplate:
              "O jurídico promete estudar o pedido e estuda por quatro meses. O disco fica pronto e trancado numa gaveta da gravadora.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Registrar o nome antes de assinar",
        description:
          "Correr ao cartório, registrar o nome da banda e só depois devolver o contrato, com a cláusula riscada a caneta.",
        consequence: [
          {
            resultLabel: "Registrado",
            descriptionTemplate:
              "O registro sai em duas semanas, e a gravadora aceita sem comentar. O advogado da gravadora manda parabéns por escrito, o que preocupa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Loja de tintas",
            descriptionTemplate:
              "No cartório, a banda descobre que o nome já é de uma loja de tintas do interior, há seis anos. A loja aceita negociar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Ler o contrato inteiro, cláusula por cláusula",
        description:
          "[{character2}] Passar três noites lendo as cento e vinte cláusulas, uma por uma, atrás da próxima armadilha.",
        visibleIfCharacterHas: [[], ["paranoid"]],
        consequence: [
          {
            resultLabel: "Armadilhas",
            descriptionTemplate:
              "{character2} encontra mais quatro cláusulas parecidas, uma delas sobre a voz de {character1}. A gravadora retira todas, com um sorriso amarelo.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Conspiração",
            descriptionTemplate:
              "{character2} encontra armadilhas em todas as cláusulas, inclusive na que define a data. A gravadora se cansa e assina com outra banda, que leu menos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0352-o-dueto-encomendado",
    type: "decisao_criativa",
    title: "O dueto encomendado",
    descriptionTemplate:
      "A gravadora quer que a banda grave um dueto com a nova aposta da casa, uma cantora que nunca subiu num palco e já tem três capas de revista. A música está escolhida, o figurino também, e a voz escolhida é a de {character1}. {character2} lembra que a banda tem outras vozes, todas disponíveis.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Gravar o dueto",
        description:
          "Emprestar a voz de {character1} à aposta da gravadora em troca de verba de divulgação.",
        consequence: [
          {
            resultLabel: "Verba liberada",
            descriptionTemplate:
              'O dueto toca nas rádios, e a gravadora libera verba para o disco da banda. {character2} aparece no encarte do dueto como "agradecimento especial".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Os que cantam com ela",
            descriptionTemplate:
              'O dueto vira sucesso da cantora, e os locutores passam a apresentar a banda como "os que cantam com ela".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar o dueto",
        description:
          "Avisar à gravadora que a banda não é escada para ninguém, nem para a aposta da casa.",
        consequence: [
          {
            resultLabel: "Sem dueto",
            descriptionTemplate:
              "A gravadora aceita sem drama, e a cantora grava com um ator de televisão. A banda segue igual, sem verba e sem dueto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Geladeira",
            descriptionTemplate:
              "A gravadora aceita e esquece o disco da banda numa prateleira o semestre inteiro. A cantora manda flores, por educação.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Propor que {character2} cante no lugar",
        description:
          "Trocar a voz escolhida e ver quanto tempo a gravadora leva para perceber.",
        consequence: [
          {
            resultLabel: "Química",
            descriptionTemplate:
              "{character2} e a cantora gravam numa tarde, e o produtor diz que a química está perfeita. {character1} comenta que química é matéria de escola.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 4,
            chance: 40,
          },
          {
            resultLabel: "Troca desfeita",
            descriptionTemplate:
              'A gravadora percebe no primeiro ensaio e devolve o dueto a {character1}, agora com menos prazo e a mesma cantora. {character2} fica com o "agradecimento especial".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 60,
          },
        ],
      },
      {
        label: "Compor uma balada nova para o dueto",
        description:
          "[{character1}] Trocar a música escolhida por uma balada de amor escrita na mesma noite, com rimas que só alguém apaixonado assina.",
        visibleIfCharacterHas: [["romantic"]],
        consequence: [
          {
            resultLabel: "Balada",
            descriptionTemplate:
              "A balada emociona a gravadora, as rádios e a cantora. A música toma o estado, e os direitos de autor ficam com a banda, não com a aposta da casa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Romance inventado",
            descriptionTemplate:
              "A balada é tão apaixonada que as revistas anunciam um romance entre {character1} e a cantora. {character1} desmente toda semana, e cada desmentido vende mais revista.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
];
