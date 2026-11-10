import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Universal templates for the "Bares" fame phase (151 to 2,000 fans,
 * ADR-0025): no trait requirement nor relationship bound; traits only unlock
 * an extra option.
 */
export const BARES_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "0201-pago-em-cerveja",
    type: "conflito_membros",
    title: "Pago em cerveja",
    descriptionTemplate:
      "O bar paga a banda em cerveja. {character1} bebe a parte de todo mundo antes do show, e {character2} perde a paciência.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Regra nova: só depois do show",
        description: "Ninguém bebe antes do último acorde.",
        consequence: {
          resultLabel: "Lei seca",
          descriptionTemplate:
            "Os shows melhoram, e {character1} toca de cara amarrada.",
          fanCountChange: 2,
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
        description: "Faz parte do pacote.",
        consequence: [
          {
            resultLabel: "Noite animada",
            descriptionTemplate:
              "{character1} faz o show mais solto da história da banda.",
            fanCountChange: 3,
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
            resultLabel: "Desastre",
            descriptionTemplate:
              "{character1} esquece a letra no meio da música e o público vaia.",
            fanCountChange: -4,
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
        label: "Pedir ao bar que pague em dinheiro",
        description: "Assim cada um faz o que quiser com a sua parte.",
        consequence: [
          {
            resultLabel: "Combinado",
            descriptionTemplate: "O dono aceita, e a briga perde o motivo.",
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
            resultLabel: "Sem acordo",
            descriptionTemplate: "O dono diz que é cerveja ou nada.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Levar na brincadeira",
        description:
          "[{character1}] Prometer pagar uma rodada para a banda inteira no próximo show.",
        visibleIfAnyInvolvedHas: ["informal", "playful"],
        consequence: {
          resultLabel: "Rodada",
          descriptionTemplate:
            "A banda ri, a rodada acontece e ninguém lembra mais da briga.",
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
    id: "0202-data-ruim",
    type: "conflito_membros",
    title: "A data ruim",
    descriptionTemplate:
      "{character1} fechou sozinho(a) um show numa terça-feira de chuva, do outro lado da cidade. {character2} diz que devia ter sido consultado(a).",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cumprir a data",
        description: "Palavra dada é palavra cumprida.",
        consequence: [
          {
            resultLabel: "Valeu a pena",
            descriptionTemplate:
              "A casa enche de gente que nunca tinha ouvido a banda.",
            fanCountChange: 5,
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
            resultLabel: "Noite perdida",
            descriptionTemplate:
              "Chove, ninguém aparece, e {character2} não diz uma palavra na volta.",
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
        label: "Cancelar",
        description: "{character1} liga para o bar e desfaz o combinado.",
        consequence: {
          resultLabel: "Desfeito",
          descriptionTemplate:
            "O bar não gosta, e {character1} se sente desautorizado(a).",
          fanCountChange: -1,
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
        label: "Combinar uma regra para as próximas",
        description:
          "Cumprir esta data, mas daqui para a frente todo show passa pela banda.",
        consequence: {
          resultLabel: "Regra",
          descriptionTemplate:
            "A regra acalma os ânimos, mesmo que a terça-feira continue ruim.",
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
        label: "Renegociar o cachê com o bar",
        description:
          "[{character1}] Se é para tocar numa terça de chuva, o bar paga mais.",
        visibleIfAnyInvolvedHas: ["greedy", "professional"],
        consequence: [
          {
            resultLabel: "Melhor acordo",
            descriptionTemplate:
              "O bar topa pagar o dobro e ainda divulga o show.",
            fanCountChange: 3,
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
              "O bar cancela o show e não chama a banda de novo.",
            fanCountChange: -2,
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
    id: "0203-a-palhinha",
    type: "conflito_membros",
    title: "A palhinha",
    descriptionTemplate:
      "Todo show, {character1} chama um amigo para dar uma palhinha no palco. {character2} acha que ele toca mal e atrapalha.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Acabar com as palhinhas",
        description: "O palco é da banda.",
        consequence: {
          resultLabel: "Palco fechado",
          descriptionTemplate:
            "O amigo some, e {character1} fica chateado(a) por semanas.",
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
        label: "Só uma música por noite",
        description: "O amigo continua vindo, mas com hora marcada.",
        consequence: {
          resultLabel: "Meio-termo",
          descriptionTemplate: "A palhinha vira um momento esperado do show.",
          fanCountChange: 2,
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
        label: "Deixar tudo como está",
        description: "O público parece gostar.",
        consequence: [
          {
            resultLabel: "Festa",
            descriptionTemplate: "O amigo traz a turma dele, e o bar lota.",
            fanCountChange: 4,
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
            resultLabel: "Desafinou",
            descriptionTemplate:
              "O amigo erra tudo, e {character2} desliga o amplificador dele no meio da música.",
            fanCountChange: -2,
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
        label: "Ensaiar com o amigo",
        description:
          "[{character2}] Se ele vai tocar, que ensaie como todo mundo.",
        visibleIfAnyInvolvedHas: ["conciliator", "stable"],
        consequence: {
          resultLabel: "Reforço",
          descriptionTemplate:
            "Depois de dois ensaios, o amigo até que toca direito.",
          fanCountChange: 3,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
          happinessChangePercent: 4,
        },
      },
    ],
  },
  {
    id: "0204-concurso-de-bandas",
    type: "oportunidade_externa",
    title: "Concurso de bandas",
    descriptionTemplate:
      "{character1} inscreveu a banda num concurso da cidade sem avisar ninguém. A final é no sábado.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Ir com a melhor música autoral",
        description:
          "Se é para competir, que seja com o que a banda tem de melhor.",
        consequence: [
          {
            resultLabel: "Campeões",
            descriptionTemplate:
              "A banda vence, e o troféu fica na estante do bar onde tudo começou.",
            fanCountChange: 10,
            happinessChangePercent: 10,
            chance: 35,
          },
          {
            resultLabel: "Finalistas",
            descriptionTemplate:
              "A banda não vence, mas o júri elogia em público.",
            fanCountChange: 4,
            happinessChangePercent: 4,
            chance: 40,
          },
          {
            resultLabel: "Eliminados",
            descriptionTemplate: "A banda cai na primeira rodada.",
            happinessChangePercent: -6,
            chance: 25,
          },
        ],
      },
      {
        label: "Ir com um cover conhecido",
        description: "Júri gosta do que conhece.",
        consequence: {
          resultLabel: "Correto",
          descriptionTemplate:
            "A apresentação agrada, mas ninguém lembra do nome da banda.",
          fanCountChange: 3,
          happinessChangePercent: 0,
        },
      },
      {
        label: "Desistir",
        description:
          "[{character1}] Pedir desculpas à banda e retirar a inscrição.",
        consequence: {
          resultLabel: "Desistência",
          descriptionTemplate:
            "A banda fica aliviada, e {character1} fica com a sensação de que perdeu uma chance.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Prometer ao júri que vai ganhar",
        description:
          "[{character1}] Subir ao palco anunciando que a banda veio buscar o troféu.",
        visibleIfAnyInvolvedHas: ["confident", "hothead"],
        consequence: [
          {
            resultLabel: "Cumpriu",
            descriptionTemplate:
              "A banda entrega o que prometeu e a plateia vai à loucura.",
            fanCountChange: 12,
            happinessChangePercent: 10,
            chance: 40,
          },
          {
            resultLabel: "Vaiado(a)",
            descriptionTemplate:
              "A banda tropeça logo no começo e a plateia cobra a promessa.",
            fanCountChange: -3,
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0205-professor-de-musica",
    type: "oportunidade_externa",
    title: "Professor de música",
    descriptionTemplate:
      "Uma escola de música oferece a {character1} uma vaga de professor(a) nas tardes de semana.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar",
        description: "[{character1}] Um salário fixo não faz mal a ninguém.",
        consequence: {
          resultLabel: "Estabilidade",
          descriptionTemplate:
            "As contas ficam em dia, mas {character1} chega cansado(a) aos ensaios.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Aceitar e divulgar a banda aos alunos",
        description:
          "[{character1}] Cada aula termina com o convite para o próximo show.",
        consequence: {
          resultLabel: "Fã-clube mirim",
          descriptionTemplate:
            "Os alunos levam os pais, e os pais levam os amigos.",
          fanCountChange: 5,
          happinessChangePercent: 4,
        },
      },
      {
        label: "Recusar",
        description: "[{character1}] O tempo é da banda.",
        consequence: {
          resultLabel: "Foco",
          descriptionTemplate:
            "{character1} recusa, e a banda nota a dedicação.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Aceitar só para ter onde ensaiar",
        description:
          "[{character1}] Dar as aulas em troca da sala de ensaio à noite.",
        visibleIfAnyInvolvedHas: ["lazy", "informal"],
        consequence: [
          {
            resultLabel: "Sala de graça",
            descriptionTemplate:
              "A escola aceita, e a banda ganha um lugar decente para ensaiar.",
            fanCountChange: 2,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Demitido(a)",
            descriptionTemplate:
              "As aulas são tão preguiçosas que a escola desfaz o acordo.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0206-festa-da-faculdade",
    type: "oportunidade_externa",
    title: "A festa da faculdade",
    descriptionTemplate:
      "Uma república de estudantes contrata a banda para a festa do semestre. {character1} e {character2} cuidam da negociação.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar a noite inteira",
        description: "Quatro horas de show, até o último estudante cair.",
        consequence: {
          resultLabel: "Maratona",
          descriptionTemplate:
            "A festa vira lenda no campus, e a banda sai sem voz.",
          fanCountChange: 6,
          happinessChangePercent: -6,
        },
      },
      {
        label: "Um set de uma hora",
        description: "O combinado, bem tocado.",
        consequence: {
          resultLabel: "Profissional",
          descriptionTemplate:
            "A banda toca bem e vai embora antes da bagunça.",
          fanCountChange: 3,
          happinessChangePercent: 2,
        },
      },
      {
        label: "Exigir um som decente",
        description: "Só tocam se a república alugar caixas de verdade.",
        consequence: [
          {
            resultLabel: "Som de show",
            descriptionTemplate:
              "Os estudantes alugam as caixas e o show soa como nunca.",
            fanCountChange: 6,
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
            resultLabel: "Trocados",
            descriptionTemplate:
              "A república chama outra banda, que topa tocar com o som da sala.",
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
        label: "Ficar na festa depois do show",
        description:
          "[{character1}] Virar a noite com os estudantes e fazer amizade com metade do campus.",
        visibleIfAnyInvolvedHas: ["informal", "friendly"],
        consequence: [
          {
            resultLabel: "Banda do campus",
            descriptionTemplate:
              "A banda vira a trilha oficial das festas da faculdade.",
            fanCountChange: 8,
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
            resultLabel: "Ressaca",
            descriptionTemplate:
              "A banda perde o ensaio do dia seguinte inteiro.",
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0207-o-cartaz",
    type: "decisao_criativa",
    title: "O cartaz",
    descriptionTemplate:
      "{character1} desenhou o cartaz do próximo show. É, no mínimo, estranho.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Usar assim mesmo",
        description: "Estranho chama atenção.",
        consequence: [
          {
            resultLabel: "Colecionável",
            descriptionTemplate:
              "As pessoas arrancam o cartaz dos postes para levar para casa.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Ninguém entendeu",
            descriptionTemplate:
              "Metade da cidade acha que é um anúncio de circo.",
            fanCountChange: -2,
            happinessChangePercent: 2,
            chance: 50,
          },
        ],
      },
      {
        label: "Refazer com a banda",
        description: "Uma noite de colagem e canetinha, todo mundo junto.",
        consequence: {
          resultLabel: "Trabalho em grupo",
          descriptionTemplate:
            "O cartaz novo fica bom, e {character1} finge que não ligou.",
          fanCountChange: 2,
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pedir para um amigo desenhar",
        description: "Alguém da escola de artes deve topar.",
        consequence: {
          resultLabel: "Bonito",
          descriptionTemplate:
            "O cartaz fica bonito, e {character1} fica com o dele na parede do quarto.",
          fanCountChange: 3,
          happinessChangePercent: -4,
        },
      },
      {
        label: "Transformar o cartaz na identidade da banda",
        description:
          "[{character1}] Usar o mesmo traço no cartaz, nas camisetas e no bumbo.",
        visibleIfAnyInvolvedHas: ["visionary", "genius"],
        consequence: [
          {
            resultLabel: "Marca",
            descriptionTemplate:
              "O desenho vira a cara da banda, e a cidade reconhece de longe.",
            fanCountChange: 8,
            happinessChangePercent: 10,
            chance: 60,
          },
          {
            resultLabel: "Exagero",
            descriptionTemplate:
              "Ninguém aguenta mais ver o mesmo desenho em tudo.",
            fanCountChange: -2,
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0208-roupa-de-palco",
    type: "decisao_criativa",
    title: "Roupa de palco",
    descriptionTemplate:
      "{character1} quer que a banda toque com roupas combinando. {character2} diz que prefere sair da banda a usar uniforme.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Adotar o uniforme",
        description: "Banda com visual é banda que se lembra.",
        consequence: [
          {
            resultLabel: "Identidade",
            descriptionTemplate:
              "O visual pega, e o público começa a ir aos shows vestido igual.",
            fanCountChange: 5,
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
            resultLabel: "Fantasia",
            descriptionTemplate:
              "A banda parece uma excursão escolar, e {character2} tira a camisa no meio do show.",
            fanCountChange: -2,
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
        label: "Cada um com a sua roupa",
        description: "A banda é a música, não o figurino.",
        consequence: {
          resultLabel: "Liberdade",
          descriptionTemplate:
            "Tudo segue como antes, e {character1} desiste da ideia.",
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
        label: "Só um detalhe em comum",
        description:
          "Uma cor, um lenço, um broche: algo pequeno que todos usem.",
        consequence: {
          resultLabel: "Assinatura",
          descriptionTemplate:
            "O detalhe vira marca da banda sem ninguém se sentir fantasiado.",
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
        label: "Um figurino de verdade, com costureira",
        description:
          "[{character1}] Se é para combinar, que seja coisa de artista grande.",
        visibleIfAnyInvolvedHas: ["dazzled", "validation_seeker"],
        consequence: [
          {
            resultLabel: "Impacto",
            descriptionTemplate:
              "A banda entra no palco e o bar inteiro para para olhar.",
            fanCountChange: 7,
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
            resultLabel: "Exagerado",
            descriptionTemplate:
              "O figurino pesa, esquenta e rasga na segunda música.",
            fanCountChange: -3,
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
];
