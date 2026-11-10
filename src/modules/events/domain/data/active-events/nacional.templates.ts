import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Universal templates for the "Nacional" fame phase (100,001 to 2,000,000
 * fans, ADR-0025): no trait requirement nor relationship bound; traits only
 * unlock an extra option.
 */
export const NACIONAL_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "0401-projeto-paralelo",
    type: "conflito_membros",
    title: "Projeto paralelo",
    descriptionTemplate:
      "{character1} anuncia numa entrevista que vai gravar um disco solo. {character2} fica sabendo pelo jornal, como todo mundo, só que com mais raiva.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Apoiar o disco solo",
        description:
          "Desde que não atrapalhe a agenda da banda, coisa que nunca aconteceu na história da música.",
        consequence: [
          {
            resultLabel: "Convivência",
            descriptionTemplate:
              "O disco solo sai sem atrapalhar a banda e vende o suficiente para {character1} voltar motivado(a), e pouco o bastante para voltar.",
            fanCountChange: 2,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Agenda dividida",
            descriptionTemplate:
              "Os dois projetos disputam as mesmas datas, e {character2} começa a contar quantos shows {character1} faz em cada um.",
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
        label: "Pedir que espere",
        description:
          'Primeiro a turnê da banda; o solo fica para depois. "Depois" é uma data muito flexível.',
        consequence: {
          resultLabel: "Adiado",
          descriptionTemplate:
            "{character1} aceita adiar, mas deixa claro que não vai esperar para sempre. Para sempre, no caso, é até a próxima entrevista.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: -6,
        },
      },
      {
        label: "Transformar em disco da banda",
        description:
          "Convidar {character1} a trazer as músicas para o próximo disco de todos.",
        consequence: [
          {
            resultLabel: "Aceito",
            descriptionTemplate:
              "As músicas entram no repertório, e {character2} ajuda nos arranjos com um entusiasmo suspeito.",
            fanCountChange: 3,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Recusado",
            descriptionTemplate:
              '{character1} explica que essas músicas "não são para a banda". A banda tenta não levar para o lado pessoal.',
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
        label: "Lançar no mesmo dia do disco da banda",
        description:
          "[{character1}] Bater de frente: quem vender mais, ganha a discussão.",
        visibleIfCharacterHas: [["individualist"], []],
        consequence: [
          {
            resultLabel: "Holofote",
            descriptionTemplate:
              "A imprensa adora a disputa, e os dois discos vendem bem. A família de {character1} compra os dois, por diplomacia.",
            fanCountChange: 5,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Racha",
            descriptionTemplate:
              "Os fãs tomam partido, e a banda passa semanas se comunicando por bilhetes.",
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
    id: "0402-a-turne-nao-acaba",
    type: "conflito_membros",
    title: "A turnê não acaba",
    descriptionTemplate:
      "Seis meses de estrada, quatro pneus trocados e nenhuma noite inteira de sono. {character2} quer parar para descansar; {character1} quer aceitar mais vinte datas.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar as vinte datas",
        description: "O momento é agora, e ninguém sabe quanto tempo ele dura.",
        consequence: {
          resultLabel: "Estrada",
          descriptionTemplate:
            "A banda toca para multidões e desce de cada palco mais calada. No fim, só se comunica por aceno.",
          fanCountChange: 4,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: -10,
        },
      },
      {
        label: "Cancelar as datas novas",
        description:
          "Voltar para casa e lembrar como é uma cama que não balança.",
        consequence: {
          resultLabel: "Descanso",
          descriptionTemplate:
            "A banda descansa. {character1} passa as férias calculando quanto dinheiro está deixando de ganhar por hora.",
          fanCountChange: -2,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: 8,
        },
      },
      {
        label: "Duas semanas de folga no meio",
        description: "Aceitar metade das datas e encaixar uma pausa.",
        consequence: {
          resultLabel: "Fôlego",
          descriptionTemplate:
            "A pausa faz bem, e os dois voltam à estrada de bom humor. Dura até o primeiro posto de gasolina.",
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
        label: "Fingir uma gripe",
        description:
          "[{character2}] Cancelar um show alegando doença e passar o dia dormindo.",
        visibleIfCharacterHas: [[], ["lazy"]],
        consequence: [
          {
            resultLabel: "Colou",
            descriptionTemplate:
              "Ninguém desconfia, e o dia de folga salva a semana. {character2} descobre um talento para atuar.",
            fanCountChange: -1,
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Flagrado",
            descriptionTemplate:
              "Um fotógrafo flagra {character2} na piscina do hotel na hora do show, com uma saúde invejável.",
            fanCountChange: -4,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
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
    id: "0403-revista-de-fofoca",
    type: "conflito_membros",
    title: "Revista de fofoca",
    descriptionTemplate:
      "Uma revista de fofoca publica que {character1} fala mal de {character2} pelas costas. Ninguém sabe se é verdade, e a revista não pretende descobrir.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Desmentir juntos",
        description:
          "Os dois dão uma entrevista lado a lado, sorrindo o tempo todo.",
        consequence: [
          {
            resultLabel: "Convincente",
            descriptionTemplate:
              "A entrevista acalma os fãs, e a revista perde o assunto. Na semana seguinte, inventa outro.",
            fanCountChange: 2,
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
            resultLabel: "Constrangido",
            descriptionTemplate:
              "Os dois mal se olham na entrevista, e a foto da capa diz mais do que qualquer resposta.",
            fanCountChange: -2,
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
        label: "Ignorar",
        description:
          "Revista de fofoca vive de resposta. De silêncio também, só que demora mais.",
        consequence: {
          resultLabel: "Desconfiança",
          descriptionTemplate:
            "A notícia morre na semana seguinte. A pulga atrás da orelha de {character2} vive bem mais.",
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
        label: "Conversar a portas fechadas",
        description:
          "Perguntar a {character1}, sem plateia, se aquilo é verdade.",
        consequence: [
          {
            resultLabel: "Era mentira",
            descriptionTemplate:
              "{character1} jura que nunca disse nada, e {character2} acredita. Ou finge muito bem.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Meia verdade",
            descriptionTemplate:
              '{character1} admite que reclamou num bar, "mas com carinho". A conversa azeda mesmo assim.',
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
        label: "Culpar o empresário pela fofoca",
        description:
          "[{character1}] Dizer a {character2} que o empresário inventou tudo para vender a banda.",
        visibleIfCharacterHas: [["manipulator"], []],
        consequence: [
          {
            resultLabel: "Bode expiatório",
            descriptionTemplate:
              "{character2} engole a história, e os dois se unem contra o empresário, que nem estava sabendo de nada.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Descoberto",
            descriptionTemplate:
              "O empresário aparece com as provas, e {character2} se sente traído(a) duas vezes, uma delas por escrito.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -4,
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
    id: "0404-o-quarto-de-hotel",
    type: "conflito_membros",
    title: "O quarto de hotel",
    descriptionTemplate:
      "Depois de um show na capital, {character1} destrói o quarto do hotel, por tradição. Às três da manhã, quem atende o gerente é {character2}, de pijama.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Abafar o caso",
        description:
          "Pedir desculpas ao hotel e garantir que nada saia na imprensa.",
        consequence: {
          resultLabel: "Silêncio",
          descriptionTemplate:
            "Ninguém fica sabendo. {character2} não esquece a noite mal dormida e passa a pedir quarto em outro andar.",
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
        label: "Deixar sair na imprensa",
        description: "Rock é isso, dizem. Que falem.",
        consequence: [
          {
            resultLabel: "Lenda",
            descriptionTemplate:
              "A história vira folclore, ganha um andar a mais cada vez que é contada, e a banda ganha fama de perigosa.",
            fanCountChange: 4,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Vexame",
            descriptionTemplate:
              "A imprensa trata a banda como mimada, e uma casa cancela o próximo show por medo pelas cadeiras.",
            fanCountChange: -4,
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
        label: "Exigir um pedido de desculpas",
        description:
          "{character1} pede desculpas a {character2} na frente da banda.",
        consequence: [
          {
            resultLabel: "Desculpas",
            descriptionTemplate:
              "{character1} reconhece o exagero, e o clima melhora. O gerente do hotel não foi consultado.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 60,
          },
          {
            resultLabel: "Orgulho ferido",
            descriptionTemplate:
              "{character1} se recusa e sai batendo a porta. De outro quarto, desta vez.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Resolver tudo com calma",
        description:
          "[{character2}] Acalmar o gerente, acertar o prejuízo e voltar a dormir.",
        visibleIfCharacterHas: [[], ["stable"]],
        consequence: {
          resultLabel: "Sangue frio",
          descriptionTemplate:
            "No café da manhã, ninguém diria que algo aconteceu. {character1} fica devendo essa, e mais uma televisão.",
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
    id: "0405-ciume-de-palco",
    type: "conflito_membros",
    title: "Ciúme de palco",
    descriptionTemplate:
      "O público grita o nome de {character1} mais alto que o nome da banda. {character2} sugere, pelo bem do grupo, que {character1} fique mais atrás no palco. Bem mais atrás.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter a formação",
        description: "O público escolhe quem quer ver. Ninguém muda de lugar.",
        consequence: {
          resultLabel: "Tudo igual",
          descriptionTemplate:
            "{character1} segue na frente, e {character2} toca de cara fechada para um público que não está olhando.",
          fanCountChange: 2,
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
        label: "Revezar a frente do palco",
        description: "Cada música, um integrante em destaque.",
        consequence: {
          resultLabel: "Rodízio",
          descriptionTemplate:
            "O show fica mais variado e a tensão diminui. O público aplaude todo mundo, mas grita um nome só.",
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
        label: "Atender {character2}",
        description: "{character1} passa a tocar mais recuado(a).",
        consequence: [
          {
            resultLabel: "Paz",
            descriptionTemplate:
              "{character2} se acalma, e o público nem percebe a mudança. {character1} percebe, e muito.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Cadê?",
            descriptionTemplate:
              "O público vaia quando não encontra {character1} e passa o show procurando, como quem procura as chaves.",
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
        label: "Pedir que a banda vote",
        description:
          "[{character1}] Sem saber o que fazer, deixar a decisão para todo mundo.",
        visibleIfCharacterHas: [["insecure"], []],
        consequence: [
          {
            resultLabel: "Acolhido(a)",
            descriptionTemplate:
              "A banda vota para {character1} ficar na frente. {character2} aceita o resultado e pede recontagem só uma vez.",
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
            resultLabel: "Exposto(a)",
            descriptionTemplate:
              "A votação racha a banda ao meio, e {character1} passa a noite se perguntando o que fez de errado. A lista é longa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -10,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0406-programa-de-entrevistas",
    type: "oportunidade_externa",
    title: "Programa de entrevistas",
    descriptionTemplate:
      "O programa de entrevistas mais visto do país convida {character1} e {character2}. O apresentador é famoso por provocar os convidados e por nunca ter ouvido o disco de nenhum deles.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Seguir o roteiro",
        description:
          "Responder com educação e falar do disco novo, quer ele pergunte ou não.",
        consequence: {
          resultLabel: "Correto",
          descriptionTemplate:
            "A entrevista passa sem sustos, e o disco ganha uma boa vitrine. O apresentador boceja duas vezes, ao vivo.",
          fanCountChange: 3,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Responder à altura",
        description: "Se ele provocar, a banda provoca de volta.",
        consequence: [
          {
            resultLabel: "Momento histórico",
            descriptionTemplate:
              "A resposta afiada de {character1} vira assunto no país inteiro, e o apresentador passa um raro segundo sem palavras.",
            fanCountChange: 7,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Barraco",
            descriptionTemplate:
              "A discussão sai do controle, e a banda parece arrogante. O apresentador, satisfeito, chama os comerciais.",
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
      {
        label: "Trocar a conversa por música",
        description: "Pedir para tocar duas músicas em vez de dar entrevista.",
        consequence: [
          {
            resultLabel: "Palco",
            descriptionTemplate:
              "O programa aceita, e a apresentação agrada. Ninguém sente falta das perguntas.",
            fanCountChange: 4,
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Só uma",
            descriptionTemplate:
              "O programa deixa tocar só uma, no fim, quando metade do país já foi dormir.",
            fanCountChange: 1,
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
      {
        label: "Conquistar o apresentador antes do programa",
        description:
          "[{character1}] Passar no camarim dele, puxar conversa e quebrar o gelo.",
        visibleIfAnyInvolvedHas: ["friendly"],
        consequence: {
          resultLabel: "Amizade",
          descriptionTemplate:
            "O apresentador trata a banda como velhos amigos e convida para voltar. Os velhos amigos dele nunca ouviram falar disso.",
          fanCountChange: 6,
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
    id: "0407-trilha-do-filme",
    type: "oportunidade_externa",
    title: "A trilha do filme",
    descriptionTemplate:
      "Um diretor de cinema quer uma música de {character1} na trilha do próximo filme, um drama de três horas sobre um farol.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Ceder uma música já lançada",
        description: "Sem trabalho extra: a música entra como está.",
        consequence: {
          resultLabel: "Nas telas",
          descriptionTemplate:
            "O filme faz sucesso, e a música volta às rádios. Metade do público jura que ela foi escrita para o farol.",
          fanCountChange: 4,
          happinessChangePercent: 4,
        },
      },
      {
        label: "Compor uma inédita",
        description:
          "[{character1}] Escrever uma música feita para a cena principal.",
        consequence: [
          {
            resultLabel: "Tema do filme",
            descriptionTemplate:
              "A música vira a cara do filme, e ninguém sai do cinema sem cantarolar. Do filme, ninguém lembra muito.",
            fanCountChange: 8,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Cortada na edição",
            descriptionTemplate:
              "O diretor corta a música da versão final. Ela sobrevive nos créditos, tocando enquanto o público procura a saída.",
            fanCountChange: 1,
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar",
        description: "A música da banda não é fundo de cena.",
        consequence: {
          resultLabel: "Fora",
          descriptionTemplate:
            "O diretor usa a música de outra banda, que agora toca em todo cinema do país. Está tudo bem.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Compor a trilha inteira",
        description:
          "[{character1}] Propor ao diretor uma trilha completa, do primeiro ao último minuto. São três horas.",
        visibleIfAnyInvolvedHas: ["genius"],
        consequence: [
          {
            resultLabel: "Obra",
            descriptionTemplate:
              "A trilha é elogiada até por quem não gostou do filme.",
            fanCountChange: 12,
            happinessChangePercent: 10,
            chance: 60,
          },
          {
            resultLabel: "Exaustão",
            descriptionTemplate:
              "O prazo esmaga {character1}, e a trilha sai abaixo do esperado. Pelo menos combina com o farol.",
            fanCountChange: 3,
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0408-dueto-com-a-lenda",
    type: "oportunidade_externa",
    title: "Dueto com a lenda",
    descriptionTemplate:
      "Uma lenda da música convida {character1} para um dueto no próximo disco dela, o trigésimo, o primeiro com alguém que ela não conhece.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar",
        description: "[{character1}] Não se recusa um convite desses.",
        consequence: {
          resultLabel: "Consagração",
          descriptionTemplate:
            "O dueto toca no país inteiro, e o nome da banda vai junto, em letra pequena.",
          fanCountChange: 6,
          happinessChangePercent: 8,
        },
      },
      {
        label: "Aceitar se a banda tocar junto",
        description: "Ou grava a banda inteira, ou ninguém grava.",
        consequence: [
          {
            resultLabel: "Todos no estúdio",
            descriptionTemplate:
              "A lenda adora a ideia, e a gravação vira uma festa. Ela chama todo mundo pelo nome errado, com muito carinho.",
            fanCountChange: 8,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Convite retirado",
            descriptionTemplate:
              "A lenda prefere chamar outra pessoa. Lendas não negociam.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Recusar por lealdade à banda",
        description:
          "[{character1}] Agradecer e explicar que só canta com a banda.",
        consequence: {
          resultLabel: "Lealdade",
          descriptionTemplate:
            "A recusa vira notícia, e muita gente admira o gesto. A lenda nem lembra de ter convidado.",
          fanCountChange: 1,
          happinessChangePercent: -2,
        },
      },
      {
        label: "Gravar sem aparecer",
        description:
          "[{character1}] Aceitar o dueto, mas pedir para ficar fora da capa e das entrevistas.",
        visibleIfAnyInvolvedHas: ["shy"],
        consequence: {
          resultLabel: "Voz misteriosa",
          descriptionTemplate:
            "O país inteiro quer saber de quem é a segunda voz. {character1} finge não saber também.",
          fanCountChange: 4,
          happinessChangePercent: 8,
        },
      },
    ],
  },
  {
    id: "0409-convencao-do-fa-clube",
    type: "oportunidade_externa",
    title: "Convenção do fã-clube",
    descriptionTemplate:
      "O fã-clube nacional organiza uma convenção num salão de festas alugado e quer {character1} como convidado(a) de honra. Há um bolo com o rosto de {character1}.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Ir pessoalmente",
        description:
          "[{character1}] Passar o dia com os fãs, dar autógrafos e ouvir histórias que não lembra de ter vivido.",
        consequence: {
          resultLabel: "Carinho",
          descriptionTemplate:
            "Os fãs saem emocionados, e o fã-clube dobra de tamanho. {character1} sai com cãibra na mão.",
          fanCountChange: 3,
          happinessChangePercent: 6,
        },
      },
      {
        label: "Mandar um recado gravado",
        description:
          "A agenda está cheia, mas dá para mandar um recado e uma foto autografada pelo assessor.",
        consequence: {
          resultLabel: "Lembrança",
          descriptionTemplate:
            "O recado é aplaudido. O bolo com o rosto de {character1} é cortado em silêncio.",
          fanCountChange: 1,
          happinessChangePercent: 0,
        },
      },
      {
        label: "Fazer um show surpresa na convenção",
        description: "Aparecer sem avisar e tocar três músicas.",
        consequence: [
          {
            resultLabel: "Inesquecível",
            descriptionTemplate:
              "Os fãs não acreditam no que veem, e a história corre o país, cada vez com mais músicas.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 70,
          },
          {
            resultLabel: "Tumulto",
            descriptionTemplate:
              "O salão é pequeno demais, e a polícia encerra a convenção. O bolo não sobrevive.",
            fanCountChange: -2,
            happinessChangePercent: -6,
            chance: 30,
          },
        ],
      },
      {
        label: "Cantar uma balada só para os fãs",
        description:
          "[{character1}] Pegar um violão e cantar uma música inédita, escrita para eles.",
        visibleIfAnyInvolvedHas: ["romantic"],
        consequence: {
          resultLabel: "Lágrimas",
          descriptionTemplate:
            "Não sobra um olho seco no salão, e a balada vira pedido em todos os shows. A banda passa a odiá-la com todas as forças.",
          fanCountChange: 5,
          happinessChangePercent: 8,
        },
      },
    ],
  },
  {
    id: "0410-festival-na-chuva",
    type: "oportunidade_externa",
    title: "Festival na chuva",
    descriptionTemplate:
      "Atração principal de um festival nacional, a banda vê uma tempestade roubar o palco minutos antes do show. A organização lava as mãos, que é o que não falta, e deixa {character1} e {character2} decidirem.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar na chuva",
        description: "O público ficou. A banda também fica.",
        consequence: [
          {
            resultLabel: "Épico",
            descriptionTemplate:
              "Encharcada, a multidão canta mais alto que os amplificadores. Metade pega gripe; a outra metade vai jurar para sempre que estava lá.",
            fanCountChange: 8,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 10,
            chance: 60,
          },
          {
            resultLabel: "Pane",
            descriptionTemplate:
              "O som pifa na terceira música, e a banda descobre ao vivo que eletricidade e água continuam sem se dar bem.",
            fanCountChange: -2,
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Esperar a chuva passar",
        description: "Atrasar o show até o tempo melhorar.",
        consequence: [
          {
            resultLabel: "Valeu a espera",
            descriptionTemplate:
              "A chuva passa, e o show começa com o céu limpo e um público que, de tanto esperar, já ensaiou o coro.",
            fanCountChange: 4,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Toque de recolher",
            descriptionTemplate:
              "A chuva não passa, e o festival encerra a noite sem a atração principal. A segunda atração toca no lugar, emocionada.",
            fanCountChange: -3,
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Cancelar",
        description: "Segurança em primeiro lugar.",
        consequence: {
          resultLabel: "Prudência",
          descriptionTemplate:
            "A organização entende. O público, encharcado e sem show, escreve cartas aos jornais com uma criatividade que a banda nunca teve.",
          fanCountChange: -4,
          happinessChangePercent: -4,
        },
      },
      {
        label: "Exigir o cachê inteiro antes de subir",
        description:
          "[{character1}] Com chuva ou sem chuva, o dinheiro vem antes do primeiro acorde.",
        visibleIfAnyInvolvedHas: ["greedy"],
        consequence: [
          {
            resultLabel: "Pago",
            descriptionTemplate:
              "O cachê chega antes do primeiro acorde e é a única coisa que termina a noite seca. Prioridades.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Impasse",
            descriptionTemplate:
              "A discussão dura até a chuva apagar o palco, e a imprensa conta tudo, com os valores.",
            fanCountChange: -5,
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
  {
    id: "0411-musica-proibida",
    type: "decisao_criativa",
    title: "A música proibida",
    descriptionTemplate:
      "Uma grande rede de rádio proíbe a música nova por causa da letra de {character1}, que ninguém tinha prestado atenção até agora. {character2} quer mudar a letra.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mudar a letra",
        description: "Trocar os versos polêmicos e voltar às rádios.",
        consequence: {
          resultLabel: "No ar de novo",
          descriptionTemplate:
            "A música volta a tocar, e {character1} se recusa a cantar a versão nova ao vivo. O público canta a antiga mesmo assim.",
          fanCountChange: 2,
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
        label: "Manter a letra",
        description: "Tocar a versão original em todos os shows.",
        consequence: [
          {
            resultLabel: "Hino proibido",
            descriptionTemplate:
              "A proibição transforma a música em símbolo, e o público canta cada verso. Nada vende mais que uma proibição.",
            fanCountChange: 7,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Silêncio",
            descriptionTemplate:
              "Sem rádio, a música some, e o disco perde força. A rede manda lembranças.",
            fanCountChange: -3,
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
        label: "Lançar as duas versões",
        description: "Uma para as rádios, outra para os shows.",
        consequence: {
          resultLabel: "Meio-termo",
          descriptionTemplate:
            "A estratégia funciona, e os dois saem satisfeitos. As rádios fingem não saber da outra versão.",
          fanCountChange: 3,
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
        label: "Responder à rádio no ar, em outra emissora",
        description:
          "[{character1}] Ligar para um programa rival e dizer o que pensa da proibição.",
        visibleIfCharacterHas: [["hothead"], []],
        consequence: [
          {
            resultLabel: "Desabafo histórico",
            descriptionTemplate:
              "O desabafo vira assunto no país inteiro, e a música vende como nunca. A rádio rival agradece a audiência.",
            fanCountChange: 6,
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
            resultLabel: "Portas fechadas",
            descriptionTemplate:
              "Outras rádios se solidarizam com a primeira e param de tocar a banda. Corporativismo também é um gênero musical.",
            fanCountChange: -5,
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
    id: "0412-disco-de-covers",
    type: "decisao_criativa",
    title: "O disco de covers",
    descriptionTemplate:
      "O empresário sugere um disco de covers para aproveitar a fase, que é o que empresários sugerem quando a fase está boa. {character1} tem que decidir o que a banda vai gravar.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Gravar os covers",
        description: "Sucessos dos outros, com a cara da banda.",
        consequence: {
          resultLabel: "Vendável",
          descriptionTemplate:
            "O disco vende bem, e a crítica chama de preguiçoso. As duas coisas são verdade.",
          fanCountChange: 4,
          happinessChangePercent: -4,
        },
      },
      {
        label: "Recusar e gravar inéditas",
        description:
          "[{character1}] A banda não chegou até aqui tocando música dos outros.",
        consequence: [
          {
            resultLabel: "Autoral",
            descriptionTemplate:
              "As inéditas convencem, e a banda ganha respeito. O empresário preferia dinheiro, mas aceita.",
            fanCountChange: 4,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Fase perdida",
            descriptionTemplate:
              'As inéditas demoram a sair, e a banda some das rádios por um tempo. O empresário não diz "eu avisei", mas pensa alto.',
            fanCountChange: -2,
            happinessChangePercent: 2,
            chance: 50,
          },
        ],
      },
      {
        label: "Covers irreconhecíveis",
        description: "Gravar os sucessos dos outros, mas virados do avesso.",
        consequence: [
          {
            resultLabel: "Reinvenção",
            descriptionTemplate:
              "As versões surpreendem, e algumas ficam mais famosas que as originais. Os autores mandam cartas, nem todas simpáticas.",
            fanCountChange: 6,
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Ninguém entendeu",
            descriptionTemplate:
              "O público não reconhece as músicas, e o disco encalha. Nem os autores reconhecem.",
            fanCountChange: -1,
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Escolher só clássicos que todo mundo conhece",
        description:
          "[{character1}] Nada de invenção: os clássicos, tocados como manda o figurino.",
        visibleIfAnyInvolvedHas: ["conservative"],
        consequence: {
          resultLabel: "Porto seguro",
          descriptionTemplate:
            "O disco vira presente de aniversário em todo o país, principalmente de quem não sabe o que dar.",
          fanCountChange: 6,
          happinessChangePercent: 6,
        },
      },
    ],
  },
  {
    id: "0413-show-beneficente",
    type: "decisao_criativa",
    title: "Show beneficente",
    descriptionTemplate:
      "Uma enchente devasta uma cidade do interior. {character1} quer fazer um show beneficente; {character2} teme que pareça marketing, porque já viu muita banda chorar para as câmeras.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Fazer sem divulgar a banda",
        description:
          "O show acontece, mas o nome da banda fica fora dos cartazes.",
        consequence: {
          resultLabel: "Discreto",
          descriptionTemplate:
            "A renda ajuda centenas de famílias, e quem estava lá nunca esquece.",
          fanCountChange: 2,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 8,
        },
      },
      {
        label: "Fazer com toda a imprensa",
        description: "Quanto mais gente souber, mais dinheiro chega à cidade.",
        consequence: [
          {
            resultLabel: "Corrente",
            descriptionTemplate:
              "Outros artistas se juntam, cada um com o seu fotógrafo, e a arrecadação bate recorde.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Oportunismo",
            descriptionTemplate:
              "Parte da imprensa acusa a banda de usar a tragédia para aparecer. A acusação sai em letras maiores que a arrecadação.",
            fanCountChange: -2,
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
        label: "Doar o cachê de uma data",
        description: "Ajudar sem montar um show novo.",
        consequence: {
          resultLabel: "Ajuda silenciosa",
          descriptionTemplate:
            "A doação chega rápido, e {character1} fica com a sensação de que dava para fazer mais.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Visitar as famílias antes do show",
        description:
          "[{character1}] Passar o dia na cidade, longe das câmeras, ouvindo quem perdeu tudo.",
        visibleIfAnyInvolvedHas: ["spiritual"],
        consequence: {
          resultLabel: "Presença",
          descriptionTemplate:
            "O show daquela noite é o mais emocionante da carreira da banda.",
          fanCountChange: 3,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
          happinessChangePercent: 10,
        },
      },
    ],
  },
  {
    id: "0414-o-documentario",
    type: "decisao_criativa",
    title: "O documentário",
    descriptionTemplate:
      "Uma equipe de cinema quer acompanhar a banda por um ano, inclusive nos ensaios, nas brigas e no café da manhã. {character1} fica encarregado(a) de decidir o quanto mostrar.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Acesso total",
        description:
          "Bastidores, brigas, ensaios: tudo. O que pode dar errado?",
        consequence: [
          {
            resultLabel: "Retrato honesto",
            descriptionTemplate:
              "O documentário emociona e aproxima a banda do público, que agora sabe quem nunca lava a louça.",
            fanCountChange: 7,
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Roupa suja",
            descriptionTemplate:
              "As brigas viram o centro do filme, a banda passa vergonha e o documentário ganha um prêmio.",
            fanCountChange: 3,
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Só os palcos",
        description: "Câmera ligada só nos shows.",
        consequence: {
          resultLabel: "Filme de show",
          descriptionTemplate:
            "O resultado é bonito e não diz nada sobre quem a banda é. É, basicamente, um show caro com créditos.",
          fanCountChange: 3,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Recusar",
        description: "Algumas coisas são só da banda.",
        consequence: {
          resultLabel: "Privacidade",
          descriptionTemplate:
            "A equipe vai filmar outra banda, que briga mais e rende mais. {character1} dorme tranquilo(a) mesmo assim.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Exigir aprovar cada cena",
        description: "[{character1}] Nada sai sem passar pelos seus olhos.",
        visibleIfAnyInvolvedHas: ["paranoid"],
        consequence: [
          {
            resultLabel: "Sob controle",
            descriptionTemplate:
              "O filme sai como a banda queria: polido, bonito e sem nenhuma cena que alguém queira ver duas vezes.",
            fanCountChange: 3,
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Equipe desiste",
            descriptionTemplate:
              "Depois de semanas de cortes, o diretor abandona o projeto e escreve um livro sobre a experiência.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0415-mudanca-de-som",
    type: "decisao_criativa",
    title: "Mudança de som",
    descriptionTemplate:
      "Com a banda tocando no país inteiro, {character1} quer mudar completamente o som no próximo disco. {character2} quer repetir a fórmula que deu certo, que é exatamente o que o empresário também quer.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mudar tudo",
        description:
          "Banda grande é banda que se reinventa. Banda pequena também, mas ninguém repara.",
        consequence: [
          {
            resultLabel: "Nova fase",
            descriptionTemplate:
              "O som novo conquista um público que nunca tinha ouvido a banda e que nunca vai ouvir os discos antigos.",
            fanCountChange: 8,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Traição",
            descriptionTemplate:
              "Os fãs antigos não reconhecem a banda e devolvem os discos. Alguns, em pedaços.",
            fanCountChange: -5,
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
        label: "Repetir a fórmula",
        description: "Em time que está ganhando não se mexe.",
        consequence: {
          resultLabel: "Mais do mesmo",
          descriptionTemplate:
            "O disco vende bem. {character1} sente que a banda parou no tempo, e a crítica concorda numa resenha de três linhas.",
          fanCountChange: 3,
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
        label: "Uma música diferente por disco",
        description: "Manter a fórmula, mas abrir espaço para uma experiência.",
        consequence: {
          resultLabel: "Evolução",
          descriptionTemplate:
            "A experiência agrada, e os dois saem satisfeitos. A crítica elogia justamente ela, o que irrita {character2}.",
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
        label: "Uma jam sem compromisso",
        description:
          "[{character2}] Propor uma noite de improviso no estúdio, sem gravar nada, só para ver o que sai.",
        visibleIfCharacterHas: [[], ["informal"]],
        consequence: [
          {
            resultLabel: "Faísca",
            descriptionTemplate:
              "No meio da madrugada, os dois encontram um som novo que agrada aos dois, fenômeno raro como eclipse.",
            fanCountChange: 5,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Noite perdida",
            descriptionTemplate:
              "A jam não dá em nada, mas pelo menos ninguém brigou.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 40,
          },
        ],
      },
    ],
  },
];
