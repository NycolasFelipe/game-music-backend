/**
 * Fame (fama) rules, ported verbatim from the `game-music` frontend
 * (`src/utils/fameCalculator.ts`, read-only reference). Fame is a level derived
 * purely from a band's fan count — it is not stored.
 */

/** The highest fame level; it has no upper fan cap. */
export const MAX_FAME_LEVEL = 30;

/**
 * Inclusive upper bound of fans for each fame level.
 *
 * - Index `0` → level 0 (`0..50`)
 * - Index `29` → level 29 (`900_000_001..1_200_000_000`)
 * - Level 30 is the last and uncapped (`fanCount > ` index 29's bound).
 */
export const FAME_LEVEL_MAX_FANS: readonly number[] = [
  50, 100, 150, 300, 600, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000,
  500000, 1000000, 2000000, 4000000, 10000000, 20000000, 35000000, 50000000,
  70000000, 100000000, 150000000, 250000000, 400000000, 500000000, 700000000,
  900000000, 1200000000,
];

/** Title + subtitle shown for a fame level. */
export interface FameLevelDescription {
  title: string;
  subtitle: string;
}

/** Human-readable title/subtitle per fame level (keyed by level as string). */
export const FAME_LEVEL_DESCRIPTIONS: Record<string, FameLevelDescription> = {
  "0": { title: "Anônimos", subtitle: "Tocam só pra amigos e familiares" },
  "1": {
    title: "Iniciantes",
    subtitle: "Primeiras apresentações em bares vazios",
  },
  "2": {
    title: "Emergentes",
    subtitle: "Começam a criar uma base local de fãs",
  },
  "3": { title: "Promessas", subtitle: "Destaque na cena musical do bairro" },
  "4": { title: "Revelações", subtitle: "Agenda cheia em bares da cidade" },
  "5": { title: "Conhecidos", subtitle: "Nome reconhecido na cena local" },
  "6": {
    title: "Destaques",
    subtitle: "Matérias em jornais e blogs regionais",
  },
  "7": { title: "Fenômenos Locais", subtitle: "Lotam casas de show da região" },
  "8": {
    title: "Estrelas em Ascensão",
    subtitle: "Primeiras aparições em rádios locais",
  },
  "9": { title: "Virais", subtitle: "Sucesso nas redes sociais" },
  "10": {
    title: "Profissionais",
    subtitle: "Vivem da música, turnês regionais",
  },
  "11": { title: "Nacionais", subtitle: "Reconhecimento em nível nacional" },
  "12": { title: "Sucesso", subtitle: "Músicas em rádios nacionais" },
  "13": { title: "Famosos", subtitle: "Aparições em programas de TV" },
  "14": {
    title: "Ícones Regionais",
    subtitle: "Representam sua região no país",
  },
  "15": {
    title: "Sensações",
    subtitle: "Trending topics e viralização global",
  },
  "16": { title: "Estrelas", subtitle: "Colaborações com grandes nomes" },
  "17": { title: "Superastros", subtitle: "Lotam arenas e estádios" },
  "18": {
    title: "Lendas Contemporâneas",
    subtitle: "Headliners de festivais internacionais",
  },
  "19": { title: "Ícones Culturais", subtitle: "Influenciam além da música" },
  "20": {
    title: "Lendas Nacionais",
    subtitle: "Parte da história musical do país",
  },
  "21": { title: "Imortais da Cena", subtitle: "Carreira ativa por décadas" },
  "22": { title: "Mitos do Rock", subtitle: "Referência para novas gerações" },
  "23": {
    title: "Deidades do Palco",
    subtitle: "Shows que entram para a história",
  },
  "24": { title: "Semideuses", subtitle: "Festivais com seu nome" },
  "25": { title: "Eternos", subtitle: "Discografia estudada em escolas" },
  "26": { title: "Imortais", subtitle: "Marcas que nunca serão superadas" },
  "27": {
    title: "Divindades Musicais",
    subtitle: "Exposições em museus mundialmente",
  },
  "28": { title: "Lendas da História", subtitle: "Nomes que definiram eras" },
  "29": { title: "Mitos da Cultura", subtitle: "Transcenderam a música" },
  "30": {
    title: "Deuses da Música",
    subtitle: "Status de lenda inquestionável",
  },
};
