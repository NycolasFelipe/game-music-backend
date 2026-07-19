import type {
  BandTheme,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";

/**
 * PT-BR display labels for band theme ids. Presentation-only; the domain keeps
 * only the stable ids ({@link BandTheme}).
 */
export const THEME_LABELS: Record<BandTheme, string> = {
  "indie-folk": "Indie Folk/Lo-Fi",
  grunge: "Grunge",
  "rock-indie": "Rock Indie/Psicodélico",
  "rock-sinfonico": "Rock Sinfônico/Ópera Rock",
  punk: "Punk Anarquista/Hardcore",
  metal: "Metal",
  blues: "Blues Clássico",
  jazz: "Jazz Tradicional/New Orleans",
  synthwave: "Synthwave/Retrowave",
  cyberpunk: "Cyberpunk",
  steampunk: "Steampunk",
  "rave-edm": "Rave/EDM",
  "pop-urbano": "Pop Urbano/Trap",
  "rap-hiphop": "Rap/Hip-Hop",
  "funk-carioca": "Funk Carioca",
  kpop: "K-Pop",
  "pop-mainstream": "Pop Mainstream",
  "samba-raiz": "Samba de Raiz",
  sertanejo: "Sertanejo",
  mpb: "MPB",
  reggae: "Reggae",
  "folk-rock": "Folk Rock",
  "egirl-eboy": "E-girl/E-boy",
  gotico: "Gótico",
  "emo-scene": "Emo/Scene",
  "skate-streetwear": "Skate/Streetwear",
};

/**
 * PT-BR display labels for origin-city ids (includes the state suffix).
 */
export const ORIGIN_LABELS: Record<OriginCity, string> = {
  "sao-paulo": "São Paulo, SP",
  "rio-janeiro": "Rio de Janeiro, RJ",
  "belo-horizonte": "Belo Horizonte, MG",
  curitiba: "Curitiba, PR",
  "porto-alegre": "Porto Alegre, RS",
  recife: "Recife, PE",
  salvador: "Salvador, BA",
  fortaleza: "Fortaleza, CE",
  manaus: "Manaus, AM",
  brasilia: "Brasília, DF",
  "new-york": "Nova Iorque, NY",
  "los-angeles": "Los Angeles, CA",
  chicago: "Chicago, IL",
  nashville: "Nashville, TN",
  seattle: "Seattle, WA",
  austin: "Austin, TX",
  detroit: "Detroit, MI",
  memphis: "Memphis, TN",
  "san-francisco": "São Francisco, CA",
  "new-orleans": "Nova Orleans, LA",
};
