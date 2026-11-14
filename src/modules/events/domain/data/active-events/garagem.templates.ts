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
              "O vizinho desiste. O filho dele aparece no dia seguinte querendo assistir, provavelmente só para irritar o pai.",
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
          "[{character1}] Sugerir um nome absurdo que só a banda entende, tirado de uma viagem que deu errado.",
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
              'O jornal publica a entrevista mais curta da história do bairro, e os vizinhos passam a semana tentando adivinhar o que {character1} quis dizer com "talvez".',
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
            descriptionTemplate:
              "A banda ri até chorar, e alguém pede bis só para rir de novo.",
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
        description:
          "Devolver o caderno à gaveta antes que alguém veja a capa.",
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
  {
    id: "0107-o-amplificador-emprestado",
    type: "conflito_membros",
    title: "O amplificador emprestado",
    descriptionTemplate:
      "{character2} emprestou o amplificador para {character1} por um fim de semana. Ele volta três semanas depois, com um chiado novo e cheiro de churrasco.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar o conserto de {character1}",
        description: "Quem quebra paga, inclusive o cheiro.",
        consequence: {
          resultLabel: "Conta paga",
          descriptionTemplate:
            "{character1} paga o conserto em moedas, contadas uma a uma na frente de {character2}, que conta junto.",
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
        label: "Deixar para lá",
        description:
          "Chiado se conserta. Amizade também, mas dá mais trabalho.",
        consequence: [
          {
            resultLabel: "Esquecido",
            descriptionTemplate:
              "{character2} leva o amplificador ao conserto e não toca mais no assunto. Só pensa nele, toda vez que sente cheiro de churrasco.",
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
            resultLabel: "Rancor guardado",
            descriptionTemplate:
              "{character2} diz que está tudo bem. Três ensaios depois, continua tudo bem, num tom que ninguém tem coragem de contrariar.",
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
        label: "Emprestar de novo, sem cobrar nada",
        description:
          "[{character2}] Emprestar o amplificador outra vez, já consertado, como prova de confiança.",
        visibleIfCharacterHas: [[], ["loyal"]],
        consequence: [
          {
            resultLabel: "Confiança",
            descriptionTemplate:
              "{character1} devolve o amplificador no domingo, limpo e sem chiado. O cheiro de churrasco continua, agora com um toque de pastel.",
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
            resultLabel: "De novo",
            descriptionTemplate:
              "O amplificador volta com dois chiados e um cheiro novo, que ninguém consegue identificar.",
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
    id: "0108-a-chave-da-garagem",
    type: "conflito_membros",
    title: "A chave da garagem",
    descriptionTemplate:
      "A garagem é emprestada, a chave é uma só, e {character1} perdeu. A banda está na calçada com os instrumentos, e {character2} já ensaiou mentalmente o discurso para o dono.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Chamar um chaveiro",
        description:
          "Resolve em meia hora e custa o cachê dos próximos três shows, que ainda nem existem.",
        consequence: {
          resultLabel: "Porta aberta",
          descriptionTemplate:
            "O chaveiro abre a porta em quatro minutos e cobra por uma hora. {character1} paga e passa o ensaio fazendo contas de cabeça.",
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
        label: "Contar tudo ao dono da garagem",
        description: "A verdade, antes que o dono descubra por conta própria.",
        consequence: [
          {
            resultLabel: "Perdão",
            descriptionTemplate:
              "O dono tinha uma cópia na gaveta desde sempre. Só não contou porque ninguém perguntou.",
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
            resultLabel: "Fechadura nova",
            descriptionTemplate:
              "O dono troca a fechadura e guarda a chave nova no próprio bolso. A banda passa a ensaiar com hora marcada e supervisão.",
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
        label: "Ensaiar em outro lugar até a chave aparecer",
        description:
          "A sala de alguém, o quintal de alguém, qualquer lugar com tomada.",
        consequence: {
          resultLabel: "Sem casa",
          descriptionTemplate:
            "A banda ensaia na sala da avó de alguém, cercada de bibelôs de porcelana, com o volume no mínimo e os cotovelos colados ao corpo.",
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
        label: "Refazer o caminho do dia inteiro atrás da chave",
        description:
          "[{character1}] Voltar a cada lugar por onde passou, na ordem, ou quase.",
        visibleIfCharacterHas: [["erratic"]],
        consequence: [
          {
            resultLabel: "Achou",
            descriptionTemplate:
              "A chave estava na geladeira, ao lado da manteiga. {character1} não lembra de ter aberto a geladeira, e ninguém quer saber mais.",
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
            resultLabel: "Achou outra coisa",
            descriptionTemplate:
              "{character1} não acha a chave, mas acha o afinador que tinha perdido no ano passado. A banda continua na calçada, agora afinada.",
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
    ],
  },
  {
    id: "0109-o-turno-da-noite",
    type: "conflito_membros",
    title: "O turno da noite",
    descriptionTemplate:
      "{character1} arrumou emprego numa fábrica, no turno da noite, bem no horário do ensaio. {character2} acha que a banda vem antes do salário; {character1} lembra que a banda nunca pagou um.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Mudar o ensaio para de manhã",
        description:
          "Ensaiar às oito da manhã, horário em que o rock ainda está dormindo.",
        consequence: {
          resultLabel: "Ensaio matinal",
          descriptionTemplate:
            "O ensaio muda de horário. {character1} chega direto da fábrica e toca de olhos fechados, nem sempre por emoção.",
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
        label: "Exigir que {character1} escolha entre a banda e o emprego",
        description:
          "Pôr a escolha na mesa, na frente da banda, e torcer para a fábrica perder.",
        consequence: [
          {
            resultLabel: "Fica na banda",
            descriptionTemplate:
              "{character1} pede demissão e aparece no ensaio seguinte com o uniforme da fábrica, por falta de outra camisa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 2,
            chance: 40,
          },
          {
            resultLabel: "Fica na fábrica",
            descriptionTemplate:
              "{character1} escolhe o salário e passa a aparecer só nos shows, sem ensaiar. Ninguém percebe a diferença, o que magoa mais.",
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
        label: "Ensaiar sem {character1} durante a semana",
        description:
          "Os outros ensaiam; {character1} aprende o resto de ouvido.",
        consequence: {
          resultLabel: "Banda em turnos",
          descriptionTemplate:
            "A banda ensaia sem {character1} e acelera metade das músicas. {character1} descobre isso no show.",
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
        label: "Trabalhar de noite e ensaiar de dia",
        description: "[{character1}] Dormir é para quem não tem banda.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Máquina",
            descriptionTemplate:
              "{character1} não falta a nenhum ensaio e não dorme desde terça. Toca melhor do que nunca e responde perguntas que ninguém fez.",
            fanCountChangeAbsolute: 3,
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
            resultLabel: "Apagão",
            descriptionTemplate:
              "{character1} cochila no meio do refrão, com o instrumento no colo. A banda termina a música em respeito ao sono alheio.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0110-a-garagem-alugada",
    type: "conflito_membros",
    title: "A garagem alugada",
    descriptionTemplate:
      "A família de {character1}, dona da garagem, recebeu uma proposta: um vizinho quer alugar o espaço para guardar o carro, e paga em dia. {character2} quer que {character1} defenda a banda em casa; {character1} conhece a própria família.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar um aluguel à família",
        description: "Se o carro paga, a banda também pode pagar. Em tese.",
        consequence: {
          resultLabel: "Inquilinos",
          descriptionTemplate:
            "A banda junta o aluguel do primeiro mês. Do segundo mês ninguém fala ainda.",
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
        label: "Pedir que {character1} enfrente a família",
        description: "Uma conversa franca no almoço de domingo.",
        consequence: [
          {
            resultLabel: "Vitória em casa",
            descriptionTemplate:
              'A família cede, mas passa a chamar os ensaios de "aquele barulho que custou um aluguel". O nome pega.',
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
            resultLabel: "Derrota em casa",
            descriptionTemplate:
              "{character1} perde a discussão antes da sobremesa. O carro do vizinho entra na terça, e a bateria vai para o quintal.",
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
        label: "Dividir a garagem com o carro",
        description: "O carro dorme lá; a banda ensaia em volta.",
        consequence: {
          resultLabel: "Vizinho de ensaio",
          descriptionTemplate:
            "A banda ensaia espremida entre o carro e a parede. O retrovisor vira estante de partitura.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Convencer a família de que o carro estraga a garagem",
        description:
          "[{character1}] Mencionar no jantar a umidade, o óleo no piso e um incêndio que talvez tenha acontecido em algum lugar.",
        visibleIfCharacterHas: [["manipulator"]],
        consequence: [
          {
            resultLabel: "Convencidos",
            descriptionTemplate:
              "A família recusa o aluguel e agradece a {character1} pelo alerta. O vizinho continua guardando o carro na rua, onde ele sempre esteve seguro.",
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
            resultLabel:
              "{character1:Desmascarado|Desmascarada|Farsa descoberta}",
            descriptionTemplate:
              "O vizinho é bombeiro e desmonta cada argumento no portão. A família aluga a garagem e ainda pede desculpas a ele em nome de {character1}.",
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
    id: "0111-a-plateia-de-uma-pessoa",
    type: "conflito_membros",
    title: "A plateia de uma pessoa",
    descriptionTemplate:
      "{character1} leva a pessoa com quem namora a todos os ensaios. Ela senta no banquinho, opina sobre os arranjos e já sugeriu tirar {character2} de duas músicas.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Proibir visitas nos ensaios",
        description:
          "Ensaio fechado, como nos grandes estúdios. Sem os grandes estúdios.",
        consequence: {
          resultLabel: "Portas fechadas",
          descriptionTemplate:
            "As visitas acabam. {character1} passa a sair do ensaio meia hora mais cedo, sempre com uma desculpa diferente.",
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
        label: "Deixar como está",
        description:
          "Uma opinião de fora nunca fez mal a nenhuma banda que ainda existe.",
        consequence: [
          {
            resultLabel: "Boa ideia",
            descriptionTemplate:
              "Uma das sugestões funciona, e a música melhora. {character2} admite em voz baixa, para não criar precedente.",
            fanCountChangeAbsolute: 2,
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
            resultLabel: "Mais uma música a menos",
            descriptionTemplate:
              "As sugestões continuam, agora anotadas num caderno. {character2} sai de mais uma música e começa a ensaiar a cara de quem não se importa.",
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
        label: "Dar um trabalho à visita",
        description:
          "Quem fica no ensaio carrega cabo, segura lanterna ou passa o café.",
        consequence: {
          resultLabel: "Contratação",
          descriptionTemplate:
            "A visita vira a primeira roadie da banda e para de opinar por falta de tempo. O café melhora muito.",
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
        label: "Levar a própria companhia aos ensaios",
        description:
          "[{character2}] Se é para ter plateia, que seja uma plateia de duas pessoas.",
        visibleIfCharacterHas: [[], ["jealous"]],
        consequence: [
          {
            resultLabel: "Plateia dupla",
            descriptionTemplate:
              "As duas visitas se dão bem e passam o ensaio conversando, de costas para a banda. Pela primeira vez, ninguém opina.",
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
              "As visitas disputam quem tem a opinião mais forte sobre o refrão. A banda ensaia como trilha sonora da discussão.",
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
    id: "0112-o-metronomo",
    type: "conflito_membros",
    title: "O metrônomo",
    descriptionTemplate:
      "{character2} aparece no ensaio com um metrônomo e o põe ao lado de {character1}, que acelera todas as músicas. {character1} diz que música precisa respirar; o metrônomo discorda, sessenta vezes por minuto.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Ensaiar uma semana com o metrônomo",
        description: "Uma semana de tique-taque. Quem acelerar paga o lanche.",
        consequence: [
          {
            resultLabel: "No tempo",
            descriptionTemplate:
              "A banda passa a tocar junta, coisa rara. {character1} admite que o metrônomo ajuda e nunca mais olha para ele.",
            fanCountChangeAbsolute: 3,
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
            resultLabel: "Guerra ao aparelho",
            descriptionTemplate:
              "{character1} pisa no metrônomo sem querer, duas vezes, no mesmo lugar.",
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
        label: "Guardar o metrônomo",
        description:
          "A banda decide que o tempo certo é o tempo de {character1}.",
        consequence: {
          resultLabel: "Pressa",
          descriptionTemplate:
            "O show seguinte dura doze minutos a menos que o ensaio. O público agradece sem saber o motivo.",
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
        label: "Deixar {character1} puxar o andamento",
        description: "Se é para acelerar, que a banda acelere junta.",
        consequence: {
          resultLabel: "Corrida",
          descriptionTemplate:
            "A banda inteira acelera junto e, pela primeira vez, termina as músicas ao mesmo tempo, dois minutos antes do previsto.",
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
        label: "Escrever o andamento de cada música no repertório",
        description:
          "[{character2}] Pôr um número ao lado de cada título e conferir música por música.",
        visibleIfCharacterHas: [[], ["professional"]],
        consequence: {
          resultLabel: "Por escrito",
          descriptionTemplate:
            "O repertório ganha números ao lado de cada título. {character1} ignora todos, mas agora com culpa, e a culpa desacelera.",
          fanCountChangeAbsolute: 2,
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
    id: "0113-o-solo-de-sete-minutos",
    type: "conflito_membros",
    title: "O solo de sete minutos",
    descriptionTemplate:
      "O solo de {character1} cresce a cada ensaio e já passou dos sete minutos. {character2} cronometrou e garante que dá para comprar pão e voltar, contando a fila.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Cortar o solo para um minuto",
        description: "Sessenta segundos de glória, como todo mundo.",
        consequence: {
          resultLabel: "Tesoura",
          descriptionTemplate:
            "{character1} aceita e toca o minuto inteiro com a cara de quem cumpre pena. O público nunca soube do que escapou.",
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
        label: "Manter os sete minutos",
        description: "Arte não se mede no relógio. O público, sim.",
        consequence: [
          {
            resultLabel: "Fã único",
            descriptionTemplate:
              "Na estreia, um senhor no fundo do bar aplaude o solo inteiro de pé. Vira o primeiro fã de {character1}, e o único.",
            fanCountChangeAbsolute: 4,
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
            resultLabel: "Êxodo",
            descriptionTemplate:
              "No quarto minuto, metade da plateia vai ao banheiro; no sexto, a outra metade vai embora. {character2} mostra o cronômetro sem dizer nada.",
            fanCountChangeAbsolute: -3,
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
        label: "Dividir o tempo em dois solos",
        description:
          "{character1} e {character2} solam três minutos e meio cada, cronometrados por {character2}.",
        consequence: {
          resultLabel: "Duelo",
          descriptionTemplate:
            "O duelo vira o momento mais longo do show e o mais animado. Ninguém sabe quem venceu, mas cada solista tem certeza.",
          fanCountChangeAbsolute: 3,
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
        label: "Anunciar o solo como atração principal",
        description:
          "[{character1}] Pôr o solo no cartaz, com o próprio nome em letras maiores que as da banda.",
        visibleIfCharacterHas: [["individualist"]],
        consequence: [
          {
            resultLabel: "Curiosidade",
            descriptionTemplate:
              "Aparece gente só para ver o solo anunciado, e essa gente fica para o resto do show, por educação.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Cartaz riscado",
            descriptionTemplate:
              "{character2} risca o nome de {character1} em todos os cartazes da rua, um por um, com a mesma caneta.",
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
    id: "0114-a-vaquinha",
    type: "conflito_membros",
    title: "A vaquinha",
    descriptionTemplate:
      "A banda junta dinheiro todo mês para cordas e peles de bateria. {character2} cuida do caixa num caderno de capa dura e anota que {character1} não paga há três meses, com os juros calculados a lápis.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar {character1} na frente da banda",
        description:
          "Leitura pública do caderno, em voz alta, página por página.",
        consequence: [
          {
            resultLabel: "Pagou",
            descriptionTemplate:
              "{character1} paga tudo em notas amassadas e exige recibo. {character2} faz o recibo, com carimbo improvisado.",
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
            resultLabel: "Escândalo",
            descriptionTemplate:
              "{character1} diz que contribuiu com ideias, que não compram corda. A discussão dura mais que o ensaio.",
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
        label: "Perdoar a dívida",
        description: "Recomeçar do zero, menos para quem pagou em dia.",
        consequence: {
          resultLabel: "Anistia",
          descriptionTemplate:
            "A dívida some do caderno. Os outros, que pagavam em dia, passam a esquecer também.",
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
        label: "Deixar {character1} pagar em trabalho",
        description:
          "Carregar equipamento, limpar a garagem, trocar as cordas de todo mundo.",
        consequence: {
          resultLabel: "Mão de obra",
          descriptionTemplate:
            "{character1} quita a dívida carregando caixas por um mês e descobre que pagar em dinheiro saía mais barato.",
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
        label: "Cobrar juros pelo atraso",
        description:
          "[{character2}] Aplicar a tabela de juros do caderno, inclusive a parte inventada.",
        visibleIfCharacterHas: [[], ["greedy"]],
        consequence: [
          {
            resultLabel: "Caixa cheio",
            descriptionTemplate:
              "{character1} paga com juros, e o caixa da banda nunca esteve tão cheio. {character2} compra um caderno novo, maior.",
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
            resultLabel: "Calote",
            descriptionTemplate:
              "{character1} se recusa a pagar juros a quem toca na mesma banda. O caderno ganha uma página só para a dívida e outra para o ressentimento.",
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
    id: "0115-o-irmao-cacula",
    type: "conflito_membros",
    title: "O irmão caçula",
    descriptionTemplate:
      "O irmão caçula de {character1} quer entrar na banda tocando pandeiro. Ele tem doze anos e um pandeiro novo. {character2} diz que a banda não é creche; {character1} diz que a mãe mandou.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o caçula na banda",
        description: "Mais um integrante na banda, menos um problema em casa.",
        consequence: [
          {
            resultLabel: "Mascote",
            descriptionTemplate:
              "O caçula toca direito e leva a turma da escola aos shows. A plateia da banda passa a ter hora para ir embora.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Fora do tempo",
            descriptionTemplate:
              "O pandeiro entra em todas as músicas, inclusive nas que não têm pandeiro. {character2} começa a ensaiar com algodão nos ouvidos.",
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
        label: "Recusar o caçula",
        description: "A banda tem regras: idade mínima e nenhum pandeiro.",
        consequence: {
          resultLabel: "Porta fechada",
          descriptionTemplate:
            "O caçula passa a ensaiar no quarto ao lado, mais alto que a banda. {character1} ouve sobre o assunto em todo jantar até o fim do ano.",
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
        label: "Deixar o caçula tocar em uma música por show",
        description: "A última do repertório, perto da hora de dormir.",
        consequence: {
          resultLabel: "Participação especial",
          descriptionTemplate:
            "O número do caçula vira o mais aplaudido do show. A banda prefere não pensar muito nisso.",
          fanCountChangeAbsolute: 4,
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
        label: "Dar ao caçula um cargo fora do palco",
        description:
          "[{character1}] Nomear o irmão responsável pelos cabos, pela água e pelo pandeiro dos outros.",
        visibleIfCharacterHas: [["conciliator"]],
        consequence: {
          resultLabel: "Primeiro funcionário",
          descriptionTemplate:
            "O caçula aceita o cargo, ganha um crachá desenhado à mão e leva o trabalho mais a sério que a banda.",
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
    id: "0116-as-camisetas",
    type: "conflito_membros",
    title: "As camisetas",
    descriptionTemplate:
      "{character1} gastou o caixa da banda em cinquenta camisetas com o nome da banda. Saíram com uma letra trocada, e quem percebe é {character2}, na hora de vender a primeira.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Vender as camisetas assim mesmo",
        description:
          "Erro de impressão vira item de colecionador se a banda ficar famosa. Se não, vira pano de chão.",
        consequence: [
          {
            resultLabel: "Esgotadas",
            descriptionTemplate:
              "As camisetas vendem, e meio bairro passa a chamar a banda pelo nome errado. Pelo menos chama.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Encalhadas",
            descriptionTemplate:
              "Vendem três, todas para parentes. As outras quarenta e sete viram o pijama oficial da banda pelos próximos anos.",
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
        label: "Cobrar o prejuízo de {character1}",
        description: "Quem encomendou paga, letra por letra.",
        consequence: {
          resultLabel: "Prejuízo",
          descriptionTemplate:
            "{character1} paga do próprio bolso e passa a usar uma camiseta errada por dia, em protesto.",
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
        label: "Mudar o nome da banda para o da camiseta",
        description:
          "Sai mais barato mudar a banda do que reimprimir as camisetas.",
        consequence: {
          resultLabel: "Rebatizada",
          descriptionTemplate:
            "A banda adota o nome com a letra trocada. Ele soa melhor que o original, e ninguém conta isso a {character1}.",
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
        label: "Usar a camiseta errada em todo lugar",
        description:
          "[{character1}] Vestir a camiseta no mercado, no ônibus e no trabalho, como se a banda fosse a mais famosa do bairro.",
        visibleIfCharacterHas: [["dazzled"]],
        consequence: [
          {
            resultLabel: "Propaganda ambulante",
            descriptionTemplate:
              "Gente pergunta que banda é essa, e {character1} responde com o endereço do próximo show e uma pose ensaiada.",
            fanCountChangeAbsolute: 5,
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
            resultLabel: "Revisão ortográfica",
            descriptionTemplate:
              "O bairro inteiro aponta o erro para {character1} na rua, um vizinho de cada vez.",
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
    id: "0117-a-feira-da-escola",
    type: "oportunidade_externa",
    title: "A feira da escola",
    descriptionTemplate:
      "A escola onde {character1} estudou convida a banda para a feira de fim de ano: dez minutos entre o coral do terceiro ano e o sorteio de uma cesta de frutas. {character2} avisa que a plateia tem pais, avós e uma diretora que ainda lembra de {character1}.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar o repertório da banda",
        description:
          "Dez minutos de rock para pais sentados em cadeiras de plástico.",
        consequence: [
          {
            resultLabel: "Sucesso no recreio",
            descriptionTemplate:
              "As crianças pulam, e os pais anotam o nome da banda para proibir em casa. Meia escola aparece no show seguinte.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Tomada desligada",
            descriptionTemplate:
              "Na segunda música, a diretora tira o som da tomada com a calma de quem já fez isso antes. Com {character1}, inclusive.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar músicas infantis",
        description: "O público manda, e o público tem oito anos.",
        consequence: {
          resultLabel: "Coro infantil",
          descriptionTemplate:
            "A banda vira a atração da feira e recebe convite para todos os aniversários do terceiro ano. {character2} recusa todos em nome da banda.",
          fanCountChangeAbsolute: 4,
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
        label: "Recusar o convite",
        description: "A banda não toca entre o coral e a cesta de frutas.",
        consequence: {
          resultLabel: "Cesta sorteada",
          descriptionTemplate:
            "A feira acontece sem a banda. A cesta de frutas sai para o pai de {character2}, que fala disso por meses.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Tocar só clássicos que os avós conhecem",
        description:
          "[{character1}] Montar um repertório que nenhum avô consiga reprovar.",
        visibleIfCharacterHas: [["conservative"]],
        consequence: {
          resultLabel: "Avós em pé",
          descriptionTemplate:
            "Os avós dançam, a diretora sorri, e a banda ganha a plateia mais fiel da cidade, desde que o show acabe antes das nove.",
          fanCountChangeAbsolute: 8,
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
    id: "0118-a-sala-de-madrugada",
    type: "oportunidade_externa",
    title: "A sala de madrugada",
    descriptionTemplate:
      "Um conhecido de um conhecido tem uma sala de ensaio de verdade, com isolamento e tudo, e oferece a {character1} uma noite de graça para a banda. O horário livre vai das duas às seis da manhã.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar e levar a banda toda",
        description:
          "[{character1}] Convencer cada integrante de que a madrugada é o horário dos artistas.",
        consequence: [
          {
            resultLabel: "Noite histórica",
            descriptionTemplate:
              "Com som de verdade, a banda descobre que soa bem, ou quase. Sai às seis, de olhos vermelhos e com duas músicas novas.",
            fanCountChangeAbsolute: 3,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Ensaio sonâmbulo",
            descriptionTemplate:
              "Às três da manhã, metade da banda dorme no sofá da recepção. A outra metade ensaia para o sofá.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Pedir um horário melhor",
        description:
          "[{character1}] Perguntar, com educação, se não existe uma tarde livre.",
        consequence: {
          resultLabel: "Lista de espera",
          descriptionTemplate:
            "O conhecido anota o pedido num papel que ninguém vai ler de novo.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Recusar a oferta",
        description: "A garagem é pequena, mas funciona em horário comercial.",
        consequence: {
          resultLabel: "Garagem mesmo",
          descriptionTemplate:
            "A banda continua na garagem. O vizinho nunca vai saber da noite de silêncio que quase ganhou.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Usar a noite para acertar cada música até o fim",
        description:
          "[{character1}] Repetir cada trecho até sair certo, sem pausa para o café.",
        visibleIfCharacterHas: [["perfectionist"]],
        consequence: [
          {
            resultLabel: "Lapidadas",
            descriptionTemplate:
              "A banda passa quatro horas em duas músicas e sai tocando as duas melhor do que tudo o que já fez. As outras onze continuam como estavam.",
            fanCountChangeAbsolute: 5,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Motim",
            descriptionTemplate:
              "Na trigésima repetição do mesmo refrão, a banda vai embora e deixa {character1} {character1:sozinho|sozinha|sem ninguém} na sala, cantando para as paredes acústicas.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0119-a-vitrine-da-loja",
    type: "oportunidade_externa",
    title: "A vitrine da loja",
    descriptionTemplate:
      "A loja de instrumentos do centro quer {character1} tocando na vitrine no sábado, para mostrar os instrumentos à venda. O pagamento é um desconto de dez por cento, válido só nos instrumentos mais caros.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar e tocar músicas da banda",
        description:
          "[{character1}] Aproveitar a vitrine para divulgar o repertório.",
        consequence: [
          {
            resultLabel: "Roda na calçada",
            descriptionTemplate:
              "Uma roda se forma na calçada, e alguém pergunta onde a banda toca. O dono pergunta se alguém vai comprar alguma coisa.",
            fanCountChangeAbsolute: 6,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Ninguém parou",
            descriptionTemplate:
              "As pessoas passam, olham o preço das guitarras e seguem andando. {character1} toca quatro horas para o próprio reflexo.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Aceitar e tocar o que o dono pedir",
        description:
          "[{character1}] Repertório de vendedor: músicas fáceis, que fazem qualquer um achar que sabe tocar.",
        consequence: {
          resultLabel: "Recorde de vendas",
          descriptionTemplate:
            "A loja vende três violões e um teclado. {character1} ganha o desconto e um convite para voltar, de uniforme.",
          fanCountChangeAbsolute: 1,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Recusar",
        description:
          "[{character1}] Recusar quatro horas atrás do vidro, entre um manequim e uma bateria em promoção.",
        consequence: {
          resultLabel: "Dignidade",
          descriptionTemplate:
            "{character1} recusa. A loja chama um vendedor que toca pior e vende mais.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Tocar olhando nos olhos de quem passa",
        description:
          "[{character1}] Encarar cada pedestre até alguém parar e aplaudir.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "{character1:Aplaudido|Aplaudida|Aplausos}",
            descriptionTemplate:
              "Uma senhora para, aplaude e deixa uma moeda no estojo. {character1} passa a semana contando a história, com a moeda na mão.",
            fanCountChangeAbsolute: 4,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "{character1:Ignorado|Ignorada|Indiferença}",
            descriptionTemplate:
              "Ninguém para. Um pedestre desvia o olhar com a pressa de quem escapou de um vendedor.",
            happinessChangePercent: -8,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0120-o-palco-de-caminhao",
    type: "oportunidade_externa",
    title: "O palco de caminhão",
    descriptionTemplate:
      "A associação de moradores faz a festa da rua no sábado e oferece à banda a carroceria de um caminhão como palco. {character1} já aceitou; {character2} pergunta se o caminhão fica parado. Ninguém responde.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar na festa",
        description: "Palco é palco, mesmo com placa de carga máxima.",
        consequence: [
          {
            resultLabel: "Festa da rua",
            descriptionTemplate:
              "A rua inteira dança em volta do caminhão, e o motorista pede bis. É o primeiro show da banda com plateia que não foi convidada.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Extensão desligada",
            descriptionTemplate:
              "A energia vem de uma extensão puxada da casa de um morador, que desliga tudo às nove em ponto, hora de dormir. A banda termina o show no grito.",
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
        label: "Pedir um lugar no chão",
        description: "Melhor tocar na calçada do que cair da carroceria.",
        consequence: {
          resultLabel: "No asfalto",
          descriptionTemplate:
            "A associação põe a banda na calçada, ao lado da barraca de pastel. Metade da plateia está na fila do pastel, mas fica perto.",
          fanCountChangeAbsolute: 4,
          happinessChangePercent: 0,
        },
      },
      {
        label: "Recusar o convite",
        description:
          "{character2} vence a discussão, e a banda passa o sábado em casa.",
        consequence: {
          resultLabel: "Ouvindo de longe",
          descriptionTemplate:
            "A banda escuta a festa de longe. A banda que subiu no caminhão era pior e foi aplaudida.",
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
        label: "Tocar com o caminhão andando pelo bairro",
        description:
          "[{character1}] Transformar o show num desfile, rua por rua.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Desfile",
            descriptionTemplate:
              "O caminhão roda o bairro com a banda tocando, e gente sai à janela para ver. Metade aplaude; a outra metade vai bater na porta da associação de moradores para reclamar.",
            fanCountChangeAbsolute: 12,
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
            resultLabel: "Lombada",
            descriptionTemplate:
              "Na primeira lombada, um prato da bateria cai na rua, e o show termina com a banda correndo atrás dele.",
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
    id: "0121-a-loja-de-colchoes",
    type: "oportunidade_externa",
    title: "A loja de colchões",
    descriptionTemplate:
      "Um aviso no mural da padaria procura banda para a inauguração de uma loja de colchões. {character1} vai até lá, e o dono contrata na hora, sem perguntar o estilo nem ouvir uma nota.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar na calçada da loja",
        description:
          "[{character1}] Cachê, lanche e desconto num colchão de casal.",
        consequence: [
          {
            resultLabel: "Inauguração",
            descriptionTemplate:
              "A calçada enche de gente que veio pelo pastel grátis e ficou pela banda. Algumas pessoas.",
            fanCountChangeAbsolute: 7,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Fundo musical",
            descriptionTemplate:
              "Os clientes passam pela banda como passam pelos vendedores. {character1} usa o desconto num colchão e dorme de raiva.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar só se a banda for anunciada",
        description:
          "[{character1}] Exigir o nome da banda na faixa da inauguração.",
        consequence: [
          {
            resultLabel: "Na faixa",
            descriptionTemplate:
              'O nome sai na faixa da loja, abaixo de "colchões em até dez vezes". É a primeira faixa da carreira.',
            fanCountChangeAbsolute: 5,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Outra banda",
            descriptionTemplate:
              "O dono contrata outra banda, que não exige nada. {character1} passa na frente da loja no dia e escuta o show inteiro, de propósito.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar",
        description: "[{character1}] A banda não toca para vender colchão.",
        consequence: {
          resultLabel: "Princípios",
          descriptionTemplate:
            "{character1} recusa. Os princípios continuam intactos, e o colchão, velho.",
          happinessChangePercent: 0,
        },
      },
      {
        label:
          "Tocar {character1:deitado|deitada|na horizontal} num colchão da vitrine",
        description:
          "[{character1}] Demonstrar o produto e a música ao mesmo tempo, sem levantar.",
        visibleIfCharacterHas: [["lazy"]],
        consequence: [
          {
            resultLabel:
              "{character1:Garoto-propaganda|Garota-propaganda|Rosto da loja}",
            descriptionTemplate:
              "A cena vira a atração da inauguração, e o dono oferece a {character1} todos os sábados do mês, no mesmo colchão.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Cochilo",
            descriptionTemplate:
              "Na quarta música, {character1} dorme. Os clientes acham que faz parte da demonstração e levam dois colchões.",
            fanCountChangeAbsolute: 1,
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0122-o-teatro-amador",
    type: "oportunidade_externa",
    title: "O teatro amador",
    descriptionTemplate:
      "O grupo de teatro do bairro precisa de música ao vivo para a peça de sábado. A banda vai tocar atrás de uma cortina, de figurino, para o caso de a cortina cair. {character1} topa; {character2} quer saber que figurino.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o figurino que o grupo escolher",
        description: "A banda toca vestida de árvore, se for preciso.",
        consequence: [
          {
            resultLabel: "Aplausos",
            descriptionTemplate:
              "A peça é um sucesso, e a cortina cai no segundo ato. O público descobre a banda vestida de floresta e aplaude a floresta.",
            fanCountChangeAbsolute: 8,
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
            resultLabel: "Figurino que coça",
            descriptionTemplate:
              "{character2} passa a peça inteira se coçando dentro da fantasia de árvore, inclusive no segundo ato, que não tinha música.",
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
        label: "Tocar sem figurino",
        description: "Música sim, fantasia não.",
        consequence: {
          resultLabel: "Bastidores",
          descriptionTemplate:
            'A banda toca de roupa normal, escondida o tempo todo. O programa da peça agradece à "música ao vivo", sem citar o nome.',
          fanCountChangeAbsolute: 2,
          happinessChangePercent: 0,
        },
      },
      {
        label: "Recusar o convite",
        description:
          "Banda de garagem não faz trilha de peça de bairro. Ainda.",
        consequence: {
          resultLabel: "Sem trilha",
          descriptionTemplate:
            "O grupo de teatro canta a trilha por conta própria. O jornal do bairro elogia a música.",
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
        label: "Compor uma trilha original para a peça",
        description:
          "[{character1}] Escrever uma música para cada cena, em quatro dias.",
        visibleIfCharacterHas: [["creative"]],
        consequence: [
          {
            resultLabel: "Trilha própria",
            descriptionTemplate:
              "A trilha é o melhor da peça, segundo o jornal do bairro, que nem cita o nome do diretor.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Cena muda",
            descriptionTemplate:
              "Faltam músicas para duas cenas, e os atores improvisam em silêncio. O diretor passa a falar com {character1} só por bilhetes.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0123-o-hino-do-time",
    type: "oportunidade_externa",
    title: "O hino do time",
    descriptionTemplate:
      "O time de futebol amador do bairro encomenda um hino à banda. O pagamento é um jogo de camisas e o direito de cantar na arquibancada, que tem três degraus. {character1} já está compondo; {character2} torce para o time rival.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Compor um hino animado",
        description: "Refrão fácil, para cantar perdendo de três.",
        consequence: [
          {
            resultLabel: "Hino oficial",
            descriptionTemplate:
              "O hino pega, e o time passa a perder cantando. A banda ganha uma torcida inteira, de vinte pessoas.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Pé-frio",
            descriptionTemplate:
              "O time perde os cinco jogos seguintes, e a torcida culpa o hino. {character2} não consegue esconder a satisfação.",
            fanCountChangeAbsolute: -2,
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
        label: "Recusar a encomenda",
        description:
          "Deixar o hino para a fanfarra da escola, que já tem uniforme.",
        consequence: {
          resultLabel: "Neutralidade",
          descriptionTemplate:
            "A banda recusa, e o time rival agradece a {character2} em público. {character1} passa a desconfiar de cada torcedor na banda.",
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
        label: "Compor um hino que sirva para os dois times",
        description:
          "Um hino sem nome de time nem cor de camisa, que qualquer torcida pode cantar.",
        consequence: {
          resultLabel: "Hino genérico",
          descriptionTemplate:
            "O hino serve para os dois times, e nenhum dos dois quer. A banda ganha um jogo de camisas de cada um.",
          fanCountChangeAbsolute: 2,
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
        label: "Adaptar a melodia de um hino famoso",
        description:
          "[{character1}] Trocar a letra de um hino conhecido e torcer para ninguém reconhecer.",
        visibleIfCharacterHas: [["plagiarist"]],
        consequence: [
          {
            resultLabel: "Pegou na hora",
            descriptionTemplate:
              "A torcida canta o hino na primeira tentativa, porque já sabia. Ninguém pergunta de onde veio a melodia.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Flagrante",
            descriptionTemplate:
              "O juiz reconhece a melodia no primeiro jogo e canta a letra original, mais alto que a torcida.",
            fanCountChangeAbsolute: -2,
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
    id: "0124-o-empresario",
    type: "oportunidade_externa",
    title: "O empresário",
    descriptionTemplate:
      "Um homem de terno brilhante aborda {character1} e {character2} depois do ensaio e se apresenta como empresário de bandas. Quer cinquenta por cento de tudo. O cachê da banda ainda é uma promessa, e ele já quer metade dela.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Assinar com o empresário",
        description:
          "Dar metade de um cachê que ainda não existe e torcer para ele passar a existir.",
        consequence: [
          {
            resultLabel: "Primeira agenda",
            descriptionTemplate:
              "O empresário arruma dois shows numa semana, um deles com palco. Fica com metade do cachê e com o lanche da banda.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Sumiu",
            descriptionTemplate:
              "O empresário cobra uma taxa de cadastro e some, com o terno. A banda guarda o cartão dele como lembrança.",
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
        label: "Recusar",
        description:
          "A banda segue sem empresário, como sempre, com os resultados de sempre.",
        consequence: {
          resultLabel: "Autônomos",
          descriptionTemplate:
            "O empresário deseja boa sorte no tom de quem já viu muitas bandas recusarem. Algumas famosas, segundo ele.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Propor três meses de experiência",
        description:
          "Se der certo, a banda assina. Se não, ninguém deve nada a ninguém.",
        consequence: {
          resultLabel: "Experiência",
          descriptionTemplate:
            "O empresário aceita, arruma um show num aniversário e cobra a comissão em fatias de bolo.",
          fanCountChangeAbsolute: 3,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Investigar o empresário antes de responder",
        description:
          "[{character2}] Perguntar sobre ele em cada bar, loja de instrumentos e banda da cidade.",
        visibleIfCharacterHas: [[], ["paranoid"]],
        consequence: [
          {
            resultLabel: "Golpe evitado",
            descriptionTemplate:
              "{character2} descobre que o empresário já representou quatro bandas ao mesmo tempo, nenhuma com sucesso. A banda recusa e fica devendo um pedido de desculpas a {character2}.",
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
            resultLabel: "Tarde demais",
            descriptionTemplate:
              "A investigação demora, e o empresário assina com a banda rival do bairro, que desde então toca dois shows por semana.",
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
    id: "0125-a-primeira-demo",
    type: "decisao_criativa",
    title: "A primeira demo",
    descriptionTemplate:
      "A banda vai gravar a primeira demo com um gravador emprestado e um microfone só. {character1} quer gravar tudo ao vivo, de uma vez; {character2} quer gravar cada instrumento separado, o que levaria um mês e um microfone a mais.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Gravar tudo ao vivo, de uma vez",
        description: "Erro gravado vira personalidade.",
        consequence: [
          {
            resultLabel: "Energia crua",
            descriptionTemplate:
              "A demo sai suja e cheia de energia. Quem ouve gosta e pergunta se aquilo no fundo é um cachorro. É.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Bateria na frente",
            descriptionTemplate:
              "Na gravação, a bateria engole tudo, inclusive a voz. A demo serve para provar que a banda existe, e só.",
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
        label: "Gravar cada instrumento separado",
        description: "Um mês de trabalho, um instrumento por vez.",
        consequence: [
          {
            resultLabel: "Caprichada",
            descriptionTemplate:
              "A demo sai limpa, quase profissional. Ninguém lembra mais como a música era antes de virar quebra-cabeça.",
            fanCountChangeAbsolute: 5,
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
            resultLabel: "Descompasso",
            descriptionTemplate:
              "Gravado em partes, cada instrumento segue um andamento diferente. A briga sobre quem atrasou dura mais que a demo.",
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
        label: "Gravar só a melhor música",
        description:
          "Caprichar numa música só e torcer para ninguém pedir a segunda.",
        consequence: {
          resultLabel: "Cartão de visita",
          descriptionTemplate:
            "A banda grava uma música só, com capricho. A demo dura três minutos; a escolha da música levou três dias.",
          fanCountChangeAbsolute: 3,
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
        label: "Gravar na garagem, sem retoque nenhum",
        description:
          "[{character1}] Gravar com a porta aberta, o barulho da rua e tudo o que acontecer.",
        visibleIfCharacterHas: [["purist"]],
        consequence: [
          {
            resultLabel: "Autêntica",
            descriptionTemplate:
              "A demo leva o latido do vizinho, o caminhão do lixo e uma banda que soa como ela mesma. Quem ouve diz que tem alma.",
            fanCountChangeAbsolute: 8,
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
            resultLabel: "Inaudível",
            descriptionTemplate:
              "A rua vence a disputa. A demo tem mais caminhão do lixo do que banda.",
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
    id: "0126-quatro-musicas",
    type: "decisao_criativa",
    title: "Quatro músicas",
    descriptionTemplate:
      "A banda foi chamada para tocar quarenta minutos e sabe quatro músicas, que somam doze minutos contando a afinação. {character1} monta o repertório na véspera.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar cada música duas vezes",
        description:
          '[{character1}] Anunciar a repetição como "versão estendida".',
        consequence: [
          {
            resultLabel: "Ninguém notou",
            descriptionTemplate:
              "Ninguém nota a repetição, ou ninguém se importa. Um senhor pede a terceira música uma terceira vez.",
            fanCountChangeAbsolute: 4,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Essa já foi",
            descriptionTemplate:
              'Na segunda volta, a plateia canta a letra junto e alguém grita "essa já foi". A banda toca mesmo assim, mais rápido.',
            fanCountChangeAbsolute: -1,
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Completar com músicas de outras bandas",
        description:
          "[{character1}] Encher o repertório com sucessos que todo mundo conhece.",
        consequence: {
          resultLabel: "Banda de baile",
          descriptionTemplate:
            "Os covers agradam mais que as músicas da banda. {character1} prefere não comentar.",
          fanCountChangeAbsolute: 3,
          happinessChangePercent: -2,
        },
      },
      {
        label: "Tocar só os doze minutos",
        description: "[{character1}] Show curto, saída digna.",
        consequence: {
          resultLabel: "Curto e grosso",
          descriptionTemplate:
            "A banda toca doze minutos e sai do palco antes que alguém perceba. O dono do lugar percebe.",
          fanCountChangeAbsolute: 1,
          happinessChangePercent: -2,
        },
      },
      {
        label: "Improvisar músicas novas no palco",
        description:
          "[{character1}] Inventar o resto na hora, com a certeza de quem nunca fez isso.",
        visibleIfCharacterHas: [["confident"]],
        consequence: [
          {
            resultLabel: "Improviso",
            descriptionTemplate:
              "Uma das músicas inventadas sai melhor que as quatro ensaiadas. Ninguém consegue repetir no ensaio seguinte.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Sem final",
            descriptionTemplate:
              "O improviso dura vinte minutos e não tem refrão nem final. A banda para quando o dono acende a luz.",
            fanCountChangeAbsolute: -3,
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0127-o-estilo-da-banda",
    type: "decisao_criativa",
    title: "O estilo da banda",
    descriptionTemplate:
      "A banda ainda não decidiu que tipo de música faz. {character1} quer tudo mais pesado e mais rápido; {character2} quer tudo mais calmo, para dar para ouvir a letra. Por enquanto, a banda soa como as duas coisas ao mesmo tempo, e o vizinho já escolheu nenhuma.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Seguir o estilo de {character1}",
        description: "Mais distorção, menos explicação.",
        consequence: [
          {
            resultLabel: "Pegada",
            descriptionTemplate:
              "A banda encontra a própria cara, e a plateia pula. {character2} toca com raiva, o que nesse estilo ajuda.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Barulho sem rumo",
            descriptionTemplate:
              'Ficou mais pesado e mais rápido, mas não ficou melhor. {character2} diz "eu avisei" duas vezes por ensaio.',
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
        label: "Seguir o estilo de {character2}",
        description: "Volume baixo, letra clara.",
        consequence: [
          {
            resultLabel: "Letra audível",
            descriptionTemplate:
              "As letras finalmente aparecem, e alguém chora no show. De emoção, segundo a própria pessoa.",
            fanCountChangeAbsolute: 6,
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
            resultLabel: "Sonolento",
            descriptionTemplate:
              "O show fica tão calmo que o barman cochila no balcão. {character1} toca de olho no relógio.",
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
        label: "Misturar os dois estilos",
        description: "Calmo nos versos, pesado no refrão. Ou o contrário.",
        consequence: {
          resultLabel: "Meio-termo",
          descriptionTemplate:
            'A mistura vira a marca da banda, que ninguém consegue descrever. Os cartazes dizem só "rock".',
          fanCountChangeAbsolute: 3,
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
        label: "Inventar um estilo que ainda não existe",
        description:
          "[{character1}] Juntar tudo o que a banda gosta numa coisa nova e dar um nome a ela.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Pioneirismo",
            descriptionTemplate:
              "O estilo novo atrai a gente mais estranha da cidade, que vira a plateia mais fiel da banda.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Movimento de uma pessoa",
            descriptionTemplate:
              "O estilo novo tem nome, manifesto e um único adepto: {character1}.",
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
    id: "0128-a-musica-sobre-o-chefe",
    type: "decisao_criativa",
    title: "A música sobre o chefe",
    descriptionTemplate:
      "{character1} compôs uma música sobre o chefe do emprego de dia. É a melhor música da banda, tem o nome dele no refrão, e ele avisou que vai ao show de sexta.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar a música como está",
        description:
          "[{character1}] Cantar o nome do chefe no refrão e torcer para ele não prestar atenção na letra.",
        consequence: [
          {
            resultLabel: "Hino dos colegas",
            descriptionTemplate:
              "Os colegas de trabalho cantam o refrão aos gritos. O chefe ri, sem entender, e pede bis.",
            fanCountChangeAbsolute: 8,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Segunda-feira",
            descriptionTemplate:
              "O chefe entende na segunda estrofe. Na segunda-feira, {character1} tem a tarde livre para compor, e todas as outras também.",
            fanCountChangeAbsolute: 3,
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
      {
        label: "Trocar o nome no refrão",
        description:
          "[{character1}] O chefe vira um personagem inventado, com as mesmas manias.",
        consequence: {
          resultLabel: "Ficção",
          descriptionTemplate:
            "O chefe ouve, adora a música e comenta que conhece alguém igualzinho. {character1} concorda.",
          fanCountChangeAbsolute: 4,
          happinessChangePercent: 4,
        },
      },
      {
        label: "Deixar a música fora do show",
        description:
          "[{character1}] Guardar para quando a banda pagar as contas.",
        consequence: {
          resultLabel: "Para depois",
          descriptionTemplate:
            "A música fica para depois. O chefe assiste ao show, aplaude por educação e marca uma reunião para segunda às sete.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Mostrar a música ao chefe antes do show",
        description:
          "[{character1}] Tocar para o chefe no intervalo do almoço, com calma e sem pedir desculpas.",
        visibleIfCharacterHas: [["stable"]],
        consequence: [
          {
            resultLabel: "Patrocínio",
            descriptionTemplate:
              "O chefe ri de si mesmo pela primeira vez na história da empresa e leva o setor inteiro ao show.",
            fanCountChangeAbsolute: 10,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Turno novo",
            descriptionTemplate:
              "O chefe ouve até o fim, agradece e transfere {character1} para o turno da madrugada. {character1} aceita sem mudar de expressão.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0129-o-acordeao-da-avo",
    type: "decisao_criativa",
    title: "O acordeão da avó",
    descriptionTemplate:
      "{character1} herdou o acordeão da avó e quer usá-lo nas músicas da banda, em todas. {character2} lembra que a banda é de rock; {character1} lembra que a avó também era.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Pôr o acordeão em todas as músicas",
        description: "Se é para ter acordeão, que seja para valer.",
        consequence: [
          {
            resultLabel: "Assinatura",
            descriptionTemplate:
              'O acordeão pega, e o público passa a pedir "aquela do acordeão", que são todas.',
            fanCountChangeAbsolute: 8,
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
            resultLabel: "Excesso",
            descriptionTemplate:
              "Na quinta música seguida com acordeão, até {character1} começa a sentir saudade do silêncio.",
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
        label: "Usar o acordeão em uma música só",
        description: "Uma participação especial, como convém a uma avó.",
        consequence: {
          resultLabel: "Homenagem",
          descriptionTemplate:
            "A música do acordeão vira o momento mais aplaudido do show. {character2} aplaude também, porque é uma só.",
          fanCountChangeAbsolute: 4,
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
        label: "Deixar o acordeão em casa",
        description:
          "A banda segue como está. A avó entenderia, provavelmente.",
        consequence: {
          resultLabel: "Na estante",
          descriptionTemplate:
            "O acordeão vai para a estante, e {character1} passa a tocar o resto com saudade e menos vontade.",
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
        label: "Aprender acordeão para valer em uma semana",
        description:
          "[{character1}] Passar sete dias no quarto até tocar como a avó tocava.",
        visibleIfCharacterHas: [["genius"]],
        consequence: [
          {
            resultLabel: "Prodígio",
            descriptionTemplate:
              "Em sete dias, {character1} toca acordeão melhor que o próprio instrumento. A banda passa a se perguntar quanto tempo {character1} leva para aprender o instrumento de cada um.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Quarteirão acordado",
            descriptionTemplate:
              "A semana de estudo começa às cinco da manhã, todo dia. O vizinho volta a bater na porta, agora com um motivo novo.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0130-o-nome-artistico",
    type: "decisao_criativa",
    title: "O nome artístico",
    descriptionTemplate:
      "{character1} decidiu adotar um nome artístico e testou três nesta semana. Nenhum pegou, e o último era o nome de uma marca de sabão em pó.",
    maxFanCount: 150,
    requiredCharacters: 1,
    options: [
      {
        label: "Escolher um nome novo e manter",
        description:
          "[{character1}] Assinar o nome novo em tudo até as pessoas se acostumarem.",
        consequence: [
          {
            resultLabel: "Nome na boca",
            descriptionTemplate:
              "O nome pega, e a plateia passa a gritar por ele no show. A família continua usando o nome de batismo, por teimosia.",
            fanCountChangeAbsolute: 5,
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Só no papel",
            descriptionTemplate:
              "A banda continua chamando {character1} pelo nome antigo, e o apresentador do bar também. O nome novo só existe nos autógrafos, que ninguém pediu.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Manter o nome de batismo",
        description:
          "[{character1}] O nome de sempre já está no cartaz, mesmo que em letra pequena.",
        consequence: {
          resultLabel: "Nome de sempre",
          descriptionTemplate:
            "{character1} desiste dos nomes novos. A banda agradece, porque já não sabia como chamar ninguém no ensaio.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Deixar a banda escolher o nome",
        description: "[{character1}] Votação aberta, com direito a veto.",
        consequence: {
          resultLabel: "Batismo coletivo",
          descriptionTemplate:
            "A banda escolhe um apelido de infância que {character1} tinha jurado enterrar. Pega na hora.",
          fanCountChangeAbsolute: 3,
          happinessChangePercent: -2,
        },
      },
      {
        label: "Escolher o nome pelos astros",
        description:
          "[{character1}] Calcular, com data, hora e lugar de nascimento, o nome de melhor energia.",
        visibleIfCharacterHas: [["spiritual"]],
        consequence: [
          {
            resultLabel: "Alinhamento",
            descriptionTemplate:
              "Os astros escolhem um nome curto e fácil de gritar. {character1} credita o sucesso a Júpiter.",
            fanCountChangeAbsolute: 6,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Retrógrado",
            descriptionTemplate:
              "Os astros escolhem um nome de onze sílabas que nenhum apresentador consegue dizer. {character1} culpa Mercúrio.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0131-em-outra-lingua",
    type: "decisao_criativa",
    title: "Em outra língua",
    descriptionTemplate:
      "{character1} quer cantar as músicas em outra língua, porque a banda rival do bairro faz isso e enche as festas. {character2} lembra que ninguém na banda fala essa língua; {character1} lembra que na rival também não.",
    maxFanCount: 150,
    requiredCharacters: 2,
    options: [
      {
        label: "Cantar em outra língua",
        description:
          "Ninguém entende a letra, o que resolve o problema da letra.",
        consequence: [
          {
            resultLabel: "Internacional",
            descriptionTemplate:
              "A plateia canta junto sons parecidos com palavras. Ninguém nota a pronúncia, e a banda parece vir de longe.",
            fanCountChangeAbsolute: 8,
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
            resultLabel: "Sotaque",
            descriptionTemplate:
              "Um professor de línguas na plateia ri do primeiro ao último verso. No fim, corrige a letra num guardanapo e entrega a {character2}.",
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
        label: "Continuar cantando na língua da banda",
        description: "Manter as letras que a banda pelo menos sabe pronunciar.",
        consequence: {
          resultLabel: "Raiz",
          descriptionTemplate:
            "A banda segue como está, e alguém na plateia entende uma letra inteira pela primeira vez. {character1} acha isso um mau sinal.",
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
        label: "Misturar as duas línguas",
        description: "Verso numa língua, refrão na outra.",
        consequence: {
          resultLabel: "Bilíngue",
          descriptionTemplate:
            "O refrão estrangeiro gruda, e os versos ninguém nota. A banda passa a errar os versos sem consequência nenhuma.",
          fanCountChangeAbsolute: 4,
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
        label: "Copiar o repertório da banda rival",
        description:
          "[{character1}] Se a rival faz sucesso assim, a banda faz igual, só que antes.",
        visibleIfCharacterHas: [["envious"]],
        consequence: [
          {
            resultLabel: "Virada",
            descriptionTemplate:
              "A banda toca as mesmas músicas que a rival, uma semana antes e nos mesmos lugares. A rival passa a parecer a cópia.",
            fanCountChangeAbsolute: 10,
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
            resultLabel: "Primeira fila",
            descriptionTemplate:
              "A rival descobre e aparece no show inteira, de braços cruzados na primeira fila. {character1} esquece a letra que nunca soube.",
            fanCountChangeAbsolute: -2,
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
];
