# 0008 — Obras musicais (criação de discos)

- **Status:** Aceita
- **Data:** 2026-07-19
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — bands/band-members](0002-modulos-bands-e-band-members.md),
  [0003 — Relacionamentos entre membros](0003-relacionamentos-entre-membros.md),
  [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0006 — Turnos](0006-turnos.md),
  [0007 — Fama](0007-fama.md)
- **Emenda:** ajusta o ADR-0006 §6 (ver "Emenda ao ADR-0006").
- **Desdobramento futuro:** gravadoras e contratos serão um ADR próprio (0009);
  o schema aqui já é desenhado para acomodar essa camada.

## Contexto

O jogo precisa de um sistema de **produção de obras** (single, EP, LP, álbum,
etc.): o jogador cria discos investindo o talento dos membros e dinheiro, e a
obra retorna **fãs** (logo, fama — ADR-0007) e **receita**. O frontend de
referência `game-music` (somente leitura) **não modela obras nem economia** —
"single", "álbum" etc. aparecem apenas como texto de eventos. Portanto este é um
**design novo**, não um port; ele reaproveita os blocos já existentes: `Skills`,
`happiness`, `BandTheme` (26 estilos), características (traits) com raridade,
relacionamentos, o relógio (`current_year`), a máquina de eventos ativos e a
regra de "estado muda só atomicamente" (`applyBandStateChanges`).

Este ADR cobre o **núcleo de obras no modo independente** (banda sem gravadora,
autofinanciada). A camada de **gravadoras/contratos** (cut, adiantamento
recuperável, cadência, exigências, mercado) é decidida em princípio, mas fica
para um ADR seguinte; aqui garantimos apenas que o modelo de dados a comporte.

## Decisão

### 1. Módulo novo `releases`
Segue a mesma estrutura em camadas dos demais módulos
(`domain → application → infrastructure → presentation`). Obras referenciam a
banda por `band_id` (uuid, FK cascade); nenhum relacionamento TypeORM. Grafo de
dependências acíclico: `releases → bands` (obras leem membros/relacionamentos/
humor via o agregado `bands`).

### 2. Obra é uma unidade atômica (não por faixa)
Uma obra tem **qualidade agregada**, não faixas individuais como entidades. O
detalhamento (breakdown por aspecto/membro, rolagens) fica em uma coluna `jsonb`
(`details`), o que preserva a informação e **deixa a porta aberta para faixas no
futuro** sem migração destrutiva.

### 3. Campos de autoria
Além de `format` e `style` (um `BandTheme`, default = tema da banda), a obra
carrega **autoria**:
- **`title`** — texto livre **ou** gerado por `release-title.generator.ts`
  (fonte da verdade no backend, no padrão do gerador de nome de banda).
- **`concept`** (álbum conceitual) — texto livre **ou** gerado por
  `release-concept.generator.ts` (usa título, estilo e membros como sementes).
- **`credits`** (`jsonb`) — mapa **aspecto → membro(s)**. Os aspectos são as 6
  skills (Letras, Vocais, Guitarra, Baixo, Bateria, Teclado); cada aspecto
  aceita 1+ membros e um membro pode ocupar vários. Os créditos são exibidos na
  ficha da obra e alimentam o cálculo (§5).

### 4. Formatos como dado de domínio (sem cadeado de permissão)
Os formatos vivem em `domain/data/release-formats.ts` (SINGLE, EP, LP, ALBUM,
ACOUSTIC, LIVE, …), cada um com faixa de nº de faixas, `custoBase`, `alcanceBase`
e `receitaBase`. **Decisão de realismo:** não há trava de permissão por formato.
Uma banda independente **pode** tentar qualquer formato; o que a diferencia de
uma banda com gravadora é **custo alto e alcance baixo**, não permissão (na
indústria real, formato é escolha artística; a gravadora destrava orçamento,
alcance e distribuição). Os catálogos são expostos por endpoints
(`GET /releases/formats`, `GET /releases/budget-tiers`), no padrão dos demais
metadados (ADR-0007 / happiness-levels).

### 5. Qualidade derivada dos membros atribuídos
A qualidade sai **de quem foi creditado em cada aspecto**, não da média da banda:
```
scoreAspecto  = f(skill dos membros atribuídos àquele aspecto)   // Letras←lyrics …
skillScore    = Σ ( scoreAspecto × pesoDoGênero[aspecto] )        // normalizado 0–1
quality       = clamp( skillScore × moodMod × budgetBonus × Π mod_eventos × variance, 0, 1 ) × 100
qualityTier   = mapQualityTier(quality)   // Fracasso · Medíocre · Sólido · Grande · Obra-prima
```
- `pesoDoGênero` vem de `domain/data/release-genre-profiles.ts` (perfil de pesos
  de skill por `BandTheme`; ex.: rock pesa guitar+drums+vocal, kpop pesa
  vocal+lyrics).
- `moodMod` usa o humor médio dos membros atribuídos; `budgetBonus` vem do tier
  de orçamento (§7); `mod_eventos` são os modificadores das escolhas de criação
  (§6); `variance` é uma pequena aleatoriedade (via `Math.random`, mockável nos
  testes, como nos demais geradores).
- Os tiers de qualidade replicam o padrão de patamares rotulados do
  `fame.calculator` (ADR-0007).

### 6. Criação como rascunho com eventos resolvidos em sequência
Criar é um **fluxo interativo**, não um único cálculo. A obra nasce como
**rascunho** (`status = "em_criacao"`); o backend gera uma sequência de
**eventos de criação** e o jogador os resolve um a um; quando não há pendentes,
a obra é **finalizada** e vira `status = "lancada"`.
- Eventos de criação são persistidos em tabela própria
  (`release_creation_events`, que espelha o formato de `active_events`) e
  gerados por `domain/generation/creation-event.generator.ts` a partir dos
  **membros atribuídos**:
  - **conflito de visão** — dois creditados com relação ruim → escolher a visão
    de A ou B (aplica `mod_eventos` e pode mexer em humor/relacionamento deles);
  - **evento único por traço** — uma característica do membro dispara um evento
    **probabilístico** (ex.: traço excêntrico → "ideia maluca": chance baixa de
    grande bônus, senão penalidade) — reusa o modo probabilístico dos eventos.
- Cada escolha entra como modificador na qualidade (§5) e é registrada em
  `creation_log` (`jsonb`) para exibição posterior nos créditos.
- **Criar não avança o relógio** (é ação do período atual), mas uma obra
  `em_criacao` **bloqueia o `AdvanceTurn`** (`409`), espelhando a regra de
  eventos ativos pendentes (ADR-0006 §4). Para isso, `ReleasesRepository` expõe
  `countInCreation(bandId)`, consultado pelo tick.

### 7. Economia: orçamento, custo e duas trilhas de receita
A banda passa a ter **caixa** (`bands.balance numeric(12,2)`), inicializado com
um capital inicial (`STARTING_CAPITAL`). Ao iniciar a obra, o jogador escolhe um
**tier de orçamento** (`domain/data/budget-tiers.ts`: Caseiro / Estúdio / Grande
Produção) que é **duas coisas ao mesmo tempo**: fator de custo e alavanca de
qualidade (`budgetBonus`, §5).

Na **finalização** calculam-se, além da qualidade:
```
cost         = formato.custoBase × tierOrçamento.custoMult          // debitado do caixa
fansGained   = round( formato.alcanceBase × multQualidade(tier) × alcanceFama(fãsAtuais) )
masterTotal  = receitaBase × multQualidade(tier) × alcance × fatorFama(fãsAtuais)   // gravação
publishTotal = masterTotal × PUBLISHING_RATIO                        // composição (crédito Letras)
```
Há **duas trilhas de receita** — de gravação (*master*) e de composição
(*publishing*) — porque isso espelha a indústria real e dá peso a **quem é
creditado em Letras**. No modo independente ambas ficam **100% com a banda**; a
camada de gravadora (ADR futuro) aplicará **cut** e **recoupment do adiantamento**
apenas sobre a trilha de gravação, mantendo a de composição intacta — por isso já
as separamos agora.

### 8. Receita híbrida (pico no lançamento + cauda de royalties)
A receita não entra de uma vez: uma **fração de pico** (`UPFRONT_FRACTION`) é
creditada na finalização e o restante vira **cauda** que **decai por turno**.
- Na finalização, atômico via `applyBandStateChanges` **estendido para aceitar
  `balance`** (`{ balance: −cost + pico, fanCount: +fansGained }`) — a **fama
  recalcula sozinha** (ADR-0007). A obra guarda `royalty_remaining` e
  `royalty_turns_left`.
- A cada `AdvanceTurn`, `AccrueReleaseRoyaltiesUseCase` credita a parcela da
  cauda de cada obra ativa da banda (decaimento geométrico, `ROYALTY_PAYOUT_RATE`,
  janela `ROYALTY_WINDOW_TURNS`) e decrementa o restante. `TurnsModule` importa
  `ReleasesModule` (grafo `turns → {bands, events, releases}`, acíclico).

## Emenda ao ADR-0006

O ADR-0006 §6 ("Sem economia passiva") dizia que avançar o tempo não altera
estado. Com as obras, o `AdvanceTurn` passa a **creditar royalties** das obras
ativas (§8). A regra original é preservada onde importa: turnos continuam
**neutros para fãs, felicidade e relacionamentos** (esses só mudam por resolução
de eventos). A economia (dinheiro) é a única dimensão que o tempo passa a mover
passivamente, deliberadamente, para criar o ciclo econômico do jogo.

## Persistência

- `bands.balance` (`numeric(12,2)`, NOT NULL) — migration `AddBalanceToBands`
  faz backfill dos registros existentes com `STARTING_CAPITAL`.
- `releases`: `id`, `band_id` (FK→bands, cascade), `title`, `concept`, `format`,
  `style`, `budget_tier`, `status` (`em_criacao`|`lancada`), `credits` (`jsonb`),
  `quality` (`numeric(6,1)`, nullable até finalizar), `quality_tier`,
  `fans_gained`, `cost` (`numeric(12,2)`), `master_revenue_total` /
  `publishing_revenue_total` (`numeric(12,2)`), `royalty_remaining`
  (`numeric(12,2)`), `royalty_turns_left` (int), `released_at_year`
  (`numeric(6,1)`, nullable até finalizar), `creation_log` (`jsonb`), `details`
  (`jsonb`), `created_at`. Índice em `band_id`.
- `release_creation_events`: `id`, `release_id` (FK→releases, cascade),
  `sequence` (int), `kind`, `prompt`, `options` (`jsonb`), `resolved` (bool),
  `chosen_option` (nullable), `quality_modifier` (`numeric`, nullable),
  `created_at`. Índice em `release_id`.

Migrations (sequência a partir de `1752000010000`):
`AddBalanceToBands`, `CreateReleasesTable`, `CreateReleaseCreationEventsTable`.

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`    | `/releases/formats` | Catálogo de formatos (metadados) |
| `GET`    | `/releases/budget-tiers` | Tiers de orçamento (custo × qualidade) |
| `POST`   | `/releases/generate-title` | Gera sugestões de título |
| `POST`   | `/releases/generate-concept` | Gera um álbum conceitual |
| `GET`    | `/bands/:bandId/releases` | Discografia da banda |
| `POST`   | `/bands/:bandId/releases` | Inicia um rascunho (título/conceito/estilo/formato/orçamento/créditos) |
| `POST`   | `/bands/:bandId/releases/:id/creation-events/:eventId/resolve` | Resolve um evento de criação |
| `POST`   | `/bands/:bandId/releases/:id/finalize` | Finaliza e lança a obra |
| `DELETE` | `/bands/:bandId/releases/:id` | Cancela um rascunho |

Rotas escopadas por banda sob `@UseGuards(JwtAuthGuard)` + `@CurrentUser()`,
uuids validados por `ParseUUIDPipe`. `finalize`/`resolve` respondem `200`
(ações, não criação de recurso); `POST /releases` responde `201`.

## Alternativas consideradas
- **Obra por faixa (cada música uma entidade):** rejeitado no MVP — muito mais
  complexo; o `jsonb details` preserva a evolução futura sem migração destrutiva.
- **Produção em fases ao longo de vários turnos:** rejeitado — criar é uma sessão
  interativa no período atual (§6), não meses de relógio.
- **Cadeado de formato para banda independente:** rejeitado por realismo —
  formato é escolha artística; a diferença é custo/alcance, não permissão (§4).
- **Receita única agregada (uma só trilha):** rejeitado — separar master de
  publishing é barato agora e é o que dá sentido ao crédito de Letras e ao
  recoupment futuro (§7).
- **Receita à vista no lançamento (sem cauda):** rejeitado — a cauda de royalties
  é o que dá motivo econômico para avançar turnos (§8).
- **Módulo de gravadoras junto neste ADR:** adiado — subsistema grande, merece
  ADR próprio; aqui o schema só o antecipa.

## Consequências

**Positivas**
- As obras fecham o loop econômico: criar → escolher créditos e resolver eventos
  → lançar → ganhar fãs (fama recalcula) e dinheiro (pico + cauda).
- Reaproveita blocos existentes (skills, humor, traits, relacionamentos, eventos,
  relógio, `applyBandStateChanges`) sem duplicação; cascade limpa obras e eventos
  de criação ao apagar a banda.
- Créditos por aspecto tornam a composição da banda mecanicamente relevante e
  alimentam a ficha da obra.
- Schema desenhado para acomodar gravadoras/recoupment (duas trilhas de receita,
  `details`/`credits` em jsonb) sem migração destrutiva.
- Será coberto por testes unitários (calculadora de qualidade/impacto/receita,
  geradores, use cases de rascunho/resolução/finalização, bloqueio de turno,
  cauda de royalties) e validado e2e no Postgres isolado.

**Negativas / trade-offs**
- O `AdvanceTurn` deixa de ser puramente neutro (passa a mover dinheiro) — emenda
  explícita ao ADR-0006.
- `release_creation_events` acopla a máquina de eventos de criação ao módulo de
  obras (própria, não reusa a tabela `active_events`) — duplica um pouco de forma
  para manter os domínios desacoplados, decisão consciente.
- Muitos parâmetros econômicos (`STARTING_CAPITAL`, multiplicadores,
  `PUBLISHING_RATIO`, `UPFRONT_FRACTION`, decaimento) exigem **balanceamento por
  playtesting**; começam como constantes versionadas.
- A finalização credita pico/fãs e grava a obra em passos próximos, mas não numa
  única transação com o snapshot de turno — aceitável (o estado da banda é
  atômico; a obra é o registro de histórico).

## Referências
- Base: **design novo** — o frontend `game-music` (somente leitura) não modela
  obras nem economia (confirmado em varredura). Reaproveita `Skills`,
  `happiness`, `BandTheme`, características e o padrão de patamares de
  `fameCalculator.ts`.
- Implementação: [src/modules/releases/](../../src/modules/releases/); alterações
  no agregado em [src/modules/bands/](../../src/modules/bands/) (`balance`,
  `applyBandStateChanges` estendido) e em
  [src/modules/turns/](../../src/modules/turns/) (cauda de royalties, bloqueio por
  obra em criação).
- Migrations: `src/database/migrations/*-AddBalanceToBands.ts`,
  `*-CreateReleasesTable.ts`, `*-CreateReleaseCreationEventsTable.ts`.
