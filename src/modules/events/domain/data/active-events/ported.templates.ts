import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Active-event templates ported from the `game-music` frontend. Most of them
 * require a trait or a relationship band, so they do not count towards the
 * ADR-0025 coverage floor.
 */
export const PORTED_TEMPLATES: ActiveEventTemplate[] = [
  {
    id: "0001-melodia-familiar",
    type: "conflito_membros",
    title: "Melodia Familiar",
    descriptionTemplate:
      "{character1} percebe que a nova composição de {character2} é idêntica a um rascunho que {character1} jogou no lixo meses atrás. Ao que parece, alguém anda revirando o lixo da banda.",
    minFanCount: 101,
    maxRelationshipLevel: 3,
    requiredCharacterCharacteristicsAll: [["plagiarist"], []],
    requiredCharacters: 2,
    options: [
      {
        label: "Exigir créditos",
        description:
          "[{character1}] Confrontar {character2} e exigir que a música seja registrada em coautoria. Lixo também tem direito autoral.",
        consequence: [
          {
            resultLabel: "Neutro",
            descriptionTemplate:
              "{character2} aceita a coautoria, {character2:ressentido por ter sido pego|ressentida por ter sido pega|com rancor do flagrante}, não por ter copiado.",
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
              "{character2} nega tudo e jura que teve a mesma ideia {character2:sozinho|sozinha|sem ajuda}, nota por nota. Coincidências acontecem, diz.",
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
          "[{character1}] Mexer discretamente nos arranjos finais para que a parte copiada soe mal. Sabotar a própria banda para provar um ponto: um clássico.",
        consequence: [
          {
            resultLabel: "Sucesso",
            descriptionTemplate:
              "A música fracassa, como planejado, e {character2} perde a coragem de propor ideias novas. Ou de revirar o lixo.",
            fanCountChangeAbsolute: -5,
            chance: 60,
          },
          {
            resultLabel: "{character1:Exposto|Exposta|Exposição}",
            descriptionTemplate:
              "A banda percebe a sabotagem, e {character1} consegue a proeza de {character1:sair como culpado|sair como culpada|levar a culpa} de um plágio que sofreu.",
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
              "{character2} fica sem saída e aceita a parceria. A música sai excelente, e ninguém fala sobre como ela começou.",
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
              "{character2} {character2:se sente vigiado|se sente vigiada|sente que a banda está de olho} e rasga a partitura {character2:por medo de ser descoberto|por medo de ser descoberta|antes que alguém compare}. Ninguém vai saber como era o refrão, nem de quem.",
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
      'Numa cerimônia de premiação da música, {character1} ganha o troféu de "Melhor Composição". No meio do discurso, um astro famoso invade o palco, arranca o microfone e anuncia que outra pessoa merecia o prêmio. Ninguém convidou o astro a subir, nem à cerimônia.',
    minFanCount: 2000001,
    maxRelationshipLevel: 1,
    requiredCharacters: 1,
    options: [
      {
        label: "Manter a compostura",
        description:
          "[{character1}] Ficar em silêncio, demonstrar choque contido e esperar a segurança agir. A segurança, como sempre, está no bufê.",
        consequence: {
          resultLabel: "Compostura",
          descriptionTemplate:
            "O público e a imprensa abraçam {character1} pela elegância sob pressão. O astro ganha uma semana de manchetes, que era o plano dele.",
          fanCountChange: 5,
        },
      },
      {
        label: "Transformar em performance",
        description:
          "[{character1}] Cantar por cima da fala do astro e transformar a interrupção em show. Sem microfone, no gogó.",
        consequence: [
          {
            resultLabel: "Lendário",
            descriptionTemplate:
              "O país inteiro comenta o improviso por semanas, e o astro descobre que não é o único que sabe roubar a cena.",
            fanCountChange: 10,
            chance: 70,
          },
          {
            resultLabel: "Constrangedor",
            descriptionTemplate:
              "O público não entende a piada, e a cerimônia ganha cinco minutos de constrangimento ao vivo. A transmissão corta para os comerciais.",
            fanCountChange: -5,
            chance: 30,
          },
        ],
      },
      {
        label: "Abandonar o palco",
        description:
          "[{character1}] Largar o troféu no palco e sair de cena, recusando-se a participar do circo. O circo continua sem {character1}.",
        consequence: {
          resultLabel: "Recuo",
          descriptionTemplate:
            'A imprensa conclui que {character1} não tem "casca grossa" para a fama. O troféu fica com o astro, que agradece.',
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
      "Um grupo de fãs descobriu o hotel da banda e cercou a saída. Batem nos vidros do carro com o carinho de quem quer uma lembrança, de preferência um pedaço da banda.",
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
            "A banda se protege, e os jornais do dia seguinte trazem fotos de policiais arrastando adolescentes. Ótimo para a imagem.",
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
            'A banda chega ao compromisso no horário, e os jornais estampam "Banda ignora fãs". Pontualidade nunca deu capa.',
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
              "{character1} {character1:passa a ser visto|passa a ser vista|ganha fama} como a pessoa mais humilde do mundo, título que ninguém na banda contesta em público.",
            fanCountChange: 6,
            chance: 65,
          },
          {
            resultLabel: "Pânico",
            descriptionTemplate:
              "A multidão se descontrola, e {character1} sai {character1:levemente ferido|levemente ferida|com arranhões} e sem um dos sapatos. Os fãs ficam decepcionados, menos o que levou o sapato.",
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
              "O momento é tão visceral que {character2} se sente transcendente. Os fãs também, ou pelo menos param de bater no vidro.",
            fanCountChange: 10,
            chance: 50,
          },
          {
            resultLabel: "Mal-entendido",
            descriptionTemplate:
              'A plateia acha que {character2} surtou, e a música inédita sai no jornal como "o grito do teto solar".',
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
      "No meio de um show num barzinho de esquina, o amplificador principal da banda começa a soltar fumaça. Pela cara do dono do bar, isso não está incluído no cachê.",
    maxFanCount: 150,
    maxRelationshipLevel: 0,
    requiredCharacterCharacteristics: [[], ["creative", "experimental"]],
    requiredCharacters: 2,
    options: [
      {
        label: "Conserto gambiarra",
        description:
          "[{character1}] Tentar um reparo rápido com fita isolante e fios soltos para terminar o show. Toda a engenharia da banda cabe num rolo de fita.",
        consequence: [
          {
            resultLabel: "Sucesso",
            descriptionTemplate:
              'A música volta com um som "sujo" que o público adora e que nenhum técnico consegue reproduzir de propósito.',
            fanCountChangeAbsolute: 15,
            chance: 50,
          },
          {
            resultLabel: "Desastre",
            descriptionTemplate:
              "O amplificador desiste de vez, e o silêncio que fica é o som mais alto da noite.",
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
              'O público acha o momento íntimo e "conceitual". A banda aceita o elogio sem explicar que foi o amplificador.',
            fanCountChangeAbsolute: 20,
            chance: 70,
          },
          {
            resultLabel: "Fracasso",
            descriptionTemplate:
              "O bar é barulhento demais, e ninguém ouve nada. O show acústico morre sem testemunhas.",
            fanCountChangeAbsolute: -8,
            chance: 30,
          },
        ],
      },
      {
        label: "Pausa para manutenção",
        description:
          "[{character1}] Parar o show, explicar a situação ao público com honestidade e prometer compensar o tempo perdido. Honestidade em bar: estratégia arriscada.",
        consequence: [
          {
            resultLabel: "Respeito",
            descriptionTemplate:
              "O público aproveita a pausa para ir ao balcão. O dono do bar vende como nunca e passa a torcer por mais incêndios.",
            fanCountChangeAbsolute: 6,
            chance: 60,
          },
          {
            resultLabel: "Clima morre",
            descriptionTemplate:
              "A demora esfria a festa, e algumas pessoas vão embora antes da volta. O amplificador, pelo menos, sobrevive.",
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
      'A banda foi contratada para tocar no aniversário do tio de {character1}. O "palco" fica ao lado da churrasqueira, o som dá choque e as crianças correm entre os pedestais. O cachê é pago em linguiça.',
    maxFanCount: 50,
    maxRelationshipLevel: 5,
    requiredCharacterCharacteristics: [[], ["hothead"]],
    requiredCharacters: 2,
    options: [
      {
        label: "Manter o profissionalismo",
        description:
          "Ignorar a fumaça de gordura e o som ruim e tocar o repertório como se fosse o maior festival do país.",
        consequence: [
          {
            resultLabel: "Profissional",
            descriptionTemplate:
              "O tio de {character1} fica impressionado com a postura e indica a banda para um bar local. O bar também tem churrasqueira.",
            fanCountChangeAbsolute: 10,
            chance: 70,
          },
          {
            resultLabel: "Frustração",
            descriptionTemplate:
              "Ninguém presta atenção, e a banda termina o show frustrada e defumada.",
            fanCountChangeAbsolute: 0,
            chance: 30,
          },
        ],
      },
      {
        label: "Impor Respeito",
        description:
          "[{character2}] Parar a música, aumentar o volume no máximo e exigir que todo mundo pare de comer para ouvir. A banda não é som de fundo, nem num churrasco.",
        visibleIfAnyInvolvedHas: ["hothead"],
        consequence: [
          {
            resultLabel: "Briga",
            descriptionTemplate:
              "A festa acaba em briga, e o tio se recusa a pagar o cachê. A banda perde a linguiça e a dignidade, nessa ordem.",
            fanCountChangeAbsolute: -12,
            chance: 50,
          },
          {
            resultLabel: "Rebeldes",
            descriptionTemplate:
              "O silêncio constrangedor faz as pessoas finalmente ouvirem, e a banda ganha fama de rebelde no bairro. O tio nunca mais faz aniversário.",
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
              "A festa vira um sucesso, e a banda ganha gorjetas extras. Os integrantes se sentem vendidos, mas pelo menos bem pagos.",
            fanCountChangeAbsolute: 13,
            chance: 80,
          },
          {
            resultLabel: "Humilhação",
            descriptionTemplate:
              "A banda toca os covers tão mal que os convidados pedem para voltar às músicas autorais. Humilhação total.",
            fanCountChangeAbsolute: -5,
            chance: 20,
          },
        ],
      },
    ],
  },
];
