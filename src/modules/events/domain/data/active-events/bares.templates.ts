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
      "O bar paga a banda em cerveja, e {character1} recebe adiantado: a parte de todo mundo, antes do show. {character2} perde a paciência, que já estava curta.",
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
            "Os shows melhoram. {character1} toca de cara amarrada e jura que o som piorou.",
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
        description: "Faz parte do pacote. Do engradado, na verdade.",
        consequence: [
          {
            resultLabel: "Noite animada",
            descriptionTemplate:
              "{character1} faz o show mais solto da história da banda e não lembra de nenhum segundo.",
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
              "{character1} esquece a letra no meio da música e decide improvisar. O público prefere vaiar.",
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
        description:
          "Assim cada um bebe a própria parte, como manda a civilização.",
        consequence: [
          {
            resultLabel: "Combinado",
            descriptionTemplate:
              "O dono aceita, um pouco ofendido, e a briga perde o motivo.",
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
            descriptionTemplate:
              "O dono explica que é cerveja ou nada, e que o nada também está em promoção.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Levar na brincadeira",
        description:
          "[{character1}] Prometer pagar uma rodada para a banda inteira no próximo show. Com a cerveja do bar, claro.",
        visibleIfAnyInvolvedHas: ["informal", "playful"],
        consequence: {
          resultLabel: "Rodada",
          descriptionTemplate:
            "A banda ri, a rodada acontece e ninguém lembra mais da briga. Nem de muita coisa.",
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
      "{character1} fechou {character1:sozinho|sozinha|por conta própria} um show numa terça-feira de chuva, do outro lado da cidade, num bar que ninguém conhece. {character2} diz que {character2:devia ter sido consultado|devia ter sido consultada|alguém devia ter consultado a banda}, nem que fosse para recusar.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cumprir a data",
        description:
          "Palavra dada é palavra cumprida, mesmo quando foi uma péssima palavra.",
        consequence: [
          {
            resultLabel: "Valeu a pena",
            descriptionTemplate:
              "A casa enche de gente que nunca tinha ouvido a banda e só entrou para fugir da chuva. Funciona.",
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
              "Chove, ninguém aparece, e {character2} passa a volta inteira em silêncio. Um silêncio bem alto.",
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
            "O bar não gosta, e {character1} descobre que o cargo de empresário da banda só existia na própria cabeça.",
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
            "A regra acalma os ânimos. A terça-feira continua ruim, mas agora é uma terça-feira aprovada por todos.",
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
              "O bar topa pagar o dobro, que, convenhamos, ainda é pouco.",
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
              "O bar cancela o show e põe o nome da banda numa lista que ninguém quer integrar.",
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
      "Todo show, {character1} chama o mesmo amigo para dar uma palhinha no palco. {character2} garante que o amigo toca mal; a plateia não discorda.",
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
            "O amigo some, e {character1} {character1:fica chateado por semanas|fica chateada por semanas|passa semanas de cara amarrada}. O som, por outro lado, nunca esteve tão bom.",
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
          descriptionTemplate:
            "A palhinha vira um momento esperado do show: é a hora em que o público vai ao banheiro.",
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
        description: "O público parece gostar. Ou é educado.",
        consequence: [
          {
            resultLabel: "Festa",
            descriptionTemplate:
              "O amigo traz a turma dele, e o bar lota de gente que aplaude uma música só.",
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
            "Depois de dois ensaios, o amigo até que toca direito. {character2} fica sem assunto.",
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
      "{character1} inscreveu a banda num concurso da cidade sem avisar ninguém. A final é no sábado, e a banda descobre isso na quinta.",
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
              "A banda vence. O troféu, de plástico dourado, vai para a estante do bar, onde vai juntar poeira com orgulho.",
            fanCountChange: 10,
            happinessChangePercent: 10,
            chance: 35,
          },
          {
            resultLabel: "Finalistas",
            descriptionTemplate:
              "A banda não vence, mas o júri elogia em público, que é o prêmio de consolação favorito dos júris.",
            fanCountChange: 4,
            happinessChangePercent: 4,
            chance: 40,
          },
          {
            resultLabel: "Eliminados",
            descriptionTemplate:
              "A banda cai na primeira rodada, atrás de um trio de sanfonas. Ninguém toca no assunto no ensaio.",
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
            "A apresentação agrada, e o júri anota com carinho o nome de quem compôs a música. Não é a banda.",
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
            "A banda fica aliviada. {character1} passa o sábado imaginando o troféu que nunca teve.",
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
              "A banda entrega o que prometeu, e o júri, intimidado, concorda.",
            fanCountChange: 12,
            happinessChangePercent: 10,
            chance: 40,
          },
          {
            resultLabel: "Vaia",
            descriptionTemplate:
              "A banda tropeça logo na primeira música, e a plateia passa o resto da noite cobrando o troféu.",
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
      "Uma escola de música oferece a {character1} {character1:uma vaga de professor|uma vaga de professora|uma vaga para dar aulas} nas tardes de semana. Tem salário fixo, coisa que ninguém na banda vê há anos.",
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
            "As contas ficam em dia, e {character1} passa a chegar aos ensaios com a energia de quem ensinou escala para crianças a tarde inteira.",
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
            "Os alunos levam os pais, os pais levam os amigos, e a banda ganha a plateia mais bem-comportada da cidade.",
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
            "{character1} recusa. A banda nota a dedicação; o dono do aluguel, nem tanto.",
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
              "A escola aceita, e a banda ganha uma sala com isolamento acústico e um piano que ninguém sabe tocar.",
            fanCountChange: 2,
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "{character1:Demitido|Demitida|Demissão}",
            descriptionTemplate:
              "As aulas são tão preguiçosas que os alunos reclamam. Os alunos de oito anos.",
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
      "Uma república de estudantes contrata a banda para a festa do semestre, com um orçamento que cabe num cofrinho. {character1} e {character2} cuidam da negociação.",
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
            "A festa vira lenda no campus. A banda sai sem voz, sem dinheiro e com três convites para formaturas.",
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
            "A banda toca bem e vai embora antes da bagunça, o que os estudantes consideram falta de caráter.",
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
              "Os estudantes alugam as caixas com o dinheiro da conta de luz, e o show soa como nunca.",
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
              "A república chama outra banda, que topa tocar com o rádio da cozinha. A festa é ótima mesmo assim.",
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
              "A banda vira a trilha oficial das festas da faculdade e ganha um apelido que ninguém vai explicar.",
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
              "A banda perde o ensaio do dia seguinte e boa parte do outro. A república manda lembranças.",
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
      "{character1} desenhou o cartaz do próximo show. É, sendo generoso, estranho.",
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
              "As pessoas arrancam o cartaz dos postes para levar para casa. Ninguém sabe se é admiração ou serviço público.",
            fanCountChange: 5,
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Ninguém entendeu",
            descriptionTemplate:
              "Metade da cidade acha que é um anúncio de circo. A outra metade vai ao show esperando palhaços e não sai totalmente decepcionada.",
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
            "O cartaz novo fica bom. {character1} finge que não ligou, com o mesmo talento do desenho original.",
          fanCountChange: 2,
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pedir para um amigo desenhar",
        description:
          "Alguém da escola de artes deve topar, em troca de ingresso e gratidão eterna.",
        consequence: {
          resultLabel: "Bonito",
          descriptionTemplate:
            "O cartaz fica bonito. {character1} pendura o próprio na parede do quarto, onde ninguém mais precisa ver.",
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
              "O desenho vira a cara da banda, e a cidade reconhece de longe. Alguns atravessam a rua.",
            fanCountChange: 8,
            happinessChangePercent: 10,
            chance: 60,
          },
          {
            resultLabel: "Exagero",
            descriptionTemplate:
              "O desenho aparece no cartaz, na camiseta, no bumbo e na van. A cidade pede trégua.",
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
      "{character1} quer que a banda toque com roupas combinando. {character2} responde que preferia sair da banda, e parece estar falando sério.",
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
              "O visual pega, e o público começa a ir aos shows vestido igual. {character2} {character2:nunca se sentiu tão cercado|nunca se sentiu tão cercada|nunca teve tanta gente em volta}.",
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
            "Tudo segue como antes. {character1} guarda os desenhos dos figurinos numa pasta, para um dia mais receptivo.",
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
            "O detalhe vira marca da banda sem ninguém se sentir fantasiado. Quase ninguém.",
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
              "A banda entra no palco e o bar inteiro para para olhar. Ninguém lembra das músicas, mas todo mundo lembra das lantejoulas.",
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
              "O figurino pesa, esquenta e rasga na segunda música, num lugar que a plateia não esquece.",
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
