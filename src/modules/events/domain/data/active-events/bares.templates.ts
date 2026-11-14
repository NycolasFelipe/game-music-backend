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
      "Uma república de estudantes contrata a banda para a festa de fim de ano, com um orçamento que cabe num cofrinho. {character1} e {character2} cuidam da negociação.",
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
  {
    id: "0209-a-porcao-de-calabresa",
    type: "conflito_membros",
    title: "A porção de calabresa",
    descriptionTemplate:
      "{character1} fechou o show de sábado em troca de porções à vontade, e o dono do bar apertou a mão rápido demais. {character2} queria dinheiro, de preferência em notas que não cheirem a cebola.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar as porções",
        description: "Cachê é cachê, mesmo quando chega num prato de alumínio.",
        consequence: [
          {
            resultLabel: "Banquete",
            descriptionTemplate:
              "O dono cumpre a palavra, e a banda come como nunca comeu na vida. {character2} sai com a barriga cheia e o bolso vazio, nessa ordem de importância.",
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
            resultLabel: "Porção única",
            descriptionTemplate:
              '"À vontade", para o dono, quer dizer uma porção para a banda inteira, servida fria no intervalo. {character2} conta as rodelas de calabresa: dezessete.',
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
        label: "Exigir do dono o cachê em dinheiro",
        description:
          "{character1} volta ao balcão para desfazer o próprio acordo, na frente do garçom.",
        consequence: [
          {
            resultLabel: "Dinheiro na mão",
            descriptionTemplate:
              "O dono paga em dinheiro a metade do que as porções custariam no cardápio. {character1} desconfia que perdeu na troca e não está enganado.",
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
              "O dono responde que acordo é acordo e chama outra banda, que aceita porção e traz o próprio garfo.",
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
        label: "Propor metade em porção, metade em dinheiro",
        description: "Uma proposta que agrada ao dono só pela metade.",
        consequence: {
          resultLabel: "Meio a meio",
          descriptionTemplate:
            "O dono aceita e paga a parte em dinheiro com as moedas do troco. A parte em porção chega com mais cebola do que calabresa.",
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
        label: "Revender as porções para as mesas",
        description:
          "[{character2}] Levar as porções da banda de mesa em mesa e cobrar a metade do preço do cardápio.",
        visibleIfCharacterHas: [[], ["greedy"]],
        consequence: [
          {
            resultLabel: "Lucro",
            descriptionTemplate:
              "As mesas compram tudo, e a banda termina a noite com mais dinheiro do que o dono pagaria. No dia seguinte, o cardápio aparece com preços novos.",
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
            resultLabel: "Concorrência",
            descriptionTemplate:
              "O dono flagra {character2} vendendo calabresa ao lado do balcão e encerra o acordo, a porção e a noite.",
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
    id: "0210-o-tecnico-da-casa",
    type: "conflito_membros",
    title: "O técnico da casa",
    descriptionTemplate:
      "O técnico de som do bar é sobrinho do dono e opera a mesa com um palito de dente no canto da boca. Desde que {character1} pagou um refrigerante para ele, o microfone de {character1} ficou mais alto, e o de {character2} quase sumiu.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar um refrigerante ao técnico também",
        description: "Se o volume tem preço, {character2} paga a tabela.",
        consequence: [
          {
            resultLabel: "Equilíbrio",
            descriptionTemplate:
              "O técnico aceita o refrigerante e sobe o microfone de {character2}. A banda soa equilibrada pela primeira vez, ao custo de duas garrafas por show.",
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
            resultLabel: "Leilão",
            descriptionTemplate:
              "{character1} responde com um sanduíche, e o técnico passa a mexer nos volumes conforme o lanche. O show vira um leilão com trilha sonora.",
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
        label: "Reclamar com o dono",
        description: "Levar o problema direto ao tio do técnico.",
        consequence: [
          {
            resultLabel: "Advertência",
            descriptionTemplate:
              "O dono chama o sobrinho para uma conversa atrás da cozinha. Os volumes voltam ao normal, e o técnico passa a cumprimentar a banda só com o queixo.",
            happinessChangePercent: 2,
            chance: 40,
          },
          {
            resultLabel: "Família primeiro",
            descriptionTemplate:
              "O dono ouve tudo, concorda com a cabeça e defende o sobrinho. No show seguinte, o microfone de {character2} chia sozinho, sem ninguém encostar nele.",
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
        label: "Levar uma mesa de som emprestada",
        description:
          "Uma mesa de som trazida de ônibus, que a banda vai ter que aprender a operar no escuro.",
        consequence: {
          resultLabel: "Autonomia",
          descriptionTemplate:
            "A banda controla o próprio volume e passa metade do show olhando para os botões. O técnico assiste do balcão, de braços cruzados.",
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
        label: "Vigiar a mesa de som durante o show",
        description:
          "[{character2}] Passar o show inteiro de olho no técnico, virando a cabeça para trás a cada refrão.",
        visibleIfCharacterHas: [[], ["paranoid"]],
        consequence: [
          {
            resultLabel: "Flagrante",
            descriptionTemplate:
              "{character2} pega o técnico baixando o volume no meio da música e aponta para ele do palco. O bar inteiro se vira, e o técnico devolve o volume, vermelho.",
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
            resultLabel: "Torcicolo",
            descriptionTemplate:
              "O técnico não faz nada de errado a noite toda. {character2} termina o show com torcicolo e a certeza de que ele percebeu a vigilância.",
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
    id: "0211-o-banheiro-camarim",
    type: "conflito_membros",
    title: "O banheiro camarim",
    descriptionTemplate:
      "O camarim do bar é o banheiro, que também é o banheiro dos clientes. Antes de cada show, {character1} passa quarenta minutos lá dentro, de porta trancada, diante do espelho, e a fila do lado de fora já começou a vaiar {character2}, que só estava esperando a vez.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Impor dez minutos para cada um",
        description: "Um relógio pendurado na porta e um rodízio sem exceções.",
        consequence: {
          resultLabel: "Rodízio",
          descriptionTemplate:
            "O rodízio funciona. {character1} sai do banheiro com metade do penteado pronto e toca o show passando a mão no lado que faltou.",
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
        label: "Exigir que a banda se arrume em casa",
        description:
          "A banda chega pronta, e o banheiro volta para quem precisa dele.",
        consequence: [
          {
            resultLabel: "Pronta entrega",
            descriptionTemplate:
              "A banda chega arrumada, de ônibus, e o visual sobrevive até o segundo ponto. A fila do banheiro nunca andou tão rápido.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Chuva no caminho",
            descriptionTemplate:
              "Chove entre o ponto de ônibus e o bar. {character1} sobe ao palco com o cabelo de quem atravessou um rio e culpa {character2} pela ideia.",
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
        label: "Deixar {character1} usar o banheiro à vontade",
        description: "O visual faz parte do show. A fila faz parte do bar.",
        consequence: {
          resultLabel: "Fila histórica",
          descriptionTemplate:
            "{character1} sai do banheiro impecável, sob vaias. A fila desiste e vai ao banheiro da padaria ao lado, e metade dela não volta.",
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
        label: "Pedir a opinião da fila",
        description:
          "[{character1}] Abrir a porta do banheiro e perguntar à fila se o visual está bom.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Aprovação",
            descriptionTemplate:
              "A fila aprova o visual, por pressa, e {character1} sobe ao palco com uma confiança que dura o show inteiro. A fila também agradece.",
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
            resultLabel: "Júri popular",
            descriptionTemplate:
              "A fila responde com sinceridade, e alguém sugere voltar para casa e começar de novo. {character1} toca o show inteiro de boné.",
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
    id: "0212-a-briga-da-mesa-quatro",
    type: "conflito_membros",
    title: "A briga da mesa quatro",
    descriptionTemplate:
      "No meio da música mais calma do repertório, duas mesas começam a trocar empurrões por causa da última asinha de frango. {character1} quer parar o show; {character2} acha que banda de verdade toca até a última cadeira voar.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Parar o show",
        description: "Silêncio no palco até as mesas se acalmarem.",
        consequence: [
          {
            resultLabel: "Trégua",
            descriptionTemplate:
              "Sem música, os brigões ficam sem assunto e voltam a sentar. Um deles ainda pede a música de volta, do ponto em que parou.",
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
            resultLabel: "Bar vazio",
            descriptionTemplate:
              "A briga continua no silêncio, mais audível, e o resto do bar vai embora antes da sobremesa. O cachê sai proporcional ao público.",
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
        label: "Continuar tocando",
        description: "A banda não é juiz nem segurança.",
        consequence: [
          {
            resultLabel: "Trilha sonora",
            descriptionTemplate:
              "A briga acaba no refrão, com os dois brigões abraçados e cantando junto. O dono considera a noite um sucesso de público.",
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
            resultLabel: "Copo voador",
            descriptionTemplate:
              "Um copo atravessa o bar e acerta o prato da bateria, no tempo certo. A banda termina a música com a cara de quem já esperava por isso.",
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
        label: "Trocar para uma música lenta",
        description: "Apostar que ninguém consegue brigar ouvindo uma balada.",
        consequence: [
          {
            resultLabel: "Dança",
            descriptionTemplate:
              "Os brigões se olham sem saber o que fazer, e um casal de outra mesa começa a dançar entre eles. A briga perde o palco.",
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
            resultLabel: "Provocação",
            descriptionTemplate:
              "Um dos brigões entende a balada como deboche e passa a discutir com a banda. Pela primeira vez, o bar inteiro presta atenção no palco.",
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
        label: "Mandar parar pelo microfone",
        description:
          "[{character2}] Gritar ao microfone, no volume máximo, que a briga está atrapalhando o solo.",
        visibleIfCharacterHas: [[], ["hothead"]],
        consequence: [
          {
            resultLabel: "Autoridade",
            descriptionTemplate:
              "As duas mesas param na hora e sentam como alunos depois do sinal. O dono oferece a {character2} um emprego na porta.",
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
            resultLabel: "Terceira mesa",
            descriptionTemplate:
              "As duas mesas param de brigar entre si e passam a brigar com {character2}. A banda descobre que o palco não tem saída pelos fundos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
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
    id: "0213-o-pote-de-gorjeta",
    type: "conflito_membros",
    title: "O pote de gorjeta",
    descriptionTemplate:
      "O bar deixa a banda pôr um pote de gorjeta no palco. {character2} colocou o pote bem na frente do próprio microfone, e a plateia passou a agradecer só a {character2}, inclusive pelos solos de {character1}.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dividir a gorjeta igualmente",
        description: "O pote é da banda, não de quem está mais perto dele.",
        consequence: {
          resultLabel: "Partilha",
          descriptionTemplate:
            "A gorjeta passa a ser dividida no fim da noite, moeda por moeda, em cima do bumbo. {character2} confere a conta duas vezes, por desconfiança da própria matemática.",
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
        label: "Mudar o pote para o meio do palco",
        description: "Na frente do bumbo, onde ninguém é dono de nada.",
        consequence: [
          {
            resultLabel: "Território neutro",
            descriptionTemplate:
              "No meio do palco, o pote enche menos. Sem um rosto para agradecer, a plateia guarda o dinheiro para a próxima rodada.",
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
            resultLabel: "Chute",
            descriptionTemplate:
              "Na terceira música, {character1} chuta o pote sem querer, com o pé direito. As moedas rolam para baixo das mesas e viram gorjeta do garçom.",
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
        label: "Deixar o pote onde está",
        description: "Quem põe o pote colhe a moeda.",
        consequence: [
          {
            resultLabel: "Passagem paga",
            descriptionTemplate:
              "{character2} paga o ônibus da banda inteira com as moedas, todo sábado. {character1} aceita a passagem de cara amarrada.",
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
            resultLabel: "Ressentimento",
            descriptionTemplate:
              "{character2} sai de cada show com o bolso tilintando. {character1} passa a tocar os solos de costas para o pote, como se isso mudasse alguma coisa.",
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
        label: "Pôr um segundo pote no palco",
        description:
          "[{character1}] Colocar um pote próprio na frente do próprio microfone, maior que o de {character2}.",
        visibleIfCharacterHas: [["envious"]],
        consequence: [
          {
            resultLabel: "Corrida das moedas",
            descriptionTemplate:
              "A plateia gosta da disputa e passa a dar gorjeta aos dois potes, torcendo. A banda ganha o dobro e não troca uma palavra no caminho de volta.",
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
            resultLabel: "Pote vazio",
            descriptionTemplate:
              "O pote de {character1} passa a noite vazio, iluminado pelo refletor do palco. Alguém deixa uma tampinha de garrafa, por pena.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
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
    id: "0214-o-pedido-no-guardanapo",
    type: "conflito_membros",
    title: "O pedido no guardanapo",
    descriptionTemplate:
      "Um cliente manda ao palco um guardanapo com o nome de uma música romântica que toca em toda festa de casamento, e uma nota dobrada por baixo. {character1} já está afinando; {character2} quer devolver o guardanapo intacto.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar o pedido",
        description: "A nota dobrada fala mais alto que o repertório.",
        consequence: [
          {
            resultLabel: "Bis pago",
            descriptionTemplate:
              "O cliente canta junto, chora no segundo refrão e manda outro guardanapo, com outra nota. {character2} toca as duas vezes olhando para o teto.",
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
            resultLabel: "Só o refrão",
            descriptionTemplate:
              "Ninguém na banda sabe a letra além do refrão, e o refrão dura a música inteira. O cliente pega a nota de volta.",
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
        label: "Recusar o pedido",
        description:
          "A banda toca o próprio repertório, com ou sem guardanapo.",
        consequence: {
          resultLabel: "Nota devolvida",
          descriptionTemplate:
            "{character2} devolve o guardanapo com um sorriso. O cliente vai embora e leva junto a mesa dele, a maior do bar.",
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
        label: "Prometer o pedido para o fim do show",
        description:
          "Tocar o repertório inteiro antes e torcer para o cliente cansar.",
        consequence: [
          {
            resultLabel: "Esquecido",
            descriptionTemplate:
              "O cliente dorme na mesa antes do fim. A banda fica com a nota e com a consciência pesada, nessa ordem.",
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
            resultLabel: "Cobrança",
            descriptionTemplate:
              "O cliente grita o nome da música em todo intervalo. No fim, a banda toca o pedido para um bar que já foi embora.",
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
        label: "Tocar o pedido num arranjo próprio",
        description:
          "[{character2}] Aceitar o pedido, mas num arranjo tão diferente que a música fique irreconhecível.",
        visibleIfCharacterHas: [[], ["purist"]],
        consequence: [
          {
            resultLabel: "Releitura",
            descriptionTemplate:
              "O cliente leva dois minutos para reconhecer a música e, quando reconhece, aplaude de pé. {character2} diz que a música finalmente ficou boa.",
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
            resultLabel: "Irreconhecível",
            descriptionTemplate:
              "O cliente não reconhece a música e pede o dinheiro de volta. {character2} considera a noite uma vitória artística.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0215-o-novo-dono",
    type: "conflito_membros",
    title: "O novo dono",
    descriptionTemplate:
      "O bar mudou de dono. O novo dono gosta de {character1}, mas acha a banda grande demais para o palco e para o caixa, e propõe que {character1} toque {character1:sozinho|sozinha|sem a banda}, de voz e violão, com o cachê que antes era dividido entre todos. {character2} ouve a proposta do balcão.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar e pôr o cachê no caixa da banda",
        description:
          "{character1} toca às sextas, e o dinheiro vai para todos.",
        consequence: [
          {
            resultLabel: "Sócios",
            descriptionTemplate:
              "O cachê entra no caixa, e a banda passa as sextas numa mesa do bar, assistindo. Algumas mesas pedem a banda de volta.",
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
            resultLabel: "Contando palmas",
            descriptionTemplate:
              "{character1} faz sucesso, e o novo dono pede mais datas. {character2} assiste do balcão, contando as palmas.",
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
        label: "Exigir a banda inteira no palco",
        description: "O bar contrata todos, ou ninguém toca.",
        consequence: [
          {
            resultLabel: "Contratados",
            descriptionTemplate:
              "O novo dono cede, mas corta o cachê e tira dois refletores do palco. A banda fica, com menos luz e mais espaço.",
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
            resultLabel: "Bar perdido",
            descriptionTemplate:
              "O novo dono agradece e contrata um tecladista que toca sozinho e não divide nada.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Deixar {character1} aceitar sem dividir",
        description: "Cada um cuida do próprio bolso.",
        consequence: {
          resultLabel: "Carreira paralela",
          descriptionTemplate:
            "{character1} passa a ter dinheiro nas sextas e explicações nos sábados. Os ensaios ficam mais curtos e mais silenciosos.",
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
        label: "Chamar a banda ao palco de surpresa",
        description:
          "[{character1}] Aceitar o voz e violão e, na primeira noite, chamar a banda inteira para subir na segunda música.",
        visibleIfCharacterHas: [["loyal"]],
        consequence: [
          {
            resultLabel: "Golpe de palco",
            descriptionTemplate:
              "O bar aplaude de pé, e o novo dono recontrata a banda inteira com a cara de quem perdeu uma aposta.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Porta da rua",
            descriptionTemplate:
              "O novo dono desliga o som no meio da segunda música e dispensa todo mundo, {character1} junto. A banda volta para casa unida e sem bar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
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
    id: "0216-a-comanda-da-banda",
    type: "conflito_membros",
    title: "A comanda da banda",
    descriptionTemplate:
      "O bar deixa a banda consumir por conta do cachê, numa comanda de papel presa ao balcão. Na hora do acerto, a comanda passa do cachê, e o item mais caro é um filé à parmegiana que {character1} pediu no intervalo e jura que dividiu com todo mundo. {character2} não viu ninguém dividindo.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Descontar o filé de {character1}",
        description: "Quem pediu o filé paga o filé, até a última batata.",
        consequence: {
          resultLabel: "Conta separada",
          descriptionTemplate:
            "{character1} paga o filé do próprio bolso e anuncia que nunca mais divide nada com a banda. A banda tenta lembrar da última vez que isso aconteceu e não consegue.",
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
        label: "Dividir a dívida entre todos",
        description: "A banda é uma família, inclusive na hora da conta.",
        consequence: {
          resultLabel: "Prejuízo coletivo",
          descriptionTemplate:
            "A banda sai do bar devendo, com uma comanda nova já aberta para o próximo show. {character2} guarda a velha na carteira, como prova.",
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
        label: "Acabar com a comanda",
        description:
          "Daqui para a frente, cada um paga o que consumir, na hora.",
        consequence: [
          {
            resultLabel: "Contas em dia",
            descriptionTemplate:
              "A banda passa a beber menos e a receber o cachê inteiro. O garçom sente falta do movimento.",
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
            resultLabel: "Sede",
            descriptionTemplate:
              "Sem comanda, a banda descobre quanto custa a água do bar e toca o show de boca seca. {character1} culpa {character2}, que culpa o filé.",
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
        label: "Revisar a comanda item por item",
        description:
          "[{character2}] Sentar com o garçom e conferir cada risco da comanda contra a memória da noite.",
        visibleIfCharacterHas: [[], ["perfectionist"]],
        consequence: [
          {
            resultLabel: "Erro de soma",
            descriptionTemplate:
              "{character2} encontra três cervejas de outra mesa e um segundo filé que ninguém pediu. O bar devolve a diferença e uma porção de desculpas.",
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
            resultLabel: "Tudo certo",
            descriptionTemplate:
              "A comanda está certa, risco por risco, e a revisão leva uma hora. {character1} pede outro filé enquanto espera.",
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
    id: "0217-o-cache-da-semana-que-vem",
    type: "oportunidade_externa",
    title: "O cachê da semana que vem",
    descriptionTemplate:
      "Pela terceira semana seguida, o dono do bar avisa a {character1} que o cachê sai na semana que vem. Em compensação, oferece à banda todas as sextas do próximo mês, também pagas na semana que vem.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar as sextas",
        description:
          "[{character1}] Palco garantido, pagamento a combinar com o futuro.",
        consequence: [
          {
            resultLabel: "Pagou tudo",
            descriptionTemplate:
              "No fim do mês, o dono paga tudo de uma vez, em notas miúdas contadas na frente do caixa. A banda nunca teve tanto dinheiro na mão, nem tão amassado.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Semana que vem",
            descriptionTemplate:
              "O mês acaba, as sextas acabam, e o cachê continua marcado para a semana que vem. O dono agora cumprimenta a banda pelo nome.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar até receber o atrasado",
        description:
          "[{character1}] Nenhuma sexta antes de aparecer o dinheiro das três semanas.",
        consequence: [
          {
            resultLabel: "Lata de biscoito",
            descriptionTemplate:
              "O dono paga o atrasado na hora, com dinheiro tirado de uma lata de biscoito atrás do balcão. As sextas vão para outra banda.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Sem palco",
            descriptionTemplate:
              "O dono diz que vai pensar e contrata outra banda para as sextas. O atrasado, ele garante, sai na semana que vem.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Cobrar o cachê ao microfone",
        description:
          "[{character1}] Lembrar o dono da dívida no palco, entre uma música e outra.",
        consequence: [
          {
            resultLabel: "Vergonha pública",
            descriptionTemplate:
              "A plateia vaia o dono, que paga no intervalo para recuperar o próprio balcão.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Riscados",
            descriptionTemplate:
              "O dono paga no intervalo, sem olhar para o palco, e risca a banda de todas as sextas do mês com a caneta do caixa.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Esperar no balcão até o dono pagar",
        description:
          "[{character1}] Sentar no balcão, sem pressa e sem pedir nada, até o caixa abrir.",
        visibleIfCharacterHas: [["stable"]],
        consequence: [
          {
            resultLabel: "Vencido pelo cansaço",
            descriptionTemplate:
              "Às duas da manhã, o dono paga tudo para conseguir fechar o bar. {character1} confere o dinheiro com a mesma calma, nota por nota.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Porta dos fundos",
            descriptionTemplate:
              "O dono sai pela porta dos fundos e deixa {character1} no balcão com o rapaz da limpeza. O cachê fica para a semana que vem.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0218-a-noite-do-bolero",
    type: "oportunidade_externa",
    title: "A noite do bolero",
    descriptionTemplate:
      "O dono do bar quer criar a Noite do Bolero, toda quinta, para atrair o público que janta cedo e paga a conta inteira. Oferece o dobro do cachê se a banda aprender doze boleros em duas semanas. {character1} já está com os olhos marejados; {character2} nunca tocou um bolero na vida.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aprender os doze boleros",
        description:
          "Duas semanas de ensaio dobrado para um público que sabe cada letra de cor.",
        consequence: [
          {
            resultLabel: "Quinta lotada",
            descriptionTemplate:
              "A Noite do Bolero lota de casais que dançam colados e deixam gorjeta. A banda ganha um público que nunca vai ouvir as músicas autorais.",
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
            resultLabel: "Bolero torto",
            descriptionTemplate:
              "A banda aprende os doze pela metade, e os casais percebem pelo passo. Um senhor da pista passa a marcar o ritmo com o pé, e a banda segue o pé dele.",
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
        label: "Propor metade bolero, metade repertório da banda",
        description: "Seis boleros e seis músicas autorais, misturados.",
        consequence: [
          {
            resultLabel: "Mistura",
            descriptionTemplate:
              "Os casais dançam os boleros e usam as outras músicas para ir ao banheiro. O dono paga uma vez e meia o cachê e chama isso de meio-termo.",
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
            resultLabel: "Trio de violões",
            descriptionTemplate:
              "O dono responde que bolero pela metade não existe e chama um trio de violões que sabe todos de cor.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a noite temática",
        description:
          "A banda não troca de estilo por causa de uma quinta-feira.",
        consequence: {
          resultLabel: "Quinta livre",
          descriptionTemplate:
            "A banda recusa, e o trio de violões que fica com as quintas compra uma van no fim do ano.",
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
        label: "Compor um bolero da banda",
        description:
          "[{character1}] Escrever um bolero próprio para estrear na primeira quinta, com dedicatória ao microfone.",
        visibleIfCharacterHas: [["romantic"]],
        consequence: [
          {
            resultLabel: "Hino da quinta",
            descriptionTemplate:
              "O bolero de {character1} vira o mais pedido da noite, e os casais pedem bis olhando um para o outro. {character2} admite que tocou com sentimento.",
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
            resultLabel: "Dedicatória errada",
            descriptionTemplate:
              "{character1} dedica o bolero a alguém da plateia que tinha vindo acompanhado. A Noite do Bolero ganha a primeira briga de casal.",
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
    id: "0219-o-aniversario-do-bar",
    type: "oportunidade_externa",
    title: "O aniversário do bar",
    descriptionTemplate:
      "O bar faz vinte anos, e o dono quer a banda tocando da abertura ao fechamento, das oito às quatro. Ele procura {character1} com a proposta: o cachê de sempre, bolo à vontade e uma placa na parede com o nome da banda.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar a noite inteira",
        description:
          "[{character1}] Oito horas de show pelo preço de duas, mais o bolo.",
        consequence: [
          {
            resultLabel: "Maratona",
            descriptionTemplate:
              "A banda toca até as quatro e repete o repertório três vezes. Depois da meia-noite, ninguém percebe. A placa aparece na parede, com o nome da banda escrito errado.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Sem fôlego",
            descriptionTemplate:
              "Na quinta hora, {character1} toca {character1:sentado|sentada|numa cadeira}, e na sétima o bolo acaba. A placa nunca aparece.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Tocar só até a meia-noite",
        description:
          "[{character1}] Quatro horas, o mesmo cachê e metade do bolo.",
        consequence: {
          resultLabel: "Meia festa",
          descriptionTemplate:
            "O dono aceita e liga o rádio depois da meia-noite. A festa segue animada até as quatro, e ninguém reclama da troca.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Pedir o dobro do cachê",
        description:
          "[{character1}] Aniversário é dia de presente, e a banda quer o dela.",
        consequence: [
          {
            resultLabel: "Presente",
            descriptionTemplate:
              "O dono paga o dobro e tira a banda da placa, porque homenagem paga não conta.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Banda de baile",
            descriptionTemplate:
              "O dono contrata uma banda de baile que toca a noite inteira pelo cachê de sempre e ainda traz o próprio bolo.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
      {
        label: "Chamar os músicos da plateia para tocar junto",
        description:
          "[{character1}] Transformar a festa numa roda e dividir as oito horas com quem aparecer com um instrumento.",
        visibleIfCharacterHas: [["informal"]],
        consequence: [
          {
            resultLabel: "Roda",
            descriptionTemplate:
              "Aparecem onze músicos, dois pandeiros e um acordeom. A banda descansa metade da noite e sai na placa ao lado de um acordeonista que ninguém conhece.",
            happinessChangePercent: 8,
            chance: 70,
          },
          {
            resultLabel: "Fila no palco",
            descriptionTemplate:
              "Os convidados não largam os instrumentos, e a banda passa a madrugada esperando a vez de tocar no próprio show.",
            happinessChangePercent: -4,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0220-o-jogo-na-televisao",
    type: "oportunidade_externa",
    title: "O jogo na televisão",
    descriptionTemplate:
      "Noite de final de campeonato, e o dono quer a banda no palco com a televisão ligada logo atrás, sem som. Promete o dobro do cachê, porque o bar vai lotar. {character1} topa na hora; {character2} pergunta para onde a plateia vai olhar.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar com a televisão ligada",
        description: "Dobro do cachê, metade da atenção.",
        consequence: [
          {
            resultLabel: "Gol no refrão",
            descriptionTemplate:
              "O time da casa marca no meio do refrão, e o bar explode. A banda fica com o crédito e não desmente.",
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
            resultLabel: "Show de costas",
            descriptionTemplate:
              "O bar passa o show inteiro olhando por cima da banda. Na hora do pênalti, alguém pede silêncio, e a banda obedece.",
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
        label: "Tocar só no intervalo e depois do jogo",
        description: "Dividir a noite com a partida, sem disputar a atenção.",
        consequence: [
          {
            resultLabel: "Festa da vitória",
            descriptionTemplate:
              "O time vence, e a banda sobe ao palco com o bar inteiro querendo cantar. O dono paga o cachê dobrado e ainda uma rodada.",
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
            resultLabel: "Velório",
            descriptionTemplate:
              "O time perde, e a banda sobe ao palco para um bar que só quer ir embora. A primeira música do repertório é a mais triste, por azar.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Pedir ao dono que desligue a televisão",
        description: "Show é show. Jogo é em outro lugar.",
        consequence: {
          resultLabel: "Bar da esquina",
          descriptionTemplate:
            "O dono desliga a televisão, e o público vai ver o jogo no bar da esquina. A banda toca para o dono, o garçom e um senhor que não gosta de futebol.",
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
        label: "Narrar o jogo entre as músicas",
        description:
          "[{character1}] Narrar os lances ao microfone, de costas para a televisão, como se estivesse vendo.",
        visibleIfCharacterHas: [["playful"]],
        consequence: [
          {
            resultLabel: "Narrador da casa",
            descriptionTemplate:
              "A narração inventada de {character1} é melhor que a do jogo, e o bar passa a olhar para o palco para saber o placar. O dono reserva a banda para a próxima final.",
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
            resultLabel: "Placar errado",
            descriptionTemplate:
              "{character1} narra um gol do time da casa que não aconteceu. A comemoração dura até alguém olhar para a televisão.",
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
    id: "0221-a-mesa-de-sinuca",
    type: "oportunidade_externa",
    title: "A mesa de sinuca",
    descriptionTemplate:
      "Um bar sem palco oferece à banda as noites de sábado, com uma condição: o palco é a mesa de sinuca, coberta por uma tábua, e os jogadores querem a mesa de volta às onze. {character1} já mediu a tábua; {character2} mediu a altura do teto.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tocar em cima da mesa",
        description: "Palco alto, piso de feltro e saída por qualquer lado.",
        consequence: [
          {
            resultLabel: "Palco alto",
            descriptionTemplate:
              "Pela primeira vez a banda toca acima da plateia, e o bar adora. A tábua aguenta, por educação.",
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
            resultLabel: "Teto baixo",
            descriptionTemplate:
              "Na terceira música, {character2} bate a cabeça na luminária da mesa e toca o resto do show {character2:abaixado|abaixada|de joelhos}. Os jogadores cobram a luminária.",
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
        label: "Tocar no chão, ao lado da mesa",
        description:
          "A banda divide o espaço com os jogadores, que continuam jogando.",
        consequence: {
          resultLabel: "Taco no braço",
          descriptionTemplate:
            "A banda toca espremida contra a parede e desvia dos tacos a cada jogada. O show vira uma partida com trilha sonora.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Recusar o sábado",
        description:
          "Banda que se respeita não toca em cima de mesa de sinuca.",
        consequence: {
          resultLabel: "Sem sábado",
          descriptionTemplate:
            "A banda recusa, e o bar contrata um sanfoneiro que cabe numa cadeira.",
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
        label: "Tocar em volta da mesa com o jogo rolando",
        description:
          "[{character1}] Destampar a mesa, deixar a partida seguir e tocar cada música no ritmo das tacadas.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Sinuca musical",
            descriptionTemplate:
              "Os jogadores entram na brincadeira e passam a jogar no tempo da música. O bar assiste à partida mais musical da história da cidade.",
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
            resultLabel: "Bola sete",
            descriptionTemplate:
              "Uma bola pula da mesa e acerta o pedal de {character2}, que pisa no lugar errado pelo resto do show. Os jogadores cobram a bola perdida.",
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
    id: "0222-o-sanduiche-da-banda",
    type: "oportunidade_externa",
    title: "O sanduíche da banda",
    descriptionTemplate:
      "O dono do bar quer pôr no cardápio um sanduíche com o nome da banda e oferece dez por cento de cada venda. A receita é dele: pão, ovo e o que sobrar na cozinha. {character1} acha uma honra; {character2} acha que a banda vai ficar conhecida pelo cheiro.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o sanduíche como está",
        description:
          "Dez por cento de alguma coisa é mais do que a banda ganha hoje.",
        consequence: [
          {
            resultLabel: "Mais pedido",
            descriptionTemplate:
              'O sanduíche vende mais que a cerveja, e o bar passa a anunciar o show como "a banda do sanduíche". Ninguém sabe mais o que veio primeiro.',
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
            resultLabel: "Indigestão",
            descriptionTemplate:
              "Dois clientes passam mal na mesma noite, e o sanduíche sai do cardápio com o nome da banda junto. Da memória do bairro, demora mais.",
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
        label: "Exigir que a banda decida a receita",
        description: "Se o nome é da banda, o recheio também é.",
        consequence: [
          {
            resultLabel: "Receita da casa",
            descriptionTemplate:
              "A banda passa uma tarde na cozinha e cria um sanduíche decente. O dono cobra os ingredientes do teste.",
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
            resultLabel: "Briga de cozinha",
            descriptionTemplate:
              "{character1} e {character2} não concordam nem sobre o pão. O dono desiste e batiza o sanduíche com o nome do próprio cachorro.",
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
        label: "Recusar o nome no cardápio",
        description: "A banda é de música, não de lanche.",
        consequence: {
          resultLabel: "Especial do dono",
          descriptionTemplate:
            'O sanduíche entra no cardápio como "Especial do dono" e vende bem. {character1} pede um toda noite, em luto.',
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
        label: "Criar um lanche para cada música",
        description:
          "[{character1}] Montar um cardápio inteiro, com um sanduíche para cada música do repertório.",
        visibleIfCharacterHas: [["creative"]],
        consequence: [
          {
            resultLabel: "Cardápio musical",
            descriptionTemplate:
              "Cada música vira um lanche, e os clientes pedem a música junto com o pedido. O show passa a ser montado pela cozinha.",
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
            resultLabel: "Lanche do solo",
            descriptionTemplate:
              "O lanche da música mais longa leva onze ingredientes e quarenta minutos de preparo. A cozinha desiste antes da plateia.",
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
    id: "0223-o-pedido-de-casamento",
    type: "oportunidade_externa",
    title: "O pedido de casamento",
    descriptionTemplate:
      "No intervalo, um cliente procura {character1}: vai pedir a namorada em casamento no meio do show e precisa da música do casal, que a banda nunca tocou. Ele cantarola a melodia, errada, e deixa o dinheiro no balcão.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar a música do jeito que der",
        description:
          "[{character1}] Seguir a melodia cantarolada e confiar no momento.",
        consequence: [
          {
            resultLabel: "Disse sim",
            descriptionTemplate:
              "A namorada aceita no primeiro refrão, chorando, e não percebe que a música está em outro tom. O bar aplaude o casal e, por tabela, a banda.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Que música é essa?",
            descriptionTemplate:
              "A namorada só reconhece a música no fim e pergunta, com carinho, que música é essa. O pedido acontece mesmo assim, num silêncio que a banda não vai esquecer.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Trocar por uma balada do repertório",
        description:
          "[{character1}] Oferecer ao casal uma música que a banda sabe tocar.",
        consequence: {
          resultLabel: "Trilha substituta",
          descriptionTemplate:
            "O pedido dá certo, e o casal adota a balada da banda como a nova música do casal. A antiga fica para os aniversários.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Recusar e devolver o dinheiro",
        description:
          "[{character1}] Melhor um pedido em silêncio do que um pedido desafinado.",
        consequence: {
          resultLabel: "Pedido a seco",
          descriptionTemplate:
            "O cliente pede a namorada em casamento em silêncio, de joelhos no chão grudento do bar. Dá certo, e o casal passa a frequentar o bar da frente.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Aprender a música no intervalo",
        description:
          "[{character1}] Levar o cliente para a calçada e tirar a música de ouvido, nota por nota, antes do segundo set.",
        visibleIfCharacterHas: [["professional"]],
        consequence: [
          {
            resultLabel: "Como no original",
            descriptionTemplate:
              "{character1} toca a música inteira, certa, como se ensaiasse havia meses. O casal convida a banda para tocar no casamento, com cachê.",
            happinessChangePercent: 8,
            chance: 70,
          },
          {
            resultLabel: "Intervalo longo",
            descriptionTemplate:
              "O cliente não lembra a segunda parte, e o intervalo dura quarenta minutos. Metade do bar vai embora antes do pedido.",
            happinessChangePercent: -4,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0224-musica-de-fundo",
    type: "decisao_criativa",
    title: "Música de fundo",
    descriptionTemplate:
      "O dono do bar pede a {character1} que a banda toque mais baixo, quase sem bateria, porque os clientes vieram para conversar. Ele chama isso de música ambiente e aponta um vaso de planta como referência de volume.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Tocar baixo como o dono pediu",
        description:
          "[{character1}] Volume de vaso de planta, a noite inteira.",
        consequence: [
          {
            resultLabel: "Ouvido atento",
            descriptionTemplate:
              "Com o bar no volume da conversa, uma mesa presta atenção nas letras pela primeira vez e pede o nome da banda. Anota no guardanapo.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Decoração",
            descriptionTemplate:
              "A banda toca a noite inteira sem que ninguém olhe para o palco. O dono elogia do mesmo jeito que elogia a cortina.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar no volume de sempre",
        description: "[{character1}] A banda é uma banda, não um vaso.",
        consequence: [
          {
            resultLabel: "Conversa encerrada",
            descriptionTemplate:
              "As conversas param, e o bar passa a assistir ao show contra a própria vontade. Algumas mesas gostam.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Último sábado",
            descriptionTemplate:
              "Os clientes reclamam no caixa, e o dono avisa que aquele foi o último show da banda na casa. Avisa em voz baixa, por coerência.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Trocar a bateria por um pandeiro",
        description:
          "[{character1}] Baixar o volume mudando o arranjo, não a vontade.",
        consequence: {
          resultLabel: "Versão de bolso",
          descriptionTemplate:
            "O repertório ganha arranjos leves, e algumas músicas melhoram. Ninguém na banda vai admitir isso em voz alta.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Tocar ainda mais baixo",
        description:
          "[{character1}] Aproveitar que ninguém está ouvindo para tocar sem medo de errar.",
        visibleIfCharacterHas: [["insecure"]],
        consequence: [
          {
            resultLabel: "Sem testemunhas",
            descriptionTemplate:
              "Sem ninguém ouvindo, {character1} faz o melhor show da vida, sem errar uma nota. Ninguém percebe, e {character1} prefere assim.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Alguém ouviu",
            descriptionTemplate:
              "No meio do melhor solo, uma mesa para de conversar para prestar atenção. {character1} erra na hora.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0225-as-onze-em-ponto",
    type: "decisao_criativa",
    title: "As onze em ponto",
    descriptionTemplate:
      "A rua do bar tem lei do silêncio, e o dono desliga a tomada às onze em ponto, nem que seja no meio do refrão. O show só começa às dez e quinze, depois do último prato da cozinha. {character1} quer cortar metade do repertório; {character2} quer tocar tudo mais rápido.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cortar metade do repertório",
        description: "Só as músicas que funcionam, sem as que a banda gosta.",
        consequence: {
          resultLabel: "Set enxuto",
          descriptionTemplate:
            "A banda toca seis músicas e termina às dez e cinquenta e nove. {character2} lista as músicas cortadas no caminho de volta, em voz alta.",
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
        label: "Tocar tudo mais rápido",
        description: "O repertório inteiro, em velocidade de fim de festa.",
        consequence: [
          {
            resultLabel: "Recorde",
            descriptionTemplate:
              "A banda toca doze músicas em quarenta e cinco minutos, e o público sai sem fôlego, como a banda. As baladas viram outra coisa.",
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
            resultLabel: "Atropelo",
            descriptionTemplate:
              "Na pressa, a banda começa duas músicas diferentes ao mesmo tempo, duas vezes. O dono desliga a tomada às onze, aliviado.",
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
        label: "Pedir ao dono para começar antes do jantar",
        description:
          "Tocar às nove, com a cozinha funcionando e os pratos passando.",
        consequence: [
          {
            resultLabel: "Plateia de garfo",
            descriptionTemplate:
              "O show começa às nove, e a banda toca para quem está mastigando. O repertório cabe inteiro, e os aplausos vêm abafados.",
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
            resultLabel: "Cozinha manda",
            descriptionTemplate:
              "O dono explica que, antes do último prato, quem manda no bar é a cozinha. A banda toca às dez e quinze, agora com menos tempo para discutir.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar um set extra no fim da tarde",
        description:
          "[{character1}] Chegar às cinco e tocar o repertório cortado para as cadeiras ainda viradas em cima das mesas.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Sessão das cinco",
            descriptionTemplate:
              "Quem sai do trabalho para no bar e fica para os dois shows. O dono cria a sessão das cinco e não paga nada a mais por ela.",
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
            resultLabel: "Sem voz",
            descriptionTemplate:
              "A banda toca às cinco para o garçom e o rodo, e às dez e quinze já não tem voz. {character1} ainda queria um terceiro set.",
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
    id: "0226-a-mesa-do-canto",
    type: "decisao_criativa",
    title: "A mesa do canto",
    descriptionTemplate:
      "Um senhor ocupa a mesa do canto toda sexta, há mais tempo que o próprio bar, e pede sempre a mesma valsa antiga. É o único que aplaude todas as músicas. {character1} quer pôr a valsa no repertório fixo; {character2} acha que a banda não é rádio de pedidos.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pôr a valsa no repertório",
        description: "Uma valsa por noite para o único fã garantido.",
        consequence: [
          {
            resultLabel: "Fã número um",
            descriptionTemplate:
              "O senhor dança a valsa sozinho entre as mesas, e o bar inteiro passa a esperar o momento. A valsa vira a música mais aplaudida da banda, e {character2} não sabe se comemora.",
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
            resultLabel: "Pista vazia",
            descriptionTemplate:
              "A valsa entra entre duas músicas rápidas e esvazia a pista toda sexta. O senhor aplaude, e só ele.",
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
        label: "Manter só o repertório da banda",
        description: "O senhor aplaude de qualquer jeito.",
        consequence: [
          {
            resultLabel: "Aplauso baixo",
            descriptionTemplate:
              "O senhor continua aplaudindo tudo, um pouco mais baixo. {character1} passa as sextas olhando para a mesa do canto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Mesa nova",
            descriptionTemplate:
              "Na terceira sexta sem a valsa, o senhor muda de mesa e passa a aplaudir o garçom.",
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
        label: "Tocar a valsa só com gorjeta",
        description: "Pedido especial tem preço, até para o fã número um.",
        consequence: [
          {
            resultLabel: "Moedas antigas",
            descriptionTemplate:
              "O senhor paga com moedas que já saíram de circulação e um sorriso. {character1} devolve as moedas às escondidas, no bolso do paletó dele.",
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
            resultLabel: "Ofendido",
            descriptionTemplate:
              "O senhor paga em silêncio e, na semana seguinte, não aparece. A banda descobre que tinha um fã quando ele vai embora.",
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
        label: "Chamar o senhor ao palco",
        description:
          "[{character1}] Convidar o senhor para cantar a valsa ao microfone, com a banda acompanhando.",
        visibleIfCharacterHas: [["friendly"]],
        consequence: [
          {
            resultLabel: "Dueto",
            descriptionTemplate:
              "O senhor canta afinado, para espanto geral, e conta ao microfone que tocou naquele mesmo bar quarenta anos atrás. O bar pede bis para os dois.",
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
            resultLabel: "Discurso",
            descriptionTemplate:
              "O senhor pega o microfone e não devolve mais, contando a história do bar desde a fundação. O show termina sem a valsa e sem a banda.",
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
    id: "0227-o-cachorro-do-bar",
    type: "decisao_criativa",
    title: "O cachorro do bar",
    descriptionTemplate:
      "O cachorro do dono dorme no palco, em cima do cabo do pedal de {character1}, e ninguém no bar tem coragem de acordar o bicho. Faltam dez minutos para o show. {character2} sugere tocar em volta dele; {character1} quer o cabo.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tirar o cachorro do palco",
        description: "Com cuidado, um biscoito e a bênção do dono.",
        consequence: [
          {
            resultLabel: "Mudança aceita",
            descriptionTemplate:
              "O cachorro troca o palco pela cozinha, onde a oferta é maior. O show acontece sem interrupções e sem plateia canina.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Rosnado",
            descriptionTemplate:
              "O cachorro rosna, o dono fica do lado dele, e a banda toca com o cachorro encarando {character1} a noite inteira.",
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
        label: "Tocar em volta do cachorro",
        description: "A banda se ajeita, e {character1} toca sem o pedal.",
        consequence: [
          {
            resultLabel: "Mascote",
            descriptionTemplate:
              "O cachorro dorme o show inteiro, e a plateia passa a vir para ver o cachorro. A banda ganha um integrante que não reclama do cachê.",
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
            resultLabel: "Uivo",
            descriptionTemplate:
              "No solo mais agudo, o cachorro acorda e uiva junto, afinado. O bar elege o cachorro o destaque da noite.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Puxar o cabo bem devagar",
        description:
          "Um puxão lento e firme, como no truque da toalha de mesa.",
        consequence: [
          {
            resultLabel: "Truque perfeito",
            descriptionTemplate:
              "O cabo sai inteiro, e o cachorro nem se mexe. {character1} toca o show com a pose de quem acabou de serrar alguém ao meio.",
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
            resultLabel: "Cabo confiscado",
            descriptionTemplate:
              "O cachorro acorda e decide que o cabo é dele. {character1} toca o show sem pedal, vendo o cabo balançar na boca do cachorro, perto do bumbo.",
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
        label: "Deitar ao lado do cachorro",
        description:
          "[{character2}] Tocar o show no chão do palco, ao lado do cachorro, para não acordar ninguém.",
        visibleIfCharacterHas: [[], ["lazy"]],
        consequence: [
          {
            resultLabel: "Show no chão",
            descriptionTemplate:
              "{character2} toca o show inteiro no chão, com a cabeça do cachorro apoiada no joelho. A plateia acha a cena a mais bonita que já viu num bar.",
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
            resultLabel: "Dois dormindo",
            descriptionTemplate:
              "Na quinta música, {character2} também dorme. O bar não acorda nenhum dos dois.",
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
    id: "0228-a-lampada-do-palco",
    type: "decisao_criativa",
    title: "A lâmpada do palco",
    descriptionTemplate:
      "A única luz do palco é uma lâmpada pendurada num fio, que balança a cada batida do bumbo. {character1} quer transformar a iluminação com velas, papel celofane colorido e uma lanterna. {character2} lembra que o palco é de madeira.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Usar velas e celofane",
        description: "Clima de grande show, com orçamento de festa de escola.",
        consequence: [
          {
            resultLabel: "Atmosfera",
            descriptionTemplate:
              "O palco ganha cores, e a banda parece maior do que é. O dono pede a mesma luz para o aniversário da filha.",
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
            resultLabel: "Balde de gelo",
            descriptionTemplate:
              "Uma vela tomba no celofane na quarta música. O garçom apaga o fogo com o balde de gelo, e o bar aplaude o garçom.",
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
        label: "Manter a lâmpada",
        description: "Quem tem que brilhar é a música.",
        consequence: {
          resultLabel: "Penumbra",
          descriptionTemplate:
            "A banda toca sob a lâmpada de sempre, que balança no tempo do bumbo e hipnotiza a mesa da frente. {character1} guarda o celofane para outro bar.",
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
        label: "Dividir com o dono dois refletores usados",
        description: "Luz de verdade, paga em parcelas de cachê.",
        consequence: [
          {
            resultLabel: "Refletores",
            descriptionTemplate:
              "O dono aceita, e a banda paga a parte dela com três shows sem cachê. A luz fica ótima, e a banda, mais pobre.",
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
            resultLabel: "Caixa escuro",
            descriptionTemplate:
              "O dono diz que ilumina o palco no dia em que a banda iluminar o caixa. A lâmpada continua balançando.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Fazer o show no escuro",
        description:
          "[{character1}] Apagar a lâmpada e tocar o show inteiro no escuro, com uma única lanterna para o solo.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Show às escuras",
            descriptionTemplate:
              "O bar inteiro fica em silêncio no escuro, e o solo sob a lanterna vira o assunto da semana. O dono passa a anunciar a noite no cartaz da porta.",
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
            resultLabel: "Tropeço",
            descriptionTemplate:
              "No escuro, {character2} tropeça num cabo, derruba o pedestal e termina o show iluminando o próprio pé com a lanterna.",
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
    id: "0229-o-prato-do-dia",
    type: "decisao_criativa",
    title: "O prato do dia",
    descriptionTemplate:
      "Entre uma música e outra, o dono do bar sobe ao palco, pega o microfone de {character1} e anuncia o prato do dia, com preço e acompanhamento. Na terceira interrupção, a plateia já sabe de cor o preço da costela.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Proibir o dono de usar o microfone",
        description:
          "[{character1}] Durante o show o microfone é da banda, mesmo que o bar seja dele.",
        consequence: [
          {
            resultLabel: "Microfone de volta",
            descriptionTemplate:
              "O dono aceita, de má vontade, e passa a anunciar o prato aos gritos do balcão. O volume é o mesmo, mas o microfone volta.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Tudo dele",
            descriptionTemplate:
              "O dono lembra que o microfone também é dele, assim como o palco, a tomada e o cachê. A banda volta a tocar entre um anúncio e outro.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Anunciar o prato pelo dono",
        description:
          "[{character1}] Ler o cardápio ao microfone em troca de o show seguir sem interrupções.",
        consequence: {
          resultLabel: "Anúncio ao vivo",
          descriptionTemplate:
            "{character1} anuncia a costela com tanta convicção que ela acaba antes das dez. O dono pede que o anúncio entre no repertório.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Começar a música por cima do anúncio",
        description:
          "[{character1}] Contar o tempo e entrar com a banda no meio do preço.",
        consequence: [
          {
            resultLabel: "Duelo de volume",
            descriptionTemplate:
              "O dono e a banda disputam o volume, e a plateia escolhe a banda. A costela fica sem anúncio e encalha.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Tomada",
            descriptionTemplate:
              "O dono termina o anúncio e desliga o amplificador. A banda passa o resto da noite ouvindo o preço da sobremesa.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Cantar o cardápio na melodia de um sucesso",
        description:
          "[{character1}] Encaixar o prato do dia na melodia de um sucesso conhecido, para a plateia cantar junto.",
        visibleIfCharacterHas: [["plagiarist"]],
        consequence: [
          {
            resultLabel: "Jingle da costela",
            descriptionTemplate:
              "A plateia canta o cardápio inteiro, e a costela acaba. O dono reserva a banda para todas as sextas e pede uma música nova para o peixe.",
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Reconhecido",
            descriptionTemplate:
              "Um cliente reconhece a melodia e grita o nome do autor a cada verso. O dono acha que é o nome do prato e passa a vender a costela com ele.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0230-o-carro-do-pai",
    type: "conflito_membros",
    title: "O carro do pai",
    descriptionTemplate:
      "O pai de {character2} emprestou o carro para a banda tocar na cidade vizinha. {character1} dirigiu na volta e devolveu o carro com um risco na porta e o banco de trás com cheiro de pastel. O pai ainda não viu o risco, mas já sentiu o pastel.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar a funilaria com o cachê",
        description: "O cachê da noite vai inteiro para a porta do carro.",
        consequence: {
          resultLabel: "Porta nova",
          descriptionTemplate:
            "A porta fica perfeita. As cordas da banda vão ter que durar mais alguns meses.",
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
        label: "Cobrar o conserto só de {character1}",
        description: "Quem dirigiu, paga.",
        consequence: [
          {
            resultLabel: "Pago em três vezes",
            descriptionTemplate:
              "{character1} paga em três parcelas, uma por mês, e lembra {character2} de cada uma no ensaio.",
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
            resultLabel: "Risco antigo",
            descriptionTemplate:
              "{character1} jura que o risco já estava lá, e {character2} passa o fim de semana procurando provas no próprio quintal.",
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
        label: "Contar a verdade ao pai",
        description:
          "{character1} e {character2} vão juntos, de cabeça baixa, antes que ele encontre o risco sozinho.",
        consequence: [
          {
            resultLabel: "Perdoados",
            descriptionTemplate:
              "O pai olha o risco, olha a banda e diz que também já foi jovem. Não diz quando volta a emprestar o carro.",
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
            resultLabel: "Chave na gaveta",
            descriptionTemplate:
              "O pai escuta tudo em silêncio e guarda a chave numa gaveta com tranca. A próxima viagem vai ser de ônibus.",
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
        label: "Convencer o pai de que o risco já estava lá",
        description:
          "[{character2}] Mostrar ao pai, com muita calma, umas fotos antigas do carro tiradas de bem longe.",
        visibleIfCharacterHas: [[], ["manipulator"]],
        consequence: [
          {
            resultLabel: "Convencido",
            descriptionTemplate:
              "O pai aceita que o risco é antigo e pede desculpas à própria memória. {character1} fica devendo um favor do tamanho de uma porta.",
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
            resultLabel: "Perícia",
            descriptionTemplate:
              "O pai encontra uma migalha de pastel dentro do risco. A versão de {character2} não sobrevive à perícia.",
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
    id: "0231-o-banco-da-frente",
    type: "conflito_membros",
    title: "O banco da frente",
    descriptionTemplate:
      "Em toda viagem para tocar fora, quem namora {character1} vai junto e senta no banco da frente. {character2} vai atrás, entre dois amplificadores e o bumbo, ouvindo o casal escolher a estação do rádio.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Proibir acompanhantes nas viagens",
        description: "O carro é da banda, e o banco da frente também.",
        consequence: {
          resultLabel: "Viagem fechada",
          descriptionTemplate:
            "{character1} cumpre a regra e passa as viagens olhando pela janela, com a cara de quem perdeu uma guerra.",
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
        label: "Alugar um carro maior",
        description:
          "Cabe todo mundo sentado, e o aluguel sai do cachê da noite.",
        consequence: [
          {
            resultLabel: "Espaço",
            descriptionTemplate:
              "Todo mundo viaja sentado, com o bumbo no porta-malas, onde bumbo deve ficar.",
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
            resultLabel: "Prejuízo",
            descriptionTemplate:
              "O carro maior bebe o dobro de gasolina, e a banda volta para casa devendo ao posto.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Deixar como está",
        description: "O amor ocupa espaço, e o bumbo também.",
        consequence: [
          {
            resultLabel: "Costume",
            descriptionTemplate:
              "{character2} se acostuma e aprende a dormir abraçando o bumbo. É a relação mais estável da banda.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Pescoço torto",
            descriptionTemplate:
              "{character2} chega ao show com o pescoço travado e toca a noite inteira olhando para o mesmo lado.",
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
        label: "Ir no banco de trás com quem namora",
        description:
          "[{character1}] Ceder a frente para {character2} e viajar atrás, de mãos dadas, entre os amplificadores.",
        visibleIfCharacterHas: [["romantic"]],
        consequence: [
          {
            resultLabel: "Gesto",
            descriptionTemplate:
              "{character2} viaja na frente pela primeira vez e descobre que a estrada tem paisagem. Atrás, o casal divide o bumbo sem reclamar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 4,
            chance: 70,
          },
          {
            resultLabel: "Vista para o casal",
            descriptionTemplate:
              "{character2} ganha o banco da frente e um retrovisor com vista para o casal. Pede para voltar para trás.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0232-a-lata-de-biscoito",
    type: "conflito_membros",
    title: "A lata de biscoito",
    descriptionTemplate:
      "O caixa da banda mora numa lata de biscoito, no armário de {character1}. {character2} conta o dinheiro antes do ensaio e acha bem menos do que diz o papel colado na tampa. {character1} explica que pegou emprestado para o passe do ônibus, que, de certa forma, também é da banda.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Exigir a devolução até o próximo show",
        description: "Com juros, se a vergonha não bastar.",
        consequence: [
          {
            resultLabel: "Devolvido",
            descriptionTemplate:
              "{character1} devolve tudo em notas amassadas e moedas de troco de padaria. A lata fica cheia, e o ensaio, calado.",
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
            resultLabel: "Sem dinheiro",
            descriptionTemplate:
              "{character1} não tem como pagar e passa a ir aos ensaios a pé, para provar um ponto que ninguém entendeu.",
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
        label: "Passar a lata para {character2}",
        description: "O caixa muda de armário e de dono.",
        consequence: {
          resultLabel: "Troca de guarda",
          descriptionTemplate:
            "A lata vai para a casa de {character2}, que passa a anotar até a moeda achada no sofá. {character1} {character1:se sente vigiado|se sente vigiada|passa a se sentir sob vigilância}.",
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
        label: "Aceitar o passe como gasto da banda",
        description:
          "Se {character1} chega ao ensaio de ônibus, o ônibus trabalha para a banda.",
        consequence: [
          {
            resultLabel: "Despesa aprovada",
            descriptionTemplate:
              'A lata perde o mistério, e o papel da tampa ganha uma linha nova: "passe".',
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
            resultLabel: "Precedente",
            descriptionTemplate:
              'Na semana seguinte, a lata traz um bilhete de {character1}: "pastel de viagem, despesa da banda". {character2} guarda o bilhete como prova.',
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Trancar a lata com cadeado",
        description:
          "[{character2}] Comprar um cadeado, contar o dinheiro todo dia e levar a chave pendurada no pescoço.",
        visibleIfCharacterHas: [[], ["paranoid"]],
        consequence: [
          {
            resultLabel: "Cofre",
            descriptionTemplate:
              "O dinheiro para de sumir. {character2} dorme com a chave e acorda duas vezes por noite para conferir se ela continua lá.",
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
            resultLabel: "Chave perdida",
            descriptionTemplate:
              "{character2} perde a chave na primeira semana. A banda abre a lata com um abridor, na frente de testemunhas.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0233-a-sexta-do-chefe",
    type: "conflito_membros",
    title: "A sexta do chefe",
    descriptionTemplate:
      "A banda fechou um show na cidade vizinha numa sexta, com saída às cinco da tarde. O chefe de {character1} avisa que sexta é dia de fechar o balanço da loja e que ninguém sai antes das oito. {character2} lembra que a estrada não espera, e o bar muito menos.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Faltar ao trabalho na sexta",
        description:
          "{character1} some na sexta e inventa uma gripe na segunda.",
        consequence: [
          {
            resultLabel: "Gripe aceita",
            descriptionTemplate:
              "O chefe acredita, e {character1} passa a segunda-feira tossindo por precaução.",
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
            resultLabel: "Flagrante",
            descriptionTemplate:
              "O chefe é da cidade vizinha e aparece no show. {character1} toca a noite inteira de costas para a plateia.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Mandar {character1} depois, de ônibus",
        description:
          "A banda vai antes, e {character1} pega o ônibus das oito e meia com o instrumento no colo.",
        consequence: [
          {
            resultLabel: "A tempo",
            descriptionTemplate:
              "{character1} entra no palco na terceira música, ainda com o crachá da loja no peito.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Só para o bis",
            descriptionTemplate:
              "O ônibus para em todas as cidades do caminho. {character1} chega para o bis e para ajudar a carregar o carro.",
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
        label: "Tocar sem {character1}",
        description: "{character2} cobre a parte que faltar, do jeito que der.",
        consequence: {
          resultLabel: "Desfalque",
          descriptionTemplate:
            "A banda toca com um buraco no som, e {character2} passa a noite apontando para o buraco. {character1} fecha o balanço e fica sabendo de tudo no sábado, em detalhes.",
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
        label: "Fazer hora extra para trocar pela sexta",
        description:
          "[{character1}] Chegar à loja às seis da manhã de segunda a quinta e negociar a sexta com o chefe.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Troca feita",
            descriptionTemplate:
              "O chefe aceita, e {character1} chega ao show com quatro noites de sono a menos e o balanço do mês na cabeça.",
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
            resultLabel: "Promoção",
            descriptionTemplate:
              "O chefe gosta tanto da hora extra que oferece uma promoção. A promoção inclui as sextas.",
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
    id: "0234-o-roadie-de-graca",
    type: "conflito_membros",
    title: "O roadie de graça",
    descriptionTemplate:
      "Há um ano, um amigo de {character1} carrega o equipamento da banda em troca de cerveja e de um lugar no carro. Agora ele quer uma parte do cachê. {character2} acha que a amizade já é o pagamento, e o lugar no carro, um luxo.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar uma parte fixa ao amigo",
        description:
          "O cachê passa a ser dividido por mais um, que nem sobe ao palco.",
        consequence: {
          resultLabel: "Equipe paga",
          descriptionTemplate:
            "O amigo passa a chegar na hora e a carregar o bumbo com orgulho. Cada integrante leva para casa o preço de um pastel a menos.",
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
        label: "Negar e manter a cerveja",
        description: "Quem quer cachê, sobe ao palco.",
        consequence: [
          {
            resultLabel: "Ficou",
            descriptionTemplate:
              "O amigo aceita, resmunga e continua. Só que agora carrega o equipamento devagar, em protesto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Pediu as contas",
            descriptionTemplate:
              "O amigo vai embora, e a banda descobre o peso real de um amplificador, um degrau de cada vez.",
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
        label: "Pôr o nome dele no cartaz",
        description:
          "O nome do amigo sai no cartaz do próximo show, em letra pequena, como equipe técnica.",
        consequence: [
          {
            resultLabel: "Nome no poste",
            descriptionTemplate:
              "O amigo arranca um cartaz de cada poste da cidade para guardar de lembrança. O cachê continua intacto, e a divulgação, nem tanto.",
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
            resultLabel: "Prova de vínculo",
            descriptionTemplate:
              "O amigo agradece e repete o pedido do cachê, agora com o cartaz na mão como prova de que trabalha para a banda.",
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
        label: "Pagar o amigo do próprio bolso",
        description:
          "[{character1}] Dividir a própria parte do cachê com o amigo, já que foi {character1} quem o trouxe para a banda.",
        visibleIfCharacterHas: [["loyal"]],
        consequence: {
          resultLabel: "Do próprio bolso",
          descriptionTemplate:
            "O amigo fica, e {character1} passa a voltar dos shows com metade do cachê. {character2} se oferece para pagar a cerveja, que é até onde vai a consciência.",
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
    ],
  },
  {
    id: "0235-o-amplificador-em-doze-vezes",
    type: "conflito_membros",
    title: "O amplificador em doze vezes",
    descriptionTemplate:
      "{character1} comprou um amplificador novo em doze prestações e, como o próprio nome não passou na loja, pôs o carnê no nome de {character2}, com uma assinatura pedida no intervalo de um ensaio. A quarta prestação atrasou, e a loja telefonou para a casa de {character2}. Quem atendeu foi a mãe.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar a prestação com o caixa da banda",
        description:
          "O amplificador serve a todos, e a dívida passa a servir também.",
        consequence: {
          resultLabel: "Dívida coletiva",
          descriptionTemplate:
            "A loja para de ligar. A banda passa os meses seguintes trabalhando para um amplificador, que nem agradece.",
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
        label: "Exigir que {character1} pague a prestação",
        description: "O amplificador foi escolha de uma pessoa só.",
        consequence: [
          {
            resultLabel: "Pago",
            descriptionTemplate:
              "{character1} paga com o dinheiro do almoço e passa a semana comendo pão com banana no ensaio, com ar de mártir.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Atrasou de novo",
            descriptionTemplate:
              "A quinta prestação atrasa também. A mãe de {character2} já atende a loja pelo nome.",
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
        label: "Vender o amplificador para um conhecido",
        description:
          "A dívida vai junto com o amplificador, se alguém aceitar.",
        consequence: [
          {
            resultLabel: "Negócio fechado",
            descriptionTemplate:
              "Um conhecido fica com o amplificador e com as prestações. A banda volta ao amplificador velho, que chia mas não telefona para ninguém.",
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
            resultLabel: "Calote",
            descriptionTemplate:
              "O conhecido paga metade e some. A banda fica sem amplificador e com oito prestações.",
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
        label: "Devolver o novo e voltar ao velho",
        description:
          "[{character2}] Levar o amplificador novo de volta à loja e tirar do armário o velho, que nunca precisou de carnê.",
        visibleIfCharacterHas: [[], ["conservative"]],
        consequence: [
          {
            resultLabel: "Devolvido",
            descriptionTemplate:
              "A loja aceita de volta, com multa e cara feia. O amplificador velho volta ao palco com o chiado de sempre.",
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
            resultLabel: "Sem devolução",
            descriptionTemplate:
              "A loja não aceita amplificador usado em três shows e uma festa de aniversário. A banda fica com dois amplificadores e uma dívida.",
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
    id: "0236-o-ultimo-onibus",
    type: "conflito_membros",
    title: "O último ônibus",
    descriptionTemplate:
      "O show na cidade vizinha termina à uma da manhã, e o último ônibus de volta sai à uma e dez. O dono do bar só paga o cachê quando fecha o caixa, lá pelas três. {character1} quer esperar o dinheiro; {character2} entra no trabalho às sete.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Esperar o cachê",
        description:
          "A banda inteira fica, e a volta é no primeiro ônibus da manhã.",
        consequence: {
          resultLabel: "Rodoviária",
          descriptionTemplate:
            "A banda recebe às três e passa o resto da noite num banco da rodoviária, abraçada ao equipamento. {character2} vai direto para o trabalho, com a roupa do show.",
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
        label: "Pegar o ônibus e receber depois",
        description:
          "O dono promete mandar o dinheiro pelo motorista do ônibus da semana que vem.",
        consequence: [
          {
            resultLabel: "Envelope",
            descriptionTemplate:
              "O dinheiro chega num envelope com carimbo da rodoviária e uma nota a menos, que o motorista chama de frete.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Extraviado",
            descriptionTemplate:
              "O envelope nunca chega. O dono jura que mandou, e o motorista jura que nunca viu dono nenhum.",
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
        label: "Deixar {character1} esperando o dinheiro",
        description:
          "{character1} fica com o equipamento, e o resto da banda pega o ônibus.",
        consequence: [
          {
            resultLabel: "Missão cumprida",
            descriptionTemplate:
              "{character1} recebe o cachê, cochila na rodoviária com a cabeça no amplificador e chega em casa ao meio-dia, com o dinheiro inteiro e a marca de um botão no rosto.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -2,
            chance: 60,
          },
          {
            resultLabel: "Meio cachê",
            descriptionTemplate:
              "O dono paga metade, porque a banda foi embora cedo. {character1} volta com metade do dinheiro e a história inteira, contada três vezes.",
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
        label: "Cobrar o cachê do dono agora",
        description:
          "[{character1}] Ir ao balcão antes da uma e dez e exigir o dinheiro com o relógio na mão.",
        visibleIfCharacterHas: [["hothead"]],
        consequence: [
          {
            resultLabel: "Pago na hora",
            descriptionTemplate:
              "O dono paga para se livrar de {character1} e conta as notas tão rápido que erra a favor da banda. A banda pega o ônibus correndo.",
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
            resultLabel: "Riscados da agenda",
            descriptionTemplate:
              "O dono não gosta do tom e risca a banda da agenda. O ônibus sai enquanto a discussão ainda está no segundo assunto.",
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
    id: "0237-o-relogio-da-sala",
    type: "conflito_membros",
    title: "O relógio da sala",
    descriptionTemplate:
      "A banda aluga uma sala de ensaio por hora, e o dono adianta o relógio da parede cinco minutos, por segurança. {character1} gasta os primeiros vinte e cinco minutos afinando, regulando o amplificador e afinando de novo. {character2} cronometra e calcula que a banda paga, por mês, uma hora inteira de afinação.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar de {character1} os minutos de afinação",
        description: "Cada minuto afinando sai do bolso de quem afina.",
        consequence: [
          {
            resultLabel: "Conta paga",
            descriptionTemplate:
              "{character1} paga e passa a afinar tão depressa que o ensaio começa com uma briga de gatos.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
          {
            resultLabel: "Recusa",
            descriptionTemplate:
              "{character1} se recusa a pagar e declara que afinação é arte. {character2} entrega a conta da arte por escrito.",
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
        label: "Pagar meia hora a mais por semana",
        description: "A afinação ganha horário próprio, pago pela banda.",
        consequence: {
          resultLabel: "Meia hora extra",
          descriptionTemplate:
            "A sala fica mais cara, e {character1} usa a meia hora a mais para afinar com mais calma. O ensaio continua do mesmo tamanho.",
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
        label: "Começar o ensaio sem esperar",
        description:
          "Quem estiver pronto toca. Quem não estiver, afina tocando.",
        consequence: [
          {
            resultLabel: "Ninguém notou",
            descriptionTemplate:
              "{character1} afina no meio da primeira música e descobre que ninguém notou a diferença, o que é bem pior.",
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
            resultLabel: "Meio tom acima",
            descriptionTemplate:
              "A banda ensaia duas horas meio tom acima de {character1}. O dono da sala bate na porta para perguntar se alguém se machucou.",
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
        label: "Afinar tudo em casa antes do ensaio",
        description:
          "[{character1}] Chegar com o instrumento afinado de casa, o diapasão no bolso e uma lista de ajustes por escrito.",
        visibleIfCharacterHas: [["perfectionist"]],
        consequence: [
          {
            resultLabel: "Hora cheia",
            descriptionTemplate:
              "{character1} liga o amplificador no primeiro minuto. A banda ensaia a hora inteira, pela primeira vez em meses.",
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
            resultLabel: "Ônibus desafinou",
            descriptionTemplate:
              "O instrumento desafina no ônibus, e {character1} gasta trinta minutos refazendo o que fez em casa, desta vez com plateia.",
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
    id: "0238-a-gasolina-por-quilo",
    type: "conflito_membros",
    title: "A gasolina por quilo",
    descriptionTemplate:
      "O cachê da cidade vizinha mal paga a gasolina e o pedágio. {character1} propõe dividir a gasolina pelo peso do que cada um leva no carro. {character2} leva o maior amplificador da banda e uma mochila de roupa.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dividir a gasolina por igual",
        description: "Todo mundo paga a mesma parte, leve o que levar.",
        consequence: {
          resultLabel: "Partes iguais",
          descriptionTemplate:
            "A conta fecha, e {character1} passa as viagens comentando o peso do amplificador de {character2} a cada lombada.",
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
        label: "Aceitar a divisão por peso",
        description: "Quem carrega mais, paga mais, e a matemática agradece.",
        consequence: [
          {
            resultLabel: "Balança de feira",
            descriptionTemplate:
              "A banda pesa tudo numa balança de feira. {character2} paga o dobro e começa a se interessar por gaita.",
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
            resultLabel: "Paz no carro",
            descriptionTemplate:
              "{character2} paga o dobro sem discutir, e {character1} para de falar das lombadas. É a viagem mais silenciosa da história da banda.",
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
      {
        label: "Ir de ônibus, cada um com a sua passagem",
        description: "O carro fica em casa, e cada um carrega o próprio peso.",
        consequence: [
          {
            resultLabel: "Mais barato",
            descriptionTemplate:
              "A passagem sai mais barata que a gasolina. O ônibus cobra o amplificador como um passageiro a mais.",
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
            resultLabel: "Corredor",
            descriptionTemplate:
              "O motorista não deixa o amplificador ir no bagageiro. {character2} viaja em pé no corredor, segurando o amplificador como um passageiro que passou mal.",
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
        label: "Pesar a mala de {character1} na frente de todos",
        description:
          "[{character2}] Levar a balança do banheiro para a próxima viagem e pesar a mala de roupas de {character1}, peça por peça.",
        visibleIfCharacterHas: [[], ["playful"]],
        consequence: [
          {
            resultLabel: "Três jaquetas",
            descriptionTemplate:
              "A mala de {character1} tem três jaquetas, um secador e um travesseiro. A banda ri até o pedágio, e a regra do peso morre ali.",
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
            resultLabel: "Sem graça",
            descriptionTemplate:
              "{character1} não acha graça e paga a própria parte em moedas, despejadas no colo de {character2}.",
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
    id: "0239-o-almoco-de-domingo",
    type: "oportunidade_externa",
    title: "O almoço de domingo",
    descriptionTemplate:
      "No almoço de domingo, na frente da família inteira, o tio de {character1} oferece uma vaga na loja de ferragens: carteira assinada, de segunda a sábado, começo amanhã. A avó para de servir a sobremesa para ouvir a resposta.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar a vaga",
        description: "Salário fixo e a família em paz, ao preço dos sábados.",
        consequence: {
          resultLabel: "Ferragens",
          descriptionTemplate:
            "{character1} passa a chegar aos ensaios com cheiro de parafuso, falando do preço do prego. A família manda bolo para a banda pela primeira vez.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Recusar na frente de todos",
        description: "A banda vem primeiro, e a sobremesa, depois.",
        consequence: [
          {
            resultLabel: "Respeito",
            descriptionTemplate:
              "A família fica quieta, e o tio, magoado. A avó serve {character1} primeiro, sem dizer por quê.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Assunto do ano",
            descriptionTemplate:
              "A recusa vira o assunto de todos os almoços até o Natal. {character1} passa a almoçar antes do ensaio, na padaria.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Pedir só meio período",
        description: "Ficar com as manhãs na loja e as noites para a banda.",
        consequence: [
          {
            resultLabel: "Acordo de família",
            descriptionTemplate:
              "O tio aceita, desde que {character1} trabalhe no sábado do inventário. É um sábado por ano, sempre o do melhor show.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Vaga do primo",
            descriptionTemplate:
              "O tio diz que meio emprego é coisa de meio artista e dá a vaga para um primo. O primo nem toca nada.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Prometer que a banda vai pagar o almoço",
        description:
          "[{character1}] Recusar e anunciar à mesa que, em dois anos, quem paga o almoço de domingo é a banda.",
        visibleIfCharacterHas: [["confident"]],
        consequence: [
          {
            resultLabel: "Guardanapo",
            descriptionTemplate:
              "A família ri, mas o tio guarda o guardanapo em que {character1} escreveu a promessa. Diz que é para cobrar.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Piada fixa",
            descriptionTemplate:
              "A promessa vira piada de família. Todo domingo alguém pergunta, antes da sobremesa, se a banda já pode pagar o refrigerante.",
            happinessChangePercent: -4,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0240-a-caminhonete-do-vizinho",
    type: "oportunidade_externa",
    title: "A caminhonete do vizinho",
    descriptionTemplate:
      "Um vizinho de {character1} tem uma caminhonete velha e se oferece para levar a banda a todos os shows fora da cidade. Ele quer trinta por cento do cachê e o direito de escolher a estação do rádio na estrada.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar a proposta",
        description:
          "Trinta por cento e o rádio dele, em troca de nunca mais levar o bumbo no ônibus.",
        consequence: [
          {
            resultLabel: "Frota própria",
            descriptionTemplate:
              "A banda passa a chegar inteira aos shows e a ouvir o mesmo programa de moda de viola em todas as viagens. Já sabe as letras.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Quebrou no caminho",
            descriptionTemplate:
              "A caminhonete quebra a meio caminho do primeiro show. O vizinho cobra os trinta por cento mesmo assim, pela intenção.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar e continuar de ônibus",
        description: "O cachê fica inteiro, e as costas, nem tanto.",
        consequence: {
          resultLabel: "Ônibus",
          descriptionTemplate:
            "A banda continua viajando com o equipamento no colo. O cachê volta inteiro, amassado entre um amplificador e um joelho.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Aceitar só nas viagens longas",
        description:
          "O vizinho leva a banda quando passar de cem quilômetros, e o rádio é dele só nessas.",
        consequence: [
          {
            resultLabel: "Meio acordo",
            descriptionTemplate:
              "O vizinho aceita e passa a perguntar, a cada show, a quantos quilômetros fica. Uma viagem de noventa e oito vira briga de calçada.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Vendida",
            descriptionTemplate:
              "O vizinho diz que motorista de meio expediente não existe e vende a caminhonete para outra banda.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Negociar a porcentagem",
        description:
          "[{character1}] Oferecer quinze por cento, a gasolina por conta da banda e o rádio dividido por música.",
        visibleIfCharacterHas: [["greedy"]],
        consequence: [
          {
            resultLabel: "Quinze por cento",
            descriptionTemplate:
              "O vizinho aceita depois de três cafés. A banda ganha transporte barato e passa a votar a estação a cada pedágio.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Quarenta por cento",
            descriptionTemplate:
              "O vizinho percebe o interesse e sobe o preço. {character1} sai da conversa com um acordo de quarenta por cento e a sensação de que ganhou.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0241-os-sete-de-sempre",
    type: "oportunidade_externa",
    title: "Os sete de sempre",
    descriptionTemplate:
      "Sete pessoas vão a todos os shows da banda, sabem as letras e já ajudaram a empurrar o carro duas vezes. Agora querem fundar o fã-clube oficial e pedem a {character1} e {character2} carteirinhas assinadas e entrada de graça para sempre.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Dar as carteirinhas e a entrada de graça",
        description:
          "Sete entradas a menos por show, em troca de sete pessoas que nunca faltam.",
        consequence: {
          resultLabel: "Fã-clube fundado",
          descriptionTemplate:
            "O fã-clube nasce com sete sócios, um estatuto escrito à mão e uma faixa pintada num lençol. O cachê de cada show fica sete entradas mais leve.",
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
        label: "Dar só as carteirinhas",
        description: "Carteirinha assinada, mas o ingresso continua pago.",
        consequence: [
          {
            resultLabel: "Sócios pagantes",
            descriptionTemplate:
              "Os sete aceitam e mostram a carteirinha na porta, mesmo pagando. O porteiro decora os sete nomes.",
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Debandada",
            descriptionTemplate:
              "Os sete acham a proposta mesquinha e passam a ir aos shows de outra banda, de carteirinha e tudo.",
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
        label: "Recusar o fã-clube",
        description:
          "Fã-clube é coisa de banda grande, e esta banda ainda tem emprego de dia.",
        consequence: [
          {
            resultLabel: "Não oficial",
            descriptionTemplate:
              'Os sete continuam indo aos shows, agora com uma faixa que diz "fã-clube não oficial". A faixa é maior que o nome da banda no cartaz.',
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Braços cruzados",
            descriptionTemplate:
              "Os sete ficam ofendidos e assistem a um show inteiro de braços cruzados na primeira fila. É o show mais longo da banda.",
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
        label: "Assinar cada carteirinha com dedicatória",
        description:
          "[{character1}] Escrever uma dedicatória diferente em cada carteirinha e decorar o nome dos sete.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Ídolo de sete",
            descriptionTemplate:
              "{character1} vira {character1:o integrante favorito|a integrante favorita|a figura favorita} do fã-clube e cumprimenta os sete pelo nome, do palco. {character2} percebe que o próprio nome saiu na carteirinha em letra menor.",
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
            resultLabel: "Dois fã-clubes",
            descriptionTemplate:
              "{character1} troca dois nomes nas dedicatórias, e o fã-clube racha no primeiro mês. Agora são dois, um de três e outro de quatro sócios.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0242-a-casa-de-penhores",
    type: "oportunidade_externa",
    title: "A casa de penhores",
    descriptionTemplate:
      "{character1} leva o violão antigo do avô a uma casa de penhores, só para saber o preço. O avaliador oferece dinheiro para pagar a sala de ensaio por um ano e devolve o violão em seis meses, se a banda pagar os juros.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Penhorar o violão",
        description:
          "Um ano de ensaio garantido e seis meses para buscar o violão de volta.",
        consequence: [
          {
            resultLabel: "Resgatado",
            descriptionTemplate:
              "A banda ensaia o ano inteiro, e {character1} resgata o violão no último dia do prazo, com o dinheiro de quatro shows e uma rifa.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Vitrine",
            descriptionTemplate:
              "O prazo vence, e o violão do avô vai para a vitrine da casa de penhores. {character1} passa a fazer o caminho mais longo para ir ao ensaio.",
            happinessChangePercent: -8,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar e levar o violão de volta",
        description:
          "O violão do avô não é moeda, e a sala continua sendo paga por hora.",
        consequence: {
          resultLabel: "Herança guardada",
          descriptionTemplate:
            "O violão volta para cima do armário, onde mora há vinte anos. A sala de ensaio continua cobrando por hora, sem nenhum respeito pela família.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Vender o violão de vez",
        description: "A venda paga o dobro, sem juros e sem prazo.",
        consequence: [
          {
            resultLabel: "Caixa cheio",
            descriptionTemplate:
              "A banda paga a sala, troca as cordas de todo mundo e ainda sobra para o pedágio. Na família, ninguém pergunta pelo violão, por enquanto.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "A avó perguntou",
            descriptionTemplate:
              "A avó pergunta pelo violão no almoço de domingo. {character1} diz que está no conserto e passa a mentir uma vez por semana.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Penhorar e comprar um amplificador de vitrine",
        description:
          "[{character1}] Pegar o dinheiro e gastar tudo, no mesmo dia, no amplificador mais brilhante da loja de instrumentos.",
        visibleIfCharacterHas: [["dazzled"]],
        consequence: [
          {
            resultLabel: "Brilho",
            descriptionTemplate:
              "O amplificador novo enche o ensaio de som e o carro de orgulho. O violão do avô espera na casa de penhores, com etiqueta.",
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Mesmo som",
            descriptionTemplate:
              "O amplificador é lindo, soa igual ao velho e custou um ano de ensaio. O violão do avô vai para a vitrine.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0243-a-carona-das-melancias",
    type: "oportunidade_externa",
    title: "A carona das melancias",
    descriptionTemplate:
      "Um caminhoneiro conhecido de {character2} oferece levar a banda de graça ao show da cidade vizinha, na carroceria, entre as melancias. A saída é às quatro da manhã, porque as melancias não esperam.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar a carona",
        description: "Viagem de graça, com cheiro de fruta e sem banco.",
        consequence: [
          {
            resultLabel: "Chegada cedo",
            descriptionTemplate:
              "A banda chega à cidade vizinha às sete da manhã, com o equipamento inteiro e catorze horas livres até o show. Passa todas elas dormindo num banco de praça.",
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
            resultLabel: "Freada",
            descriptionTemplate:
              "Numa freada, as melancias avançam sobre a bateria. A banda chega ao show com a caixa amassada e a roupa vermelha até a cintura.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Recusar e pagar o ônibus",
        description: "A banda chega a uma hora decente, e o cachê chega menor.",
        consequence: {
          resultLabel: "Passagem paga",
          descriptionTemplate:
            "A banda viaja sentada e chega descansada. O cachê da noite cobre as passagens e um pastel para cada um, sem refrigerante.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Mandar só o equipamento na carroceria",
        description:
          "Os instrumentos vão com as melancias, e a banda vai de ônibus, mais tarde.",
        consequence: [
          {
            resultLabel: "Entregue",
            descriptionTemplate:
              "O caminhoneiro deixa o equipamento na porta do bar às sete da manhã, com uma melancia de brinde.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Feira",
            descriptionTemplate:
              "O equipamento vai parar na feira da cidade, numa banca de frutas. A banda o resgata comprando três melancias.",
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
        label: "Ir na cabine, fazendo companhia ao motorista",
        description:
          "[{character1}] Passar a viagem conversando com o caminhoneiro, para ele não dormir e, quem sabe, buscar a banda na volta.",
        visibleIfCharacterHas: [["friendly"]],
        consequence: [
          {
            resultLabel: "Volta garantida",
            descriptionTemplate:
              "Antes do amanhecer, {character1} já sabe o nome dos filhos, dos netos e do cachorro do caminhoneiro, que faz questão de levar a banda de volta.",
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
            resultLabel: "Silêncio pago",
            descriptionTemplate:
              "{character1} fala as três horas da viagem, e o caminhoneiro deixa a banda na entrada da cidade, a dois quilômetros do bar, para ter um pouco de silêncio.",
            happinessChangePercent: -4,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0244-a-pensao-de-um-quarto",
    type: "oportunidade_externa",
    title: "A pensão de um quarto",
    descriptionTemplate:
      "Para o show a duzentos quilômetros, uma pensão oferece preço especial para a banda inteira: um quarto só, com uma cama de casal, um colchão no chão e uma rede pendurada na janela. {character1} e {character2} ficam de decidir quem dorme onde.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o quarto e sortear as camas",
        description: "Pensão barata, e a sorte decide quem fica com a rede.",
        consequence: [
          {
            resultLabel: "Sorteio justo",
            descriptionTemplate:
              "O sorteio sai com palitos de fósforo, e todo mundo dorme mal por igual. É a noite mais democrática da banda.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Sorteio suspeito",
            descriptionTemplate:
              "{character1} tira a cama de casal duas vezes seguidas, e {character2} passa a noite na rede, contando os fósforos.",
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
        label: "Dormir no carro",
        description:
          "A banda economiza a pensão e dorme sentada, com o equipamento de travesseiro.",
        consequence: {
          resultLabel: "Noite no carro",
          descriptionTemplate:
            "A banda acorda com o vidro embaçado e as costas em outro formato. O cachê volta inteiro.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Voltar dirigindo depois do show",
        description:
          "Quatro horas de estrada de madrugada, mas cada um dorme na própria cama.",
        consequence: [
          {
            resultLabel: "Em casa",
            descriptionTemplate:
              "A banda chega ao amanhecer, com cara de quem viu o sol nascer sem querer, e dorme até a hora do almoço.",
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Parada no posto",
            descriptionTemplate:
              "Na metade do caminho, {character1} e {character2} discutem quem dirige o resto. A banda passa a madrugada parada num posto, que é uma pensão sem cama.",
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
        label: "Ficar com a rede por causa da energia",
        description:
          "[{character2}] Explicar que a rede, virada para o nascente, tem a melhor energia do quarto, e se oferecer para dormir nela.",
        visibleIfCharacterHas: [[], ["spiritual"]],
        consequence: [
          {
            resultLabel: "Paz no quarto",
            descriptionTemplate:
              "{character2} dorme na rede e acorda {character2:renovado|renovada|com a alma em dia}. Ninguém discute a energia de quem escolheu o pior lugar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 4,
            chance: 70,
          },
          {
            resultLabel: "Energia do prego",
            descriptionTemplate:
              "A rede despenca às três da manhã e leva a cortina junto. {character2} conclui que a energia era do prego.",
            happinessChangePercent: -4,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0245-o-estepe-murcho",
    type: "decisao_criativa",
    title: "O estepe murcho",
    descriptionTemplate:
      "A caminho do show na cidade vizinha, o pneu do carro fura no acostamento. {character1} abre o porta-malas e descobre que o estepe está tão murcho quanto o pneu. O show começa às nove, e são seis e meia.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Rolar o pneu até a borracharia",
        description:
          "Três quilômetros de acostamento, empurrando um pneu e a própria dignidade.",
        consequence: [
          {
            resultLabel: "A tempo",
            descriptionTemplate:
              "O borracheiro conserta o pneu em dez minutos e cobra como se fossem duas horas. A banda sobe ao palco às nove e cinco, com graxa até o cotovelo.",
            happinessChangePercent: 2,
            chance: 60,
          },
          {
            resultLabel: "Fechada",
            descriptionTemplate:
              "A borracharia fecha às seis. {character1} rola o pneu de volta, sob o olhar de três vacas.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
      {
        label: "Pedir carona com os instrumentos",
        description:
          "Erguer o polegar no acostamento, ao lado de um bumbo e três estojos.",
        consequence: [
          {
            resultLabel: "Carona",
            descriptionTemplate:
              "Um casal de idosos para e leva a banda inteira, com o bumbo no colo da senhora. Ela pede uma música no fim do show.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "A pé",
            descriptionTemplate:
              "Ninguém para para uma banda no acostamento. A banda chega às dez e meia, a pé, e toca para os garçons.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Ligar para o bar e pedir para atrasar",
        description:
          "{character1} acha um telefone num posto e pede uma hora a mais.",
        consequence: [
          {
            resultLabel: "Uma hora a mais",
            descriptionTemplate:
              "O bar segura o show até as dez. A plateia passa a hora bebendo e recebe a banda como heroína.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Substituída",
            descriptionTemplate:
              "O dono escuta tudo com paciência e chama outra banda, que mora na esquina do bar.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Esperar alguém parar para ajudar",
        description:
          "[{character1}] Sentar no capô, abrir uma garrafa d'água e confiar na bondade da estrada.",
        visibleIfCharacterHas: [["lazy"]],
        consequence: [
          {
            resultLabel: "Bondade",
            descriptionTemplate:
              "Um mecânico de folga para, enche o estepe e não cobra nada. {character1} conta a história como se tivesse planejado.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Paciência",
            descriptionTemplate:
              "Ninguém para. Às nove, {character1} ainda está no capô, explicando à banda que paciência também é uma forma de ensaio.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0246-o-ensaio-no-onibus",
    type: "decisao_criativa",
    title: "O ensaio no ônibus",
    descriptionTemplate:
      "A volta do show é num ônibus de madrugada, com três horas de estrada. {character1} quer aproveitar para ensaiar as vozes da música nova ali mesmo, nos últimos bancos. {character2} lembra que o ônibus está cheio de gente que trabalha às sete.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Ensaiar baixinho",
        description: "Vozes em sussurro, só para não perder a viagem.",
        consequence: [
          {
            resultLabel: "Arranjo sussurrado",
            descriptionTemplate:
              "A banda acerta as vozes num sussurro, e a música nova ganha um arranjo de quem não quer acordar ninguém. Fica bonito.",
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
            resultLabel: "Opiniões",
            descriptionTemplate:
              "Um passageiro pede silêncio na segunda música, e outro pede a primeira de novo. A banda não sabe qual dos dois é a crítica.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Ensaiar em voz alta",
        description: "Se o ônibus tem plateia, a banda tem show.",
        consequence: [
          {
            resultLabel: "Ônibus cantando",
            descriptionTemplate:
              "Na terceira música, metade do ônibus canta junto e o motorista pede bis. A outra metade anota o nome da banda para nunca ir ao show.",
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
            resultLabel: "Acostamento",
            descriptionTemplate:
              "O motorista para no acostamento e pergunta se a banda prefere descer ou se calar. A banda se cala pelos duzentos quilômetros seguintes.",
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
        label: "Dormir e deixar o ensaio para casa",
        description:
          "Três horas de sono valem mais que três horas de ensaio no corredor.",
        consequence: {
          resultLabel: "Sono",
          descriptionTemplate:
            "A banda dorme encostada na janela e acorda com a marca do vidro no rosto. A música nova espera mais uma semana.",
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
        label: "Compor no ritmo do motor",
        description:
          "[{character1}] Compor a música nova no tom do ronco do ônibus, batendo o ritmo no encosto do banco da frente.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Música de estrada",
            descriptionTemplate:
              "A música nasce com o ritmo do motor e a melodia de uma buzina. Vira a mais pedida da banda, e ninguém sabe dizer em que tom ela está.",
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
            resultLabel: "Encosto ocupado",
            descriptionTemplate:
              "O dono do encosto acorda na segunda batida e não gosta de ritmo nenhum. {character1} termina a viagem no último banco, ao lado do banheiro.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0247-os-cases-de-guarda-roupa",
    type: "decisao_criativa",
    title: "Os cases de guarda-roupa",
    descriptionTemplate:
      "A banda precisa de cases para levar o equipamento na estrada, e o caixa dá para um só. {character1} encontra um guarda-roupa velho na calçada e anuncia que, com um serrote e boa vontade, dá para fazer o resto.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Fazer os cases com o guarda-roupa",
        description: "Um fim de semana de serrote, cola e dedos amassados.",
        consequence: [
          {
            resultLabel: "Marcenaria",
            descriptionTemplate:
              "Os cases ficam feios e firmes, com as dobradiças do guarda-roupa e um espelho por dentro. A banda ganha onde se pentear antes do show.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Desmontou",
            descriptionTemplate:
              "O primeiro case se abre na escada, e o amplificador desce os degraus sozinho. A porta do guarda-roupa chega lá embaixo inteira.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
      {
        label: "Comprar um case para o instrumento mais caro",
        description:
          "Um case de verdade, e o resto viaja enrolado em cobertor.",
        consequence: {
          resultLabel: "Cobertores",
          descriptionTemplate:
            "O instrumento mais caro viaja protegido. O resto chega aos shows enrolado em cobertor de lã, com cara de quem foi resgatado de uma enchente.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Comprar cases usados a prestação",
        description:
          "Cases de verdade para todo mundo, em dez parcelas que o caixa ainda não tem.",
        consequence: [
          {
            resultLabel: "Protegidos",
            descriptionTemplate:
              "O equipamento passa a viajar em cases de verdade, com as iniciais de outra banda gravadas na tampa.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Cobrador",
            descriptionTemplate:
              "A segunda parcela atrasa, e a loja manda um cobrador ao ensaio. Ele fica para ouvir duas músicas e cobra as duas.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Copiar os cases de uma banda famosa",
        description:
          "[{character1}] Copiar, peça por peça, os cases de uma banda famosa que aparecem numa foto de revista.",
        visibleIfCharacterHas: [["plagiarist"]],
        consequence: [
          {
            resultLabel: "Cara de turnê",
            descriptionTemplate:
              "Os cases saem idênticos aos da foto, com o nome da banda famosa na tampa e tudo. Os porteiros passam a deixar a banda entrar pela frente.",
            happinessChangePercent: 6,
            chance: 60,
          },
          {
            resultLabel: "Foto de frente",
            descriptionTemplate:
              "A foto da revista era de frente, e {character1} não faz ideia de como é a parte de trás de um case. Os cases ficam sem fundo.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0248-o-diario-de-bordo",
    type: "decisao_criativa",
    title: "O diário de bordo",
    descriptionTemplate:
      "{character1} anota num caderno tudo que acontece nas viagens da banda, para fazer um disco inteiro sobre a estrada. {character2} leu escondido e aparece em todas as páginas, sempre como quem esqueceu alguma coisa no posto.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Apoiar o disco da estrada",
        description: "As músicas saem do caderno, com {character2} e tudo.",
        consequence: [
          {
            resultLabel: "Disco de estrada",
            descriptionTemplate:
              "As primeiras músicas ficam boas, e a do posto de gasolina vira a favorita da plateia. {character2} canta o refrão sobre si mesmo com os dentes cerrados.",
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
            resultLabel: "Rima com esqueceu",
            descriptionTemplate:
              '{character2} descobre o próprio nome numa letra, rimado com "esqueceu", e passa a viajar no banco de trás, longe do caderno.',
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
        label: "Pedir que tire {character2} do caderno",
        description: "Músicas sobre a estrada, sem o nome de ninguém.",
        consequence: [
          {
            resultLabel: "Sem nomes",
            descriptionTemplate:
              "{character1} risca os nomes, e as músicas perdem metade das piadas. A estrada fica mais genérica, e {character2}, em paz.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -2,
            chance: 60,
          },
          {
            resultLabel: "Código",
            descriptionTemplate:
              "{character1} acusa a banda de censura e passa a escrever em código, com o nome de {character2} trocado pelo desenho de uma bomba de gasolina.",
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
        label: "Guardar o caderno para depois",
        description:
          "A banda ainda é pequena demais para um disco sobre a própria estrada.",
        consequence: {
          resultLabel: "Gaveta",
          descriptionTemplate:
            "O caderno vai para a gaveta, onde continua crescendo. {character1} anota até a ida à loja para comprar cordas.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Exigir uma música heroica",
        description:
          "[{character2}] Exigir pelo menos uma música em que {character2} salve a banda de alguma coisa.",
        visibleIfCharacterHas: [[], ["envious"]],
        consequence: [
          {
            resultLabel: "Momento heroico",
            descriptionTemplate:
              "{character1} escreve a música do pneu furado com {character2} no papel principal. Sobra um verso para o borracheiro, que foi quem trabalhou.",
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
            resultLabel: "Quarenta segundos",
            descriptionTemplate:
              "{character1} escreve a música heroica. Ela dura quarenta segundos e termina com {character2} esquecendo a carteira no posto.",
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
    id: "0249-o-ensaio-das-seis",
    type: "decisao_criativa",
    title: "O ensaio das seis",
    descriptionTemplate:
      "Com os empregos de dia, o único horário em que a banda inteira está livre é domingo às seis da manhã. {character1} propõe ensaiar nesse horário todo domingo, com café e pão na chapa. {character2} pergunta se o horário vem com cama.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Ensaiar às seis do domingo",
        description: "Toda semana, antes do sol e depois do sábado.",
        consequence: [
          {
            resultLabel: "Disciplina",
            descriptionTemplate:
              "A banda ensaia meio dormindo e descobre que toca mais devagar e mais junta. A padaria da esquina vira patrocinadora informal.",
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
            resultLabel: "Polícia às seis e meia",
            descriptionTemplate:
              "O vizinho da sala não acha que domingo às seis seja horário de bateria e chama a polícia, que chega às seis e meia, também de mau humor.",
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
        label: "Ensaiar uma vez por mês, num horário decente",
        description: "Menos ensaio, mais sono, e o show que se vire.",
        consequence: {
          resultLabel: "Arranjos esquecidos",
          descriptionTemplate:
            "A banda descansa e esquece metade dos arranjos. No show seguinte, cada um toca a versão de que se lembra.",
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
        label: "Ensaiar à noite, depois do trabalho",
        description: "Das dez à meia-noite, com quem conseguir chegar.",
        consequence: [
          {
            resultLabel: "Café e teimosia",
            descriptionTemplate:
              "Todo mundo chega, ninguém sabe como. A banda ensaia até depois da meia-noite, à base de café e teimosia.",
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
            resultLabel: "Rodízio",
            descriptionTemplate:
              "A banda ensaia exausta e com dois integrantes por vez. Ninguém ouve a música inteira há um mês.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Estudar em casa, por conta própria",
        description:
          "[{character2}] Estudar as próprias partes em casa, no horário que quiser, e só aparecer no ensaio do mês.",
        visibleIfCharacterHas: [[], ["individualist"]],
        consequence: [
          {
            resultLabel: "Arranjos para todos",
            descriptionTemplate:
              "{character2} chega sabendo tudo e mais um pouco: trouxe arranjos novos também para as partes dos outros.",
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
            resultLabel: "Duas bandas",
            descriptionTemplate:
              "{character2} chega com as próprias partes perfeitas e nenhuma ideia das outras. A música soa como duas bandas tocando ao mesmo tempo.",
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
    id: "0250-o-porta-malas",
    type: "decisao_criativa",
    title: "O porta-malas",
    descriptionTemplate:
      "O único carro disponível para o show na cidade vizinha é o de uma tia de {character2}, com um porta-malas do tamanho de uma sacola de feira. Cabe o amplificador grande ou a bateria inteira, nunca os dois. {character1} e {character2} decidem com que som a banda chega lá.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Levar a bateria inteira",
        description:
          "O ritmo vai completo, e o amplificador grande fica em casa.",
        consequence: [
          {
            resultLabel: "Volume baixo",
            descriptionTemplate:
              "Sem o amplificador, a banda baixa o volume de tudo e descobre que as letras existem.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Só ritmo",
            descriptionTemplate:
              "A banda faz o show mais percussivo da sua história. A plateia dança por falta de alternativa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Levar o amplificador e meia bateria",
        description:
          "Caixa, prato e bumbo vão no banco de trás, junto com duas pessoas.",
        consequence: [
          {
            resultLabel: "Formato enxuto",
            descriptionTemplate:
              "A meia bateria soa como ensaio de garagem, no bom sentido. A banda chega com som e com dois integrantes amassados.",
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
            resultLabel: "Prato no colo",
            descriptionTemplate:
              "O prato viaja no colo de {character1}, e cada lombada vira um solo de percussão. Chega ao show com a marca do prato na perna.",
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
        label: "Fazer duas viagens",
        description:
          "Levar o equipamento à tarde e voltar para buscar a banda, com o dobro de gasolina.",
        consequence: [
          {
            resultLabel: "Tudo lá",
            descriptionTemplate:
              "Tudo chega, e a tia de {character2} recebe o carro com o tanque vazio e o banco de trás com cheiro de cabo.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Serra",
            descriptionTemplate:
              "Na segunda viagem, o carro esquenta na serra. A banda chega quando o bar já está servindo a saideira.",
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
        label: "Levar só violões e vozes",
        description:
          "[{character1}] Deixar a bateria e o amplificador em casa e fazer um show acústico, do jeito que a música nasceu.",
        visibleIfCharacterHas: [["purist"]],
        consequence: [
          {
            resultLabel: "Silêncio na plateia",
            descriptionTemplate:
              "Sem amplificador e sem bateria, a plateia se cala para ouvir. {character1} chama isso de pureza; o resto da banda, de economia de gasolina.",
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
            resultLabel: "Show para a mesa",
            descriptionTemplate:
              "O barulho do bar engole os violões na primeira música. A banda faz um show acústico para a própria mesa.",
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
    id: "0251-o-cartaz-por-cima",
    type: "conflito_membros",
    title: "O cartaz por cima",
    descriptionTemplate:
      "A banda rival do circuito colou os cartazes dela por cima dos da banda, em todos os postes da avenida, com cola de farinha e capricho. {character1} quer revidar de madrugada; {character2} lembra que os rivais também têm madrugada.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Colar por cima dos deles de madrugada",
        description: "Uma noite inteira de balde, pincel e corrida.",
        consequence: [
          {
            resultLabel: "Avenida retomada",
            descriptionTemplate:
              "Ao amanhecer, a avenida é da banda de novo. Dura até a noite seguinte, quando os rivais voltam com o dobro de cola.",
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
            resultLabel: "Guerra de cola",
            descriptionTemplate:
              "A disputa dura um mês. Os postes ganham dois dedos de papel, e nenhum dos cartazes dá mais para ler.",
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
        label: "Colar os cartazes em outra rua",
        description:
          "Deixar a avenida para eles e ocupar a rua do mercado, onde passa menos gente e mais carrinho de feira.",
        consequence: {
          resultLabel: "Rua do mercado",
          descriptionTemplate:
            "Os cartazes ficam intactos na rua do mercado. Quem lê são as mesmas senhoras de sempre, agora muito bem informadas.",
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
        label: "Propor aos rivais dividir os postes",
        description:
          "Ir ao ensaio deles e sugerir os postes pares para uma banda e os ímpares para a outra.",
        consequence: [
          {
            resultLabel: "Acordo de postes",
            descriptionTemplate:
              "Os rivais aceitam e escolhem os postes do ponto de ônibus. A banda só entende a diferença no fim do mês.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Proposta recusada",
            descriptionTemplate:
              "Os rivais ouvem tudo, riem e colam um cartaz na porta do ensaio da banda na mesma noite.",
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
        label: "Arrancar os cartazes deles em plena luz do dia",
        description:
          "[{character1}] Arrancar cada cartaz rival na frente do bar onde eles tocam, de preferência com eles olhando.",
        visibleIfCharacterHas: [["hothead"]],
        consequence: [
          {
            resultLabel: "Recado dado",
            descriptionTemplate:
              "Os rivais assistem da calçada e não reagem. A história corre o circuito, e a banda ganha fama de perigosa, que ainda é melhor do que fama nenhuma.",
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
            resultLabel: "Empurra-empurra",
            descriptionTemplate:
              "O baterista rival sai do bar, e a discussão termina com {character1} sem um botão da camisa. {character2} passa a semana explicando ao circuito quem começou.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0252-o-guardanapo-assinado",
    type: "conflito_membros",
    title: "O guardanapo assinado",
    descriptionTemplate:
      "Um empresário que agencia três bandas da região, a partir de uma mesa de pastelaria, convenceu {character1} a assinar um contrato num guardanapo. {character2} lê a parte de baixo, escrita a lápis: por cinco anos, a banda só toca onde ele mandar.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Cumprir o contrato e ver no que dá",
        description:
          "Ele prometeu um festival na capital. Prometeu também um carro, mas isso foi para outra banda.",
        consequence: [
          {
            resultLabel: "Agenda cheia",
            descriptionTemplate:
              "O empresário arruma seis shows nos meses seguintes, todos em bares de amigos dele, todos com pastel de cortesia. É mais do que a banda arrumava por conta própria.",
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
            resultLabel: "Agenda dele",
            descriptionTemplate:
              "Os shows aparecem, e a banda abre para a dupla sertaneja dele em todos. O festival da capital continua marcado para o mês que vem, todo mês.",
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
        label: "Rasgar o guardanapo",
        description:
          "Contrato de papel fino se desfaz com um gesto. O empresário, nem sempre.",
        consequence: {
          resultLabel: "Rasgado",
          descriptionTemplate:
            "{character1} rasga o guardanapo na frente do empresário, que pede outro ao garçom e anota o nome da banda numa lista curta e rancorosa.",
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
        label: "Renegociar na mesma pastelaria",
        description:
          "Voltar à mesa e riscar a cláusula dos cinco anos, com caneta, desta vez.",
        consequence: [
          {
            resultLabel: "Um ano só",
            descriptionTemplate:
              "O empresário aceita um ano, desde que a banda pague os pastéis da reunião. Foram onze.",
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
            resultLabel: "Mesa virada",
            descriptionTemplate:
              "O empresário chama a banda de ingrata e conta a versão dele em todos os bares do circuito antes do fim da semana.",
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
        label: "Investigar o empresário antes de qualquer coisa",
        description:
          "[{character2}] Procurar as outras três bandas dele e perguntar, uma por uma, o que aconteceu com elas.",
        visibleIfCharacterHas: [[], ["paranoid"]],
        consequence: [
          {
            resultLabel: "Dossiê",
            descriptionTemplate:
              "Duas bandas acabaram, e a terceira toca na pastelaria toda sexta, de graça. {character1} devolve o guardanapo pelo correio, com o carimbo de recusado.",
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
            resultLabel: "Desconfiança",
            descriptionTemplate:
              "As três bandas falam bem dele, e uma até agradece. {character2} continua {character2:desconfiado|desconfiada|com a pulga atrás da orelha} e agora desconfia também das bandas.",
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
    id: "0253-a-banda-daquela-musica",
    type: "conflito_membros",
    title: "A banda daquela música",
    descriptionTemplate:
      'No circuito, a banda virou "a banda daquela música": um cover que o público pede três vezes por noite, aos gritos. {character1} quer tirar o cover do repertório; {character2} lembra que é a única música que o circuito inteiro sabe cantar.',
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Tirar o cover do repertório",
        description:
          "A banda passa a ser conhecida pelas próprias músicas ou por mais nada.",
        consequence: [
          {
            resultLabel: "Nome próprio",
            descriptionTemplate:
              "Por duas semanas, o público grita o nome do cover. Na terceira, alguém grita o nome de uma música da banda, por engano, e o bar acompanha.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Plateia órfã",
            descriptionTemplate:
              "O público pede o cover a noite toda e vai embora no intervalo. Na semana seguinte, a banda rival põe o mesmo cover no repertório dela.",
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
        label: "Tocar o cover só no bis",
        description: "O público precisa merecer. E esperar.",
        consequence: {
          resultLabel: "Plateia refém",
          descriptionTemplate:
            "O público aguenta o show inteiro pelo bis, com paciência de fila de banco. {character1} toca o cover de olhos fechados, para não ver a felicidade alheia.",
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
        label: "Tocar o cover quantas vezes pedirem",
        description:
          "Se o público pede, a banda toca, na terceira vez com a mesma cara da primeira.",
        consequence: {
          resultLabel: "Máquina de pedidos",
          descriptionTemplate:
            "As noites lotam e terminam cedo. {character1} passa a chamar a banda de máquina de pedidos, sempre perto de {character2}.",
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
        label: "Tocar o cover num arranjo irreconhecível",
        description:
          "[{character1}] Manter a música e desmontar tudo nela, andamento, tom e refrão, até sobrar só o título.",
        visibleIfCharacterHas: [["purist"]],
        consequence: [
          {
            resultLabel: "Versão da banda",
            descriptionTemplate:
              "O público leva três minutos para reconhecer a música e aplaude a descoberta. O cover vira, enfim, uma música da banda.",
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
            resultLabel: "Irreconhecível",
            descriptionTemplate:
              "Ninguém reconhece a música, nem no final. Logo em seguida, o público pede o cover, educadamente.",
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
    id: "0254-o-primo-do-juri",
    type: "conflito_membros",
    title: "O primo do júri",
    descriptionTemplate:
      "O concurso de bandas do bairro dá como prêmio uma tarde num estúdio de verdade, e o primo de {character2} está no júri. {character1} acha que família serve para isso; {character2} prefere não descobrir se a banda ganharia sem ajuda.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pedir o voto ao primo",
        description:
          "Uma conversa de família, longe do palco e perto do almoço de domingo.",
        consequence: [
          {
            resultLabel: "Vitória em família",
            descriptionTemplate:
              "A banda vence por um voto. O segundo colocado aponta o parentesco no microfone, e a tarde de estúdio vem com uma vaia de brinde.",
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
            resultLabel: "Primo íntegro",
            descriptionTemplate:
              "O primo se ofende, conta para a família inteira e dá a nota mais baixa da noite para provar que é honesto. A banda fica em penúltimo, à frente só de um trio de flautas doces.",
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
        label: "Competir sem falar com o primo",
        description: "Tocar como qualquer banda e torcer como qualquer banda.",
        consequence: [
          {
            resultLabel: "Mérito",
            descriptionTemplate:
              "A banda vence de forma limpa, e ninguém acredita. O primo jura a todos que votou contra.",
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
            resultLabel: "Terceiro lugar",
            descriptionTemplate:
              "A banda fica em terceiro e leva um vale-lanche. O primo dá a menor nota de todas, por precaução.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: -2,
            chance: 60,
          },
        ],
      },
      {
        label: "Retirar a banda do concurso",
        description: "Melhor não competir do que ganhar sob suspeita.",
        consequence: {
          resultLabel: "Arquibancada",
          descriptionTemplate:
            "A banda assiste da plateia. Vence uma banda pior, cujo baixista é sobrinho do outro jurado.",
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
        label: "Convidar o primo para jantar na semana do concurso",
        description:
          "[{character1}] Não pedir nada, só pagar o jantar e elogiar a camisa dele três vezes.",
        visibleIfCharacterHas: [["manipulator"]],
        consequence: [
          {
            resultLabel: "Simpatia",
            descriptionTemplate:
              "O primo dá a maior nota da noite, por pura afinidade. {character2} nunca vai saber do jantar, e {character1} pretende que continue assim.",
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
            resultLabel: "Jantar descoberto",
            descriptionTemplate:
              "O primo comenta o jantar com a família, e a família comenta com {character2}. A banda ganha o concurso e perde a paz.",
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
    id: "0255-a-camiseta-da-rival",
    type: "conflito_membros",
    title: "A camiseta da rival",
    descriptionTemplate:
      "{character2} aparece no ensaio com a camiseta da banda rival, presente do vocalista deles. O tecido é melhor que o das camisetas da banda, e {character2} faz questão de comentar. {character1} trata o assunto como traição com estampa.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Exigir que {character2} tire a camiseta",
        description: "No ensaio desta banda, só a estampa desta banda.",
        consequence: {
          resultLabel: "Do avesso",
          descriptionTemplate:
            "{character2} vira a camiseta do avesso, o que tecnicamente esconde a estampa e tecnicamente não resolve nada.",
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
        label: "Ignorar a camiseta",
        description: "É só pano. Pano com o nome dos outros, mas pano.",
        consequence: [
          {
            resultLabel: "Esquecida",
            descriptionTemplate:
              "A camiseta vai para a gaveta depois de duas lavagens, e o assunto vai junto.",
            happinessChangePercent: 0,
            chance: 50,
          },
          {
            resultLabel: "Plateia rival",
            descriptionTemplate:
              "{character2} usa a camiseta no show da banda. Na plateia, os rivais aplaudem a própria estampa.",
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
        label: "Encomendar camisetas melhores que as deles",
        description: "Gastar o caixa num tecido que também dê o que comentar.",
        consequence: {
          resultLabel: "Tecido nobre",
          descriptionTemplate:
            "As camisetas novas ficam ótimas e custam o cachê de dois shows. {character2} veste uma e comenta que a dos rivais ainda era mais macia.",
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
        label: "Dar a {character2} a própria camiseta da banda",
        description:
          "[{character1}] Tirar a camiseta da banda do corpo e entregar ali mesmo, ainda quente.",
        visibleIfCharacterHas: [["loyal"]],
        consequence: [
          {
            resultLabel: "Gesto",
            descriptionTemplate:
              "{character2} aceita, meio sem graça, e nunca mais aparece com a estampa rival. A camiseta volta lavada uma semana depois, com perfume.",
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
            resultLabel: "Duas camisetas",
            descriptionTemplate:
              "{character2} aceita a camiseta e veste por cima da outra. A estampa rival aparece pela gola em todas as fotos dos meses seguintes.",
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
    id: "0256-a-primeira-resenha",
    type: "conflito_membros",
    title: "A primeira resenha",
    descriptionTemplate:
      'O jornal do bairro publica a primeira resenha de um show da banda, três parágrafos entre os classificados e a previsão do tempo. Elogia {character2} pelo nome e chama {character1} de "um esforço sincero". {character2} já recortou a página; {character1} já rascunhou uma carta ao editor.',
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Mandar a carta ao editor",
        description:
          "Uma resposta educada, de três páginas, com alguns adjetivos.",
        consequence: [
          {
            resultLabel: "Direito de resposta",
            descriptionTemplate:
              "O jornal publica a carta inteira, e o bairro passa a semana discutindo a banda. É a primeira vez que alguém discute a banda.",
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
            resultLabel: "Tréplica",
            descriptionTemplate:
              "O jornal publica a carta cortada, ao lado de uma nota do resenhista que confirma o esforço. Agora são dois textos.",
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
        label: "Usar a resenha no próximo cartaz",
        description:
          "Recortar a frase do elogio e deixar o resto para o arquivo do jornal.",
        consequence: {
          resultLabel: "Citação",
          descriptionTemplate:
            'O cartaz sai com "uma banda que merece ser vista", em letras grandes. A frase original continuava com "uma vez", mas o cartaz não tinha espaço.',
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
        label: "Fingir que ninguém leu",
        description:
          "Não tocar no assunto até o jornal virar papel de embrulho.",
        consequence: {
          resultLabel: "Silêncio",
          descriptionTemplate:
            "Ninguém fala da resenha. {character2} guarda o recorte na capa do caderno de letras, virado para fora.",
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
        label: "Levar o resenhista a outro show",
        description:
          "[{character1}] Ir à redação, buscar o resenhista e ficar ao lado dele a noite inteira, para ajudar na avaliação.",
        visibleIfCharacterHas: [["validation_seeker"]],
        consequence: [
          {
            resultLabel: "Segunda chance",
            descriptionTemplate:
              "A segunda resenha elogia {character1} pelo nome. Também cita, sem nomear, um integrante que não saiu de perto da mesa do jornal.",
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
            resultLabel: "Esforço confirmado",
            descriptionTemplate:
              "A segunda resenha repete a primeira, com um parágrafo a mais sobre a insistência de certos integrantes.",
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
    id: "0257-o-estudio-por-hora",
    type: "conflito_membros",
    title: "O estúdio por hora",
    descriptionTemplate:
      "A banda grava a primeira demo num estúdio nos fundos de uma oficina, cobrado por hora, com um relógio de parede que adianta. Faltam vinte minutos, e {character1} quer usar todos para regravar a parte de {character2}, que achou a primeira tentativa ótima.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Regravar a parte de {character2}",
        description: "Vinte minutos, uma tentativa e o relógio correndo.",
        consequence: [
          {
            resultLabel: "Take bom",
            descriptionTemplate:
              "A segunda tentativa sai melhor, e {character2} admite isso no ônibus de volta, só para a janela.",
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
            resultLabel: "Hora extra",
            descriptionTemplate:
              "A segunda tentativa sai pior, a terceira também, e a banda paga mais uma hora para voltar à primeira.",
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
        label: "Gravar mais uma música com o tempo que sobrou",
        description:
          "Quantidade também é qualidade quando o dinheiro é contado.",
        consequence: {
          resultLabel: "Faixa extra",
          descriptionTemplate:
            "A banda grava uma música a mais, numa tentativa só, com o mecânico ligando o compressor no meio do refrão. O barulho fica na demo, e alguém chama de textura.",
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
        label: "Encerrar e economizar o dinheiro",
        description: "Sair vinte minutos mais cedo, com o troco no bolso.",
        consequence: {
          resultLabel: "Troco",
          descriptionTemplate:
            "A banda sai com a demo e com dinheiro para o lanche. {character1} escuta a parte de {character2} quarenta vezes na semana, sem dizer nada.",
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
        label: "Mexer na mixagem nos vinte minutos",
        description:
          "[{character1}] Mexer em cada botão da mesa até a parte de {character2} sumir no lugar certo.",
        visibleIfCharacterHas: [["perfectionist"]],
        consequence: [
          {
            resultLabel: "Equilíbrio",
            descriptionTemplate:
              "Em vinte minutos, {character1} deixa a demo soando como uma banda de verdade. O técnico pede para usar como exemplo para os próximos clientes.",
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
            resultLabel: "Sumiu",
            descriptionTemplate:
              "A parte de {character2} some, e não só no lugar certo. {character2} descobre ao ouvir a demo pronta, em casa, com a família.",
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
    id: "0258-o-ex-integrante",
    type: "conflito_membros",
    title: "O ex-integrante",
    descriptionTemplate:
      "O primeiro baterista da banda, que saiu antes do primeiro show, agora toca na banda rival e conta nos bares do circuito que compôs as músicas mais antigas da banda. {character1} quer tirar satisfação; {character2} ainda almoça com ele aos domingos.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Desmentir o ex no palco",
        description:
          "Antes de cada música antiga, anunciar quem compôs, com nome e data.",
        consequence: [
          {
            resultLabel: "Versão oficial",
            descriptionTemplate:
              "O público aprende a história das músicas. Parte dele prefere a versão do ex, que tinha mais drama.",
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
            resultLabel: "Réplica no bar",
            descriptionTemplate:
              "O ex aparece no show seguinte e conta a versão dele do fundo do bar, sem microfone e mais alto que a banda.",
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
        label: "Deixar o ex falar",
        description: "Quem compôs sabe quem compôs.",
        consequence: {
          resultLabel: "Boato",
          descriptionTemplate:
            "O boato cresce sem ninguém para contrariar. Alguns meses depois, o ex compôs também uma música que a banda ainda nem terminou.",
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
        label: "Pedir a {character2} que pare de almoçar com ele",
        description: "Domingo é dia de família, e ele não é mais da família.",
        consequence: [
          {
            resultLabel: "Cardápio novo",
            descriptionTemplate:
              "{character2} para de almoçar com o ex, e o ex para de falar da banda, por falta de assunto.",
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
            resultLabel: "Sobremesa",
            descriptionTemplate:
              "{character2} continua almoçando com o ex e agora não conta mais o que ele diz. {character1} passa a ler muita coisa nos silêncios de segunda-feira.",
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
        label: "Chamar o ex para tocar uma música antiga no show",
        description:
          "[{character2}] Convidar o ex ao palco e deixar a plateia ver quem sabe tocar a música de verdade.",
        visibleIfCharacterHas: [[], ["friendly"]],
        consequence: [
          {
            resultLabel: "Reencontro",
            descriptionTemplate:
              "O ex sobe, erra a entrada da música que diz ter composto, e o bar inteiro percebe. Sai do palco abraçado com a banda e sem mais nenhuma história para contar.",
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
            resultLabel: "Palco tomado",
            descriptionTemplate:
              "O ex sobe, toca bem e aproveita o microfone para anunciar o show da banda rival na sexta.",
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
    id: "0259-a-vinheta-da-radio",
    type: "oportunidade_externa",
    title: "A vinheta da rádio",
    descriptionTemplate:
      'A rádio comunitária, que transmite dos fundos de uma borracharia, promete tocar a demo da banda todo domingo. Em troca, quer {character1} gravando a vinheta da emissora: "A voz do bairro, do pneu ao coração".',
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Gravar a vinheta como pedem",
        description:
          "[{character1}] Cantar o slogan inteiro com a seriedade de um hino.",
        consequence: {
          resultLabel: "No ar",
          descriptionTemplate:
            "A demo toca todo domingo, logo depois da vinheta. O bairro passa a reconhecer a voz de {character1}, sempre cantando sobre pneus.",
          happinessChangePercent: 2,
        },
      },
      {
        label: "Gravar a vinheta no estilo da banda",
        description:
          "[{character1}] Pôr guitarra distorcida e um grito no fim do slogan.",
        consequence: [
          {
            resultLabel: "Vinheta famosa",
            descriptionTemplate:
              "O dono da rádio adora, e a vinheta toca de hora em hora. A banda vira a trilha oficial da troca de óleo.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Sobrinha regrava",
            descriptionTemplate:
              "O dono acha agressivo para o público da manhã e chama a sobrinha para regravar. A demo continua na gaveta da borracharia.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar a vinheta",
        description:
          "[{character1}] A banda grava música, não propaganda de borracharia.",
        consequence: {
          resultLabel: "Fora do ar",
          descriptionTemplate:
            "A rádio respeita a decisão e passa a tocar a demo de uma banda rival, que gravou a vinheta no dia seguinte.",
          happinessChangePercent: -4,
        },
      },
      {
        label: "Propor um programa da banda na rádio",
        description:
          "[{character1}] Oferecer meia hora semanal da banda ao vivo, entre os recados dos ouvintes e os anúncios de pneu.",
        visibleIfCharacterHas: [["creative"]],
        consequence: [
          {
            resultLabel: "Programa próprio",
            descriptionTemplate:
              "A rádio aceita, e a banda ganha meia hora aos domingos, às sete da manhã. A audiência é pequena e muito bem acordada.",
            happinessChangePercent: 8,
            chance: 50,
          },
          {
            resultLabel: "Apagão",
            descriptionTemplate:
              "O programa estreia com uma queda de energia no meio da segunda música. Dali em diante, a rádio volta a tocar só a vinheta.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0260-a-coletanea-do-bairro",
    type: "oportunidade_externa",
    title: "A coletânea do bairro",
    descriptionTemplate:
      "Um comerciante vai lançar uma coletânea com doze bandas do circuito, e cada banda paga a sua parte dos custos. A banda entraria na faixa doze, logo depois da banda rival. {character1} quer entrar; {character2} quer saber quem compra uma coletânea de doze bandas que ninguém conhece.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar e entrar na coletânea",
        description: "Faixa doze é melhor que faixa nenhuma.",
        consequence: [
          {
            resultLabel: "Faixa doze",
            descriptionTemplate:
              "A coletânea circula pelos bares, e quem chega à faixa doze lembra da banda. São poucas pessoas, todas muito pacientes.",
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
            resultLabel: "Encalhe",
            descriptionTemplate:
              "A coletânea encalha, e o comerciante devolve a parte de cada banda em cópias. A banda passa a dar a coletânea de presente em todo aniversário.",
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
        label: "Pagar o dobro por uma faixa melhor",
        description: "Entrar antes da banda rival, de preferência bem antes.",
        consequence: [
          {
            resultLabel: "Faixa três",
            descriptionTemplate:
              "O comerciante aceita o dinheiro com gosto e põe a banda na faixa três, onde as pessoas ainda estão prestando atenção.",
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
            resultLabel: "Leilão",
            descriptionTemplate:
              "A banda rival descobre e paga o triplo. A banda volta para a faixa doze, agora mais pobre.",
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
        label: "Recusar a coletânea",
        description: "O dinheiro fica para as cordas e as peles da bateria.",
        consequence: {
          resultLabel: "Fora da lista",
          descriptionTemplate:
            "A coletânea sai com onze bandas. A faixa doze fica com a banda rival, que entra duas vezes.",
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
        label: "Mandar uma música inspirada no sucesso do circuito",
        description:
          "[{character1}] Entrar com uma música nova que lembra muito, muito mesmo, o maior sucesso da banda rival.",
        visibleIfCharacterHas: [["plagiarist"]],
        consequence: [
          {
            resultLabel: "Cópia premiada",
            descriptionTemplate:
              "A versão da banda pega antes da original. A banda rival acusa plágio, e o bairro inteiro escuta as duas para comparar.",
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
            resultLabel: "Faixa onze",
            descriptionTemplate:
              "A original está na faixa onze. Quem escuta a coletânea ouve a mesma música duas vezes seguidas e tira as próprias conclusões.",
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
    id: "0261-a-noite-na-outra-banda",
    type: "oportunidade_externa",
    title: "A noite na outra banda",
    descriptionTemplate:
      "Uma banda um pouco maior do circuito perdeu um integrante na véspera de um show grande e pede {character1} {character1:emprestado|emprestada|por empréstimo} por uma noite. O cachê é melhor que o da banda inteira, e isso já foi mencionado duas vezes.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Aceitar e tocar com eles",
        description: "[{character1}] Uma noite, um cachê e nenhum compromisso.",
        consequence: [
          {
            resultLabel: "Noite bem paga",
            descriptionTemplate:
              "{character1} toca bem, recebe o cachê e volta falando de um camarim com espelho. A banda escuta com o sorriso de quem não tem espelho.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Convite fixo",
            descriptionTemplate:
              "Eles gostam tanto que convidam {character1} para ficar. {character1} recusa e guarda o telefone deles numa gaveta que abre de vez em quando.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Aceitar se a banda abrir o show",
        description:
          "[{character1}] Emprestar o integrante em troca de vinte minutos no palco grande.",
        consequence: [
          {
            resultLabel: "Pacote",
            descriptionTemplate:
              "Eles aceitam, e a banda abre a noite para uma casa cheia. {character1} toca duas vezes e sai com o dobro do suor.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Outro substituto",
            descriptionTemplate:
              "Eles acham caro e arrumam um substituto na banda rival, que não exigiu nada.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar o convite",
        description:
          "[{character1}] Quem toca nesta banda não toca nas outras.",
        consequence: {
          resultLabel: "Exclusividade",
          descriptionTemplate:
            "{character1} recusa. Na sexta, a banda maior faz o show com um substituto pior e lota a casa mesmo assim.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Aprender o repertório deles em uma tarde",
        description:
          "[{character1}] Pedir as músicas por escrito, estudar a tarde inteira e chegar sabendo mais que os donos.",
        visibleIfCharacterHas: [["professional"]],
        consequence: [
          {
            resultLabel: "Substituição perfeita",
            descriptionTemplate:
              "{character1} toca sem um erro, e o vocalista deles cita no microfone o nome da banda de {character1}. É a primeira divulgação gratuita da carreira.",
            happinessChangePercent: 8,
            chance: 70,
          },
          {
            resultLabel: "Saber demais",
            descriptionTemplate:
              "{character1} sabe as músicas melhor que eles e corrige o guitarrista no palco. Não chamam mais, nem para assistir.",
            happinessChangePercent: -4,
            chance: 30,
          },
        ],
      },
    ],
  },
  {
    id: "0262-o-festival-do-sitio",
    type: "oportunidade_externa",
    title: "O festival do sítio",
    descriptionTemplate:
      'Um organizador de bairro vende vagas num "festival de rock" num sítio da cidade vizinha: a banda paga a inscrição, leva o próprio som e ganha "exposição". {character1} já imagina a multidão; {character2} já imagina a estrada de terra.',
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Pagar a inscrição e ir",
        description: "Festival é festival, mesmo entre aspas.",
        consequence: [
          {
            resultLabel: "Festival de verdade",
            descriptionTemplate:
              "Aparecem trezentas pessoas, um palco de madeira e um gerador que aguenta até o fim. A banda toca às quatro da tarde, debaixo de sol e de aplauso.",
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
            resultLabel: "Aniversário",
            descriptionTemplate:
              "O festival é o aniversário do dono do sítio, com quarenta convidados. A banda toca entre o bolo e o parabéns.",
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
        label: "Pagar a inscrição só depois do show",
        description: "Se o festival existir, a banda paga com gosto.",
        consequence: [
          {
            resultLabel: "Pago na volta",
            descriptionTemplate:
              "O organizador aceita, o festival acontece, e a banda paga a inscrição com o que vendeu no próprio sítio.",
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
            resultLabel: "Vaga vendida",
            descriptionTemplate:
              "O organizador vende a vaga para uma banda que pagou adiantado e culpa a burocracia.",
            happinessChangePercent: -2,
            chance: 50,
          },
        ],
      },
      {
        label: "Recusar o festival",
        description:
          "Pagar para tocar é um costume que a banda prefere não começar.",
        consequence: {
          resultLabel: "Domingo livre",
          descriptionTemplate:
            "A banda passa o domingo em casa. Na segunda, o jornal do bairro elogia o festival, que teve seis bandas e nenhuma era esta.",
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
        label: "Alugar o sítio e organizar o próprio festival",
        description:
          "[{character1}] Cortar o organizador e convidar as bandas do circuito, cada uma pagando a sua parte.",
        visibleIfCharacterHas: [["visionary"]],
        consequence: [
          {
            resultLabel: "Produtores",
            descriptionTemplate:
              "O festival acontece, com nove bandas e um nome que {character1} inventou de madrugada. Dá prejuízo, e a banda vira o assunto do circuito por meses.",
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
            resultLabel: "Sem gerador",
            descriptionTemplate:
              "As bandas aparecem, o gerador não. A banda passa o festival empurrando carros na estrada de terra.",
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
    id: "0263-os-trinta-ingressos",
    type: "oportunidade_externa",
    title: "Os trinta ingressos",
    descriptionTemplate:
      "Uma banda um pouco maior convida a banda para abrir o show dela no sábado, com uma condição: vender trinta ingressos antecipados. {character1} já aceitou, e {character2} já contou os amigos: dá onze, com boa vontade.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Vender os ingressos para parentes e colegas",
        description:
          "Tios, vizinhos e colegas do emprego de dia: quem tiver bolso.",
        consequence: [
          {
            resultLabel: "Plateia de parentes",
            descriptionTemplate:
              "A banda vende os trinta, quase todos para parentes, que gritam o nome de cada integrante durante o show da banda principal também.",
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
            resultLabel: "Dezenove",
            descriptionTemplate:
              "A banda vende dezenove e paga os outros onze do próprio bolso. Na porta, distribui os ingressos de graça para quem estava passando.",
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
        label: "Pedir para abrir o show sem a condição",
        description: "Mostrar a demo e apostar que a música basta.",
        consequence: [
          {
            resultLabel: "Exceção",
            descriptionTemplate:
              "A banda maior escuta a demo e dispensa a condição. O gesto vira história nos bares, e cada banda conta a própria versão.",
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
            resultLabel: "Vaga perdida",
            descriptionTemplate:
              "A banda maior chama outra banda de abertura, que tem família grande.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -4,
            chance: 70,
          },
        ],
      },
      {
        label: "Desistir de abrir o show",
        description: "Palco emprestado com pedágio não serve.",
        consequence: {
          resultLabel: "Na plateia",
          descriptionTemplate:
            "A banda assiste da plateia, de ingresso comprado como todo mundo. {character1} passa o show calculando quanto teria custado.",
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
        label: "Vender os trinta de porta em porta",
        description:
          "[{character1}] Bater em cada casa do bairro, depois do emprego e antes do ensaio, até vender o último.",
        visibleIfCharacterHas: [["workaholic"]],
        consequence: [
          {
            resultLabel: "Esgotado",
            descriptionTemplate:
              "{character1} vende os trinta em quatro noites, e mais dez que ninguém pediu. A banda maior pergunta, desconfiada, quantos parentes a banda tem.",
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
            resultLabel: "Exaustão",
            descriptionTemplate:
              "{character1} vende vinte e oito e cochila em pé durante o show de abertura, com a cabeça apoiada no amplificador.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0264-a-banda-dos-novatos",
    type: "oportunidade_externa",
    title: "A banda dos novatos",
    descriptionTemplate:
      'Uma banda de estudantes de quinze anos pede para abrir o próximo show da banda. Eles têm instrumentos novos e um cartaz que diz "convidados especiais", sem ninguém ter convidado. {character1} acha simpático; {character2} ouviu o ensaio deles e não achou nada simpático.',
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Deixar os novatos abrirem o show",
        description: "Toda banda já foi novata, e quase todas continuam.",
        consequence: [
          {
            resultLabel: "Padrinhos",
            descriptionTemplate:
              "Os novatos trazem a escola inteira, que fica para o show principal por educação e volta no seguinte por vontade.",
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
            resultLabel: "Ofuscados",
            descriptionTemplate:
              "Os novatos tocam tão bem que metade do público sai com eles para comemorar.",
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
        label: "Recusar os novatos",
        description: "Palco não é escolinha.",
        consequence: {
          resultLabel: "Sem abertura",
          descriptionTemplate:
            "Os novatos tocam no bar da esquina na mesma noite, e o barulho deles atravessa a rua durante o show da banda.",
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
        label: "Exigir que os novatos vendam ingressos",
        description:
          "A mesma condição que as bandas maiores impõem, que do lado de cá parece bem mais justa.",
        consequence: [
          {
            resultLabel: "Casa cheia",
            descriptionTemplate:
              "Os novatos vendem tudo para os pais, e a banda toca para a casa mais cheia do ano. Ninguém comenta de onde veio a ideia.",
            happinessChangePercent: 4,
            chance: 60,
          },
          {
            resultLabel: "Fama de pedágio",
            descriptionTemplate:
              "Os novatos contam a história no circuito, e a banda ganha fama de cobrar pedágio dos mais novos. A fama chega antes dela em todo bar.",
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
        label: "Emprestar aos novatos o amplificador que chia",
        description:
          "[{character2}] Oferecer ajuda com o equipamento, em especial com o amplificador mais velho da banda.",
        visibleIfCharacterHas: [[], ["jealous"]],
        consequence: [
          {
            resultLabel: "Mentoria",
            descriptionTemplate:
              "Os novatos tocam com chiado, a banda soa melhor por comparação, e {character2} chama isso de mentoria.",
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
            resultLabel: "Chiado vencido",
            descriptionTemplate:
              "Os novatos tocam tão bem que o chiado vira parte do som. No fim, pedem o amplificador emprestado de novo.",
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
    id: "0265-a-banca-de-jornal",
    type: "oportunidade_externa",
    title: "A banca de jornal",
    descriptionTemplate:
      "O dono da banca de jornal da praça aceita vender cópias da demo da banda no balcão, ao lado das balas, em consignação. {character1} {character1:fica encarregado|fica encarregada|fica com a tarefa} de levar as cópias e de buscar o dinheiro, se houver.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Deixar vinte cópias e esperar o fim do mês",
        description:
          "[{character1}] Entregar as cópias e esquecer a banca por um mês.",
        consequence: [
          {
            resultLabel: "Doze vendidas",
            descriptionTemplate:
              "No fim do mês, a banca vendeu doze. O dono pede mais e conta que os compradores levavam junto uma bala de hortelã, como se fosse combinado.",
            happinessChangePercent: 6,
            chance: 40,
          },
          {
            resultLabel: "Ao lado das balas",
            descriptionTemplate:
              "Vendeu duas. As outras dezoito estão onde estavam, um pouco desbotadas pelo sol da tarde.",
            happinessChangePercent: -4,
            chance: 60,
          },
        ],
      },
      {
        label: "Pagar ao dono um lugar na vitrine",
        description:
          "[{character1}] Trocar o lugar ao lado das balas pelo lugar ao lado das revistas, por uma taxa semanal.",
        consequence: [
          {
            resultLabel: "Vitrine",
            descriptionTemplate:
              "A demo vende bem na vitrine, um pouco menos do que o dono cobra pelo espaço. A banda chama isso de investimento.",
            happinessChangePercent: 2,
            chance: 50,
          },
          {
            resultLabel: "Capas pálidas",
            descriptionTemplate:
              "A vitrine pega sol a tarde inteira, e as capas desbotam em uma semana. A banda agora tem a demo mais pálida do circuito.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Vender a demo nos shows",
        description:
          "[{character1}] Recolher as cópias da banca e vender de mão em mão depois de cada show.",
        consequence: {
          resultLabel: "Mão em mão",
          descriptionTemplate:
            "{character1} vende algumas por noite, quase sempre para quem já tinha comprado e perdeu. O dono da banca fica com as balas.",
          happinessChangePercent: 0,
        },
      },
      {
        label: "Passar na banca todo dia para conferir",
        description:
          "[{character1}] Visitar a banca diariamente, perguntar quantas venderam e arrumar as cópias para ficarem mais à vista.",
        visibleIfCharacterHas: [["insecure"]],
        consequence: [
          {
            resultLabel: "Dono com pena",
            descriptionTemplate:
              "O dono, com pena, passa a recomendar a demo a todo freguês. As vendas sobem, e {character1} volta a dormir.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Compra própria",
            descriptionTemplate:
              "Num dia sem vendas, {character1} compra uma cópia para animar o dono. No fim do mês, a maior compradora da demo é a própria banda.",
            happinessChangePercent: -6,
            chance: 50,
          },
        ],
      },
    ],
  },
  {
    id: "0266-a-foto-de-divulgacao",
    type: "decisao_criativa",
    title: "A foto de divulgação",
    descriptionTemplate:
      "Um fotógrafo do jornal do bairro faz a primeira foto de divulgação da banda, num muro perto da linha do trem. Das trinta fotos, a única com todos em foco tem {character2} espirrando, e a única em que {character2} saiu bem corta {character1} na altura da testa.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Usar a foto do espirro",
        description: "Todos em foco, um integrante no meio de um espirro.",
        consequence: {
          resultLabel: "Foto oficial",
          descriptionTemplate:
            "A foto sai no jornal e em todos os cartazes. O bairro passa a reconhecer {character2} na rua e a oferecer lenço.",
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
        label: "Usar a foto que corta {character1}",
        description:
          "{character2} sai bem; {character1} sai da sobrancelha para baixo.",
        consequence: {
          resultLabel: "Sem testa",
          descriptionTemplate:
            "A foto agrada a todos, menos a {character1}, que passa a tocar de chapéu para compensar uma testa que ninguém mais procura.",
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
        label: "Pagar outra sessão de fotos",
        description: "O fotógrafo cobra o dobro e escolhe outro muro.",
        consequence: [
          {
            resultLabel: "Foto nova",
            descriptionTemplate:
              "A nova sessão rende uma foto com todos de olhos abertos e nenhum espirro. Custa o cachê de um mês e a paciência do fotógrafo.",
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
            resultLabel: "Guarda-chuvas",
            descriptionTemplate:
              "Na segunda sessão chove. A melhor foto mostra a banda inteira de guarda-chuva e nenhum rosto.",
            happinessChangePercent: -4,
            chance: 40,
          },
        ],
      },
      {
        label: "Posar de costas na última foto",
        description:
          "[{character2}] Pedir uma foto extra, de costas para a câmera, olhando o trem passar.",
        visibleIfCharacterHas: [[], ["shy"]],
        consequence: [
          {
            resultLabel: "Mistério",
            descriptionTemplate:
              "A foto de costas vira a oficial, e o bairro passa a especular sobre {character2}, que nunca mais precisa dar entrevista.",
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
            resultLabel: "Ponto de ônibus",
            descriptionTemplate:
              "A foto sai bonita, mas no jornal parece que a banda está esperando o ônibus. A legenda diz exatamente isso.",
            happinessChangePercent: -2,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0267-o-letreiro-de-acougue",
    type: "decisao_criativa",
    title: "O letreiro de açougue",
    descriptionTemplate:
      "O pintor de letreiros do bairro oferece de graça o logotipo da banda, para o bumbo, os cartazes e as camisetas. Ele só sabe um estilo, o dos açougues da avenida: letras vermelhas grossas e um boi sorrindo no canto. {character1} acha que tem personalidade; {character2} acha que tem gordura.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Aceitar o logotipo com o boi",
        description: "De graça, com personalidade e com o boi.",
        consequence: [
          {
            resultLabel: "Inconfundível",
            descriptionTemplate:
              "O logotipo vira assunto no circuito, e o público passa a chamar a banda pelo nome do boi. Ninguém confunde mais a banda com a rival.",
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
            resultLabel: "Preço do quilo",
            descriptionTemplate:
              "As pessoas param diante do cartaz para perguntar o preço do quilo. Algumas vão ao show, com fome.",
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
        label: "Aceitar o logotipo sem o boi",
        description: "Só as letras, que já são bastante coisa.",
        consequence: {
          resultLabel: "Letras vermelhas",
          descriptionTemplate:
            "O logotipo fica sóbrio, dentro do possível. Quem passa pela avenida ainda acha que a banda abriu uma filial do açougue.",
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
        label: "Pagar um desenhista profissional",
        description:
          "Um logotipo moderno, com o dinheiro do caixa e sem nenhum animal.",
        consequence: {
          resultLabel: "Profissional",
          descriptionTemplate:
            "O desenhista entrega um logotipo elegante, idêntico ao de duas outras bandas do circuito, que contrataram o mesmo desenhista.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pedir um boi tocando guitarra",
        description:
          "[{character1}] Ir além: o boi de guitarra, óculos escuros e um raio saindo do chifre.",
        visibleIfCharacterHas: [["experimental"]],
        consequence: [
          {
            resultLabel: "Mascote",
            descriptionTemplate:
              "O pintor se empolga, e o boi guitarrista vira mascote. As crianças do bairro desenham o boi no caderno, e algumas pedem para ir ao show.",
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
            resultLabel: "Boi demais",
            descriptionTemplate:
              "O pintor capricha tanto que o boi ocupa o bumbo inteiro e o nome da banda vai para a borda. O público pede a música do boi.",
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
    id: "0268-a-balada-fora-do-lugar",
    type: "decisao_criativa",
    title: "A balada fora do lugar",
    descriptionTemplate:
      "{character1} compôs uma balada de amor, a melhor música da banda e a única que não combina com nada que a banda toca. A banda rival do circuito, que vive de baladas, ofereceu um bom dinheiro por ela.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Vender a balada para a rival",
        description:
          "[{character1}] Dinheiro na mão e música na boca dos outros.",
        consequence: [
          {
            resultLabel: "Sucesso alheio",
            descriptionTemplate:
              "A balada vira o maior sucesso da banda rival. {character1} ouve a música em todo bar do circuito, com outra voz, e recebe o dinheiro em três parcelas.",
            happinessChangePercent: -6,
            chance: 50,
          },
          {
            resultLabel: "Dinheiro no bolso",
            descriptionTemplate:
              "A rival toca a balada no fim do show, depois do bis, quando metade do bar já foi embora. {character1} compra cordas novas e quase não sente falta.",
            happinessChangePercent: 4,
            chance: 50,
          },
        ],
      },
      {
        label: "Tocar a balada no show da banda",
        description:
          "[{character1}] Encaixar quatro minutos de amor entre duas músicas barulhentas.",
        consequence: [
          {
            resultLabel: "Momento do show",
            descriptionTemplate:
              "O bar fica em silêncio, e algumas pessoas se abraçam. A banda passa a ser conhecida como a banda daquela música lenta.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Hora da bebida",
            descriptionTemplate:
              "No primeiro verso, metade do bar vai buscar bebida. A outra metade aproveita para conversar.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Guardar a balada na gaveta",
        description:
          "[{character1}] Esperar o dia em que a banda tiver um repertório que combine com ela.",
        consequence: {
          resultLabel: "Gaveta",
          descriptionTemplate:
            "A balada fica guardada. {character1} canta no chuveiro toda manhã para uma plateia de azulejos.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Tocar a balada sem a banda, no meio do show",
        description:
          "[{character1}] Pedir que a banda saia do palco por quatro minutos e tocar a balada com um instrumento só.",
        visibleIfCharacterHas: [["romantic"]],
        consequence: [
          {
            resultLabel: "Arrepio",
            descriptionTemplate:
              "O bar inteiro escuta em silêncio, e uma pessoa chora perto do balcão. A banda volta ao palco sem saber o que fazer com tanto aplauso.",
            happinessChangePercent: 8,
            chance: 60,
          },
          {
            resultLabel: "Verso esquecido",
            descriptionTemplate:
              "{character1} esquece o segundo verso diante do bar inteiro. A banda volta antes do fim, por solidariedade e por pressa.",
            happinessChangePercent: -6,
            chance: 40,
          },
        ],
      },
    ],
  },
  {
    id: "0269-o-nome-repetido",
    type: "decisao_criativa",
    title: "O nome repetido",
    descriptionTemplate:
      "Uma banda da cidade vizinha manda uma carta: usa o mesmo nome há dois anos, chegou primeiro e tem um primo advogado. O primo está no segundo ano da faculdade, mas a carta tem papel timbrado. {character1} quer manter o nome; {character2} já fez uma lista de nomes novos.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o nome e ignorar a carta",
        description:
          "Quem chegou primeiro não é dono do nome. Ou é, ninguém tem certeza.",
        consequence: [
          {
            resultLabel: "Carta perdida",
            descriptionTemplate:
              "A outra banda manda mais duas cartas e desiste na terceira, por falta de selo.",
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
            resultLabel: "Confusão",
            descriptionTemplate:
              "O público passa a confundir as duas bandas, e a banda recebe reclamações de um show que não fez, numa cidade onde nunca esteve.",
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
        label: "Trocar o nome da banda",
        description: "Um nome novo, tirado da lista de {character2}.",
        consequence: {
          resultLabel: "Nome novo",
          descriptionTemplate:
            "A banda troca de nome. Metade do circuito continua usando o antigo, e a outra metade aprende o novo com uma letra trocada.",
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
        label: "Acrescentar o nome do bairro ao nome da banda",
        description:
          "Manter o nome e acabar com a dúvida, ao custo de mais três palavras.",
        consequence: {
          resultLabel: "Sobrenome",
          descriptionTemplate:
            "O nome fica comprido demais e cabe no cartaz só em letra pequena. Pelo menos ninguém confunde mais.",
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
        label: "Desafiar a outra banda para um duelo no palco",
        description:
          "[{character1}] Propor um show das duas bandas na mesma noite, e o público decide quem fica com o nome.",
        visibleIfCharacterHas: [["confident"]],
        consequence: [
          {
            resultLabel: "Nome conquistado",
            descriptionTemplate:
              "A banda vence por aclamação, e a outra banda aceita trocar de nome no próprio palco, com a dignidade que sobrou.",
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
            resultLabel: "Nome perdido",
            descriptionTemplate:
              "A outra banda traz a cidade inteira de ônibus e vence. A banda volta para casa sem nome e sem ter vendido nada no bar.",
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
    id: "0270-o-texto-de-apresentacao",
    type: "decisao_criativa",
    title: "O texto de apresentação",
    descriptionTemplate:
      'A banda precisa de um texto de apresentação para mandar a rádios, jornais e festivais. {character1} {character1:ficou encarregado|ficou encarregada|ficou com a tarefa} e já escreveu a primeira frase: "A banda mais comentada da cidade".',
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 1,
    options: [
      {
        label: "Mandar o texto como está",
        description:
          "[{character1}] Exagero é o idioma oficial dos textos de apresentação.",
        consequence: [
          {
            resultLabel: "Comentada",
            descriptionTemplate:
              "Um festival da região acredita e chama a banda. O público do festival não comenta nada, mas o texto continua funcionando com os outros festivais.",
            happinessChangePercent: 6,
            chance: 50,
          },
          {
            resultLabel: "Checagem",
            descriptionTemplate:
              "O jornal da cidade liga para saber quem comenta a banda. {character1} dá o próprio telefone e o da mãe.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Reescrever só com fatos",
        description:
          "[{character1}] Contar o número exato de shows, de fãs e de músicas prontas.",
        consequence: {
          resultLabel: "Três linhas",
          descriptionTemplate:
            "O texto novo é verdadeiro e cabe em três linhas. Nenhuma rádio responde, mas todas que leram sabem exatamente quem a banda é.",
          happinessChangePercent: -2,
        },
      },
      {
        label: "Pagar um jornalista para escrever",
        description:
          "[{character1}] Contratar o resenhista do jornal do bairro, que escreve por encomenda nas horas vagas.",
        consequence: [
          {
            resultLabel: "Palavras difíceis",
            descriptionTemplate:
              "O texto fica elegante e cheio de palavras difíceis. Duas rádios tocam a demo, uma delas para descobrir o que o texto queria dizer.",
            happinessChangePercent: 4,
            chance: 50,
          },
          {
            resultLabel: "Texto genérico",
            descriptionTemplate:
              "O jornalista cobra caro e entrega um texto que serve para qualquer banda. Serve, inclusive, para a banda rival, que comprou o mesmo.",
            happinessChangePercent: -4,
            chance: 50,
          },
        ],
      },
      {
        label: "Aumentar o texto",
        description:
          "[{character1}] Acrescentar fãs em três estados, uma turnê marcada e uma gravadora interessada.",
        visibleIfCharacterHas: [["dazzled"]],
        consequence: [
          {
            resultLabel: "Profecia",
            descriptionTemplate:
              "Uma rádio da capital se interessa e pede a demo. A turnê e a gravadora continuam imaginárias, agora com mais testemunhas.",
            happinessChangePercent: 8,
            chance: 40,
          },
          {
            resultLabel: "Desmentido",
            descriptionTemplate:
              "Um festival liga para a gravadora citada no texto, que não existe. O nome da banda entra na conversa dos organizadores pelo motivo errado.",
            happinessChangePercent: -6,
            chance: 60,
          },
        ],
      },
    ],
  },
  {
    id: "0271-a-musica-sobre-a-banda",
    type: "decisao_criativa",
    title: "A música sobre a banda",
    descriptionTemplate:
      "A banda rival do circuito estreou uma música sobre a banda, com uma rima para o nome de cada integrante. A rima de {character2} é a pior, e o público já sabe o refrão. {character1} quer responder com outra música; {character2} quer que o assunto morra antes do segundo refrão.",
    minFanCount: 151,
    maxFanCount: 2000,
    requiredCharacters: 2,
    options: [
      {
        label: "Compor uma música de resposta",
        description: "Uma rima para cada rival e nenhuma piedade.",
        consequence: [
          {
            resultLabel: "Resposta à altura",
            descriptionTemplate:
              "A resposta pega, e as duas bandas passam a lotar os bares de quem quer ver a próxima rodada.",
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
            resultLabel: "Rima fraca",
            descriptionTemplate:
              "A resposta sai pior que a provocação, e o público passa a cantar as duas, uma depois da outra, para comparar.",
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
        label: "Ignorar a música dos rivais",
        description: "Provocação morre de fome se ninguém alimentar.",
        consequence: {
          resultLabel: "Sem resposta",
          descriptionTemplate:
            "A banda não responde. A música dos rivais dura meses, e {character2} aprende a sorrir no refrão.",
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
        label: "Tocar a música dos rivais no próprio show",
        description:
          "Cantar a provocação mais alto que os autores, com o nome de cada integrante.",
        consequence: [
          {
            resultLabel: "Piada desarmada",
            descriptionTemplate:
              "O público ri junto com a banda, e a música perde a graça para os rivais em uma noite.",
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
            resultLabel: "Divulgação gratuita",
            descriptionTemplate:
              "O público canta tão alto que {character2} desiste do microfone. A banda acaba de divulgar a música dos rivais de graça.",
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
        label: "Cantar uma rima ainda pior para si mesmo",
        description:
          "[{character1}] Subir ao palco com uma versão em que a própria rima é trocada por outra, muito mais ridícula.",
        visibleIfCharacterHas: [["playful"]],
        consequence: [
          {
            resultLabel: "Piada roubada",
            descriptionTemplate:
              "O bar ri da rima nova de {character1}, que é muito pior. A música dos rivais perde a graça, e a rima de {character2} cai no esquecimento.",
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
            resultLabel: "Duas rimas",
            descriptionTemplate:
              "O público aprende a rima nova e passa a cantar as duas. {character1} ganha um apelido, e {character2} continua com a rima antiga.",
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
];
