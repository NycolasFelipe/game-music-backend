import type { PassiveEventTemplate } from "@/modules/events/domain/types/passive-event-template";

/**
 * Static passive-event templates, ported from the `game-music` frontend. Stable
 * ids were added on the backend for anti-repeat tracking; `desde` keeps modern
 * texts (streaming, viral videos…) out of the years before them.
 */
export const PASSIVE_EVENT_TEMPLATES: PassiveEventTemplate[] = [
  {
    id: "pe-01",
    type: "colaboracao_musical",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      '{artista1} lança single com {artista2}, "{nome_single}". As gravadoras dos dois juram que a parceria foi ideia artística. {avaliacao}',
  },
  {
    id: "pe-02",
    type: "evento_social",
    requiredArtists: 2,
    compatibilidade: ["solo_ativos"],
    template:
      "{artista1} aparece jantando com {artista2}, e as revistas de fofoca já marcaram o casamento. Os dois só dividiram a conta.",
  },
  {
    id: "pe-03",
    type: "turne_conjunta",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      '{artista1} e {artista2} anunciam a turnê conjunta "{nome_turne}". Os empresários dos dois já brigam pela ordem dos nomes no cartaz.',
  },
  {
    id: "pe-04",
    type: "cancelamento_show",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      '{artista} cancela show no último minuto devido a {motivo}. A produção promete devolver o dinheiro "em breve", e os fãs já sabem quanto dura um "em breve".',
  },
  {
    id: "pe-05",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["ativo_recente"],
    template:
      '{artista} lança de surpresa o álbum "{nome_album}" e quebra recordes de streaming. A surpresa foi planejada por oito meses.',
    desde: 2010,
  },
  {
    id: "pe-06",
    type: "polemica",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "Polêmica: {artista1} critica {artista2} numa entrevista, coincidentemente na semana de lançamento do próprio disco.",
  },
  {
    id: "pe-07",
    type: "aposentadoria",
    requiredArtists: 1,
    compatibilidade: ["carreira_longa"],
    template:
      "{artista} anuncia aposentadoria dos palcos após {anos} anos de carreira. A turnê de despedida tem, por enquanto, três anos de datas.",
  },
  {
    id: "pe-08",
    type: "retorno_hiato",
    requiredArtists: 1,
    compatibilidade: ["bandas"],
    template:
      "{banda} anuncia a volta aos palcos depois do hiato. Os integrantes garantem que não é pelo dinheiro, e os ingressos custam o dobro.",
  },
  {
    id: "pe-09",
    type: "polemica",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      '{artista1} e {artista2} são flagrados discutindo nos bastidores de um festival. As assessorias falam em "troca de ideias".',
  },
  {
    id: "pe-10",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} anuncia pausa na carreira para cuidar da saúde mental.",
    desde: 2010,
  },
  {
    id: "pe-11",
    type: "colaboracao_musical",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} lança um remix de {artista2}, e a música viraliza nas plataformas digitais. A versão original ganha uma segunda vida e um primeiro cheque.",
    desde: 2008,
  },
  {
    id: "pe-12",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} bate recorde de público em show gratuito na praia, segundo os organizadores. A polícia conta outro número, bem menor.",
  },
  {
    id: "pe-13",
    type: "evento_social",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "Fãs organizam um abaixo-assinado pedindo uma parceria entre {artista1} e {artista2}. As gravadoras respondem que vão estudar o assunto, o que no meio quer dizer não.",
  },
  {
    id: "pe-14",
    type: "turne_conjunta",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} confirma presença num grande festival internacional, no horário das quatro da tarde, debaixo de sol.",
    desde: 1967,
  },
  {
    id: "pe-15",
    type: "evento_social",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} declara em entrevista que {artista2} é sua maior inspiração musical. A imprensa transforma a frase em manchete por um mês inteiro.",
  },
  {
    id: "pe-16",
    type: "cancelamento_show",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} sofre um acidente durante o show, mas se recupera bem. O seguro do palco, nem tanto.",
  },
  {
    id: "pe-17",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["carreira_longa"],
    template:
      "Documentário sobre a vida de {artista} estreia e recebe elogios da crítica. São duas horas e meia, e a crítica reclama que foi pouco.",
    desde: 1965,
  },
  {
    id: "pe-18",
    type: "colaboracao_musical",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} e {artista2} são vistos gravando juntos num estúdio secreto, cujo endereço já saiu em três jornais.",
  },
  {
    id: "pe-19",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["solo_ativos"],
    template:
      "{artista} faz show acústico surpresa numa estação de metrô. Os passageiros, que só queriam chegar ao trabalho, ganham uma história e um atraso.",
  },
  {
    id: "pe-20",
    type: "polemica",
    requiredArtists: 1,
    compatibilidade: ["bandas"],
    template:
      '{banda} anuncia mudança de formação após a saída de um membro fundador. O comunicado fala em "diferenças criativas" e não menciona dinheiro.',
  },
  {
    id: "pe-21",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} lança uma linha de produtos, e os fãs esgotam o estoque em horas. Ninguém sabe ao certo para que serve metade dos itens.",
    desde: 1964,
  },
  {
    id: "pe-22",
    type: "cancelamento_show",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "Show de {artista} é interrompido por falha técnica e remarcado. O técnico responsável tira férias por tempo indeterminado.",
  },
  {
    id: "pe-23",
    type: "turne_conjunta",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} convida {artista2} para uma participação especial na turnê. A participação dura uma música e ocupa metade do cartaz.",
  },
  {
    id: "pe-24",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} anuncia álbum triplo com mais de 40 faixas inéditas, prova de que ninguém na gravadora teve coragem de dizer não.",
    desde: 1970,
  },
  {
    id: "pe-25",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "Música antiga de {artista} volta às paradas depois de viralizar numa rede social. Uma geração inteira descobre a música achando que é nova.",
    desde: 2010,
  },
  {
    id: "pe-26",
    type: "polemica",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "A gravadora processa {artista} por quebra de contrato e diz que é questão de princípio; o valor da causa diz outra coisa.",
  },
  {
    id: "pe-27",
    type: "turne_conjunta",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} e {artista2} anunciam um festival beneficente com toda a renda revertida. Os organizadores garantem que o camarote foi pago do próprio bolso.",
    desde: 1971,
  },
  {
    id: "pe-28",
    type: "polemica",
    requiredArtists: 1,
    compatibilidade: ["carreira_longa"],
    template:
      "{artista} revela bastidores polêmicos da indústria musical numa autobiografia. Três executivos cancelam as férias para ler o livro com seus advogados.",
  },
  {
    id: "pe-29",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["ativo_recente"],
    template:
      "Clipe de {artista} bate 1 bilhão de visualizações em tempo recorde. O diretor do clipe ainda espera o pagamento.",
    desde: 2012,
  },
  {
    id: "pe-30",
    type: "turne_conjunta",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} anuncia a primeira turnê mundial depois de anos de foco no mercado nacional. O mundo, por enquanto, são quatro países e um navio de cruzeiro.",
  },
];
