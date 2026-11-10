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
          "Exigir que {character1} procure {character2} no dia seguinte e desfaça o estrago, de preferência sóbrio(a).",
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
            "A conta some; o constrangimento, não. {character2} passa a noite calado(a).",
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
];
