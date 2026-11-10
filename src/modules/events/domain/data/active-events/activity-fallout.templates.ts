import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Get-togethers that went wrong (ADR-0017 §3). The random draw never picks
 * this type: they only arrive through activities, already cast with the most
 * hostile pair on the guest list as {character1}/{character2}.
 */
export const ACTIVITY_FALLOUT_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "9001-copo-a-mais",
    type: "confraternizacao",
    title: "O copo a mais",
    descriptionTemplate:
      "Já era tarde quando {character1} olhou para {character2} e disse, na frente de todo mundo, o que andava guardando havia meses. O garçom, discreto, trouxe mais uma rodada.",
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar um pedido de desculpas",
        description:
          "Exigir que {character1} procure {character2} no dia seguinte e desfaça o estrago, de preferência {character1:sóbrio|sóbria|sem ressaca}.",
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
              '{character1} se recusa: "eu só disse o que todo mundo pensa". Todo mundo jura que não pensa. {character2} não esquece.',
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
          "Encerrar a discussão pagando a diferença com o caixa da banda, que existe exatamente para isso, segundo ninguém.",
        consequence: {
          resultLabel: "Resolvido no dinheiro",
          descriptionTemplate:
            "A conta some; o constrangimento, não. {character2} passa a noite {character2:calado|calada|sem dizer uma palavra}.",
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
              "A discussão expõe mais do que devia, e a noite acaba com metade da banda indo embora sem pagar a conta.",
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
  {
    id: "9004-o-brinde",
    type: "confraternizacao",
    title: "O brinde",
    descriptionTemplate:
      "{character1} bate no copo, anuncia um brinde em homenagem a {character2} e passa cinco minutos imitando {character2} no palco. A mesa aplaude de pé, coisa que nenhum show da banda conseguiu.",
    requiredCharacters: 2,
    options: [
      {
        label: "Mandar {character1} pedir desculpas",
        description:
          "Encerrar o número antes que ele entre no repertório fixo.",
        consequence: [
          {
            resultLabel: "Desculpas aceitas",
            descriptionTemplate:
              "{character1} pede desculpas com a sinceridade de quem leu num papel. {character2} aceita com a mesma sinceridade, e os dois saem empatados.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            chance: 60,
          },
          {
            resultLabel: "Bis",
            descriptionTemplate:
              "{character1} pede desculpas imitando a voz de {character2}. A segunda imitação sai melhor que a primeira.",
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
        label: "Rir junto e pedir a próxima rodada",
        description:
          "Tratar como brincadeira entre amigos, que é como toda briga de banda começa.",
        consequence: {
          resultLabel: "Piada interna",
          descriptionTemplate:
            "A imitação vira atração fixa das saídas da banda. {character2} vira a atração, sem cachê.",
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
        label: "Deixar {character2} devolver a imitação",
        description:
          "{character2} anda com um repertório de defeitos alheios pronto para a ocasião.",
        visibleIfCharacterHas: [[], ["playful"]],
        consequence: {
          resultLabel: "Duelo de imitações",
          descriptionTemplate:
            "Os dois passam a noite se imitando. A banda descobre que tem mais talento para humor do que para música.",
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
    id: "9005-a-carona",
    type: "confraternizacao",
    title: "A carona",
    descriptionTemplate:
      "Na hora de ir embora, {character1} sai com o único carro e deixa {character2} na calçada, com o estojo do instrumento e sem dinheiro para o táxi. O instrumento, pelo menos, faz companhia.",
    requiredCharacters: 2,
    options: [
      {
        label: "Cobrar {character1} na frente da banda",
        description:
          "Deixar claro, no ensaio seguinte, que abandonar colega na calçada não é logística de turnê.",
        consequence: [
          {
            resultLabel: "Mea-culpa",
            descriptionTemplate:
              "{character1} jura que achou que {character2} já tinha ido. Ninguém acredita, mas o pedido de desculpas vem com café, e café não se recusa.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            chance: 55,
          },
          {
            resultLabel: "Contra-ataque",
            descriptionTemplate:
              "{character1} lista três vezes em que {character2} fez o mesmo, com datas. O ensaio vira um tribunal em que todo mundo é réu.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -8,
            chance: 45,
          },
        ],
      },
      {
        label: "Deixar passar",
        description: "Cada um chega em casa como pode. Adulto é para isso.",
        consequence: {
          resultLabel: "Caminhada longa",
          descriptionTemplate:
            "{character2} chega em casa de madrugada, a pé, depois de cinco quilômetros ensaiando o que vai dizer. Nunca ensaiou tanto um texto.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
        },
      },
      {
        label: "Lembrar {character1} da fama de leal",
        description:
          "Para quem vive dizendo que nunca deixa ninguém para trás, a noite foi uma contradição sobre rodas.",
        visibleIfCharacterHas: [["loyal"], []],
        consequence: {
          resultLabel: "Penitência",
          descriptionTemplate:
            "{character1} passa um mês dando carona para {character2} até o ensaio, sem ninguém pedir. O carro nunca andou tão cheio de culpa.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
        },
      },
    ],
  },
  {
    id: "9006-o-convite",
    type: "confraternizacao",
    title: "O convite",
    descriptionTemplate:
      "No meio da saída, {character1} conta para todo mundo que {character2} recebeu um convite para tocar em outra banda. {character2} pretendia recusar em silêncio, e agora vai ter que recusar com plateia.",
    requiredCharacters: 2,
    options: [
      {
        label: "Perguntar direto a {character2}",
        description:
          "Pôr o assunto na mesa antes que ele chegue à cidade, que costuma saber antes da banda.",
        consequence: [
          {
            resultLabel: "Fica",
            descriptionTemplate:
              "{character2} jura que nunca pensou em sair, e a banda volta a respirar. {character1} pede outra rodada, para ter atrás do que esconder a cara.",
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
            resultLabel: "Dúvida plantada",
            descriptionTemplate:
              "{character2} diz que ainda está pensando. Até a pergunta, não estava.",
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
      {
        label: "Fingir que não ouviu",
        description:
          "Seguir a noite como se convite de outra banda fosse problema da outra banda.",
        consequence: {
          resultLabel: "Boato",
          descriptionTemplate:
            "O assunto não morre, só muda de mesa. Na semana seguinte, o dono do bar sabe mais da banda do que a própria banda.",
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
    ],
  },
  {
    id: "9007-o-palco-aberto",
    type: "confraternizacao",
    title: "O palco aberto",
    descriptionTemplate:
      "Na noite de palco aberto do bar, {character1} sobe para tocar uma música e escolhe logo a parte de {character2} no maior sucesso da banda. Toca melhor, e o bar inteiro percebe, inclusive {character2}.",
    requiredCharacters: 2,
    options: [
      {
        label: "Dar a revanche a {character2}",
        description:
          "Devolver o palco a {character2}, com a chance de recuperar a honra ou o que sobrou dela.",
        consequence: [
          {
            resultLabel: "Revanche",
            descriptionTemplate:
              "{character2} sobe, toca a parte de {character1} e ganha por aclamação. Os dois saem quites, suados e sem ter ensaiado nada.",
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
            resultLabel: "Segunda derrota",
            descriptionTemplate:
              "{character2} perde de novo, agora para um aposentado que toca naquele bar desde antes de a banda existir.",
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
        label: "Tirar a banda do palco",
        description:
          "Encerrar a noite antes que a escalação da banda vá a voto.",
        consequence: {
          resultLabel: "Dúvida em casa",
          descriptionTemplate:
            "A noite acaba, mas a dúvida vai para casa com a banda. {character2} passa a semana ensaiando aquela parte de porta fechada.",
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
        label: "Deixar {character2} aplaudir de pé",
        description:
          "{character2} tem autoestima de sobra para perder uma noite de palco aberto.",
        visibleIfCharacterHas: [[], ["confident"]],
        consequence: {
          resultLabel: "Elegância",
          descriptionTemplate:
            "{character2} aplaude de pé e pede bis. {character1} passa a noite tentando descobrir se foi elogio.",
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
    id: "9008-a-foto-no-jornal",
    type: "confraternizacao",
    title: "A foto no jornal",
    descriptionTemplate:
      "Um fotógrafo flagra {character1} e {character2} discutindo aos gritos na porta do lugar. A foto sai no jornal do dia seguinte, maior que qualquer crítica que a banda já recebeu.",
    requiredCharacters: 2,
    options: [
      {
        label: "Desmentir em entrevista",
        description:
          "Dizer ao jornal que era uma cena do próximo clipe. Ninguém precisa saber que não existe clipe, nem dinheiro para um.",
        consequence: [
          {
            resultLabel: "Colou",
            descriptionTemplate:
              "O jornal publica a explicação, e o público fica ansioso pelo clipe que não existe. Mentir juntos aproxima os dois mais do que qualquer ensaio.",
            fanCountChange: 3,
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            chance: 50,
          },
          {
            resultLabel: "Não colou",
            descriptionTemplate:
              "O jornal publica a explicação ao lado da foto, e a foto ganha por unanimidade.",
            fanCountChange: -2,
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
        label: "Vender a fama de banda briguenta",
        description: "Se o público gosta de confusão, a banda tem estoque.",
        consequence: {
          resultLabel: "Marketing",
          descriptionTemplate:
            "A foto vira o cartaz do próximo show. {character1} e {character2} odeiam o cartaz em perfeita harmonia, a primeira em meses.",
          fanCountChange: 4,
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: -2,
            },
          ],
        },
      },
      {
        label: "Não comentar",
        description:
          "Esperar que a próxima notícia da cidade enterre esta. Nesta cidade, nunca demora.",
        consequence: {
          resultLabel: "Esquecido",
          descriptionTemplate:
            "Na semana seguinte, um vereador cai na fonte da praça, e a banda perde a capa. Fica o rancor, que não sai no jornal.",
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
  {
    id: "9009-o-violao-na-roda",
    type: "confraternizacao",
    title: "O violão na roda",
    descriptionTemplate:
      "Alguém aparece com um violão, e {character1} toca para todo mundo a música de {character2} que a banda recusou no mês passado. Em versão de deboche, que a roda aplaude mais do que a original.",
    requiredCharacters: 2,
    options: [
      {
        label: "Levar a música para o próximo ensaio",
        description:
          "Se a roda gostou, talvez a banda tenha errado ao recusar. Não seria a primeira vez na semana.",
        consequence: [
          {
            resultLabel: "Redenção",
            descriptionTemplate:
              "Levada a sério, a música funciona. {character2} ganha a razão, e {character1} ganha uma parceria que não pediu e não pode recusar.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 2,
              },
            ],
            happinessChangePercent: 4,
            chance: 55,
          },
          {
            resultLabel: "Era ruim mesmo",
            descriptionTemplate:
              "No ensaio, a música continua ruim, agora sem a graça do deboche. {character2} sente falta da versão que zombava dela.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -2,
              },
            ],
            happinessChangePercent: -4,
            chance: 45,
          },
        ],
      },
      {
        label: "Tirar o violão de {character1}",
        description: "Encerrar o show particular antes que alguém peça bis.",
        consequence: {
          resultLabel: "Fim da roda",
          descriptionTemplate:
            "A roda acaba, e a noite também. {character1} chama de censura; {character2} chama de pouco.",
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
        label: "Deixar {character2} responder com uma música nova",
        description:
          "{character2} anda com um caderno cheio de respostas que nunca teve coragem de cantar.",
        visibleIfCharacterHas: [[], ["creative"]],
        consequence: {
          resultLabel: "Resposta à altura",
          descriptionTemplate:
            "{character2} improvisa uma canção sobre o deboche de {character1}. A roda pede bis, e {character1} acaba cantando o refrão, que é sobre {character1}.",
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
    id: "9010-a-promessa",
    type: "confraternizacao",
    title: "A promessa",
    descriptionTemplate:
      "No auge da noite, {character1} sobe numa cadeira e promete a {character2} um solo inteiro no próximo disco. No dia seguinte, {character1} não lembra da cadeira nem da promessa, só da dor nas costas.",
    requiredCharacters: 2,
    options: [
      {
        label: "Cumprir a promessa",
        description:
          "Promessa de banda é contrato, mesmo assinada de cima de uma cadeira.",
        consequence: {
          resultLabel: "Palavra cumprida",
          descriptionTemplate:
            "{character2} ganha o solo e toca como quem cobra uma dívida com juros. {character1} aprende a descer das cadeiras.",
          relationshipChanges: [
            {
              character1Id: "{character1_id}",
              character2Id: "{character2_id}",
              change: 2,
            },
          ],
          happinessChangePercent: -4,
        },
      },
      {
        label: "Explicar que foi só empolgação",
        description:
          "Lembrar a {character2} que nada dito em cima de uma cadeira depois da meia-noite tem valor jurídico.",
        consequence: [
          {
            resultLabel: "Entendido",
            descriptionTemplate:
              "{character2} ri da história e guarda o episódio para a próxima briga, onde ele vai render mais.",
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
            resultLabel: "Cobrança eterna",
            descriptionTemplate:
              "{character2} passa a citar a promessa em toda reunião, com data, hora e altura da cadeira.",
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
    id: "9011-a-aposta",
    type: "confraternizacao",
    title: "A aposta",
    descriptionTemplate:
      "{character1} aposta, na frente de todo mundo, que {character2} não aguenta um mês sem se atrasar para o ensaio. {character2} aceita, e a banda inteira entra no bolão, quase toda do lado de {character1}.",
    requiredCharacters: 2,
    options: [
      {
        label: "Deixar a aposta valer",
        description:
          "Se a pontualidade não vem por amor à banda, que venha por dinheiro.",
        consequence: [
          {
            resultLabel: "Pontualidade",
            descriptionTemplate:
              "{character2} chega cedo o mês inteiro, só para ver a cara de {character1} pagando. A banda nunca ensaiou tanto, por motivos que ninguém vai pôr no encarte.",
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
            resultLabel: "Derrota no dia 29",
            descriptionTemplate:
              "{character2} perde a aposta no penúltimo dia, por cinco minutos. {character1} cobra com cronômetro na mão e testemunhas.",
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
        label: "Proibir a aposta",
        description:
          "A banda já tem problemas suficientes sem abrir uma casa de apostas.",
        consequence: {
          resultLabel: "Estraga-prazeres",
          descriptionTemplate:
            "A aposta morre, e a banda descobre que a única coisa que unia {character1} e {character2} era a vontade de ganhar um do outro.",
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
    ],
  },
  {
    id: "9012-o-fa",
    type: "confraternizacao",
    title: "O fã",
    descriptionTemplate:
      "Um fã reconhece {character1}, pede um autógrafo e entrega a câmera para {character2} tirar a foto. {character2} tira a foto, com a cabeça de {character1} cuidadosamente fora do quadro.",
    requiredCharacters: 2,
    options: [
      {
        label: "Fazer {character1} apresentar {character2} ao fã",
        description:
          "Lembrar que a banda tem mais de um rosto, mesmo que o público só tenha decorado um.",
        consequence: [
          {
            resultLabel: "Dois autógrafos",
            descriptionTemplate:
              "{character1} apresenta {character2} como a alma da banda, e o fã pede outro autógrafo por educação. Guarda no bolso de trás.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: 1,
              },
            ],
            happinessChangePercent: 4,
            chance: 55,
          },
          {
            resultLabel: "Da equipe técnica",
            descriptionTemplate:
              "O fã pergunta, com toda a sinceridade, se {character2} é da equipe técnica, e pede ajuda para achar o banheiro.",
            relationshipChanges: [
              {
                character1Id: "{character1_id}",
                character2Id: "{character2_id}",
                change: -1,
              },
            ],
            happinessChangePercent: -8,
            chance: 45,
          },
        ],
      },
      {
        label: "Rir do episódio",
        description:
          "Toda banda tem um rosto que o público reconhece e outros que carregam as caixas.",
        consequence: {
          resultLabel: "Foto oficial",
          descriptionTemplate:
            "A foto sem cabeça vira a preferida da banda. {character2} pendura uma cópia na sala de ensaio, bem na altura dos olhos de {character1}.",
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
        label: "Pagar uma sessão de fotos para {character2}",
        description:
          "Um fotógrafo de verdade, só para {character2}, pelo tempo que o ego precisar.",
        visibleIfCharacterHas: [[], ["validation_seeker"]],
        consequence: {
          resultLabel: "Ego restaurado",
          descriptionTemplate:
            "{character2} posa por duas horas e sai com quarenta fotos e o humor de volta. {character1} não aparece em nenhuma, nem por acidente.",
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
];
