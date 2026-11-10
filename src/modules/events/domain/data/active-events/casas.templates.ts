import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Universal templates for the "Casas" fame phase (2,001 to 100,000 fans,
 * ADR-0025): no trait requirement nor relationship bound; traits only unlock
 * an extra option.
 */
export const CASAS_TEMPLATES: ActiveEventTemplate[] = [
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
];
