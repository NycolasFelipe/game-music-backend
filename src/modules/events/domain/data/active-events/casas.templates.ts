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
];
