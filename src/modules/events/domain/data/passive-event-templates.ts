import type { PassiveEventTemplate } from "@/modules/events/domain/types/passive-event-template";

/**
 * Static passive-event templates, ported from the `game-music` frontend. Stable
 * ids were added on the backend for anti-repeat tracking.
 */
export const PASSIVE_EVENT_TEMPLATES: PassiveEventTemplate[] = [
  {
    id: "pe-01",
    type: "colaboracao_musical",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} surpreende e lança single com {artista2} - {nome_single}. {avaliacao}",
  },
  {
    id: "pe-02",
    type: "evento_social",
    requiredArtists: 2,
    compatibilidade: ["solo_ativos"],
    template:
      "{artista1} foi visto em um restaurante com {artista2} - fãs especulam possível namoro.",
  },
  {
    id: "pe-03",
    type: "turne_conjunta",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} e {artista2} anunciam turnê conjunta - '{nome_turne}'.",
  },
  {
    id: "pe-04",
    type: "cancelamento_show",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} cancela show no último minuto devido a {motivo}. Fãs ficam desapontados.",
  },
  {
    id: "pe-05",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["ativo_recente"],
    template:
      "{artista} lança álbum surpresa - '{nome_album}' - e quebra recordes de streaming.",
  },
  {
    id: "pe-06",
    type: "polemica",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "Polêmica: {artista1} critica publicamente {artista2} durante entrevista.",
  },
  {
    id: "pe-07",
    type: "aposentadoria",
    requiredArtists: 1,
    compatibilidade: ["carreira_longa"],
    template:
      "{artista} anuncia aposentadoria dos palcos após {anos} anos de carreira.",
  },
  {
    id: "pe-08",
    type: "retorno_hiato",
    requiredArtists: 1,
    compatibilidade: ["bandas"],
    template: "{banda} anuncia retorno aos palcos após hiato.",
  },
  {
    id: "pe-09",
    type: "polemica",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} e {artista2} são flagrados discutindo nos bastidores de festival de música.",
  },
  {
    id: "pe-10",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} anuncia pausa na carreira para cuidar da saúde mental.",
  },
  {
    id: "pe-11",
    type: "colaboracao_musical",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} lança remix de {artista2} e música viraliza nas plataformas digitais.",
  },
  {
    id: "pe-12",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template: "{artista} bate recorde de público em show gratuito na praia.",
  },
  {
    id: "pe-13",
    type: "evento_social",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "Fãs organizam abaixo-assinado pedindo colaboração entre {artista1} e {artista2}.",
  },
  {
    id: "pe-14",
    type: "turne_conjunta",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} confirma participação em grande festival internacional.",
  },
  {
    id: "pe-15",
    type: "evento_social",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} declara em entrevista que {artista2} é sua maior inspiração musical.",
  },
  {
    id: "pe-16",
    type: "cancelamento_show",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template: "{artista} sofre acidente durante show mas se recupera bem.",
  },
  {
    id: "pe-17",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["carreira_longa"],
    template:
      "Documentário sobre a vida de {artista} estreia e recebe elogios da crítica.",
  },
  {
    id: "pe-18",
    type: "colaboracao_musical",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} e {artista2} são vistos gravando juntos em estúdio secreto.",
  },
  {
    id: "pe-19",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["solo_ativos"],
    template:
      "{artista} surpreende fãs com performance acústica em estação de metrô.",
  },
  {
    id: "pe-20",
    type: "polemica",
    requiredArtists: 1,
    compatibilidade: ["bandas"],
    template:
      "{banda} anuncia mudança de formação após saída de membro fundador.",
  },
  {
    id: "pe-21",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} lança linha de produtos e fãs esgotam estoque em horas.",
  },
  {
    id: "pe-22",
    type: "cancelamento_show",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "Show de {artista} é interrompido por falha técnica e apresentação é remarcada.",
  },
  {
    id: "pe-23",
    type: "turne_conjunta",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} convida {artista2} para participação especial em turnê.",
  },
  {
    id: "pe-24",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template: "{artista} anuncia álbum triplo com mais de 40 faixas inéditas.",
  },
  {
    id: "pe-25",
    type: "evento_social",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "Música antiga de {artista} volta às paradas após viralizar em rede social.",
  },
  {
    id: "pe-26",
    type: "polemica",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template: "{artista} é processado por quebra de contrato com gravadora.",
  },
  {
    id: "pe-27",
    type: "turne_conjunta",
    requiredArtists: 2,
    compatibilidade: ["ambos_ativos"],
    template:
      "{artista1} e {artista2} anunciam festival beneficente com toda renda revertida.",
  },
  {
    id: "pe-28",
    type: "polemica",
    requiredArtists: 1,
    compatibilidade: ["carreira_longa"],
    template:
      "{artista} revela bastidores polêmicos da indústria musical em autobiografia.",
  },
  {
    id: "pe-29",
    type: "lancamento_album",
    requiredArtists: 1,
    compatibilidade: ["ativo_recente"],
    template:
      "Clipe de {artista} bate 1 bilhão de visualizações em tempo recorde.",
  },
  {
    id: "pe-30",
    type: "turne_conjunta",
    requiredArtists: 1,
    compatibilidade: ["qualquer_um"],
    template:
      "{artista} anuncia primeira turnê mundial após anos focado apenas no mercado nacional.",
  },
];
