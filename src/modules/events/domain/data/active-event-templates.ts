import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Static catalog of active-event templates, ported from the `game-music`
 * frontend. Content only — no logic.
 */
export const ACTIVE_EVENT_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "0001-melodia-familiar",
    type: "conflito_membros",
    title: "Melodia Familiar",
    descriptionTemplate:
      "{character1} percebe que a nova composição de {character2} é idêntica a um rascunho antigo que {character1} descartou.",
    minFanCount: 101,
    maxRelationshipLevel: 3,
    requiredCharacterCharacteristicsAll: [["plagiarist"], []],
    requiredCharacters: 2,
    options: [
      {
        label: "Exigir créditos",
        description:
          "[{character1}] Confrontar {character2} e exigir que a música seja registrada como coautoria.",
        consequence: [
          {
            resultLabel: "Neutro",
            descriptionTemplate:
              '{character2} aceita, mas fica ressentido(a) por ter sido "pego(a)".',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            chance: 70,
          },
          {
            resultLabel: "Confronto",
            descriptionTemplate:
              "{character2} nega tudo e diz que teve a ideia de forma independente.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            fanCountChangeAbsolute: -5,
            chance: 30,
          },
        ],
      },
      {
        label: "Sabotagem",
        description:
          "[{character1}] Alterar discretamente os arranjos finais para que a parte plagiada soe mal ou perca o impacto original.",
        consequence: [
          {
            resultLabel: "Sucesso",
            descriptionTemplate:
              "A música fracassa e {character2} perde confiança na banda para propor novas ideias.",
            fanCountChangeAbsolute: -5,
            chance: 60,
          },
          {
            resultLabel: "Exposto(a)",
            descriptionTemplate:
              "A banda percebe a sabotagem e {character1} sofre críticas pesadas de todos os membros e fãs.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -3,
              },
            ],
            fanCountChangeAbsolute: -10,
            chance: 40,
          },
        ],
      },
      {
        label: "Incorporar e melhorar",
        description:
          '[{character1}] Fingir que não percebeu o plágio e dizer: "Adorei como você desenvolveu minha ideia antiga! Vamos terminar de escrever juntos?"',
        consequence: [
          {
            resultLabel: "Produtivo",
            descriptionTemplate:
              "{character2} fica sem saída e aceita a parceria, resultando em uma música excelente.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            fanCountChangeAbsolute: 10,
            chance: 65,
          },
          {
            resultLabel: "Paranoia",
            descriptionTemplate:
              "{character2} se sente vigiado e decide deletar a música por medo de ser exposto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            chance: 35,
          },
        ],
      },
    ],
  },
  {
    id: "0002-o-roubo-do-microfone",
    type: "",
    title: "O Roubo do Microfone",
    descriptionTemplate:
      'Durante uma premiação do VMA, {character1} ganha o prêmio de "Melhor Composição". Enquanto {character1} discursa, um rapper mundialmente famoso invade o palco, arranca seu microfone e grita que outra pessoa merecia o prêmio.',
    minFanCount: 2000001,
    maxRelationshipLevel: 1,
    requiredCharacters: 1,
    options: [
      {
        label: "Manter a compostura",
        description:
          "[{character1}] Ficar em silêncio, demonstrar choque contido e esperar a segurança agir para retomar o discurso.",
        consequence: {
          resultLabel: "Compostura",
          descriptionTemplate:
            "O público e a mídia abraçam {character1} pela elegância sob pressão.",
          fanCountChange: 5,
        },
      },
      {
        label: "Transformar em performance",
        description:
          "[{character1}] Começar a cantar por cima da fala do rapper, transformando a interrupção em um show improvisado.",
        consequence: [
          {
            resultLabel: "Viral",
            descriptionTemplate:
              "A internet vai à loucura com a capacidade de improviso.",
            fanCountChange: 10,
            chance: 70,
          },
          {
            resultLabel: "Constrangedor",
            descriptionTemplate:
              "O público não entende a piada e o clima fica apenas estranho.",
            fanCountChange: -5,
            chance: 30,
          },
        ],
      },
      {
        label: "Abandonar o palco",
        description:
          "[{character1}] Simplesmente largar o prêmio e sair de cena, recusando-se a participar do circo midiático.",
        consequence: {
          resultLabel: "Recuo",
          descriptionTemplate:
            'A imprensa diz que {character1} não tem "casca grossa" para a fama.',
          fanCountChange: -10,
        },
      },
    ],
  },
  {
    id: "0003-invasao-de-privacidade",
    type: "",
    title: "Invasão de Privacidade",
    descriptionTemplate:
      "Um grupo de fãs extremistas descobriu o endereço do hotel da banda e cercou a saída. Eles estão batendo nos vidros e impedindo que o carro se mova.",
    minFanCount: 10001,
    maxRelationshipLevel: 0,
    requiredCharacterCharacteristics: [[], ["creative", "erratic"]],
    requiredCharacters: 2,
    options: [
      {
        label: "Chamar a Polícia",
        description:
          "Acionar as autoridades para dispersar a multidão à força.",
        consequence: {
          resultLabel: "Repressão",
          descriptionTemplate:
            "A banda se protege, mas a imagem de policiais retirando fãs gera fotos terríveis na mídia.",
          fanCountChange: -7,
        },
      },
      {
        label: "Ignorar e acelerar",
        description:
          "Manter os vidros fechados, não olhar para ninguém e mandar o motorista sair dali o mais rápido possível.",
        consequence: {
          resultLabel: "Frieza",
          descriptionTemplate:
            'Chegam ao compromisso no horário, mas vídeos "ignorando fãs" viralizam negativamente.',
          fanCountChange: -5,
        },
      },
      {
        label: "Sair e atender a todos",
        description:
          "Descer do carro, tirar fotos e abraçar os fãs para acalmar os ânimos.",
        consequence: [
          {
            resultLabel: "Humildade",
            descriptionTemplate:
              "{character1} é visto como a pessoa mais humilde do mundo.",
            fanCountChange: 6,
            chance: 65,
          },
          {
            resultLabel: "Pânico",
            descriptionTemplate:
              "A multidão se descontrola, {character1} sai levemente ferido(a) e assustado(a). Os fãs ficam decepcionados.",
            fanCountChange: -3,
            chance: 35,
          },
        ],
      },
      {
        label: 'O "Surto" Criativo',
        description:
          "[{character2}] Abrir o teto solar e começar a gritar versos de uma música inédita sobre o sufoco da fama.",
        visibleIfAnyInvolvedHas: ["creative", "erratic"],
        consequence: [
          {
            resultLabel: "Transcendente",
            descriptionTemplate:
              "O momento é tão visceral e artístico que {character2} se sente transcendente.",
            fanCountChange: 10,
            chance: 50,
          },
          {
            resultLabel: "Colapso",
            descriptionTemplate:
              "As pessoas acham que {character2} está tendo um colapso mental público.",
            fanCountChange: 3,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0004-ta-pegando-fogo-meu",
    type: "",
    title: "Tá pegando fogo, meu!",
    descriptionTemplate:
      "No meio de um show em um barzinho de esquina, o amplificador principal da banda começa a soltar fumaça.",
    maxFanCount: 150,
    maxRelationshipLevel: 0,
    requiredCharacterCharacteristics: [[], ["creative", "experimental"]],
    requiredCharacters: 2,
    options: [
      {
        label: "Conserto gambiarra",
        description:
          "[{character1}] Tentar um reparo rápido com fita isolante e fios soltos para terminar o show.",
        consequence: [
          {
            resultLabel: "Sucesso",
            descriptionTemplate:
              'A música volta com um som "sujo" que o público adora.',
            fanCountChangeAbsolute: 15,
            chance: 50,
          },
          {
            resultLabel: "Desastre",
            descriptionTemplate:
              "O amplificador explode de vez, causando um silêncio constrangedor.",
            fanCountChangeAbsolute: -10,
            chance: 50,
          },
        ],
      },
      {
        label: '"Unplugged" de Improviso',
        description:
          "[{character2}] Desligar o equipamento elétrico e terminar o show em formato acústico, pedindo silêncio e proximidade da plateia.",
        visibleIfAnyInvolvedHas: ["experimental", "creative"],
        consequence: [
          {
            resultLabel: "Conceitual",
            descriptionTemplate:
              'O público acha o momento íntimo e "conceitual". A banda ganha respeito.',
            fanCountChangeAbsolute: 20,
            chance: 70,
          },
          {
            resultLabel: "Fracasso",
            descriptionTemplate:
              "O bar é barulhento demais e ninguém consegue ouvir nada. O show morre.",
            fanCountChangeAbsolute: -8,
            chance: 30,
          },
        ],
      },
      {
        label: "Pausa para manutenção",
        description:
          "[{character1}] Interromper o show imediatamente, explicar a situação ao público com honestidade e prometer compensar o tempo perdido assim que estabilizarem o som.",
        consequence: [
          {
            resultLabel: "Respeito",
            descriptionTemplate:
              "O público aproveita a pausa para ir ao balcão. O dono do bar fica feliz com as vendas extras e a banda volta com som limpo.",
            fanCountChangeAbsolute: 6,
            chance: 60,
          },
          {
            resultLabel: "Clima morre",
            descriptionTemplate:
              "A demora esfria o clima da festa. Algumas pessoas vão embora antes da banda retomar.",
            fanCountChangeAbsolute: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0005-caos-no-churrasco",
    type: "",
    title: "Caos no Churrasco",
    descriptionTemplate:
      'A banda foi contratada para tocar no aniversário do tio de {character1}. O "palco" é ao lado da churrasqueira, o som vive dando choque e as crianças não param de correr entre os pedestais.',
    maxFanCount: 50,
    maxRelationshipLevel: 5,
    requiredCharacterCharacteristics: [[], ["hothead"]],
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o profissionalismo",
        description:
          "Ignorar a fumaça de gordura e o som ruim, tocando o setlist como se estivessem no Rock in Rio.",
        consequence: [
          {
            resultLabel: "Profissional",
            descriptionTemplate:
              "O tio de {character1} fica impressionado com a postura e indica a banda para um bar local.",
            fanCountChangeAbsolute: 10,
            chance: 70,
          },
          {
            resultLabel: "Frustração",
            descriptionTemplate:
              "Ninguém presta atenção e a banda termina o show frustrada e cheirando a carvão.",
            fanCountChangeAbsolute: 0,
            chance: 30,
          },
        ],
      },
      {
        label: "Impor Respeito",
        description:
          "[{character2}] Parar a música abruptamente, aumentar o volume do amplificador no máximo e exigir que todos parem de comer para ouvir, e afirmar que a banda não é som de fundo e deve ser respeitada.",
        visibleIfAnyInvolvedHas: ["hothead"],
        consequence: [
          {
            resultLabel: "Briga",
            descriptionTemplate:
              'A festa acaba em briga. O tio se recusa a pagar o "cachê" (em carne e cerveja).',
            fanCountChangeAbsolute: -12,
            chance: 50,
          },
          {
            resultLabel: "Rebeldes",
            descriptionTemplate:
              'O silêncio constrangedor faz as pessoas finalmente ouvirem. Ganham fama de "rebeldes".',
            fanCountChangeAbsolute: 8,
            chance: 50,
          },
        ],
      },
      {
        label: 'Virar "Jukebox" Humano',
        description:
          "Desistir do repertório autoral e começar a tocar apenas covers populares para tentar ganhar o público pelo estômago.",
        consequence: [
          {
            resultLabel: "Sucesso",
            descriptionTemplate:
              'A festa vira um sucesso, ganham gorjetas extras, mas os membros se sentem "vendidos".',
            fanCountChangeAbsolute: 13,
            chance: 80,
          },
          {
            resultLabel: "Humilhação",
            descriptionTemplate:
              "A banda toca tão mal os covers que pedem para eles pararem. Humilhação total.",
            fanCountChangeAbsolute: -5,
            chance: 20,
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Fase Casas (2.001 a 100.000 fãs, ADR-0025): modelos universais, sem traço
  // exigido nem limite de relação. Os traços só abrem uma opção extra.
  // ---------------------------------------------------------------------------
  {
    id: "0301-divisao-do-cache",
    type: "conflito_membros",
    title: "Divisão do cachê",
    descriptionTemplate:
      "Depois de uma casa lotada, {character1} diz no camarim que {character2} deveria receber menos, porque quase não toca nas músicas novas.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter a divisão igual",
        description:
          "Encerrar o assunto: todo mundo recebe a mesma parte, como sempre foi.",
        consequence: {
          resultLabel: "A contragosto",
          descriptionTemplate:
            "{character1} aceita, mas passa a noite calado(a).",
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
          "Quem toca mais, recebe mais. {character2} vai ter que engolir.",
        consequence: [
          {
            resultLabel: "Aceito",
            descriptionTemplate:
              "{character2} aceita a nova regra, mas o clima esfria.",
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
              "{character2} diz que, se for assim, procura outra banda.",
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
        description: "Colocar os dois frente a frente antes do próximo show.",
        consequence: [
          {
            resultLabel: "Entendimento",
            descriptionTemplate:
              "{character2} promete se envolver mais nos arranjos e {character1} recua.",
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
              "A conversa vira gritaria e o ensaio acaba mais cedo.",
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
          "[{character1}] Separar uma parte do cachê para equipamento da banda, e o resto igual para todos.",
        visibleIfAnyInvolvedHas: ["conciliator"],
        consequence: {
          resultLabel: "Acordo",
          descriptionTemplate: "A ideia agrada aos dois e o assunto morre ali.",
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
      "Uma rádio da região quer entrevistar só {character1}. {character2} sente que a banda virou figurante.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mandar só {character1}",
        description:
          "Rádio é rádio. Melhor uma entrevista com uma pessoa do que nenhuma.",
        consequence: {
          resultLabel: "No ar",
          descriptionTemplate:
            "A entrevista vai bem, mas {character2} nem liga o rádio para ouvir.",
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
        description: "Ou vai todo mundo, ou ninguém vai.",
        consequence: [
          {
            resultLabel: "A rádio cede",
            descriptionTemplate:
              "O programa abre espaço para a banda inteira e a conversa rende.",
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
            descriptionTemplate: "A produção agradece e chama outra banda.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "{character1} recusa em solidariedade",
        description: "Abrir mão da entrevista para não rachar a banda.",
        consequence: {
          resultLabel: "Gesto",
          descriptionTemplate:
            "{character2} fica sabendo e agradece em público no show seguinte.",
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
          "[{character1}] Aproveitar o microfone para contar a própria história, sem citar a banda.",
        visibleIfCharacterHas: [["validation_seeker"], []],
        consequence: {
          resultLabel: "Estrela",
          descriptionTemplate:
            "A entrevista faz sucesso, mas a banda ouve calada no carro.",
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
      "{character1} chega atrasado(a) ao ensaio pela terceira vez na semana, e {character2} perde a paciência na frente da equipe técnica.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dar uma advertência",
        description: "Deixar claro que o próximo atraso vai ter consequência.",
        consequence: {
          resultLabel: "Recado dado",
          descriptionTemplate: "{character1} se desculpa, meio sem graça.",
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
        description: "Todo mundo tem semanas ruins.",
        consequence: [
          {
            resultLabel: "Esfriou",
            descriptionTemplate: "O assunto morre e o ensaio segue.",
            happinessChangePercent: 0,
            chance: 60,
          },
          {
            resultLabel: "Explosão",
            descriptionTemplate:
              "{character2} larga o instrumento no meio da música e vai embora.",
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
        description: "Talvez o problema seja o horário, não a pessoa.",
        consequence: {
          resultLabel: "Ajuste",
          descriptionTemplate:
            "O ensaio passa para a tarde e {character1} começa a chegar antes de todo mundo.",
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
          "[{character2}] Organizar horários, transporte e lembretes para todo mundo.",
        visibleIfCharacterHas: [[], ["professional"]],
        consequence: {
          resultLabel: "Organização",
          descriptionTemplate:
            "Com tudo anotado, os atrasos param e o ensaio rende mais.",
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
      "Num jornal da região, {character1} diz que compôs sozinho(a) o maior sucesso da banda. {character2} lembra muito bem de ter escrito metade.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pedir correção ao jornal",
        description: "Mandar uma nota com os créditos certos.",
        consequence: [
          {
            resultLabel: "Corrigido",
            descriptionTemplate:
              "O jornal publica a correção e {character2} se sente reconhecido(a).",
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
              "O jornal não publica nada, e {character1} fica com a fama.",
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
        label: "Resolver entre vocês",
        description: "Roupa suja se lava em casa.",
        consequence: {
          resultLabel: "Mágoa",
          descriptionTemplate:
            "{character1} pede desculpas, mas {character2} não esquece.",
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
            "O público aplaude os dois, e a paz volta ao camarim.",
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
          "[{character2}] Contar a história verdadeira para a concorrência.",
        visibleIfCharacterHas: [[], ["envious", "jealous"]],
        consequence: [
          {
            resultLabel: "Escândalo",
            descriptionTemplate:
              "A briga vira assunto na cidade e a banda nunca foi tão comentada.",
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
              "Os leitores acham a briga mesquinha e a banda perde simpatia.",
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
      "Uma banda famosa passa pela região e convida vocês para abrir o show. O empresário deles, porém, só quer um set acústico com {character1} e {character2}.",
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
            "O set curto agrada, e muita gente pergunta o nome da banda.",
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
              "O empresário cede, e a banda inteira sobe ao palco.",
            fanCountChange: 7,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Desistem",
            descriptionTemplate:
              "O empresário acha que vocês deram trabalho demais e chama outra banda.",
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
            "A banda fica em casa, com a consciência tranquila e um pouco de arrependimento.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Pedir o palco inteiro",
        description:
          "[{character1}] Convencer o empresário de que vocês seguram o show de abertura sozinhos.",
        visibleIfAnyInvolvedHas: ["confident"],
        consequence: [
          {
            resultLabel: "Lenda local",
            descriptionTemplate:
              "O empresário compra a ideia e a abertura vira o assunto da noite.",
            fanCountChange: 9,
            happinessChangePercent: 10,
            chance: 50,
          },
          {
            resultLabel: "Convite cancelado",
            descriptionTemplate:
              "O empresário acha arrogante e cancela o convite.",
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
      "Depois do show, um empresário da capital procura {character1} no camarim e oferece um contrato para carreira solo.",
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
            "{character1} recusa, mas fica pensando no que poderia ter sido.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Pedir um tempo para pensar",
        description: "[{character1}] Guardar o cartão e não dar resposta.",
        consequence: [
          {
            resultLabel: "Esquecido",
            descriptionTemplate: "O empresário não liga de volta.",
            happinessChangePercent: -4,
            chance: 50,
          },
          {
            resultLabel: "Insistência",
            descriptionTemplate:
              "O empresário insiste, e {character1} se sente valorizado(a).",
            happinessChangePercent: 8,
            chance: 50,
          },
        ],
      },
      {
        label: "Contar para a imprensa",
        description: "Deixar vazar que até empresário da capital quer vocês.",
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
          "[{character1}] Recusar o solo e oferecer a banda inteira no lugar.",
        visibleIfAnyInvolvedHas: ["loyal"],
        consequence: [
          {
            resultLabel: "Interesse",
            descriptionTemplate:
              "O empresário assiste ao ensaio e promete indicar a banda para casas maiores.",
            fanCountChange: 6,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Educado, mas não",
            descriptionTemplate:
              "O empresário agradece, mas só queria {character1}. A banda fica sabendo e adora o gesto.",
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
      "Uma loja de departamentos da região quer {character1} cantando o jingle da campanha de fim de ano.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar",
        description:
          "[{character1}] Gravar o jingle. A voz vai tocar em todo intervalo comercial.",
        consequence: {
          resultLabel: "Refrão grudento",
          descriptionTemplate:
            "Todo mundo na cidade sabe cantar o jingle, e alguns descobrem a banda por causa dele.",
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
              "A loja aceita, e o nome da banda passa a tocar todo dia.",
            fanCountChange: 5,
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Sem acordo",
            descriptionTemplate: "A loja prefere outro cantor.",
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
            "{character1} recusa e segue em paz com a própria arte.",
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
            resultLabel: "Ovacionado(a)",
            descriptionTemplate:
              "O público adora a história e grita o nome da banda.",
            fanCountChange: 4,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Soou arrogante",
            descriptionTemplate: "Parte da plateia acha o discurso pedante.",
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
      "A TV regional chama a banda para um programa de auditório, mas só tem tempo para uma música, com playback. {character1} topa na hora; {character2} acha uma vergonha.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Ir com playback",
        description: "Sorrir, fingir que toca e aproveitar a audiência.",
        consequence: {
          resultLabel: "No ar",
          descriptionTemplate:
            "A apresentação passa para a região inteira, e {character2} faz cara feia o tempo todo.",
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
              "A produção aceita, e a banda faz a melhor apresentação da história do programa.",
            fanCountChange: 8,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Cortados",
            descriptionTemplate: "A produção corta a banda do programa.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar",
        description: "Playback não é com vocês.",
        consequence: {
          resultLabel: "Princípios",
          descriptionTemplate:
            "{character2} agradece; {character1} fica remoendo a chance perdida.",
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
              "A cena vira o momento mais comentado do programa.",
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
              "O apresentador não acha graça e a banda sai vaiada.",
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
      "{character1} quer estrear no sábado uma música que ainda não está pronta. {character2} acha arriscado diante da maior plateia que a banda já teve.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 2,
    options: [
      {
        label: "Estrear assim mesmo",
        description: "Música boa se prova no palco.",
        consequence: [
          {
            resultLabel: "Arrepio",
            descriptionTemplate:
              "A plateia canta o refrão na segunda vez. Nasceu um hino.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Desencontro",
            descriptionTemplate:
              "A banda se perde na ponte, e {character2} olha feio para {character1}.",
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
            "O show é seguro, e {character1} fica frustrado(a).",
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
            "A música sai redonda, mas a banda chega exausta ao sábado.",
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
              "O arranjo novo funciona, e os dois saem do palco abraçados.",
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
            descriptionTemplate: "A noite em claro cobra o preço no palco.",
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
      "Uma revista de música vai fotografar a banda, e {character1} quer aparecer com um visual completamente diferente.",
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
              "A foto chama atenção e vira a capa da edição.",
            fanCountChange: 4,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Estranhamento",
            descriptionTemplate: "Os leitores não reconhecem a banda na foto.",
            fanCountChange: -2,
            happinessChangePercent: 2,
            chance: 50,
          },
        ],
      },
      {
        label: "Pedir algo mais discreto",
        description: "A banda tem uma imagem, e ela está funcionando.",
        consequence: {
          resultLabel: "Contido",
          descriptionTemplate:
            "{character1} obedece, mas sai emburrado(a) em todas as fotos.",
          happinessChangePercent: -6,
        },
      },
      {
        label: "Deixar a revista decidir",
        description: "O fotógrafo entende do assunto.",
        consequence: {
          resultLabel: "Profissional",
          descriptionTemplate:
            "O fotógrafo encontra um meio-termo e as fotos ficam boas.",
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
            descriptionTemplate: "O visual vira referência na cena da região.",
            fanCountChange: 6,
            happinessChangePercent: 10,
            chance: 50,
          },
          {
            resultLabel: "Fantasia",
            descriptionTemplate: "A roupa vira piada nas cartas dos leitores.",
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
      "A casa de show pede um repertório só de sucessos. {character1} quer tocar o disco novo inteiro; {character2} concorda com a casa.",
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
            "A casa vibra do começo ao fim, e {character1} toca no automático.",
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
        description: "Quem gosta da banda vai gostar do que ela faz agora.",
        consequence: [
          {
            resultLabel: "Conquista",
            descriptionTemplate:
              "O público estranha no começo e termina pedindo bis.",
            fanCountChange: 6,
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Casa fria",
            descriptionTemplate: "Metade da plateia vai embora antes do fim.",
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
        description: "Intercalar uma nova a cada dois sucessos.",
        consequence: {
          resultLabel: "Equilíbrio",
          descriptionTemplate: "O show flui e os dois saem satisfeitos.",
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
            descriptionTemplate: "A crítica local chama de o show do ano.",
            fanCountChange: 8,
            happinessChangePercent: 10,
            chance: 50,
          },
          {
            resultLabel: "Pretensioso",
            descriptionTemplate:
              "O público não entende a história e a casa não chama de novo.",
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
      "A prefeitura da cidade natal de {character1} convida a banda para um show gratuito na praça, no mesmo fim de semana de uma data paga em outra cidade.",
    minFanCount: 2001,
    maxFanCount: 100000,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar na cidade natal",
        description:
          "[{character1}] Voltar para casa e tocar para quem viu tudo começar.",
        consequence: {
          resultLabel: "Festa",
          descriptionTemplate:
            "A praça lota e {character1} chora no último refrão.",
          fanCountChange: 3,
          happinessChangePercent: 10,
        },
      },
      {
        label: "Cumprir a data paga",
        description: "Compromisso é compromisso.",
        consequence: {
          resultLabel: "Saudade",
          descriptionTemplate:
            "O show pago vai bem, mas {character1} passa a noite pensando na praça.",
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
              "As duas datas acontecem e a banda vira notícia pelo esforço.",
            fanCountChange: 5,
            happinessChangePercent: -6,
            chance: 60,
          },
          {
            resultLabel: "Atraso",
            descriptionTemplate:
              "A van chega tarde e o segundo show começa com uma hora de atraso.",
            fanCountChange: -2,
            happinessChangePercent: -12,
            chance: 40,
          },
        ],
      },
      {
        label: "Planejar as duas datas nos mínimos detalhes",
        description:
          "[{character1}] Montar a logística da viagem, hora a hora.",
        visibleIfAnyInvolvedHas: ["workaholic"],
        consequence: {
          resultLabel: "Precisão",
          descriptionTemplate:
            "Tudo sai no horário, e a banda faz os dois shows descansada.",
          fanCountChange: 5,
          happinessChangePercent: 4,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Confraternizações que deram errado (ADR-0017 §3). O gerador aleatório nunca
  // sorteia este tipo: só chegam aqui pela porta das atividades, já com o par
  // mais hostil da lista de convidados no papel de {character1}/{character2}.
  // ---------------------------------------------------------------------------
  {
    id: "9001-copo-a-mais",
    type: "confraternizacao",
    title: "O copo a mais",
    descriptionTemplate:
      "Já era tarde quando {character1} olhou para {character2} e disse, na frente de todo mundo, o que andava guardando havia meses.",
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar um pedido de desculpas",
        description:
          "[{character1}] Exigir que {character1} procure {character2} no dia seguinte e desfaça o estrago.",
        consequence: [
          {
            resultLabel: "Constrangido",
            descriptionTemplate:
              "{character1} pede desculpas de cabeça baixa. Ninguém toca mais no assunto — e é justamente isso que fica.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            chance: 60,
          },
          {
            resultLabel: "Sem recuo",
            descriptionTemplate:
              '{character1} se recusa: "eu disse o que todo mundo pensa". {character2} não esquece.',
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
        label: "Fingir que ninguém ouviu",
        description:
          "Tratar a noite como se nada tivesse acontecido e seguir o trabalho.",
        consequence: {
          resultLabel: "Silêncio",
          descriptionTemplate:
            "O assunto morre na mesa, mas os ensaios ficam com um clima que ninguém nomeia.",
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
        label: "Botar os dois para conversar",
        description:
          "Sentar {character1} e {character2} na mesma sala e não deixar sair até resolverem.",
        consequence: [
          {
            resultLabel: "Aliviado",
            descriptionTemplate:
              "A conversa é dura, mas o que estava entalado sai. Os dois saem melhores do que entraram.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            chance: 55,
          },
          {
            resultLabel: "Piorou",
            descriptionTemplate:
              "A conversa desce para terreno pior. Agora os dois sabem exatamente onde machucar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            chance: 45,
          },
        ],
      },
    ],
  },
  {
    id: "9002-a-conta",
    type: "confraternizacao",
    title: "A conta",
    descriptionTemplate:
      "A conta chega e {character1} anuncia que não vai dividir igual — bebeu menos, comeu menos, e faz questão de detalhar isso na frente de {character2}.",
    requiredCharacters: 2,
    options: [
      {
        label: "A banda paga",
        description:
          "Encerrar a discussão pagando a diferença com o caixa da banda.",
        consequence: {
          resultLabel: "Resolvido no dinheiro",
          descriptionTemplate:
            "A conta some, o constrangimento não. {character2} passa a noite calado.",
          moneyChange: -150,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
        },
      },
      {
        label: "Deixar os dois resolverem",
        description: "Não entrar na discussão e ver onde aquilo vai parar.",
        consequence: [
          {
            resultLabel: "Papo furado",
            descriptionTemplate:
              "Discutem alto por dez minutos, dividem igual e no fim riem da própria mesquinharia.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            chance: 45,
          },
          {
            resultLabel: "Rachadura",
            descriptionTemplate:
              "{character2} paga a diferença em silêncio e guarda o episódio inteiro.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            chance: 55,
          },
        ],
      },
    ],
  },
  {
    id: "9003-verdade-na-mesa",
    type: "confraternizacao",
    title: "A verdade na mesa",
    descriptionTemplate:
      "No meio da conversa mole, {character2} traz à tona uma mágoa antiga com {character1} que a banda inteira preferia ter esquecido.",
    requiredCharacters: 2,
    options: [
      {
        label: "Encarar agora",
        description:
          "Parar tudo e tratar o assunto ali, com a banda inteira ouvindo.",
        consequence: [
          {
            resultLabel: "Limpo",
            descriptionTemplate:
              "Falam por duas horas. Sai caro em constrangimento e barato em ressentimento.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
          {
            resultLabel: "Exposto",
            descriptionTemplate:
              "A discussão expõe mais do que devia e a noite acaba com metade da banda indo embora.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -12,
            chance: 50,
          },
        ],
      },
      {
        label: "Mudar de assunto",
        description:
          "Encher os copos, subir o som e empurrar aquilo para longe.",
        consequence: {
          resultLabel: "Adiado",
          descriptionTemplate:
            "A noite se recompõe. O assunto volta para a gaveta de onde saiu, esperando a próxima.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -1,
            },
          ],
        },
      },
    ],
  },
];
