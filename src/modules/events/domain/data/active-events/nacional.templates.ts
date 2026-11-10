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
              "O disco solo sai sem atrapalhar a banda e vende o suficiente para {character1} voltar {character1:motivado|motivada|com ânimo}, e pouco o bastante para voltar.",
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
              "O empresário aparece com as provas, e {character2} {character2:se sente traído|se sente traída|se sente vítima de traição} duas vezes, uma delas por escrito.",
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
        description:
          "{character1} passa a tocar {character1:mais recuado|mais recuada|com mais discrição}.",
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
            resultLabel: "{character1:Acolhido|Acolhida|Aceitação}",
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
            resultLabel: "{character1:Exposto|Exposta|Exposição}",
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
      "O fã-clube nacional organiza uma convenção num salão de festas alugado e quer {character1} como {character1:convidado|convidada|atração} de honra. Há um bolo com o rosto de {character1}.",
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
      "Uma equipe de cinema quer acompanhar a banda por um ano, inclusive nos ensaios, nas brigas e no café da manhã. {character1} {character1:fica encarregado|fica encarregada|fica com a tarefa} de decidir o quanto mostrar.",
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
            "A equipe vai filmar outra banda, que briga mais e rende mais. {character1} dorme {character1:tranquilo|tranquila|em paz} mesmo assim.",
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
  {
    id: "0416-o-assento-da-primeira-classe",
    type: "conflito_membros",
    title: "O assento da primeira classe",
    descriptionTemplate:
      "A companhia aérea oferece à banda um único assento na primeira classe. {character1} já está nele, de máscara de dormir, antes de o embarque terminar. {character2} lembra que no último voo foi igual.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Deixar {character1} na primeira classe",
        description:
          "Quem chegou primeiro dorme melhor. Quem chegou depois dorme com rancor.",
        consequence: {
          resultLabel: "Rancor de bordo",
          descriptionTemplate:
            "{character1} desembarca {character1:descansado|descansada|com cara de quem dormiu oito horas}. {character2} desembarca depois de seis horas ao lado do banheiro, com uma lista de queixas em ordem alfabética.",
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
        label: "Mandar {character1} para a classe econômica",
        description:
          "Justiça aérea: troca de lugar no meio do corredor, com o avião inteiro assistindo.",
        consequence: [
          {
            resultLabel: "Troca feita",
            descriptionTemplate:
              "{character2} viaja de pernas esticadas, e {character1}, entre duas crianças e um saco de amendoim. A justiça foi feita para um dos dois.",
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
            resultLabel: "Cena no corredor",
            descriptionTemplate:
              "{character1} se recusa a levantar, a comissária intervém, e a banda vira o assunto do voo. Ninguém dorme, nem os passageiros.",
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
        label: "Devolver o assento à companhia",
        description: "Se ninguém pode ganhar, ninguém dorme.",
        consequence: {
          resultLabel: "Empate",
          descriptionTemplate:
            "O assento vai para um senhor que não conhece a banda e ronca o voo inteiro. {character1} e {character2} enfim concordam em alguma coisa: odeiam o senhor.",
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
        label: "Convencer a comissária a trocar {character1} de lugar",
        description:
          "[{character2}] Sussurrar para a tripulação que {character1} tem pavor de altura e precisa ficar perto da saída de emergência.",
        visibleIfCharacterHas: [[], ["manipulator"]],
        consequence: [
          {
            resultLabel: "Missão cumprida",
            descriptionTemplate:
              "A comissária leva {character1} para a fileira da saída e explica o colete salva-vidas a cada meia hora. {character2} dorme na primeira classe, com a máscara alheia.",
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
            resultLabel: "Descoberto",
            descriptionTemplate:
              "A comissária pergunta a {character1}, em voz alta, sobre o pavor de altura. {character1} descobre a história, e o avião descobre o resto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
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
    id: "0417-a-conta-do-frigobar",
    type: "conflito_membros",
    title: "A conta do frigobar",
    descriptionTemplate:
      "A produção desconta da diária de todos a conta do frigobar de catorze hotéis. Quem esvaziou os catorze foi {character1}. {character2} não abriu frigobar nenhum, porque desconfia de amendoim com preço de joia.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar a conta inteira de {character1}",
        description:
          "Quem come a castanha paga a castanha. São quarenta e dois potinhos.",
        consequence: {
          resultLabel: "Desconto na diária",
          descriptionTemplate:
            "{character1} paga tudo e, em protesto, passa o resto da turnê levando amendoim de rodoviária para os hotéis de luxo.",
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
        label: "Dividir a conta entre todos",
        description:
          "A banda é uma família, e família divide a conta de quem come demais.",
        consequence: [
          {
            resultLabel: "Paz cara",
            descriptionTemplate:
              "Todo mundo paga um pouco, e {character1} agradece com um chocolate do frigobar do hotel seguinte. Na conta de todos.",
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
            resultLabel: "Recibo guardado",
            descriptionTemplate:
              "{character2} paga a sua parte e guarda o recibo dobrado na carteira, para mostrar em momentos oportunos. O primeiro chega no dia seguinte.",
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
        label: "Pedir aos hotéis o quarto de {character1} sem frigobar",
        description:
          "Avisar cada hotel da turnê com antecedência. Os hotéis de luxo não entendem o pedido, mas cobram por ele.",
        consequence: [
          {
            resultLabel: "Quarto seco",
            descriptionTemplate:
              "Os hotéis tiram os frigobares, e {character1} descobre o serviço de quarto, que é mais caro e vem com garçom.",
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
          {
            resultLabel: "Fama de hotel",
            descriptionTemplate:
              "Os hotéis comentam o pedido entre si, e o próximo recebe {character1} com um bilhete na cama: 'frigobar retirado a pedido da banda'. {character1} sabe de quem foi a ideia.",
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
        label: "Ler a conta item por item no café da manhã",
        description:
          "[{character2}] Ler em voz alta, diante da equipe, cada item consumido, com data, hotel e preço.",
        visibleIfCharacterHas: [[], ["professional"]],
        consequence: [
          {
            resultLabel: "Conta paga",
            descriptionTemplate:
              "Na altura do décimo terceiro pote de castanha, {character1} pede para parar e paga tudo. {character2} guarda a lista, por organização.",
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
            resultLabel: "Leitura pública",
            descriptionTemplate:
              "A equipe inteira acompanha a leitura e aplaude cada chocolate. {character1} não ri, e o café da manhã esfria.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0418-o-seguranca-particular",
    type: "conflito_membros",
    title: "O segurança particular",
    descriptionTemplate:
      "{character1} contratou um segurança particular de dois metros, que vai junto até o banheiro. Ontem ele barrou {character2} na porta do camarim da banda, por falta de crachá.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Exigir que {character1} dispense o segurança",
        description:
          "O camarim volta a ter espaço, e {character1} volta a ter o próprio tamanho.",
        consequence: [
          {
            resultLabel: "Dispensado",
            descriptionTemplate:
              "O segurança vai embora com a gravata e o crachá. {character1} passa a semana {character1:emburrado|emburrada|de cara fechada}, olhando para trás nos corredores.",
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
            resultLabel: "Recusa",
            descriptionTemplate:
              "{character1} se recusa e ainda pede ao segurança que fique de olho em {character2}. Ele fica.",
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
        ],
      },
      {
        label: "Fazer um crachá para {character2}",
        description:
          "Resolver no plástico: foto, nome e a palavra 'integrante' em letra grande.",
        consequence: {
          resultLabel: "Crachá",
          descriptionTemplate:
            "{character2} recebe o crachá e mostra a foto ao segurança toda noite. Ele confere toda noite, com a mesma desconfiança.",
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
        label: "Contratar segurança para a banda inteira",
        description:
          "Se é para ter gente grande no corredor, que seja para todos. A conta também.",
        consequence: [
          {
            resultLabel: "Corredor cheio",
            descriptionTemplate:
              "Cada integrante ganha o seu segurança, e o camarim passa a ter mais músculo que instrumento. A paz sai cara, mas chega.",
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
            resultLabel: "Guerra fria",
            descriptionTemplate:
              "Os seguranças começam a disputar o corredor entre si. Na quinta cidade, o de {character2} barra {character1}.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Contratar um segundo segurança para vigiar o primeiro",
        description:
          "[{character1}] Porque ninguém garante que o primeiro está do lado certo.",
        visibleIfCharacterHas: [["paranoid"]],
        consequence: [
          {
            resultLabel: "Vigilância dupla",
            descriptionTemplate:
              "Os dois seguranças passam o show vigiando um ao outro e esquecem de barrar quem quer que seja. {character2} entra no camarim pela primeira vez na semana.",
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
            resultLabel: "Mais um",
            descriptionTemplate:
              "O segundo segurança também não conhece {character2} e barra a passagem duas vezes, em pontos diferentes do corredor.",
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
    ],
  },
  {
    id: "0419-as-respostas-prontas",
    type: "decisao_criativa",
    title: "As respostas prontas",
    descriptionTemplate:
      "A assessoria de imprensa entrega a {character1} um cartão com as respostas para todas as entrevistas da turnê. Inclui um elogio à comida da próxima cidade, onde ninguém da banda pôs os pés.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Ler as respostas do cartão",
        description:
          "Seguir o texto da assessoria palavra por palavra, sem tirar os olhos do cartão.",
        consequence: [
          {
            resultLabel: "Entrevista segura",
            descriptionTemplate:
              "{character1} lê as respostas sem errar uma vírgula. O repórter escreve que a banda é muito simpática, como dizia o cartão.",
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Cartão trocado",
            descriptionTemplate:
              "A assessoria entrega o cartão da cidade anterior, e {character1} elogia no rádio a comida do lugar errado. A cidade certa toma nota.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Improvisar as respostas",
        description:
          "Falar o que vier à cabeça, que é exatamente o que a assessoria temia.",
        consequence: [
          {
            resultLabel: "Sinceridade",
            descriptionTemplate:
              "{character1} responde o que pensa, e a entrevista vira manchete pela primeira vez sem ninguém ter pagado por isso.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Manchete ruim",
            descriptionTemplate:
              "{character1} confessa que não sabe em que cidade está. A cidade descobre no jornal da manhã.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Cancelar as entrevistas da turnê",
        description:
          "Sem entrevista não há resposta errada. Também não há resposta.",
        consequence: {
          resultLabel: "Nota oficial",
          descriptionTemplate:
            "A assessoria cancela tudo e manda aos jornais uma nota de três parágrafos. É a coisa mais longa que a banda disse no semestre.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Responder às perguntas por carta",
        description:
          "[{character1}] Pedir as perguntas por escrito e devolver as respostas à mão, longe de qualquer repórter.",
        visibleIfCharacterHas: [["shy"]],
        consequence: [
          {
            resultLabel: "Obra escrita",
            descriptionTemplate:
              "{character1} devolve três páginas por resposta, com notas de rodapé. Os jornais publicam tudo, por falta de coragem de cortar.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Correio lento",
            descriptionTemplate:
              "As cartas chegam depois que a turnê já deixou a cidade. Os jornais publicam as perguntas sozinhas.",
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0420-o-figurino-de-espelhos",
    type: "decisao_criativa",
    title: "O figurino de espelhos",
    descriptionTemplate:
      "O figurinista entrega a {character1} a roupa da turnê: nove quilos de espelhinhos costurados à mão e uma capa que precisa de duas pessoas para vestir. Hoje o ginásio marca trinta e oito graus, sem contar os holofotes.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Usar o figurino no show inteiro",
        description: "Brilhar custa nove quilos e alguns litros de suor.",
        consequence: [
          {
            resultLabel: "Brilho",
            descriptionTemplate:
              "O figurino reflete os holofotes até a última fileira, e a plateia aplaude a capa antes da primeira música. {character1} sobrevive, por pouco.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Pausa no amplificador",
            descriptionTemplate:
              "Na sexta música, {character1} precisa sentar no amplificador para não cair. A capa continua brilhando, sozinha, no chão do palco.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Tirar a capa na terceira música",
        description: "Começar brilhando e terminar respirando.",
        consequence: {
          resultLabel: "Meio brilho",
          descriptionTemplate:
            "A capa sai na terceira música e passa o resto do show num cabide ao lado da bateria. O figurinista assiste da coxia, ofendido em espelhinho.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Tocar com a roupa do dia a dia",
        description:
          "Recusar o figurino e subir ao palco de camiseta. O figurinista recebe de qualquer jeito.",
        consequence: [
          {
            resultLabel: "Conforto",
            descriptionTemplate:
              "{character1} toca de camiseta, à vontade, e as fotos do show parecem tiradas num ensaio. O figurino viaja no caminhão, brilhando para as caixas de som.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Cobrança",
            descriptionTemplate:
              "A produção lembra que o figurino custou o cachê de duas cidades e pede a explicação por escrito.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Encomendar mais uma camada de espelhos",
        description: "[{character1}] Se é para brilhar, que se veja do avião.",
        visibleIfCharacterHas: [["dazzled"]],
        consequence: [
          {
            resultLabel: "Constelação",
            descriptionTemplate:
              "A segunda camada chega, {character1} vira o ponto mais luminoso do ginásio, e a equipe de iluminação pergunta se ainda é necessária.",
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Doze quilos",
            descriptionTemplate:
              "Doze quilos de espelhinhos derrubam {character1} na escada do palco. A capa sai ilesa.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0421-jurado-de-calouros",
    type: "oportunidade_externa",
    title: "Jurado de calouros",
    descriptionTemplate:
      "O programa de auditório mais visto do domingo convida {character1} para o júri do show de calouros, entre dois shows da turnê, com voo de ida e volta no mesmo dia. O apresentador avisa que o público gosta de jurado cruel.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Ser um jurado duro",
        description:
          "Dar nota baixa para todo mundo, que é o que a televisão paga.",
        consequence: [
          {
            resultLabel: "Jurado temido",
            descriptionTemplate:
              "{character1} reprova onze calouros seguidos e vira o assunto da segunda-feira. Nos shows seguintes, a plateia vaia de brincadeira, e às vezes não.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Vilão do domingo",
            descriptionTemplate:
              "{character1} reprova uma senhora de oitenta anos que cantava para o neto. O país inteiro estava assistindo, inclusive o neto.",
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Ser um jurado generoso",
        description:
          "Dar nota máxima para todo mundo e chegar a tempo do show da noite.",
        consequence: {
          resultLabel: "Nota dez",
          descriptionTemplate:
            "{character1} dá nota dez aos onze calouros, e o apresentador promete, diante das câmeras, nunca mais chamar {character1}.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Recusar o convite",
        description:
          "O domingo é a única folga do mês, e folga não tem auditório.",
        consequence: {
          resultLabel: "Domingo livre",
          descriptionTemplate:
            "{character1} dorme até o meio-dia e assiste ao programa da cama do hotel. O jurado substituto é um ventríloquo, e o boneco vota melhor.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Reprovar o calouro que canta melhor",
        description:
          "[{character1}] Um calouro canta melhor que a banda inteira. Ele pode esperar o próximo domingo, ou a próxima década.",
        visibleIfCharacterHas: [["envious"]],
        consequence: [
          {
            resultLabel: "Ameaça afastada",
            descriptionTemplate:
              "{character1} dá nota zero ao calouro e explica que ele ainda não está pronto. O calouro agradece, educado, e o auditório aplaude sem acreditar.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Vaia nacional",
            descriptionTemplate:
              "O auditório vaia a nota zero por dois minutos, e o calouro vence pelo voto da plateia. Na saída, pede um autógrafo a {character1}, por educação.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0422-o-colchao-inflavel",
    type: "conflito_membros",
    title: "O colchão inflável",
    descriptionTemplate:
      "O patrocinador da turnê, uma fábrica de colchões, instalou atrás da bateria um colchão inflável de seis metros com o logotipo. {character1} lembra que ele paga os salários; {character2} lembra que ele balança no refrão.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o colchão no palco",
        description:
          "Dinheiro de patrocínio não tem cheiro, só um ventilador barulhento.",
        consequence: [
          {
            resultLabel: "Contrato cumprido",
            descriptionTemplate:
              "O colchão fica, o patrocínio cai em dia, e {character2} passa a tocar de costas para ele, por princípio.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 0,
            chance: 60,
          },
          {
            resultLabel: "Murchou",
            descriptionTemplate:
              "Na balada mais lenta do show, o colchão começa a murchar, devagar, em cima da banda. A plateia acha que faz parte e aplaude o colchão.",
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
        label: "Deixar o colchão no palco, só que vazio",
        description: "O contrato fala em colchão no palco. Não fala em ar.",
        consequence: [
          {
            resultLabel: "Brecha",
            descriptionTemplate:
              "O colchão fica dobrado num canto do palco, e o patrocinador não acha a cláusula do ar. {character2} sorri pela primeira vez na turnê.",
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
            resultLabel: "Página nove",
            descriptionTemplate:
              "O patrocinador relê o contrato e encontra a palavra 'inflado' na página nove. A multa sai do cachê, e {character1} lembra disso em cada cidade.",
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
        label: "Romper com o patrocinador",
        description:
          "Devolver o colchão e o dinheiro. O colchão é mais fácil de devolver.",
        consequence: {
          resultLabel: "Palco livre",
          descriptionTemplate:
            "O colchão vai embora num caminhão, junto com a verba das próximas dez cidades. {character1} passa o show olhando o espaço vazio atrás da bateria como quem olha uma conta.",
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
        label: "Cobrar do patrocinador por cada menção no palco",
        description:
          "[{character1}] Se o colchão sobe ao palco, que suba com tabela de preços. Cada 'boa noite' com o nome da fábrica custa um adicional.",
        visibleIfCharacterHas: [["greedy"]],
        consequence: [
          {
            resultLabel: "Tabela de preços",
            descriptionTemplate:
              "O patrocinador aceita, e {character1} fala o nome da fábrica onze vezes por show, inclusive no meio da balada. {character2} conta as menções e o dinheiro.",
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
            resultLabel: "Verba cortada",
            descriptionTemplate:
              "O patrocinador acha o pedido abusivo e corta a verba pela metade. O colchão continua, inteiro.",
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
    id: "0423-o-fa-do-saguao",
    type: "conflito_membros",
    title: "O fã do saguão",
    descriptionTemplate:
      "Há três semanas, o mesmo fã espera a banda no saguão de cada hotel, sempre antes dela, com uma pasta de recortes e o número dos quartos. {character1} acha simpático; {character2} quer saber como ele chega primeiro.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pedir à segurança que afaste o fã",
        description:
          "Um segurança, uma conversa firme e a pasta de recortes devolvida.",
        consequence: [
          {
            resultLabel: "Saguão vazio",
            descriptionTemplate:
              "O fã some do saguão. {character2} dorme melhor, e {character1} passa a semana olhando a porta giratória.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 0,
            chance: 60,
          },
          {
            resultLabel: "Mesa ao lado",
            descriptionTemplate:
              "O fã sai do saguão e reaparece no restaurante do hotel, com a mesma pasta e uma mesa reservada ao lado da banda.",
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
        label: "Convidar o fã para um café",
        description:
          "Descobrir de onde vêm as informações, pagando o café dele.",
        consequence: [
          {
            resultLabel: "Informante",
            descriptionTemplate:
              "O fã explica que lê a agenda da turnê no jornal e liga para os hotéis da cidade fingindo ser da produção. A produção anota o método.",
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
            resultLabel: "Café eterno",
            descriptionTemplate:
              "O café dura três horas, o fã mostra a pasta inteira, e {character2} encontra recortes da própria vida que nem a família guardou.",
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
        label: "Trocar de hotel à meia-noite",
        description:
          "Mudar de endereço sem avisar, com as malas, a equipe e o sono atrasado.",
        consequence: [
          {
            resultLabel: "Despistado",
            descriptionTemplate:
              "A banda dorme num hotel menor, de chuveiro frio e paz. O fã fica no saguão do hotel certo, que agora é o errado.",
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
            resultLabel: "Chegou primeiro",
            descriptionTemplate:
              "Às oito da manhã, o fã está no saguão do hotel novo, com café para todos. Ninguém pergunta como.",
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
        label: "Adotar o fã como mascote da turnê",
        description:
          "[{character1}] Dar a ele um crachá, um lugar no ônibus e a função de achar os hotéis antes da produção.",
        visibleIfCharacterHas: [["friendly"]],
        consequence: [
          {
            resultLabel: "Funcionário do mês",
            descriptionTemplate:
              "O fã acha os hotéis, decora os quartos e lembra o aniversário de toda a equipe. {character2} admite que ele trabalha melhor que a produção.",
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
            resultLabel: "Mascote demais",
            descriptionTemplate:
              "O fã passa a dormir no corredor da banda, por precaução. {character2} passa a trancar a porta duas vezes.",
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
    ],
  },
  {
    id: "0424-o-cenario-que-nao-cabe",
    type: "decisao_criativa",
    title: "O cenário que não cabe",
    descriptionTemplate:
      "{character1} desenhou o cenário da turnê: uma escadaria de doze metros que termina num olho gigante. O ginásio desta noite tem nove metros de teto, e {character2} já mediu duas vezes.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Montar só a metade do cenário",
        description:
          "A escadaria vai até onde o teto deixa. O olho fica no caminhão.",
        consequence: {
          resultLabel: "Meio cenário",
          descriptionTemplate:
            "A escadaria termina no nada, a sete metros do chão, e a plateia passa o show esperando alguém subir. {character1} assiste da coxia ao próprio cenário pela metade.",
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
        label: "Tocar sem cenário",
        description:
          "Só a luz de serviço e a banda, como nos tempos em que ninguém tinha olho gigante.",
        consequence: [
          {
            resultLabel: "Volta às origens",
            descriptionTemplate:
              "O show sem cenário sai mais solto, e o jornal da cidade elogia a 'simplicidade corajosa'. Ninguém conta que foi o teto.",
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
            resultLabel: "Olho ausente",
            descriptionTemplate:
              "A plateia viu o olho gigante no cartaz e quer o olho. {character1} passa o show explicando, entre as músicas, que ele está no estacionamento.",
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
        label: "Mudar o show para o pavilhão de exposições",
        description:
          "O único lugar alto o bastante fica a vinte quilômetros, e o aluguel sai do cachê da noite.",
        consequence: [
          {
            resultLabel: "Olho aberto",
            descriptionTemplate:
              "O cenário inteiro cabe, o olho se abre no último refrão, e a plateia que achou o pavilhão aplaude de pé. A outra metade ainda está procurando.",
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
            resultLabel: "Pavilhão vazio",
            descriptionTemplate:
              "O cenário cabe; o público não chega. Metade dos ingressos continua no ginásio antigo, esperando a banda.",
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
        label: "Deitar a escadaria no chão do palco",
        description:
          "[{character1}] Não é falta de teto, é um conceito novo: uma escadaria horizontal, que não leva a lugar nenhum.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Conceito",
            descriptionTemplate:
              "A plateia não entende a escadaria deitada e, por isso mesmo, sai comentando. Um crítico escreve que é a metáfora da turnê.",
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
            resultLabel: "Tropeço",
            descriptionTemplate:
              "Na quarta música, {character2} tropeça no terceiro degrau horizontal e toca o resto do show {character2:sentado|sentada|no chão}.",
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
    id: "0425-o-roteiro-da-regua",
    type: "oportunidade_externa",
    title: "O roteiro da régua",
    descriptionTemplate:
      "O escritório de shows manda o roteiro da turnê, traçado com régua sobre o mapa: extremo sul na segunda, extremo norte na terça, extremo sul de novo na quarta. Os cachês são ótimos. {character2} tem medo de avião, e o roteiro tem onze voos.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o roteiro como está",
        description:
          "Onze voos, onze cachês e uma pessoa agarrada no braço da poltrona.",
        consequence: [
          {
            resultLabel: "Milhas",
            descriptionTemplate:
              "A banda cumpre as onze datas, e {character2} descobre que o medo de avião passa depois do sétimo voo, junto com a vontade de viver.",
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
            resultLabel: "Pânico no ar",
            descriptionTemplate:
              "No quarto voo, {character2} exige descer na escala e termina o trajeto de ônibus, chegando ao ginásio na hora do bis.",
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
        label: "Trocar os voos por ônibus",
        description: "Ônibus não cai, só atrasa. Atrasa muito.",
        consequence: [
          {
            resultLabel: "Estrada",
            descriptionTemplate:
              "A banda cruza o país de ônibus, dorme sentada e chega às cidades com a cara da estrada. {character2} chega em paz.",
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
            resultLabel: "Data perdida",
            descriptionTemplate:
              "O ônibus chega ao extremo norte um dia depois do show. O ginásio estava cheio, segundo o jornal.",
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
        label: "Cortar as datas mais distantes",
        description:
          "Pagar a multa do escritório e tocar só onde se chega sem atravessar o país.",
        consequence: {
          resultLabel: "Turnê enxuta",
          descriptionTemplate:
            "A turnê perde quatro cidades e o escritório perde a paciência, mas ninguém precisa segurar a mão de {character2} na decolagem.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 0,
        },
      },
      {
        label: "Aceitar o roteiro e ensaiar nos aeroportos",
        description:
          "[{character1}] Aproveitar cada escala para ensaiar no saguão de embarque, que tem ótima acústica e nenhuma tomada.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Ensaio de escala",
            descriptionTemplate:
              "A banda ensaia em onze aeroportos e chega afiada aos shows. {character2} esquece o medo de tanto tocar, e os passageiros pedem bis na fila do embarque.",
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
            resultLabel: "Exaustão",
            descriptionTemplate:
              "Entre voos, ensaios e shows, ninguém dorme por uma semana. {character2} continua com medo de avião, agora com sono.",
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
    id: "0426-a-cidade-errada",
    type: "conflito_membros",
    title: "A cidade errada",
    descriptionTemplate:
      "No quarto mês de estrada, {character1} grita 'boa noite' para a cidade errada pela segunda vez na semana. Doze mil pessoas corrigem em coro, e {character2} quer assumir as falas entre as músicas.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Passar as falas para {character2}",
        description:
          "Quem lembra onde está fala com o público. Quem não lembra só toca.",
        consequence: {
          resultLabel: "Microfone novo",
          descriptionTemplate:
            "{character2} assume as falas e acerta o nome de todas as cidades. {character1} passa os shows {character1:calado|calada|sem dizer uma palavra} entre as músicas, como quem cumpre pena.",
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
        label: "Colar o nome da cidade no monitor",
        description:
          "Uma folha com o nome da cidade em letra grande, trocada todo dia pela produção.",
        consequence: [
          {
            resultLabel: "Lembrete",
            descriptionTemplate:
              "A folha funciona, e {character1} acerta a cidade todas as noites, com o leve atraso de quem confere a placa do ônibus.",
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
            resultLabel: "Folha velha",
            descriptionTemplate:
              "A produção esquece de trocar a folha, e {character1} lê com confiança o nome da cidade de ontem. O coro de correção vem mais alto.",
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
        label: "Fingir que foi uma piada",
        description:
          "Rir no microfone como se o erro fosse de propósito. A plateia decide se acredita.",
        consequence: [
          {
            resultLabel: "Piada aceita",
            descriptionTemplate:
              "A plateia ri junto, e o erro vira a parte mais comentada do show. {character2} não ri, mas ninguém está olhando para {character2}.",
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
            resultLabel: "Vaia",
            descriptionTemplate:
              "A plateia não acredita e vaia até o fim da música. Ninguém na banda ri, nem {character1}.",
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
        label: "Errar a cidade de propósito todas as noites",
        description:
          "[{character1}] Transformar o erro em tradição: a cada show, uma cidade errada diferente, cada vez mais longe.",
        visibleIfCharacterHas: [["playful"]],
        consequence: [
          {
            resultLabel: "Tradição",
            descriptionTemplate:
              "As plateias passam a esperar o erro e gritam o nome certo antes de {character1} terminar a frase. O jornal chama de melhor momento da turnê.",
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
            resultLabel: "Cidade rival",
            descriptionTemplate:
              "Numa noite, {character1} cumprimenta justamente a cidade rival, e doze mil pessoas deixam de entender a piada ao mesmo tempo.",
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
    id: "0427-a-bagagem-extraviada",
    type: "decisao_criativa",
    title: "A bagagem extraviada",
    descriptionTemplate:
      "A companhia aérea extravia a caixa do instrumento de {character1}, aquela com quatro adesivos de 'frágil' e um de 'cuidado'. O show é hoje às nove, e a companhia promete localizar a caixa até sexta.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Pegar emprestado com a banda de abertura",
        description:
          "Tocar com o instrumento de outra pessoa, regulado para outra pessoa.",
        consequence: [
          {
            resultLabel: "Emprestado",
            descriptionTemplate:
              "{character1} toca com o instrumento emprestado e erra só duas vezes, ambas com elegância. A banda de abertura cobra o favor no camarim.",
            happinessChangePercent: -2,
            chance: 60,
          },
          {
            resultLabel: "Desafinado",
            descriptionTemplate:
              "O instrumento emprestado desafina na segunda música e não volta mais. {character1} passa o show sorrindo para não chorar.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Comprar um instrumento novo na cidade",
        description:
          "A única loja de música aberta às seis da tarde tem três opções, todas com etiqueta de promoção.",
        consequence: [
          {
            resultLabel: "Novo em folha",
            descriptionTemplate:
              "{character1} compra o melhor dos três e descobre que ele soa bem, talvez melhor. Não conta isso a ninguém.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Promoção",
            descriptionTemplate:
              "O instrumento novo vem com um chiado de fábrica e a nota fiscal. {character1} guarda a nota, por raiva.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Atrasar o show até a caixa aparecer",
        description:
          "Pedir ao ginásio uma hora de tolerância e à companhia aérea, um milagre.",
        consequence: [
          {
            resultLabel: "Chegou",
            descriptionTemplate:
              "A caixa aparece no aeroporto às dez, vem de táxi com escolta, e o show começa com uma hora de atraso e um aplauso de alívio.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Não chegou",
            descriptionTemplate:
              "A caixa não aparece, e o show começa uma hora e meia depois, com um instrumento emprestado. A plateia vaia o relógio.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Recusar qualquer substituto e tocar pandeiro",
        description:
          "[{character1}] Nenhum instrumento alheio sobe ao palco com {character1}. Um pandeiro, por princípio, não conta.",
        visibleIfCharacterHas: [["purist"]],
        consequence: [
          {
            resultLabel: "Princípio",
            descriptionTemplate:
              "{character1} toca pandeiro o show inteiro com uma dignidade que a plateia respeita. O jornal da cidade chama de versão sem tomada.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Pandeiro em tudo",
            descriptionTemplate:
              "{character1} toca pandeiro em todas as músicas, inclusive nas baladas. A plateia passa o show tentando descobrir qual delas pedia pandeiro.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0428-o-taxi-aereo",
    type: "decisao_criativa",
    title: "O táxi aéreo",
    descriptionTemplate:
      "O voo da banda atrasa nove horas, e o show é às nove da noite, a seiscentos quilômetros. O único táxi aéreo do aeroporto tem dois lugares livres, para {character1} e {character2}, e um piloto que não tira os óculos escuros.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mandar {character1} e {character2} no táxi aéreo",
        description:
          "A dupla chega a tempo de um show acústico; o resto da banda chega a tempo do bis.",
        consequence: [
          {
            resultLabel: "Acústico",
            descriptionTemplate:
              "{character1} e {character2} seguram o ginásio por uma hora com dois instrumentos e muita história de aeroporto. O resto da banda entra no bis, aplaudido como reforço.",
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
            resultLabel: "Turbulência",
            descriptionTemplate:
              "O táxi aéreo chacoalha por duas horas, e a dupla sobe ao palco com as pernas tremendo e sem conseguir se olhar. O acústico dura onze minutos.",
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
        label: "Esperar o voo com a banda inteira",
        description: "Dormir no chão do saguão e torcer para o painel mudar.",
        consequence: [
          {
            resultLabel: "Direto do aeroporto",
            descriptionTemplate:
              "O voo sai, e a banda entra no palco às nove e meia, com as malas. A plateia aplaude as malas também.",
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
            resultLabel: "Show cancelado",
            descriptionTemplate:
              "O voo é cancelado às oito. A banda passa a noite no saguão, vendo o painel anunciar outros destinos.",
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
        label: "Alugar um ônibus para a banda inteira",
        description:
          "Seiscentos quilômetros de estrada, um motorista e nenhuma garantia de chegar antes do fim do show.",
        consequence: [
          {
            resultLabel: "Corrida",
            descriptionTemplate:
              "O ônibus chega às nove e quarenta, e a banda toca com a roupa da viagem e a energia de quem fugiu de um aeroporto.",
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
            resultLabel: "Ginásio fechado",
            descriptionTemplate:
              "O ônibus chega à meia-noite, e o ginásio só tem um vigia, que não conhece a banda.",
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
        label: "Consultar os astros antes de decidir",
        description:
          "[{character2}] Levantar o mapa astral do piloto, do avião e do horário de decolagem, e seguir o que disser.",
        visibleIfCharacterHas: [[], ["spiritual"]],
        consequence: [
          {
            resultLabel: "Céu aberto",
            descriptionTemplate:
              "Os astros recomendam o táxi aéreo, o voo é tranquilo, e {character2} passa o show agradecendo a uma constelação específica.",
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
            resultLabel: "Céu fechado",
            descriptionTemplate:
              "Os astros recomendam esperar, o voo é cancelado, e {character2} explica que o show não estava escrito. {character1} passa a não acreditar em astros, oficialmente.",
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
    id: "0429-o-eco-do-ginasio",
    type: "decisao_criativa",
    title: "O eco do ginásio",
    descriptionTemplate:
      "Na passagem de som, o ginásio devolve cada nota dois segundos depois, como uma catedral com tabela de basquete. {character1} quer manter o repertório de sempre; {character2} quer trocar metade das músicas por baladas.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o repertório de sempre",
        description:
          "As músicas rápidas, com o eco das músicas rápidas por cima.",
        consequence: [
          {
            resultLabel: "Muralha de som",
            descriptionTemplate:
              "O eco transforma o show numa muralha de barulho, e a plateia adora sem distinguir uma música da outra. {character2} também não distingue.",
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
            resultLabel: "Embolado",
            descriptionTemplate:
              "Cada refrão chega duas vezes, a segunda fora do tempo, e a banda passa o show perseguindo o próprio som.",
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
        label: "Trocar o repertório pelas baladas",
        description:
          "Músicas lentas o bastante para o eco caber entre as notas.",
        consequence: {
          resultLabel: "Noite lenta",
          descriptionTemplate:
            "As baladas soam como num templo, e a plateia acende isqueiros em vez de pular. {character1} passa o show olhando o repertório original, colado no chão.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: 0,
        },
      },
      {
        label: "Pagar cortinas acústicas para o ginásio",
        description:
          "Pendurar quatrocentos metros de pano nas arquibancadas, pagos com o cachê da noite.",
        consequence: [
          {
            resultLabel: "Ginásio domado",
            descriptionTemplate:
              "As cortinas engolem o eco, o som sai limpo, e o cachê da noite sai quase inteiro junto com ele.",
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
            resultLabel: "Cortina curta",
            descriptionTemplate:
              "O pano cobre só metade do ginásio. A arquibancada do lado esquerdo ouve o show duas vezes pelo preço de um.",
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
        label: "Usar o eco como instrumento",
        description:
          "[{character1}] Reescrever os arranjos na hora para tocar junto com o eco, em dueto com o próprio ginásio.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Dueto com o ginásio",
            descriptionTemplate:
              "A banda toca em cânone com as arquibancadas, e a plateia ouve algo que nunca vai se repetir, porque ninguém anotou. {character2} admite que foi bonito.",
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
            resultLabel: "O eco venceu",
            descriptionTemplate:
              "Os arranjos novos e o eco brigam por três músicas, e o eco vence. {character2} toca o resto do show de costas para {character1}.",
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
    id: "0430-o-horario-nobre",
    type: "oportunidade_externa",
    title: "O horário nobre",
    descriptionTemplate:
      "A organização de um grande festival oferece à banda o horário depois do pôr do sol, desde que o show caia de cinquenta para vinte e cinco minutos. A conta só fecha cortando a música de nove minutos de {character2}, que {character1} sempre achou longa.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o horário nobre e cortar a música",
        description:
          "Cinquenta mil pessoas no escuro, menos nove minutos de {character2}.",
        consequence: [
          {
            resultLabel: "Horário nobre",
            descriptionTemplate:
              "A banda toca para o festival inteiro, de luzes acesas e céu escuro. {character2} toca com o repertório cortado preso no pedestal, riscado a caneta.",
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
            resultLabel: "Corte em vão",
            descriptionTemplate:
              "O show anterior atrasa, e os vinte e cinco minutos viram quinze. A música de {character2} saiu para nada.",
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
        label: "Manter o horário da tarde com o show inteiro",
        description:
          "Cinquenta minutos completos às quatro da tarde, com sol no rosto e público ainda chegando.",
        consequence: [
          {
            resultLabel: "Tarde cheia",
            descriptionTemplate:
              "A música de nove minutos toca inteira, e quem já chegou canta junto. Quem não chegou ouve do estacionamento.",
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
            resultLabel: "Cadeira de praia",
            descriptionTemplate:
              "A banda toca para um gramado de cadeiras de praia e uma fila para o banheiro. A música de nove minutos parece ter dezoito.",
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
        label: "Exigir o horário nobre sem cortar nada",
        description:
          "Negociar com a organização como se a banda fosse a atração principal. Ela não é, ainda.",
        consequence: [
          {
            resultLabel: "Vitória",
            descriptionTemplate:
              "A organização cede e empurra outra banda para a tarde. A banda toca os cinquenta minutos no escuro, e a outra deixa um bilhete no camarim.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 6,
            chance: 30,
          },
          {
            resultLabel: "Porta fechada",
            descriptionTemplate:
              "A organização retira a oferta e ainda passa o show para as três da tarde, que é quando o sol é mais honesto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -6,
            chance: 70,
          },
        ],
      },
      {
        label: "Propor cortar um pedaço de cada música",
        description:
          "[{character2}] A música de nove minutos fica com quatro e meia, e as de {character1} perdem um refrão cada. Todo mundo sangra igual.",
        visibleIfCharacterHas: [[], ["conciliator"]],
        consequence: [
          {
            resultLabel: "Sacrifício dividido",
            descriptionTemplate:
              "O show cabe nos vinte e cinco minutos, e cada integrante perde um pedaço do que gosta. {character1} e {character2} reclamam juntos, o que é quase uma reconciliação.",
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
            resultLabel: "Ninguém satisfeito",
            descriptionTemplate:
              "As músicas cortadas soam como resumos de si mesmas, e a plateia passa o show esperando finais que não chegam.",
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
    id: "0431-o-diretor-de-turne",
    type: "oportunidade_externa",
    title: "O diretor de turnê",
    descriptionTemplate:
      "O diretor de turnê, o único que sabe em que caminhão estão as malas, recebe uma proposta de outra banda pelo dobro do salário. {character1} quer cobrir a oferta; {character2} acha que ninguém é insubstituível e que a banda aprende rápido.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrir a oferta da outra banda",
        description:
          "Pagar o dobro para continuar sem saber onde estão as malas.",
        consequence: {
          resultLabel: "Fica",
          descriptionTemplate:
            "O diretor fica, ganhando mais que dois integrantes juntos. {character2} faz a conta em voz alta toda vez que ele passa.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: 2,
        },
      },
      {
        label: "Deixar o diretor ir embora",
        description:
          "Desejar boa sorte e descobrir sem ajuda o caminho das malas.",
        consequence: [
          {
            resultLabel: "Banda autônoma",
            descriptionTemplate:
              "A banda se organiza, acerta os horários e perde uma mala só, a menos importante. {character2} trata isso como vitória pessoal.",
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
            resultLabel: "Caos logístico",
            descriptionTemplate:
              "Na primeira cidade sem ele, a banda chega ao ginásio errado, e o equipamento, ao certo. O diretor manda um cartão-postal da outra turnê.",
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
        label: "Oferecer uma parte da bilheteria",
        description:
          "Trocar o salário fixo por uma porcentagem de cada ingresso, que é a forma mais cara de criar um sócio.",
        consequence: [
          {
            resultLabel: "Sócio",
            descriptionTemplate:
              "O diretor aceita e passa a vender ingresso até no saguão do hotel. As malas nunca estiveram tão organizadas.",
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
            resultLabel: "Sócio opinativo",
            descriptionTemplate:
              "O diretor aceita e, já que agora é sócio, passa a opinar no repertório. Sugere cortar as músicas lentas, que vendem menos cerveja.",
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
        label: "Indicar {character2} para o lugar do diretor",
        description:
          "[{character1}] Concordar que ninguém é insubstituível e passar o cargo a quem teve a ideia.",
        visibleIfCharacterHas: [["lazy"]],
        consequence: [
          {
            resultLabel: "Novo diretor",
            descriptionTemplate:
              "{character2} assume a logística, descobre que tem talento para mandar e manda bastante. As malas chegam, e a banda também, no horário.",
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
            resultLabel: "Diretor à força",
            descriptionTemplate:
              "{character2} passa a turnê de prancheta na mão, sem tempo para ensaiar, enquanto {character1} dorme em todos os voos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
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
    id: "0432-o-piano-do-saguao",
    type: "oportunidade_externa",
    title: "O piano do saguão",
    descriptionTemplate:
      "Às duas da manhã, sem sono, {character1} senta ao piano de cauda do saguão do hotel de luxo e toca para três hóspedes e um porteiro. De manhã, o gerente oferece suítes de graça pelo resto da turnê em troca de um recital no almoço de domingo.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar o recital de domingo",
        description:
          "Tocar para executivos que comem salmão e conversam alto, em troca de uma banheira de mármore.",
        consequence: [
          {
            resultLabel: "Pianista da casa",
            descriptionTemplate:
              "{character1} toca uma hora entre o salmão e a sobremesa, e a banda dorme em suítes pelo resto da turnê. Ninguém ouviu o recital, mas todo mundo aplaudiu.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Pedido da mesa",
            descriptionTemplate:
              "Um hóspede pede a mesma música seis vezes, e {character1} toca as seis. A banheira de mármore não compensa.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar o convite",
        description:
          "O piano do saguão era um segredo da madrugada. Com horário marcado, vira emprego.",
        consequence: {
          resultLabel: "Madrugada livre",
          descriptionTemplate:
            "{character1} recusa e continua tocando às duas da manhã, agora com o porteiro pedindo músicas. A suíte continua na conta.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Cobrar cachê pelo recital",
        description:
          "Se é show, tem contrato, cachê e camarim, nem que o camarim seja a cozinha do hotel.",
        consequence: [
          {
            resultLabel: "Cachê de hotel",
            descriptionTemplate:
              "O gerente paga a contragosto, e {character1} toca com o nome impresso no cardápio do almoço, entre o risoto e o pudim.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Piano trancado",
            descriptionTemplate:
              "O gerente retira a oferta e manda trancar o piano às onze da noite. O porteiro lamenta mais que a banda.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar só baladas para os casais do salão",
        description:
          "[{character1}] Transformar o almoço num baile lento, com uma dedicatória para cada mesa.",
        visibleIfCharacterHas: [["romantic"]],
        consequence: [
          {
            resultLabel: "Almoço apaixonado",
            descriptionTemplate:
              "Dois casais dançam entre as mesas, um senhor pede a esposa em casamento pela segunda vez, e o gerente quer o recital todo domingo.",
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Mesa seis",
            descriptionTemplate:
              "{character1} dedica uma balada ao casal da mesa seis, que estava ali para assinar o divórcio. O advogado aplaude.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0433-a-recepcao-no-aeroporto",
    type: "conflito_membros",
    title: "A recepção no aeroporto",
    descriptionTemplate:
      "A assessoria de imprensa contrata duzentos fãs para gritar no desembarque e sair na foto do jornal. {character1} acha que a banda merece; {character2} reconhece no meio deles o garçom do hotel da semana passada.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Fazer a recepção como planejado",
        description:
          "Desembarcar, acenar e fingir surpresa diante de duzentas pessoas pagas por hora.",
        consequence: [
          {
            resultLabel: "Foto no jornal",
            descriptionTemplate:
              "A foto sai na primeira página, com duzentos fãs gritando e um garçom sorrindo. {character1} recorta a foto; {character2} recorta o garçom.",
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
            resultLabel: "Farsa descoberta",
            descriptionTemplate:
              "Um repórter pergunta aos fãs quanto ganharam, e um deles responde com o valor exato. A manchete escreve o resto.",
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
        label: "Cancelar os fãs contratados",
        description:
          "Desembarcar diante de quem quiser aparecer de graça, se alguém quiser.",
        consequence: [
          {
            resultLabel: "Fãs de verdade",
            descriptionTemplate:
              "Trinta fãs de verdade aparecem com cartazes feitos à mão, e {character1} descobre que trinta gritam mais que duzentos pagos.",
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
            resultLabel: "Excursão errada",
            descriptionTemplate:
              "Ninguém aparece, além de uma excursão de aposentados esperando outro voo. {character1} acena para eles mesmo assim.",
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
        label: "Sair pela porta de cargas",
        description:
          "Deixar os duzentos contratados gritando para o portão errado e seguir direto para o hotel.",
        consequence: {
          resultLabel: "Saída discreta",
          descriptionTemplate:
            "A banda sai pelo portão de cargas, entre as malas. Os duzentos contratados gritam para a banda que desembarca em seguida, e {character1} lê no jornal que ela foi recebida como estrela.",
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
        label: "Pedir à assessoria mais duzentos fãs",
        description:
          "[{character1}] Se é para ter recepção, que tenha quatrocentos fãs, uma faixa de vinte metros e um coral.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Recepção de gala",
            descriptionTemplate:
              "Quatrocentos fãs, um coral e uma faixa de vinte metros esperam no desembarque. {character1} chora na escada do avião, e a assessoria cobra o choro à parte.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Conta da recepção",
            descriptionTemplate:
              "A recepção sai no jornal, e a conta chega no mesmo dia, para a banda dividir. {character2} divide em voz alta.",
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
        ],
      },
    ],
  },
  {
    id: "0434-o-relogio-do-tecnico",
    type: "conflito_membros",
    title: "O relógio do técnico",
    descriptionTemplate:
      "Há um mês, {character1} paga por fora o técnico de som para subir o próprio volume a cada show. {character2} descobriu quando o técnico apareceu de relógio novo, mais ou menos na semana em que deixou de se ouvir no ginásio.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Marcar na mesa de som o volume de cada um",
        description:
          "Colar esparadrapo em cada botão da mesa e conferir antes de todo show.",
        consequence: [
          {
            resultLabel: "Mesa marcada",
            descriptionTemplate:
              "A produção marca a mesa com esparadrapo, e o show volta a soar como uma banda. {character1} passa a noite olhando o técnico, que passa a noite olhando o esparadrapo.",
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
            resultLabel: "Esparadrapo movido",
            descriptionTemplate:
              "Na terceira cidade, o esparadrapo aparece colado dois dedos acima do lugar. Ninguém sabe quem mudou, e todo mundo sabe.",
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
        label: "Demitir o técnico de som",
        description:
          "Tirar o relógio da equação e contratar outro técnico no meio da turnê.",
        consequence: [
          {
            resultLabel: "Técnico honesto",
            descriptionTemplate:
              "O técnico novo recusa dinheiro por fora e mixa o show do jeito que a banda toca, que é a coisa mais cruel que um técnico pode fazer.",
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
            resultLabel: "Microfonia",
            descriptionTemplate:
              "O técnico novo não conhece o equipamento, e o primeiro show sem o antigo tem microfonia em todas as baladas.",
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
        label: "Fingir que não sabe de nada",
        description:
          "Deixar o volume como está e guardar a informação para uma briga mais útil.",
        consequence: {
          resultLabel: "Assunto guardado",
          descriptionTemplate:
            "{character2} toca o resto da turnê sem se ouvir direito e guarda o assunto para o momento certo. Ninguém sabe quando será, e {character1} começa a desconfiar.",
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
        label: "Pagar o técnico em dobro para subir o próprio volume",
        description:
          "[{character2}] Se o volume está à venda, {character2} cobre a oferta.",
        visibleIfCharacterHas: [[], ["jealous"]],
        consequence: [
          {
            resultLabel: "Lance vencedor",
            descriptionTemplate:
              "Por uma noite, {character2} soa mais alto que a banda inteira. {character1} percebe na segunda música.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Leilão de volume",
            descriptionTemplate:
              "{character1} cobre a nova oferta, {character2} cobre de novo, e o técnico termina a turnê com dois relógios e o ginásio, com dor de ouvido.",
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
        ],
      },
    ],
  },
  {
    id: "0435-a-festa-do-milionario",
    type: "oportunidade_externa",
    title: "A festa do milionário",
    descriptionTemplate:
      "Um milionário do interior oferece o triplo do cachê para a banda tocar no aniversário dele, no único dia de folga do mês, numa fazenda a duas horas de helicóptero. O contrato exige smoking e a música favorita do aniversariante, que ninguém na banda conhece. {character1} quer aceitar; {character2} quer a folga.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar a festa",
        description:
          "Trocar a folga por um helicóptero, um smoking alugado e o triplo do cachê.",
        consequence: [
          {
            resultLabel: "Festa paga",
            descriptionTemplate:
              "A banda aprende a música favorita no helicóptero, toca no gramado da fazenda e volta com o cachê e um bolo inteiro. {character2} dorme no voo de volta, de smoking.",
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
            resultLabel: "Até o sol nascer",
            descriptionTemplate:
              "O aniversariante pede a música favorita onze vezes e manda a banda tocar até o sol nascer. O piloto do helicóptero dorme; a banda, não.",
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
        label: "Recusar e manter a folga",
        description:
          "Um dia inteiro sem palco, sem avião e sem aniversariante.",
        consequence: {
          resultLabel: "Folga",
          descriptionTemplate:
            "A banda dorme o dia inteiro no hotel. {character1} passa a folga calculando o triplo do cachê no bloco de papel do hotel, em voz alta.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
          happinessChangePercent: 4,
        },
      },
      {
        label: "Mandar só {character1} e {character2} num show acústico",
        description:
          "Uma dupla, dois instrumentos e metade do cachê, que ainda é um cachê e meio.",
        consequence: [
          {
            resultLabel: "Dupla de festa",
            descriptionTemplate:
              "{character1} e {character2} tocam no gramado, comem do bufê e voltam com histórias que o resto da banda finge não invejar.",
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
            resultLabel: "Cadê o resto",
            descriptionTemplate:
              "O aniversariante queria a banda inteira e passa a festa perguntando pelo resto. A dupla volta sem se falar, cada qual numa janela do helicóptero.",
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
        label: "Aceitar a festa e tocar de bermuda",
        description:
          "[{character1}] Ignorar a cláusula do smoking e aparecer na fazenda de bermuda e chinelo, como pede um dia de folga.",
        visibleIfCharacterHas: [["informal"]],
        consequence: [
          {
            resultLabel: "Aniversário de bermuda",
            descriptionTemplate:
              "O milionário acha a bermuda genial, troca o smoking por uma também, e a festa vira churrasco. A banda volta com o cachê e o convite para o ano que vem.",
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
            resultLabel: "Cláusula do smoking",
            descriptionTemplate:
              "O milionário lê a cláusula em voz alta e desconta um terço do cachê por falta de traje. {character2}, de smoking, não se solidariza.",
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
    id: "0436-o-disco-de-ouro",
    type: "conflito_membros",
    title: "O disco de ouro",
    descriptionTemplate:
      "A gravadora entrega o disco de ouro da banda, emoldurado e com uma placa só. {character1} já levou o quadro para casa e pendurou em cima do sofá; {character2} quer o quadro no escritório da banda, onde todos possam ignorá-lo por igual.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Revezar o quadro a cada semestre",
        description:
          "Seis meses na casa de cada integrante, com cerimônia de entrega e prego novo.",
        consequence: [
          {
            resultLabel: "Revezamento",
            descriptionTemplate:
              "O quadro circula pelas casas da banda e volta de cada uma com um arranhão novo. Ninguém confessa nenhum.",
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
            resultLabel: "Devolução atrasada",
            descriptionTemplate:
              "{character1} atrasa a devolução em três semanas, alegando que o prego criou raízes. {character2} vai buscar o quadro pessoalmente, com uma chave de fenda.",
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
        label: "Encomendar uma réplica para cada um",
        description:
          "A gravadora faz cópias, desde que a banda pague, porque o ouro nunca foi a parte que vinha de graça.",
        consequence: [
          {
            resultLabel: "Réplicas",
            descriptionTemplate:
              "Cada integrante ganha um disco de ouro com o próprio nome na placa. A conta vem descontada dos direitos autorais, com juros de gravadora.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 70,
          },
          {
            resultLabel: "Nome errado",
            descriptionTemplate:
              "As réplicas chegam, e a de {character2} vem com o nome escrito errado. A gravadora promete corrigir no próximo disco de ouro, se houver.",
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
        label: "Deixar o quadro com {character1}",
        description:
          "Quem pendurou primeiro fica com ele. A banda ganha paz e perde uma parede.",
        consequence: {
          resultLabel: "Sala de visitas",
          descriptionTemplate:
            "{character1} fica com o quadro e passa a receber visitas na sala, de pé ao lado dele. {character2} não aparece em nenhuma visita.",
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
        label: "Instalar um holofote em cima do quadro",
        description:
          "[{character1}] Pôr luz própria no disco de ouro e chamar uma revista para fotografar a sala.",
        visibleIfCharacterHas: [["dazzled"]],
        consequence: [
          {
            resultLabel: "Altar",
            descriptionTemplate:
              "A revista dá duas páginas para a sala de {character1}, com o quadro iluminado como altar. A banda aparece numa foto pequena, em cima da lareira.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Curto-circuito",
            descriptionTemplate:
              "O holofote esquenta demais e derrete a moldura. O ouro, descobre a banda, era tinta.",
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
    id: "0437-a-biografia-autorizada",
    type: "conflito_membros",
    title: "A biografia autorizada",
    descriptionTemplate:
      "O biógrafo entrega o rascunho da biografia autorizada: quatrocentas páginas, das quais {character1} ocupa trezentas. {character2} aparece pela primeira vez no capítulo nove, segurando a porta do estúdio.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Exigir que o livro seja reescrito",
        description:
          "O biógrafo cobra outro adiantamento e mais um ano, e avisa que entrevistar a banda de novo é a parte do trabalho que ele menos gosta.",
        consequence: [
          {
            resultLabel: "Livro justo",
            descriptionTemplate:
              "A nova versão divide as páginas com régua, e {character2} ganha um capítulo inteiro. O biógrafo jura nunca mais escrever sobre bandas.",
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
            resultLabel: "Livro morno",
            descriptionTemplate:
              "A reescrita tira as histórias boas para caber todo mundo. O livro sai equilibrado e encalha por igual em todas as páginas.",
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
        label: "Publicar como está",
        description:
          "O livro sai no prazo, e o prazo é a única parte que ninguém contesta.",
        consequence: {
          resultLabel: "Trezentas páginas",
          descriptionTemplate:
            "A biografia vende bem, e {character1} autografa os exemplares na própria foto da capa. {character2} assina na página da porta.",
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
        label: "Deixar {character2} escrever um capítulo próprio",
        description:
          "Um apêndice com a versão de {character2}, sem revisão de ninguém.",
        consequence: [
          {
            resultLabel: "Apêndice",
            descriptionTemplate:
              "O capítulo de {character2} é o mais citado pela imprensa, porque desmente os outros dezoito. {character1} lê duas vezes, a segunda com caneta vermelha.",
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
            resultLabel: "Duas versões",
            descriptionTemplate:
              "Os leitores percebem que a banda não concorda nem sobre o ano em que foi fundada. O biógrafo culpa a memória dos entrevistados.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
      {
        label: "Contar ao biógrafo os segredos de {character1}",
        description:
          "[{character2}] Marcar um café com o biógrafo e lembrar, com detalhes, as noites que {character1} prefere esquecer.",
        visibleIfCharacterHas: [[], ["envious"]],
        consequence: [
          {
            resultLabel: "Capítulo novo",
            descriptionTemplate:
              "O biógrafo adora e transforma o café num capítulo. {character1} lê sobre a própria vida e descobre que {character2} tem uma memória excelente.",
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
            resultLabel: "Cortado",
            descriptionTemplate:
              "O editor corta tudo por medo de processo e manda o texto para {character1} autorizar. {character1} lê, não autoriza e não esquece.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -4,
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
    id: "0438-o-casal-da-capa",
    type: "conflito_membros",
    title: "O casal da capa",
    descriptionTemplate:
      'Uma revista de fofoca publica uma foto de {character1} e {character2} saindo de uma padaria às sete da manhã, com a manchete "O casal do ano". Eram só os pães da banda, mas a gravadora pede que ninguém desminta até o disco sair.',
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Desmentir na mesma semana",
        description:
          "Um comunicado curto, com a nota fiscal da padaria anexada.",
        consequence: [
          {
            resultLabel: "Desmentido",
            descriptionTemplate:
              "O boato morre, e as vendas da semana morrem junto. A gravadora liga três vezes para lembrar quem tinha pedido silêncio.",
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
            resultLabel: "Prova contrária",
            descriptionTemplate:
              "A revista publica a nota fiscal: dois pães a mais do que a banda come. O boato ganha uma segunda capa.",
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
        label: "Deixar a revista vender",
        description:
          "Obedecer à gravadora e sorrir para os fotógrafos sem confirmar nada.",
        consequence: {
          resultLabel: "Silêncio estratégico",
          descriptionTemplate:
            "O disco sai com o boato ainda quente e vende acima do previsto. Os dois passam o semestre evitando sentar lado a lado, por estratégia.",
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
        label: "Aparecer de mãos dadas na cerimônia de prêmios",
        description:
          "Se é para mentir, que seja no tapete vermelho, com fotógrafo credenciado.",
        consequence: [
          {
            resultLabel: "Foto da noite",
            descriptionTemplate:
              "A foto dos dois vira a imagem da cerimônia, e o disco agradece. Eles soltam as mãos ainda no carro, na porta do teatro.",
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
            resultLabel: "Mão trocada",
            descriptionTemplate:
              "Os dois trocam de mão três vezes antes de chegar ao palco. A revista publica a sequência inteira, foto por foto.",
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
        label: "Escrever uma balada sobre o romance inventado",
        description:
          "[{character1}] Transformar o boato numa canção de amor, com o nome da padaria no refrão.",
        visibleIfCharacterHas: [["romantic"]],
        consequence: [
          {
            resultLabel: "Balada",
            descriptionTemplate:
              "A balada toca no rádio o dia inteiro, e a padaria ganha fila na porta. {character2} pede, por escrito, que o próprio nome fique fora do encarte.",
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
            resultLabel: "Açúcar demais",
            descriptionTemplate:
              "A balada sai tão doce que a crítica pergunta se a banda foi patrocinada pela padaria. {character2} suspende o café da manhã com a banda até segunda ordem.",
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
    id: "0439-a-mansao-dos-ensaios",
    type: "conflito_membros",
    title: "A mansão dos ensaios",
    descriptionTemplate:
      "{character1} comprou uma mansão com piscina em forma de violão e passou a marcar os ensaios lá, a duas horas da cidade. {character2} mora num apartamento de dois quartos e chega a cada ensaio de ônibus, com o estojo no colo.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Ensaiar na mansão",
        description:
          "O som é ótimo, a vista também, e a estrada cobra o resto.",
        consequence: {
          resultLabel: "Beira da piscina",
          descriptionTemplate:
            "Os ensaios rendem, com suco servido na beira da piscina. {character2} chega sempre na terceira música, com cara de rodoviária.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: 2,
        },
      },
      {
        label: "Alugar um estúdio na cidade",
        description:
          "Pagar aluguel para ensaiar perto de todo mundo e deixar a piscina para os fins de semana.",
        consequence: {
          resultLabel: "Volta à cidade",
          descriptionTemplate:
            "A banda volta a ensaiar na cidade, e o aluguel sai do caixa comum. {character1} chega de motorista e reclama do trânsito.",
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
        label: "Alternar uma semana em cada lugar",
        description: "Metade da banda reclama, em semanas alternadas.",
        consequence: [
          {
            resultLabel: "Meio a meio",
            descriptionTemplate:
              "O esquema funciona, e todo mundo reclama na mesma proporção. É o mais perto de justiça que a banda já chegou.",
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
            resultLabel: "Semana errada",
            descriptionTemplate:
              "Ninguém lembra de qual semana é, e a banda passa um sábado dividida: metade na piscina, metade no estúdio, cada uma ensaiando sem a outra.",
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
        label: "Oferecer a casa de hóspedes a {character2}",
        description:
          "[{character1}] Instalar {character2} na casa de hóspedes, com cozinha, quarto e vista para a piscina.",
        visibleIfCharacterHas: [["friendly"]],
        consequence: [
          {
            resultLabel: "Vizinhança",
            descriptionTemplate:
              "{character2} aceita e passa a chegar ao ensaio de chinelo. Os dois nunca se deram tão bem, nem dividiram tanto a conta de luz.",
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
            resultLabel: "Regras da casa",
            descriptionTemplate:
              "Em um mês, {character2} descobre que a casa de hóspedes vem com horário de silêncio e regras para a piscina. Volta para o apartamento com uma mala e uma lista de queixas.",
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
    ],
  },
  {
    id: "0440-despesas-diversas",
    type: "conflito_membros",
    title: "Despesas diversas",
    descriptionTemplate:
      'O contador entrega o balanço do ano: a banda nunca vendeu tanto e nunca deveu tanto. A maior linha do balanço se chama "despesas diversas", e quem aprovou todas foi {character1}.',
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Contratar uma auditoria",
        description:
          "Gente de terno, três meses de perguntas e uma conta que também vai para despesas diversas.",
        consequence: [
          {
            resultLabel: "Erro de soma",
            descriptionTemplate:
              "A auditoria descobre que o contador somava os impostos duas vezes. {character1} sai sem culpa e exige que isso fique registrado em ata.",
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
            resultLabel: "Aquário",
            descriptionTemplate:
              "A auditoria encontra um aquário de dez mil litros registrado como equipamento de som. {character1} defende que os peixes ouvem tudo.",
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
        label: "Tirar a assinatura de {character1}",
        description:
          "Daqui em diante, toda despesa passa por duas pessoas, e uma delas não vai gostar.",
        consequence: {
          resultLabel: "Caneta entregue",
          descriptionTemplate:
            "{character1} entrega a caneta com a solenidade de quem renuncia a um trono. As contas entram em ordem, e os dois param de se cumprimentar no corredor.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: 2,
        },
      },
      {
        label: "Trocar de contador e não perguntar mais nada",
        description:
          "Culpar o contador sai mais barato do que culpar um integrante.",
        consequence: {
          resultLabel: "Pasta herdada",
          descriptionTemplate:
            'O contador novo herda o balanço e uma pasta escrita "não mexer". O buraco continua, agora com outro responsável.',
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
        label: "Revirar as notas fiscais por conta própria",
        description:
          "[{character2}] Levar as caixas de recibos para o quarto e examinar cada um com lupa e lanterna.",
        visibleIfCharacterHas: [[], ["paranoid"]],
        consequence: [
          {
            resultLabel: "Comissão tripla",
            descriptionTemplate:
              "{character2} encontra um empresário cobrando a mesma comissão em três contratos diferentes. A banda recupera o dinheiro, e {character1} recupera a reputação.",
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
            resultLabel: "Quadro de cortiça",
            descriptionTemplate:
              "Depois de um mês sem dormir, {character2} apresenta um quadro de cortiça com barbantes ligando {character1}, o contador e um vendedor de pipoca. Ninguém sabe o que fazer com o vendedor.",
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
        ],
      },
    ],
  },
  {
    id: "0441-o-disco-la-de-fora",
    type: "conflito_membros",
    title: "O disco lá de fora",
    descriptionTemplate:
      'A gravadora quer que {character1} grave um disco solo para o mercado estrangeiro, com outro nome e cantado em outra língua, "porque aqui ninguém vai ouvir". {character2} achou a prova da capa esquecida na mesa do executivo: {character1} de chapéu enorme, sob um nome que ninguém na banda sabe pronunciar.',
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Liberar o disco lá de fora",
        description:
          "Um disco que aqui não existe, em teoria, e uma agenda que existe dos dois lados.",
        consequence: [
          {
            resultLabel: "Sucesso distante",
            descriptionTemplate:
              "O disco vende bem num país que a banda nunca visitou, e {character1} volta com presentes para todos. Ninguém pergunta o que diz a letra.",
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
            resultLabel: "Chegou aqui",
            descriptionTemplate:
              "Uma rádio da capital descobre o disco e toca a faixa um no horário nobre. O país inteiro reconhece a voz debaixo do chapéu.",
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
        label: "Vetar o disco solo",
        description: "A banda primeiro, em qualquer língua.",
        consequence: {
          resultLabel: "Vetado",
          descriptionTemplate:
            "{character1} desiste do disco e passa a cantarolar a faixa um nos ensaios, em outra língua, com uma saudade audível.",
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
        label: "Propor que a banda inteira grave o disco",
        description: "Se é para ter outro nome, que seja um nome para todos.",
        consequence: [
          {
            resultLabel: "Banda dupla",
            descriptionTemplate:
              "A gravadora aceita, e a banda vira duas: uma aqui, outra lá, com os mesmos integrantes e chapéus diferentes. As duas vendem.",
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
            resultLabel: "Só a voz",
            descriptionTemplate:
              "A gravadora responde, por escrito, que o mercado estrangeiro quer apenas {character1}. {character2} guarda a carta numa gaveta que tranca.",
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
        label: "Pedir um disco lá de fora também",
        description:
          "[{character2}] Exigir da gravadora o mesmo contrato, em outro país e com um chapéu maior.",
        visibleIfCharacterHas: [[], ["jealous"]],
        consequence: [
          {
            resultLabel: "Dois exilados",
            descriptionTemplate:
              "A gravadora aceita para encerrar a conversa, e os dois passam a se cruzar no aeroporto, cada um voltando de um país.",
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
            resultLabel: "Gráficos",
            descriptionTemplate:
              "A gravadora explica, com gráficos, por que o mercado estrangeiro dispensa {character2}. {character2} pendura os gráficos na porta do quarto de {character1}.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
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
    id: "0442-trinta-segundos-de-discurso",
    type: "conflito_membros",
    title: "Trinta segundos de discurso",
    descriptionTemplate:
      "A banda ganha o prêmio de disco do ano, e a cerimônia dá trinta segundos para o agradecimento. {character1} escreveu três páginas; {character2} só quer agradecer à avó, que pagou o primeiro amplificador.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Deixar {character1} falar",
        description:
          "Três páginas em trinta segundos, ou até a orquestra da cerimônia começar a tocar.",
        consequence: [
          {
            resultLabel: "Corte no caminho",
            descriptionTemplate:
              "{character1} corta duas páginas no caminho até o palco e acerta o tempo. A plateia aplaude, e a avó ganha uma menção no fim.",
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
            resultLabel: "Abafado pela orquestra",
            descriptionTemplate:
              "A orquestra entra no meio da segunda página, e {character1} continua falando por cima dela. A avó de {character2} não chega a ser citada.",
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
        label: "Dividir o tempo ao meio",
        description:
          "Quinze segundos para cada um, cronometrados pela produção, que adora um relógio.",
        consequence: {
          resultLabel: "Meio agradecimento",
          descriptionTemplate:
            "Os dois falam quinze segundos cada, e nenhum termina a frase. A avó ganha meio agradecimento.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 1,
            },
          ],
          happinessChangePercent: 0,
        },
      },
      {
        label: "Subir todo mundo e só levantar o troféu",
        description:
          "Nenhuma palavra: a banda inteira no palco, o troféu no alto e um aceno.",
        consequence: [
          {
            resultLabel: "Troféu no alto",
            descriptionTemplate:
              "A foto da banda com o troféu no alto é a mais publicada do dia seguinte. {character1} guarda as três páginas para a autobiografia.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Protesto",
            descriptionTemplate:
              "A plateia acha que o silêncio é um protesto contra alguma coisa. Os jornais passam a semana tentando adivinhar o quê.",
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
        label: "Agradecer à avó numa carta ao jornal",
        description:
          "[{character2}] Segurar o troféu em silêncio e mandar o agradecimento por escrito, onde ninguém interrompe.",
        visibleIfCharacterHas: [[], ["shy"]],
        consequence: [
          {
            resultLabel: "Carta publicada",
            descriptionTemplate:
              "O jornal publica a carta, e a avó ganha mais espaço que o prêmio. {character1} usa os trinta segundos inteiros, sem pressa e sem concorrência.",
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
            resultLabel: "Microfone na cara",
            descriptionTemplate:
              "O apresentador põe o microfone na frente de {character2} assim mesmo. Saem duas sílabas e um aceno, que a televisão repete a semana inteira.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0443-o-produtor-caro",
    type: "conflito_membros",
    title: "O produtor caro",
    descriptionTemplate:
      "A banda contratou o produtor mais caro do país, que cobra por hora, só trabalha de madrugada e exige uma lareira acesa na sala de gravação, mesmo no verão. Em uma semana, ele elogiou todos os takes de {character1} e apagou três partes de {character2}.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Confiar no produtor",
        description:
          "Ele cobra o que cobra por algum motivo, e não é a simpatia.",
        consequence: [
          {
            resultLabel: "Disco redondo",
            descriptionTemplate:
              "O disco fica impecável, e a crítica elogia a produção pelo nome. {character2} reconhece, a contragosto, uma parte que sobreviveu.",
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
            resultLabel: "Palmas",
            descriptionTemplate:
              "O disco sai com {character2} em duas faixas de dez, numa delas batendo palmas. O produtor chama isso de economia de recursos.",
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
        label: "Demitir o produtor no meio do disco",
        description:
          "Pagar a multa do contrato e terminar o disco com o técnico da casa.",
        consequence: {
          resultLabel: "Horário comercial",
          descriptionTemplate:
            "A multa leva o adiantamento, e o técnico termina o disco em horário comercial. As partes de {character2} voltam, e a lareira fica acesa, porque ninguém sabe apagá-la.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
          happinessChangePercent: -2,
        },
      },
      {
        label: "Gravar as partes de {character2} escondido, com outro técnico",
        description:
          "Duas salas, dois técnicos e uma banda que se cruza no corredor fingindo que não.",
        consequence: [
          {
            resultLabel: "Mistura secreta",
            descriptionTemplate:
              "{character2} grava de dia, o produtor grava de noite, e o disco junta os dois sem que ele perceba. Ou ele finge, pelo preço.",
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
            resultLabel: "Flagrante",
            descriptionTemplate:
              "O produtor descobre as gravações paralelas e abandona o disco, levando o adiantamento e deixando a lareira acesa. {character1} culpa {character2} pela fuga.",
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
        label: "Confrontar o produtor na sala de gravação",
        description:
          "[{character2}] Entrar na sala às três da manhã e explicar, em voz alta, quem toca naquele disco.",
        visibleIfCharacterHas: [[], ["hothead"]],
        consequence: [
          {
            resultLabel: "Respeito",
            descriptionTemplate:
              "O produtor escuta em silêncio, devolve as três partes e passa a chamar {character2} pelo nome. É o primeiro nome que ele decora.",
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
            resultLabel: "Porta aberta",
            descriptionTemplate:
              "O produtor sai sem fechar a porta e manda a conta inteira no dia seguinte. {character1} passa a gravar de fones, para não ouvir {character2}.",
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
    id: "0444-o-dueto-improvavel",
    type: "oportunidade_externa",
    title: "O dueto improvável",
    descriptionTemplate:
      "O cantor de bolero mais vendido do país, dono de dezenove discos sobre corações partidos, convida {character1} para um dueto. A gravadora dele manda a letra, o arranjo e um terno de lantejoulas, sem perguntar o tamanho.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Gravar o dueto como ele quer",
        description:
          "Bolero, lantejoula e uma nota longa no final que vai exigir ensaio.",
        consequence: [
          {
            resultLabel: "Sucesso de casamento",
            descriptionTemplate:
              "O dueto toca em todas as rádios de madrugada e em todos os casamentos do semestre. Senhoras passam a reconhecer {character1} na fila do mercado.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Lantejoula",
            descriptionTemplate:
              "A crítica de música dedica uma coluna inteira ao terno de lantejoulas. Nenhuma linha fala da música.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar com uma carta educada",
        description: "Uma carta gentil, com elogios ao terno.",
        consequence: {
          resultLabel: "Outro convidado",
          descriptionTemplate:
            "O cantor responde com uma carta ainda mais gentil e convida outra banda na semana seguinte. O dueto vira sucesso, com outra pessoa de terno.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Propor um arranjo no meio do caminho",
        description:
          "Metade bolero, metade banda, e muita negociação sobre quem segura a nota longa.",
        consequence: [
          {
            resultLabel: "Encontro",
            descriptionTemplate:
              "O arranjo misturado agrada aos dois públicos, que pela primeira vez concordam em alguma coisa. O cantor já fala em segunda música.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Nem um nem outro",
            descriptionTemplate:
              "O arranjo desagrada aos fãs de bolero e aos da banda ao mesmo tempo. Nunca se viu um consenso tão rápido.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Exigir o bolero no som da banda",
        description:
          "[{character1}] Aceitar o dueto só com distorção, bateria alta e nenhuma lantejoula.",
        visibleIfCharacterHas: [["purist"]],
        consequence: [
          {
            resultLabel: "Conversão",
            descriptionTemplate:
              "O cantor topa por curiosidade e sai do estúdio de jaqueta de couro. Os fãs dele levam um susto, e os da banda também.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Convite desfeito",
            descriptionTemplate:
              "O empresário do cantor desfaz o convite por carta registrada, e a imprensa publica a recusa como arrogância. {character1} recorta a matéria e guarda como elogio.",
            happinessChangePercent: -4,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0445-o-comercial-do-antiacido",
    type: "oportunidade_externa",
    title: "O comercial do antiácido",
    descriptionTemplate:
      "A banda descobre pela televisão do camarim que a gravadora vendeu a balada mais triste de {character2} para um comercial de antiácido. O contrato permite, a banda recebe oito por cento, e {character1} já fez a conta dos oito por cento.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Processar a própria gravadora",
        description:
          "Brigar com quem paga o próximo disco, por uma questão de azia.",
        consequence: [
          {
            resultLabel: "Fora do ar",
            descriptionTemplate:
              "O juiz dá razão à banda, e o comercial sai do ar. A gravadora cumpre a sentença e esquece o telefone da banda por um semestre.",
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
            resultLabel: "Contrato é contrato",
            descriptionTemplate:
              "O juiz lê a cláusula em voz alta e encerra o caso em dez minutos. A banda paga as custas, e o antiácido continua no ar.",
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
        label: "Aceitar os oito por cento",
        description: "O dinheiro chega todo mês, junto com a lembrança.",
        consequence: {
          resultLabel: "Mão no estômago",
          descriptionTemplate:
            "Os oito por cento pagam a reforma do estúdio. {character2} não consegue mais cantar a balada sem que alguém na plateia leve a mão ao estômago.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: 0,
        },
      },
      {
        label: "Oferecer outra música no lugar da balada",
        description:
          "Dar ao antiácido uma canção da banda menos pessoal e mais digerível.",
        consequence: [
          {
            resultLabel: "Troca",
            descriptionTemplate:
              "A gravadora aceita e põe uma música animada no comercial. A balada de {character2} volta a ser só sobre tristeza.",
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
            resultLabel: "Dois sabores",
            descriptionTemplate:
              "A gravadora gosta tanto da segunda música que vende as duas, uma para cada sabor do antiácido.",
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
        label: "Renegociar os direitos do catálogo inteiro",
        description:
          "[{character1}] Ameaçar a gravadora com uma entrevista e aproveitar o assunto para rever a porcentagem de todas as músicas.",
        visibleIfCharacterHas: [["greedy"]],
        consequence: [
          {
            resultLabel: "Porcentagem dobrada",
            descriptionTemplate:
              "A gravadora cede para evitar a entrevista e dobra a porcentagem do catálogo. {character2} passa a ganhar mais com uma tristeza que agora é comercial.",
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
            resultLabel: "Manchete",
            descriptionTemplate:
              "A gravadora não cede, e {character1} dá a entrevista assim mesmo. A manchete só fala de dinheiro, na semana do lançamento.",
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
    id: "0446-a-musica-deles",
    type: "oportunidade_externa",
    title: "A música deles",
    descriptionTemplate:
      "A música mais tocada do país neste semestre é de uma banda estrangeira, e o refrão é igual ao de uma música de {character1} de três discos atrás. O advogado da gravadora já calculou a indenização, e a comissão dele.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Processar a banda estrangeira",
        description:
          "Dois anos de audiências, peritos musicais e advogados cantarolando em duas línguas.",
        consequence: [
          {
            resultLabel: "Indenização",
            descriptionTemplate:
              "O perito confirma a cópia nota por nota, e a banda estrangeira paga para encerrar o caso. {character1} passa a ouvir o rádio como quem confere um recibo.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Três acordes",
            descriptionTemplate:
              "O perito conclui que os dois refrões usam os mesmos três acordes de metade da música popular. A banda paga as custas e a comissão do advogado.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Fazer um acordo discreto",
        description:
          "Uma parte dos direitos, um papel assinado e nenhuma entrevista.",
        consequence: {
          resultLabel: "Sigilo",
          descriptionTemplate:
            "A banda estrangeira paga uma porcentagem pequena e exige sigilo. {character1} recebe o dinheiro e não pode contar a ninguém de onde ele veio.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Tocar as duas músicas emendadas no show",
        description: "Deixar a plateia julgar, no volume máximo.",
        consequence: [
          {
            resultLabel: "Plateia juíza",
            descriptionTemplate:
              "A plateia canta os dois refrões sem perceber a emenda, e os jornais publicam a comparação. A música antiga de {character1} volta às rádios pela porta dos fundos.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Ao contrário",
            descriptionTemplate:
              "Metade da plateia conclui que a banda copiou os estrangeiros, e um jornal publica a conclusão como furo.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Convencer o advogado a esquecer o caso",
        description:
          "[{character1}] Encerrar o assunto antes que alguém investigue, porque {character1} sabe muito bem de onde tirou o refrão original.",
        visibleIfCharacterHas: [["plagiarist"]],
        consequence: [
          {
            resultLabel: "Arquivado",
            descriptionTemplate:
              "O advogado arquiva o caso a contragosto, e ninguém examina a música de {character1}. Nem a outra, mais antiga, de onde as duas saíram.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Perito curioso",
            descriptionTemplate:
              "O advogado contrata um perito assim mesmo, e o perito encontra a canção de cem anos de onde as duas saíram. As duas bandas dividem a vergonha, cada uma no seu idioma.",
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0447-o-filme-da-banda",
    type: "oportunidade_externa",
    title: "O filme da banda",
    descriptionTemplate:
      "Um estúdio de cinema quer filmar a história da banda, com atores. No roteiro, {character1} salva a banda três vezes e {character2} quase acaba com ela, numa briga que nunca aconteceu, num barco que a banda nunca teve.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Vender os direitos e não se meter",
        description:
          "O estúdio paga bem e pede uma coisa só: distância do set.",
        consequence: {
          resultLabel: "Estreia",
          descriptionTemplate:
            "O filme estreia com o barco, a briga e uma trilha que a banda não gravou. {character2} assiste numa sessão vazia, de óculos escuros.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: 0,
        },
      },
      {
        label: "Exigir que tirem a briga do roteiro",
        description: "Corrigir a história antes que ela vire a oficial.",
        consequence: [
          {
            resultLabel: "Roteiro corrigido",
            descriptionTemplate:
              "O estúdio corta o barco e a briga, e o filme ganha um ar de verdade que ninguém esperava. Fica também meia hora mais curto.",
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
            resultLabel: "Engavetado",
            descriptionTemplate:
              "Sem a briga, o estúdio acha a história chata e engaveta o filme. A banda descobre que a própria vida não rende roteiro.",
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
        label: "Pedir que {character2} faça o próprio papel",
        description:
          "Ninguém desmente uma briga melhor do que quem não brigou.",
        consequence: [
          {
            resultLabel: "Revelação",
            descriptionTemplate:
              "{character2} faz o próprio papel e rouba todas as cenas, inclusive a do barco. A crítica de cinema sugere uma segunda carreira.",
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
            resultLabel: "Raiva demais",
            descriptionTemplate:
              "{character2} ensaia a cena da briga com tanta convicção que a equipe chama a segurança. O diretor adora; {character1}, nem tanto.",
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
        label: "Pedir para dirigir o filme",
        description:
          "[{character1}] Assumir a câmera e contar a história como sempre a viu, com sonhos, cores e quatro horas de duração.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Obra estranha",
            descriptionTemplate:
              "O filme sai longo, estranho e bonito, e ganha um prêmio num festival de outro país. Ninguém na banda entende a cena do cavalo.",
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
            resultLabel: "Cavalo voador",
            descriptionTemplate:
              "Depois de oito meses de filmagem, o estúdio corta o orçamento na cena do cavalo voador. O filme fica pela metade, e {character1} chama o corte de intencional.",
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
    id: "0448-a-estatua-de-cera",
    type: "oportunidade_externa",
    title: "A estátua de cera",
    descriptionTemplate:
      "Um museu de cera quer {character1} no salão dos famosos, entre um apresentador de televisão e um campeão de boxe. O escultor precisa de três dias de pose e de um par de sapatos que nunca será devolvido.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Posar os três dias",
        description:
          "Três dias de pé, sem se mexer, com um escultor medindo cada sobrancelha.",
        consequence: [
          {
            resultLabel: "Fila na porta",
            descriptionTemplate:
              "A estátua fica pronta e ganha fila na porta do museu. {character1} vai ver escondido e sente ciúme da estátua, que é mais fotografada.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Placa grande",
            descriptionTemplate:
              "A estátua sai parecida com o campeão de boxe. O museu resolve com uma placa grande, com o nome de {character1} por extenso.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar o convite",
        description: "A fama continua de carne e osso, sem cera.",
        consequence: {
          resultLabel: "Verão quente",
          descriptionTemplate:
            "O museu chama outra banda, cuja estátua derrete pela metade no primeiro verão. {character1} lê a notícia duas vezes, com uma alegria que prefere não explicar.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Mandar um sósia posar no lugar",
        description:
          "Um sósia contratado faz as poses, e ninguém perde três dias.",
        consequence: [
          {
            resultLabel: "Ninguém nota",
            descriptionTemplate:
              "A estátua fica idêntica ao sósia, e o museu não percebe a troca. Os fãs também não, o que {character1} prefere não analisar.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Inauguração",
            descriptionTemplate:
              "O sósia aparece na inauguração e dá autógrafos ao lado da estátua, com mais naturalidade que {character1}. Um jornal publica a foto dos dois.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Exigir uma inauguração com show",
        description:
          "[{character1}] Aceitar com uma condição: fotógrafos, discurso e uma música tocada ao lado da estátua.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Noite de gala",
            descriptionTemplate:
              "A inauguração lota o museu, e {character1} canta abraçando a própria estátua. O jornal publica a foto na primeira página, com a estátua em primeiro plano.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Salão ao lado",
            descriptionTemplate:
              "No mesmo dia, o campeão de boxe inaugura a estátua dele no salão ao lado. Os fotógrafos escolhem o boxe.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0449-a-lista-da-matriz",
    type: "oportunidade_externa",
    title: "A lista da matriz",
    descriptionTemplate:
      "Uma gravadora multinacional compra a gravadora da banda, com o catálogo, os contratos e a máquina de café. A matriz manda a lista de artistas prioritários do ano: a banda está em décimo quarto, logo abaixo de um ventríloquo. {character1} quer pedir para sair; {character2} quer subir na lista.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pedir a rescisão do contrato",
        description:
          "Pagar a multa e procurar uma casa onde a banda não dispute espaço com um boneco.",
        consequence: [
          {
            resultLabel: "Liberdade",
            descriptionTemplate:
              "A multinacional libera a banda sem discutir, com alívio. Uma gravadora menor contrata no mesmo mês e põe a banda em primeiro numa lista de três nomes.",
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
            resultLabel: "Multa",
            descriptionTemplate:
              "A multa leva o dinheiro do semestre, e nenhuma gravadora liga na semana seguinte. O ventríloquo, dizem, vai muito bem.",
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
        label: "Ficar e aceitar o décimo quarto lugar",
        description:
          "Gravar o próximo disco com o orçamento que sobrar depois dos treze primeiros.",
        consequence: {
          resultLabel: "Décimo quarto",
          descriptionTemplate:
            "O disco sai com orçamento de décimo quarto lugar e uma capa feita pelo estagiário. {character1} lembra a banda disso em cada entrevista.",
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
        label: "Reclamar da lista nos jornais",
        description:
          "Contar à imprensa que a nova dona da banda prefere um boneco.",
        consequence: [
          {
            resultLabel: "Quinto lugar",
            descriptionTemplate:
              "Os jornais adoram a história, e a matriz sobe a banda para o quinto lugar para encerrar o assunto. O ventríloquo responde pelo boneco.",
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
            resultLabel: "Fora da lista",
            descriptionTemplate:
              "A matriz não gosta da exposição e tira a banda da lista. A banda continua contratada, sem ninguém que atenda o telefone.",
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
        label: "Levar os números de vendas à matriz",
        description:
          "[{character1}] Montar um relatório de vendas por cidade, encadernar e marcar reunião com os executivos de fora.",
        visibleIfCharacterHas: [["professional"]],
        consequence: [
          {
            resultLabel: "Terceiro lugar",
            descriptionTemplate:
              "{character1} chega com gráficos por cidade e uma pasta encadernada. A matriz sobe a banda para o terceiro lugar e pergunta quem fez o relatório.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 6,
            chance: 70,
          },
          {
            resultLabel: "Reunião curta",
            descriptionTemplate:
              "A reunião dura quatro minutos, dois deles para encontrar a sala. O executivo agradece a pasta e a deixa em cima da do ventríloquo.",
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
    ],
  },
  {
    id: "0450-o-terceiro-executivo",
    type: "decisao_criativa",
    title: "O terceiro executivo",
    descriptionTemplate:
      "A gravadora trocou de diretor artístico três vezes em um ano, e cada um pediu mudanças opostas no mesmo disco. O terceiro quer de volta as guitarras que o segundo mandou tirar. {character1} quer obedecer e acabar logo; {character2} prefere esperar o quarto.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Refazer o disco do jeito do terceiro",
        description:
          "Mais um mês de estúdio para voltar ao som que a banda tinha antes do primeiro.",
        consequence: [
          {
            resultLabel: "Aprovado",
            descriptionTemplate:
              "O terceiro executivo aprova o disco e é promovido na semana seguinte. O disco sai antes que o quarto assuma.",
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
            resultLabel: "Quarto executivo",
            descriptionTemplate:
              "O disco fica pronto no dia em que o quarto executivo assume e pede menos guitarras.",
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
        label: "Esperar o próximo executivo",
        description: "Na gravadora, quem espera sempre encontra alguém novo.",
        consequence: [
          {
            resultLabel: "Primeira versão",
            descriptionTemplate:
              "O quarto executivo assume, ouve a primeira versão e acha perfeita. Ninguém conta a ele que é a primeira.",
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
            resultLabel: "Disco na gaveta",
            descriptionTemplate:
              "O quarto executivo demora a chegar, e o disco passa um semestre na gaveta. {character1} liga para a gravadora toda segunda-feira para perguntar quem está lá.",
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
        label: "Lançar a versão que a banda prefere",
        description:
          "Ignorar os três executivos e entregar o disco que a banda acha bom.",
        consequence: [
          {
            resultLabel: "Mérito alheio",
            descriptionTemplate:
              "O disco sai sem aprovação, e o terceiro executivo assume o mérito quando ele vende. É a parte do trabalho que ele faz melhor.",
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
            resultLabel: "Sem divulgação",
            descriptionTemplate:
              "A gravadora lança o disco sem divulgação, por princípio. Só a família da banda fica sabendo que ele existe.",
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
        label: "Reenviar o primeiro disco com as faixas em outra ordem",
        description:
          "[{character1}] Mandar a versão original de novo, com outro título e as músicas embaralhadas.",
        visibleIfCharacterHas: [["lazy"]],
        consequence: [
          {
            resultLabel: "Colou",
            descriptionTemplate:
              "O terceiro executivo ouve, aprova e elogia as mudanças. A banda ganha o semestre, e {character1} ganha um apelido no estúdio.",
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
            resultLabel: "Reconhecido",
            descriptionTemplate:
              "O executivo reconhece a primeira faixa no segundo compasso, porque foi a única que ele ouviu inteira. A banda volta ao estúdio com um pouco menos de crédito na gravadora.",
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
    id: "0451-grandes-sucessos-volume-um",
    type: "decisao_criativa",
    title: "Grandes sucessos, volume um",
    descriptionTemplate:
      'A gravadora quer lançar uma coletânea de grandes sucessos no fim do ano. A banda tem três sucessos, e a capa já está impressa com "volume um". O resto, segundo o executivo, {character1} compõe até sexta.',
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Completar com músicas antigas",
        description:
          "Encher o disco com as faixas menos lembradas dos discos anteriores.",
        consequence: {
          resultLabel: "Grandes esquecidos",
          descriptionTemplate:
            "A coletânea sai com três sucessos e nove músicas que nem os fãs lembram. A crítica chama o disco de grandes esquecidos, volume um.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Encher com versões ao vivo dos três sucessos",
        description:
          "Três músicas, quatro versões de cada, e a esperança de que ninguém conte.",
        consequence: [
          {
            resultLabel: "Presente de fim de ano",
            descriptionTemplate:
              "A coletânea vende bem como presente de quem não conhece a banda. {character1} autografa o encarte, que tem o mesmo título doze vezes.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Contagem",
            descriptionTemplate:
              "Um crítico conta as faixas e encontra o mesmo refrão trinta e seis vezes. A resenha tem o tamanho de um bilhete.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a coletânea",
        description:
          "Dizer à gravadora que o volume um espera a banda ter mais sucessos.",
        consequence: {
          resultLabel: "Outra coletânea",
          descriptionTemplate:
            "A gravadora engaveta a ideia e lança a coletânea de uma banda que acabou há dez anos. A capa dela também diz volume um.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Compor nove músicas novas até sexta",
        description:
          "[{character1}] Trancar-se no estúdio com café, um piano e o calendário.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Maratona",
            descriptionTemplate:
              "{character1} entrega nove músicas na sexta às onze da noite, e duas são boas de verdade. A coletânea vira o disco mais interessante da banda, com o título errado.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Teclas na bochecha",
            descriptionTemplate:
              "Na quinta-feira, {character1} dorme em cima do piano e acorda com as teclas marcadas no rosto. A gravadora completa o disco com sobras de estúdio.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0452-a-orquestra-de-sessenta",
    type: "decisao_criativa",
    title: "A orquestra de sessenta",
    descriptionTemplate:
      "A gravadora propõe regravar os sucessos da banda com uma orquestra sinfônica de sessenta músicos, para dar prestígio ao catálogo. O maestro já avisou que guitarra é um instrumento que ele tolera. {character1} adora a ideia; {character2} sente cheiro de disco caro e encalhado.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Gravar com a orquestra",
        description:
          "Sessenta músicos, três dias de estúdio e um maestro que conta o tempo da banda em voz alta.",
        consequence: [
          {
            resultLabel: "Prestígio",
            descriptionTemplate:
              "O disco sai suntuoso, e a banda passa a ser chamada de elegante por gente que nunca a tinha ouvido. {character2} admite que os violinos ajudam no refrão.",
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
            resultLabel: "Encalhe elegante",
            descriptionTemplate:
              "O disco sai suntuoso e caro, e encalha com a mesma elegância. O maestro manda flores para a gravadora e a conta para a banda.",
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
        label: "Recusar a orquestra",
        description: "O catálogo continua sem prestígio e sem dívida.",
        consequence: {
          resultLabel: "De smoking",
          descriptionTemplate:
            "A gravadora leva a ideia para outra banda, que aparece na televisão de smoking. {character1} assiste com o caderno de arranjos fechado no colo.",
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
        label: "Gravar uma música só, com quarteto de cordas",
        description:
          "Quatro músicos em vez de sessenta, e um quarto do prestígio.",
        consequence: [
          {
            resultLabel: "Na medida",
            descriptionTemplate:
              "A faixa com cordas vira a preferida das rádios de fim de noite. O maestro não participa, para alívio geral.",
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
            resultLabel: "Inaudível",
            descriptionTemplate:
              "O quarteto soa tímido diante da bateria, e ninguém nota que ele existe. A gravadora paga quatro músicos para não serem ouvidos.",
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
        label: "Ligar a orquestra nos amplificadores",
        description:
          "[{character1}] Plugar os violinos nos amplificadores da banda e pedir ao maestro que reja com distorção.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Vanguarda",
            descriptionTemplate:
              "O resultado assusta o maestro e encanta a crítica, que usa a palavra ousadia pela primeira vez sobre a banda. Os violinistas pedem cópias.",
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
            resultLabel: "Motim",
            descriptionTemplate:
              "Os sessenta músicos se recusam a continuar depois do primeiro chiado, e o maestro sai segurando a batuta como prova. A gravadora cobra os três dias inteiros.",
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
    ],
  },
  {
    id: "0453-oito-palavras",
    type: "decisao_criativa",
    title: "Oito palavras",
    descriptionTemplate:
      "Quarenta artistas famosos vão gravar juntos uma canção beneficente, um verso para cada um, com fotógrafo no estúdio o dia inteiro. A banda ganhou oito palavras, e {character1} e {character2} querem cantar todas.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dar o verso a {character1}",
        description: "Escolher pela voz e aguentar o silêncio de quem sobrou.",
        consequence: {
          resultLabel: "Todas as fotos",
          descriptionTemplate:
            "{character1} canta as oito palavras e sai em todas as fotos da gravação. {character2} aparece numa só, ao fundo, carregando um pedestal.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
          happinessChangePercent: 0,
        },
      },
      {
        label: "Dar o verso a {character2}",
        description:
          "Escolher pela vez e aguentar a cara de {character1} no estúdio.",
        consequence: [
          {
            resultLabel: "Bis",
            descriptionTemplate:
              "{character2} canta o verso com uma emoção que surpreende o produtor, que pede para repetir. {character1} aplaude, por causa dos fotógrafos.",
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
            resultLabel: "Sexta palavra",
            descriptionTemplate:
              "{character2} desafina na sexta palavra, e o produtor regrava o verso com outro artista. A banda vira uma voz no coro.",
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
        label: "Ficar fora e doar o cachê do próximo show",
        description:
          "Mandar o dinheiro para a causa e deixar o fotógrafo para os outros.",
        consequence: {
          resultLabel: "Doação sem foto",
          descriptionTemplate:
            "A doação chega, e ninguém fotografa. A canção sai com trinta e nove artistas e um silêncio de oito palavras que só a banda percebe.",
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
        label: "Propor que os dois cantem juntos",
        description:
          "[{character2}] Dividir as oito palavras, quatro para cada um, com harmonia no fim.",
        visibleIfCharacterHas: [[], ["conciliator"]],
        consequence: [
          {
            resultLabel: "Harmonia",
            descriptionTemplate:
              "O produtor gosta da harmonia, e o verso dos dois vira o trecho mais comentado da canção. A causa também arrecada, segundo dizem.",
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
            resultLabel: "Quatro a mais",
            descriptionTemplate:
              "{character1} canta as quatro primeiras palavras e não para nas quatro seguintes. {character2} descobre que conciliar dá trabalho só para um lado.",
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
    ],
  },
  {
    id: "0454-a-musica-do-sobrinho",
    type: "decisao_criativa",
    title: "A música do sobrinho",
    descriptionTemplate:
      'O presidente da gravadora tem um sobrinho que compõe, e a gravadora quer a música dele como próximo single de {character1}. A letra rima "amor" com "amor" quatro vezes, e o presidente chama isso de identidade.',
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 1,
    options: [
      {
        label: "Gravar a música do sobrinho",
        description:
          'Agradar o presidente e cantar "amor" com convicção, quatro vezes.',
        consequence: [
          {
            resultLabel: "Single de família",
            descriptionTemplate:
              "A gravadora põe todo o orçamento de divulgação na música, e ela toca no rádio até as rimas parecerem intencionais. O sobrinho ganha um escritório.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Rima repetida",
            descriptionTemplate:
              "A crítica cita a letra inteira, e não por admiração. {character1} passa a semana explicando nas entrevistas que não escreveu aquilo.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a música",
        description: "Dizer não ao sobrenome mais importante da gravadora.",
        consequence: {
          resultLabel: "Divulgação cortada",
          descriptionTemplate:
            "O presidente aceita a recusa sorrindo, e o próximo disco de {character1} sai com metade da divulgação. O sobrinho grava a música por conta própria, e ela vende mais.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Reescrever a letra junto com o sobrinho",
        description:
          "Uma tarde de parceria, com crédito dividido e o presidente de olho.",
        consequence: [
          {
            resultLabel: "Parceria",
            descriptionTemplate:
              'A letra nova rima "amor" com outras palavras, e o sobrinho descobre que elas existem. A música sai assinada pelos dois, com o nome do sobrinho na frente.',
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Sobrinho ofendido",
            descriptionTemplate:
              'O sobrinho defende cada um dos quatro "amores" e reclama com o tio. {character1} recebe uma ligação do presidente num domingo de manhã.',
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Perguntar ao presidente qual música é melhor",
        description:
          "[{character1}] Pedir, com franqueza, que o presidente compare a música do sobrinho com as de {character1}.",
        visibleIfCharacterHas: [["insecure"]],
        consequence: [
          {
            resultLabel: "Meia frase",
            descriptionTemplate:
              "O presidente olha para o teto e diz que as de {character1} são melhores, mas que o sobrinho é da família. {character1} decide guardar só a primeira metade da frase.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Sinceridade",
            descriptionTemplate:
              "O presidente responde com sinceridade, coisa que ninguém na gravadora tinha feito antes. {character1} passa o semestre reouvindo os próprios discos atrás de rimas repetidas.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0455-o-bau-da-gravadora",
    type: "decisao_criativa",
    title: "O baú da gravadora",
    descriptionTemplate:
      "A gravadora encontrou no arquivo as primeiras gravações da banda, feitas numa garagem, e quer lançar uma edição de colecionador. Numa faixa, {character1} esquece a letra no meio e a banda segue assim mesmo; noutra, dá para ouvir {character2} pedindo pizza.",
    minFanCount: 100001,
    maxFanCount: 2000000,
    requiredCharacters: 2,
    options: [
      {
        label: "Lançar tudo como está",
        description: "A história da banda sem retoque, com pizza e tudo.",
        consequence: [
          {
            resultLabel: "Relíquia",
            descriptionTemplate:
              "Os fãs adoram a edição e decoram até o pedido da pizza. A crítica chama o disco de documento histórico, com respeito e alguma pena.",
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
            resultLabel: "Programa de humor",
            descriptionTemplate:
              "A edição vende pouco e toca muito, sempre nos programas de humor do rádio. {character1} ouve o próprio esquecimento dentro de um táxi.",
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
        label: "Lançar só as faixas apresentáveis",
        description: "Cortar o esquecimento e a pizza. Sobram quatro músicas.",
        consequence: {
          resultLabel: "Encarte grosso",
          descriptionTemplate:
            "A edição de colecionador sai com quatro faixas e um encarte de vinte páginas para compensar. Os colecionadores compram por obrigação.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Comprar as gravações e trancar",
        description: "Pagar à gravadora para que o baú continue fechado.",
        consequence: {
          resultLabel: "Cofre",
          descriptionTemplate:
            "A banda compra as gravações com o dinheiro do semestre e guarda tudo num cofre. {character2} fica com a chave, e com o poder.",
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
        label: "Regravar o baú inteiro numa noite",
        description:
          "[{character1}] Juntar a banda no estúdio e regravar cada faixa antiga do jeito que lembrar.",
        visibleIfCharacterHas: [["erratic"]],
        consequence: [
          {
            resultLabel: "Noite inspirada",
            descriptionTemplate:
              "Numa noite rara, {character1} lembra de cada letra e de uma que nunca existiu. A edição sai com as duas versões, e a nova é melhor.",
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
            resultLabel: "Mesmo verso",
            descriptionTemplate:
              "{character1} esquece a letra exatamente no mesmo verso da gravação antiga. A gravadora lança as duas lado a lado, como prova de coerência.",
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
    ],
  },
];
