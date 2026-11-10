import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Universal templates for the "Garagem" fame phase (up to 150 fans,
 * ADR-0025): no trait requirement nor relationship bound; traits only unlock
 * an extra option. Fan effects are absolute, since a percentage of an almost
 * empty fan base would round to nothing.
 */
export const GARAGEM_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "0101-o-vizinho",
    type: "conflito_membros",
    title: "O vizinho",
    descriptionTemplate:
      "Terceira visita do vizinho esta noite, e ele não veio pedir autógrafo. {character1} defende que arte não tem volume; {character2} lembra que a polícia tem.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Baixar o volume",
        description:
          "Ensaiar baixinho. O rock sobrevive; a dignidade, a gente vê depois.",
        consequence: {
          resultLabel: "Paz na rua",
          descriptionTemplate:
            "O vizinho agradece. {character1} passa o ensaio reclamando que a banda agora soa como música de elevador, só que pior.",
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
        label: "Continuar no talo",
        description: "Rock não se ensaia de pantufas.",
        consequence: [
          {
            resultLabel: "Ele desistiu",
            descriptionTemplate:
              "O vizinho desiste. O filho dele aparece no dia seguinte querendo assistir, provavelmente só para irritar o pai. Fã é fã.",
            fanCountChangeAbsolute: 3,
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
            resultLabel: "Polícia",
            descriptionTemplate:
              "A polícia encerra o ensaio: primeira plateia que a banda não conseguiu conquistar. {character2} faz questão de lembrar quem tinha avisado.",
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
        label: "Procurar outro lugar",
        description:
          "Salão da igreja, quadra da escola: qualquer lugar onde o barulho seja problema de outra pessoa.",
        consequence: {
          resultLabel: "Casa nova",
          descriptionTemplate:
            "O salão emprestado tem um eco que faz a banda soar duas vezes pior, mas pelo menos ninguém reclama.",
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
        label: "Convidar o vizinho para assistir",
        description:
          "[{character1}] Bater na porta dele com uma cadeira e um convite. O pior que pode acontecer é ele aceitar.",
        visibleIfAnyInvolvedHas: ["friendly"],
        consequence: [
          {
            resultLabel: "Primeiro fã",
            descriptionTemplate:
              "O vizinho senta de braços cruzados. Na terceira música, bate o pé. Na quarta, pede para tocarem mais baixo, sem parar de bater o pé.",
            fanCountChangeAbsolute: 8,
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
            resultLabel: "Crítico",
            descriptionTemplate:
              "O vizinho assiste até o fim e conclui que o problema nunca foi o volume. Vai embora antes do bis que ninguém pediu.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0102-o-nome-da-banda",
    type: "conflito_membros",
    title: "O nome da banda",
    descriptionTemplate:
      "A dois dias da primeira apresentação, {character1} decide que o nome da banda é constrangedor. {character2} até concorda, mas já pintou esse nome no bumbo, e tinta é para sempre.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o nome",
        description: "O bumbo já decidiu pela banda.",
        consequence: {
          resultLabel: "Decidido",
          descriptionTemplate:
            "O nome fica, e {character1} jura que um dia vai mudar. Toda banda famosa tem um integrante que jura isso.",
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
        label: "Mudar o nome",
        description:
          "Melhor mudar agora, enquanto ninguém conhece o nome antigo. Nem o novo.",
        consequence: {
          resultLabel: "Tinta nova",
          descriptionTemplate:
            "{character2} passa a noite raspando o bumbo e pensando em apelidos para {character1}, nenhum publicável.",
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
        label: "Votação com a banda toda",
        description:
          "Cada um escreve um nome num papel. A democracia, como sempre, vai decepcionar alguém.",
        consequence: [
          {
            resultLabel: "Nome novo, por unanimidade",
            descriptionTemplate:
              "Surge um nome que agrada a todo mundo, fato inédito na história da banda. Até {character2} ri.",
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
            resultLabel: "Empate",
            descriptionTemplate:
              "A votação empata, a recontagem empata de novo, e às três da manhã alguém sugere voltar ao nome antigo.",
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
        label: "Um nome que é piada interna",
        description:
          "[{character1}] Sugerir um nome absurdo que só a banda entende. Ninguém mais vai entender, e essa é a graça.",
        visibleIfAnyInvolvedHas: ["playful"],
        consequence: [
          {
            resultLabel: "Pegou",
            descriptionTemplate:
              "O nome é tão estranho que ninguém consegue esquecer, por mais que tente.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Ninguém entendeu",
            descriptionTemplate:
              "O apresentador do bar pronuncia o nome errado três vezes, cada vez de um jeito. O terceiro até que era melhor.",
            fanCountChangeAbsolute: -3,
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0103-festa-da-tia",
    type: "oportunidade_externa",
    title: "A festa da tia",
    descriptionTemplate:
      "A tia de {character1} chama a banda para tocar nos 60 anos dela. O cachê é bolo. {character2} acha que festa de família é onde as carreiras vão para morrer.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar o repertório da banda",
        description: "A festa é da tia, mas o show é da banda.",
        consequence: [
          {
            resultLabel: "Surpresa",
            descriptionTemplate:
              "Os primos adoram, e metade da família pede para ser avisada do próximo show. A outra metade pede mais bolo.",
            fanCountChangeAbsolute: 10,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Pedem outra coisa",
            descriptionTemplate:
              "Na segunda música, a tia pede educadamente algo que dê para dançar. Na terceira, menos educadamente.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar os pedidos da família",
        description:
          "Clássicos de casamento, do início ao fim. A arte pode esperar até depois do parabéns.",
        consequence: {
          resultLabel: "Pista cheia",
          descriptionTemplate:
            "A família dança a noite toda. {character2} toca olhando para o chão, como quem cumpre pena.",
          fanCountChangeAbsolute: 5,
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
        label: "Recusar",
        description:
          "{character1} explica para a tia que a banda não faz festa. A tia não entende o que mais uma banda faria.",
        consequence: {
          resultLabel: "Tia magoada",
          descriptionTemplate:
            "A tia não fala com {character1} até o Natal, e no Natal só fala disso.",
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
        label: "Chamar a tia para cantar",
        description:
          "[{character1}] Na hora do parabéns, entregar o microfone para a aniversariante.",
        visibleIfAnyInvolvedHas: ["romantic", "friendly"],
        consequence: {
          resultLabel: "Momento da noite",
          descriptionTemplate:
            "A tia canta, a família chora e todo mundo quer o contato da banda. A tia agora se considera integrante.",
          fanCountChangeAbsolute: 12,
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
    ],
  },
  {
    id: "0104-jornal-do-bairro",
    type: "oportunidade_externa",
    title: "O jornal do bairro",
    descriptionTemplate:
      'O jornalzinho do bairro quer uma entrevista com {character1} para a coluna "Talentos da rua", logo abaixo dos anúncios de cachorro perdido.',
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Falar da banda",
        description:
          "[{character1}] Contar como a banda começou e quando é o próximo show.",
        consequence: {
          resultLabel: "Divulgação",
          descriptionTemplate:
            "A nota sai do tamanho de um selo, mas os vizinhos começam a perguntar da banda. Alguns, sem reclamar do barulho.",
          fanCountChangeAbsolute: 5,
          happinessChangePercent: 4,
        },
      },
      {
        label: "Prometer o mundo",
        description:
          "[{character1}] Dizer que a banda vai ser a maior do país. Modéstia é para quem já fez sucesso.",
        consequence: [
          {
            resultLabel: "Curiosidade",
            descriptionTemplate:
              "A frase vira manchete, e muita gente aparece no show só para ver quem teve coragem de dizer isso.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Piada do bairro",
            descriptionTemplate:
              'A frase vira piada na padaria por semanas. O padeiro passa a chamar {character1} de "a maior do país".',
            fanCountChangeAbsolute: -2,
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar",
        description:
          "Primeiro a banda fica boa, depois dá entrevista. Pode demorar.",
        consequence: {
          resultLabel: "Discrição",
          descriptionTemplate:
            "O jornal entrevista o padeiro no lugar. A coluna faz sucesso.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Responder com monossílabos",
        description:
          "[{character1}] Travar diante do gravador e responder tudo com uma palavra.",
        visibleIfAnyInvolvedHas: ["shy", "insecure"],
        consequence: [
          {
            resultLabel: "{character1:Misterioso|Misteriosa|Mistério}",
            descriptionTemplate:
              "O jornal publica a entrevista mais curta da história do bairro. O mistério vende melhor que qualquer resposta.",
            fanCountChangeAbsolute: 6,
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Vergonha",
            descriptionTemplate:
              '{character1} lê a entrevista publicada e descobre que "sim", "não" e "talvez" não formam uma personalidade.',
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0105-a-segunda-feira",
    type: "decisao_criativa",
    title: "A segunda-feira",
    descriptionTemplate:
      "Um bar oferece à banda uma segunda-feira à noite, sem cachê, num horário em que nem o dono aparece. {character1} quer aceitar; {character2} acha que a banda ainda não está pronta.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar",
        description: "Ninguém fica pronto ensaiando na garagem para sempre.",
        consequence: [
          {
            resultLabel: "Batismo",
            descriptionTemplate:
              "Doze pessoas assistem, e onze voltam no show seguinte. A décima segunda era o barman.",
            fanCountChangeAbsolute: 12,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Bar vazio",
            descriptionTemplate:
              "A banda toca para o barman e um cachorro. O cachorro sai no meio.",
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
        label: "Ensaiar mais um mês",
        description: "Recusar agora e pedir uma data mais para frente.",
        consequence: {
          resultLabel: "Paciência",
          descriptionTemplate:
            "O bar promete chamar de novo, com a convicção de quem nunca vai chamar.",
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
        label: "Aceitar e chamar todos os amigos",
        description:
          "Se o bar vai estar vazio, a banda leva a plateia de casa.",
        consequence: {
          resultLabel: "Casa de amigos",
          descriptionTemplate:
            "Os amigos lotam o bar numa segunda-feira e bebem como se fosse sexta. O dono oferece uma sexta.",
          fanCountChangeAbsolute: 7,
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
        label: "Ensaiar o repertório três vezes por dia",
        description:
          "[{character2}] Aceitar, mas só se a semana inteira for de ensaio.",
        visibleIfCharacterHas: [[], ["workaholic", "perfectionist"]],
        consequence: {
          resultLabel: "Afiados",
          descriptionTemplate:
            "A banda chega à segunda-feira tocando como se fosse sábado, e com a cara de quem não dorme desde quinta.",
          fanCountChangeAbsolute: 10,
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
    ],
  },
  {
    id: "0106-o-caderno-antigo",
    type: "decisao_criativa",
    title: "O caderno antigo",
    descriptionTemplate:
      'Arrumando o quarto, {character1} encontra um caderno com músicas que escreveu aos quinze anos, época em que tudo rimava com "coração".',
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Mostrar para a banda",
        description: "[{character1}] Ler as letras em voz alta no ensaio.",
        consequence: [
          {
            resultLabel: "Pérola",
            descriptionTemplate:
              "Uma das músicas vira a melhor do repertório, o que diz muito sobre o resto do repertório.",
            fanCountChangeAbsolute: 6,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Gargalhadas",
            descriptionTemplate: "A banda ri até chorar, e não é de emoção.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Reescrever uma delas",
        description:
          "[{character1}] Pegar a melhor ideia e reescrever com a cabeça de hoje.",
        consequence: {
          resultLabel: "Renovada",
          descriptionTemplate:
            'A música ganha letra nova e entra no repertório. O "coração" sai; a rima com "emoção" fica.',
          fanCountChangeAbsolute: 3,
          happinessChangePercent: 4,
        },
      },
      {
        label: "Guardar o caderno",
        description: "Algumas coisas ficam melhor na gaveta.",
        consequence: {
          resultLabel: "Gaveta",
          descriptionTemplate:
            "O caderno volta para a gaveta, de onde nunca deveria ter saído.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Dizer que é música de um amigo",
        description:
          "[{character1}] Mostrar as letras sem assumir a autoria, para ver a reação.",
        visibleIfAnyInvolvedHas: ["insecure", "paranoid"],
        consequence: [
          {
            resultLabel: "Aprovada",
            descriptionTemplate:
              'A banda adora, e {character1} finalmente confessa quem é o "amigo". Ninguém finge surpresa.',
            fanCountChangeAbsolute: 5,
            happinessChangePercent: 10,
            chance: 60,
          },
          {
            resultLabel: "O amigo que lute",
            descriptionTemplate:
              'A banda detona a música do "amigo" sem dó. {character1} concorda com cada crítica, por segurança.',
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
];
