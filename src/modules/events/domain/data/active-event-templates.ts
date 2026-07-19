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
];
