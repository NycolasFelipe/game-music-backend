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
      "O vizinho bate na porta da garagem pela terceira vez. {character1} quer continuar no volume máximo; {character2} quer baixar antes que chamem a polícia.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Baixar o volume",
        description: "Ensaiar baixinho, nem que a bateria vire almofada.",
        consequence: {
          resultLabel: "Paz na rua",
          descriptionTemplate:
            "O vizinho agradece, e {character1} passa o ensaio inteiro reclamando que não se ouve nada.",
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
              "O vizinho desiste, e no dia seguinte o filho dele aparece pedindo para assistir.",
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
              "A polícia aparece, o ensaio acaba e {character2} diz que avisou.",
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
        description: "Ensaiar no salão da igreja, na escola ou onde der.",
        consequence: {
          resultLabel: "Casa nova",
          descriptionTemplate:
            "O salão emprestado tem eco, mas ninguém reclama do barulho.",
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
          "[{character1}] Bater na porta dele com uma cadeira e um convite.",
        visibleIfAnyInvolvedHas: ["friendly"],
        consequence: [
          {
            resultLabel: "Primeiro fã",
            descriptionTemplate:
              "O vizinho senta, cruza os braços e, na terceira música, está batendo o pé.",
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
              "O vizinho assiste e diz que o problema nunca foi o volume.",
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
      "Às vésperas da primeira apresentação, {character1} quer mudar o nome da banda. {character2} já pintou o nome antigo no bumbo.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o nome",
        description: "O bumbo está pintado. Assunto encerrado.",
        consequence: {
          resultLabel: "Decidido",
          descriptionTemplate:
            "O nome fica, e {character1} jura que um dia vai mudar.",
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
        description: "Melhor agora do que depois de famosos.",
        consequence: {
          resultLabel: "Tinta nova",
          descriptionTemplate:
            "{character2} passa a noite raspando o bumbo, de cara fechada.",
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
        description: "Cada um escreve um nome num papel.",
        consequence: [
          {
            resultLabel: "Nome novo, por unanimidade",
            descriptionTemplate:
              "Surge um nome que agrada a todo mundo, e até {character2} ri.",
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
              "A votação empata e a discussão vai até a madrugada.",
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
          "[{character1}] Sugerir um nome absurdo que só a banda entende.",
        visibleIfAnyInvolvedHas: ["playful"],
        consequence: [
          {
            resultLabel: "Pegou",
            descriptionTemplate:
              "O nome é tão estranho que ninguém esquece depois do primeiro show.",
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
              "O apresentador do bar pronuncia o nome errado três vezes.",
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
      "A tia de {character1} chama a banda para tocar nos 60 anos dela. {character2} acha que festa de família é o fim da linha.",
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
              "Os primos adoram, e metade da família pede para avisar do próximo show.",
            fanCountChangeAbsolute: 10,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Pedem outra coisa",
            descriptionTemplate:
              "A tia pede para trocar por algo que dê para dançar.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar os pedidos da família",
        description: "Clássicos de casamento, do início ao fim.",
        consequence: {
          resultLabel: "Pista cheia",
          descriptionTemplate:
            "A família dança a noite toda, e {character2} toca olhando para o chão.",
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
          "{character1} explica para a tia que a banda não faz festa.",
        consequence: {
          resultLabel: "Tia magoada",
          descriptionTemplate: "A tia não fala com {character1} até o Natal.",
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
            "A tia canta, a família chora e todo mundo quer o contato da banda.",
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
      'O jornalzinho do bairro quer uma entrevista com {character1} para a coluna "Talentos da rua".',
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
            "A nota sai pequena, mas os vizinhos começam a perguntar da banda.",
          fanCountChangeAbsolute: 5,
          happinessChangePercent: 4,
        },
      },
      {
        label: "Prometer o mundo",
        description:
          "[{character1}] Dizer que a banda vai ser a maior do país.",
        consequence: [
          {
            resultLabel: "Curiosidade",
            descriptionTemplate:
              "A frase vira manchete do jornalzinho e muita gente quer ver quem disse isso.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Piada do bairro",
            descriptionTemplate: "A frase vira piada na padaria por semanas.",
            fanCountChangeAbsolute: -2,
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar",
        description: "Primeiro a banda fica boa, depois dá entrevista.",
        consequence: {
          resultLabel: "Discrição",
          descriptionTemplate: "O jornal entrevista o padeiro no lugar.",
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
            resultLabel: "Misterioso(a)",
            descriptionTemplate:
              "O jornal publica a entrevista mais curta da história, e o bairro fica curioso.",
            fanCountChangeAbsolute: 6,
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Vergonha",
            descriptionTemplate: "{character1} lê a entrevista e quer sumir.",
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
      "Um bar oferece à banda uma segunda-feira à noite, sem cachê. {character1} quer aceitar; {character2} acha que a banda ainda não está pronta.",
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
              "Doze pessoas assistem, e onze voltam no show seguinte.",
            fanCountChangeAbsolute: 12,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Bar vazio",
            descriptionTemplate: "A banda toca para o barman e um cachorro.",
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
            "O bar promete chamar de novo, e {character1} acha que não vai chamar.",
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
        description: "Se o bar vai estar vazio, a banda leva a plateia.",
        consequence: {
          resultLabel: "Casa de amigos",
          descriptionTemplate:
            "Os amigos lotam o bar numa segunda-feira, e o dono oferece uma sexta.",
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
            "A banda chega à segunda-feira tocando como se fosse sábado.",
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
      "Arrumando o quarto, {character1} encontra um caderno com músicas que escreveu aos quinze anos.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Mostrar para a banda",
        description: "[{character1}] Ler as letras em voz alta no ensaio.",
        consequence: [
          {
            resultLabel: "Pérola",
            descriptionTemplate: "Uma das músicas vira a melhor do repertório.",
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
            "A música ganha letra nova e entra no repertório.",
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
            "O caderno volta para a gaveta, e ninguém fica sabendo.",
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
              "A banda adora, e {character1} finalmente confessa quem escreveu.",
            fanCountChangeAbsolute: 5,
            happinessChangePercent: 10,
            chance: 60,
          },
          {
            resultLabel: "O amigo que lute",
            descriptionTemplate: 'A banda detona a música do "amigo" sem dó.',
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
];
