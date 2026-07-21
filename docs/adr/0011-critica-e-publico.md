# 0011 — Obras: análise da crítica e análise do público

- **Status:** Aceita
- **Data:** 2026-07-20
- **Decisores:** Equipe de backend
- **Relacionada:** [0007 — Fama](0007-fama.md),
  [0008 — Obras musicais](0008-obras-musicais.md)
- **Origem:** promove o item 2 do [backlog](../future-work.md).
- **Relação futura:** o item 9 (sucesso × fracasso comercial) é irmão deste —
  crítica/público é **recepção**; sucesso/fracasso é **resultado comercial**.
  Ficam para ADRs distintos, mas compartilham o espírito multidimensional.

## Contexto

Hoje uma obra tem uma **nota única** (`quality`, ADR-0008): a qualidade técnica
derivada dos membros creditados. Mas sucesso é multidimensional: uma obra pode
ser **aclamada pela crítica** e ignorada pelo público — ou o oposto (um "guilty
pleasure"). Espelhando a divisão crítica × audiência (à la Metacritic), este ADR
adiciona **dois escores de recepção** — **Crítica** e **Público** — computados na
finalização, ao lado de `quality`.

## Decisão

### 1. Dois escores derivados na finalização (informativos)
No `FinalizeReleaseUseCase` (ADR-0008), além de `quality`, computam-se `critic`
e `public` (0–100). São **feedback informativo**: **não** alteram fãs, receita
nem fama — a economia continua vindo do `qualityTier` (ADR-0008 §8). O
acoplamento (público → fãs, crítica → prestígio) fica para o item 9 / futuro.
Reaproveita-se a `quality` já calculada e os sinais de formato, estilo,
orçamento e fama; nenhum novo custo de cálculo relevante.

### 2. Crítica = qualidade + ambição + inovação
A crítica valoriza o feito técnico e o risco artístico, e é **pouco sensível ao
alcance**:
```
critic = quality × CRITIC_QUALITY_WEIGHT (0.60)
       + ambition × 100 × CRITIC_AMBITION_WEIGHT (0.25)
       + experimental × 100 × CRITIC_INNOVATION_WEIGHT (0.15)
```
- **`ambition`** vem do **formato** (um álbum é uma declaração; um single é
  modesto) e do **tier de orçamento** (grande produção = mais ambição).
- **`experimental`** vem do **gênero** (metal/jazz/blues arriscam mais; pop é
  seguro). Os pesos somam 1, então `critic` é uma média ponderada de três sinais
  0–100.

### 3. Público = acessibilidade + alcance/fama + qualidade (peso menor)
O público valoriza o que é **acessível/grudento** e **o quanto a banda alcança**,
e nota a qualidade **menos** que a crítica:
```
public = quality × PUBLIC_QUALITY_WEIGHT (0.35)
       + accessibility × 100 × PUBLIC_ACCESS_WEIGHT (0.45)
       + fameAppeal × 100 × PUBLIC_FAME_WEIGHT (0.20)
```
- **`accessibility`** vem do **formato** (single grudento > álbum longo) e do
  **gênero** (pop/funk/rap alcançam mais; metal/jazz são de nicho).
- **`fameAppeal`** = `log10(1 + fãs) / FAME_APPEAL_SCALE` (assintótico): bandas
  maiores têm público mais receptivo.

Por construção os dois **divergem**: uma obra-prima experimental de nicho pontua
alto na crítica e morno no público; um single pop grudento de uma banda famosa,
o oposto.

### 4. Perfis de recepção como dado de domínio
`domain/data/release-reception-profiles.ts` define, por **formato**
(`accessibility`, `ambition`) e por **gênero/arquétipo** (`accessibility`,
`experimental`), no mesmo padrão dos perfis de gênero (ADR-0008 §5) — arquétipos
constantes mapeados por `BandTheme`. Os pesos e escalas vivem em
`domain/constants/review.constant.ts` (versionados, sujeitos a playtesting).

### 5. Selos em estrelas + comentários (crítica e público)
Um ladder **único** de patamares (`domain/data/review-tiers.ts`: Massacrado ·
Misto · Favorável · Aclamado · Consagrado · **Obra-prima**, com **estrelas** 1–5
e limiar `minScore`), aplicado **aos dois escores** — no padrão de
`mapQualityTier` (ADR-0007/0008), porém **display-only** (sem multiplicadores
econômicos). O selo mostra **estrelas** (⭐/☆), não emoji. **Obra-prima** é o topo
**exclusivo** (score ≥ 92): compartilha as 5 estrelas com Consagrado, mas se
distingue pelo rótulo e por uma cor própria (grape). Exposto por
`GET /releases/review-tiers`; a **cor** vive no frontend (`labels.ts`).

Cada obra também recebe **3 comentários da crítica especializada** e **3 do
público**, mais uma **nota específica do formato** (`domain/data/review-comments.ts`).
Os comentários têm tom **levemente humorístico (estilo tycoon)**, com pools de
**≥10 blurbs por faixa** — crítica em 5 faixas (negativa/mista/boa/excelente/
obra-prima), público em 5 (uma por estrela), e notas por formato. São
**selecionados de forma determinística** por obra (semente = id, via FNV-1a +
LCG), **derivados na leitura** (`release.mapper`), estáveis por obra e **sem
persistência** — se os pools mudarem, o texto acompanha. Expostos na view como
`criticComments`, `publicComments` e `formatComment`.

### 6. Persistência mínima; tiers derivados
Persistem-se **só os dois escores** em `releases` (`critic_score`,
`public_score`, `numeric(6,1)`, **nullable**). Os **tiers** (`criticTier`,
`publicTier`) são **derivados na leitura** via `mapReviewTier` — assim refletem
sempre os limiares atuais e evitam duas colunas redundantes (diferença
consciente em relação a `quality_tier`, que é persistido). Os sub-fatores
(`accessibility`, `ambition`, `experimental`, `fameAppeal`) vão para o `details`
(`jsonb`) já existente, para transparência.

### 7. Obras antigas ficam sem análise
Os escores são computados **só na finalização daqui pra frente**. Obras lançadas
antes desta feature ficam com `critic_score`/`public_score` **`null`** (não houve
crítica na época); a view expõe `null` e o `ReleaseCard` omite os selos. Sem
backfill.

## Persistência
- `releases.critic_score`, `releases.public_score` (`numeric(6,1)`, nullable) —
  migration `AddReviewScoresToReleases`. Sem colunas de tier (derivadas).
- `releases.details` (`jsonb`, já existe) passa a guardar também os fatores de
  recepção.

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/releases/review-tiers` | Ladder de patamares de recepção (metadados) |

A `ReleaseView` passa a trazer `criticScore`, `publicScore` (nullable) e
`criticTier`, `publicTier` (ids derivados, nullable).

## Alternativas consideradas
- **Escores acoplados à economia (público → fãs, crítica → fama):** adiado —
  arrisca circularidade (fama alimenta escore que alimenta fama) e exige
  rebalancear a economia; melhor tratado junto do item 9.
- **`jsonb reviews` único:** rejeitado — duas colunas seguem o padrão de
  `quality`, são consultáveis e mais simples.
- **Rótulos distintos por dimensão (crítica cult × público hit):** rejeitado no
  MVP — uma escala única (Metacritic) é consistente com `quality-tiers` e tem
  menos dado a manter; pode evoluir depois.
- **Persistir os tiers (`critic_tier`/`public_tier`):** rejeitado — deriváveis do
  escore; menos colunas e sempre coerentes com os limiares vigentes.
- **Backfill das obras antigas:** rejeitado — não havia recepção; `null` é
  honesto e evita aproximação em SQL.

## Consequências

**Positivas**
- Feedback multidimensional: a mesma obra pode ser cult para a crítica e nichada
  para o público (ou vice-versa), enriquecendo a leitura sem mexer na economia.
- Reaproveita `quality`, formato, gênero, orçamento e fama; o cálculo é puro e
  testável (sem `Math.random` — a variância já entrou no `quality`).
- Segue os padrões existentes (perfis por arquétipo, ladder de tiers, endpoint de
  metadados, cor no frontend).
- Coberto por testes unitários (calculadora de recepção, divergência
  crítica×público, finalize gravando os escores).

**Negativas / trade-offs**
- Muitos parâmetros (pesos, perfis de acessibilidade/ambição/experimental,
  `FAME_APPEAL_SCALE`, limiares dos selos) exigem **balanceamento por
  playtesting**; começam como constantes versionadas.
- Os perfis de recepção por gênero são um **julgamento editorial** (o que é
  "acessível" ou "experimental") — versionado e ajustável.
- `criticTier`/`publicTier` derivados na leitura divergem do padrão de
  `quality_tier` (persistido) — decisão consciente para menos colunas.

## Referências
- Base: **design novo** (o frontend `game-music`, somente leitura, não modela
  obras/recepção). Reaproveita `evaluateRelease`, `mapQualityTier` e os perfis de
  gênero (ADR-0008).
- Implementação: [src/modules/releases/](../../src/modules/releases/)
  (recepção: dados, calculadora, finalize, view, endpoint).
- Migration: `src/database/migrations/*-AddReviewScoresToReleases.ts`.
