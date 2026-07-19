# 0002 — Módulos `bands` e `band-members`

- **Status:** Aceita (implementação em fases — Fase 1 concluída)
- **Data:** 2026-07-18
- **Decisores:** Equipe de backend
- **Relacionada:** [0001 — Módulos iniciais: Usuários e Autenticação básica](0001-modulos-iniciais-usuarios-e-autenticacao.md)

## Contexto

O jogo `game-music` (frontend React, estado client-side em Zustand) gira em
torno de uma **banda** gerenciada pelo jogador e seus **membros** (os
"personagens"). Precisamos trazer esse domínio para o backend, começando pela
persistência de bandas e membros.

O frontend é a **base de referência** do domínio, mas será completamente
reescrito no futuro e **não deve ser modificado** (ver [AGENTS.md](../../AGENTS.md),
seção 7). Os tipos e regras vieram de `game-music/src/types/` e `game-music/docs/`.

Modelo de referência (frontend):
- `Band`: `name`, `theme` (26 opções), `origin` (20 cidades), `foundationYear`
  (décadas 1960–2010), `fanCount`, `members` (3–6), `relationships` (pares).
- `Character` (membro): `name`, `age` (16–30), `gender`, `happiness` (−5..5, 2
  casas), `skills` (6 tipos, 0–10; inicial 0–3 com ≥1 no nível 3),
  `characteristics` (2–4 traços por sistema de slots com incompatibilidades),
  `biography`, `primarySkill`, `joinYear`.

## Decisões

### 1. Dois módulos: `bands` (raiz do agregado) e `band-members`
Membro não existe sem banda, então ambos são criados juntos. `band-members`
importa `BandsModule` (via `BANDS_REPOSITORY`) para verificar posse da banda
antes de qualquer operação em membros. O inverso não ocorre — `bands` não
depende de `band-members`.

### 2. Sem ciclo de domínio: membros compostos na aplicação
`BandEntity` **não** embute `members[]`. A visão "banda com membros" é composta
na camada de aplicação (use cases), mantendo o domínio livre de dependências
cruzadas entre módulos.

### 3. Escopo por dono (usuário autenticado)
`Band.ownerId` referencia `users` (FK `ON DELETE CASCADE`). Todos os lookups são
escopados pelo dono (`findByIdAndOwner`, `findAllByOwner`); um usuário só alcança
as próprias bandas. Membros herdam o escopo através da banda.

### 4. Backend gera candidatos, persistência é stateless
Os dados de geração (nomes, catálogo de 32 características com opostos/raridade,
60 biografias, geradores) serão **portados para o backend como constantes de
regra de jogo** (não tabelas). O endpoint de geração devolve candidatos **não
persistidos**; o cliente escolhe; o `POST /bands` **revalida** faixas e catálogo
antes de persistir. Assim não há estado de candidatos no servidor.

### 5. Relacionamentos entre membros: fora de escopo agora
Os `relationships` (pares −5..5, A-B == B-A) ficam para uma etapa/ADR futura.

### 6. Persistência (TypeORM + migrations)
- `bands`: scalars + `owner_id` (FK/índice), `fan_count` default 0.
- `band_members`: `band_id` (FK/índice, cascade), `skills` como **`jsonb`**,
  `characteristics` como **`text[]`**, `happiness` como **`numeric(4,2)`** (com
  transformer string→number). Escolhemos `jsonb`/`text[]` (em vez de 6 colunas e
  tabela de junção) por mapear 1:1 com os tipos e simplificar migrations; as
  faixas e o catálogo são validados nos use cases.
- Enums (`theme`, `origin`, `gender`, `primarySkill`) como `varchar` +
  validação em app (não enums do Postgres), para facilitar evolução.

### 7. Transação de criação no repositório
`CreateBand` (banda + 3–6 membros) será atômico **dentro do repositório**
(`this.dataSource.transaction()`), pois os use cases não podem injetar
`DataSource` (regra do [AGENTS.md](../../AGENTS.md), seção 3).

## Endpoints previstos

Todos sob `@UseGuards(JwtAuthGuard)` e escopados por `@CurrentUser()`.

| Método | Rota | Use case |
|--------|------|----------|
| `GET`    | `/bands/name:generate` | GenerateBandName |
| `POST`   | `/bands` | CreateBand (transacional, 3–6 membros) |
| `GET`    | `/bands` | ListBands (do dono) |
| `GET`    | `/bands/:id` | GetBand (com membros) |
| `DELETE` | `/bands/:id` | DeleteBand |
| `POST`   | `/band-members/candidates` | GenerateMemberCandidates (não persiste) |
| `POST`   | `/bands/:bandId/members` | AddBandMember |
| `GET`    | `/bands/:bandId/members` | ListBandMembers |
| `GET`    | `/bands/:bandId/members/:memberId` | GetBandMember |
| `PATCH`  | `/bands/:bandId/members/:memberId` | UpdateBandMember (name/age/biography) |
| `DELETE` | `/bands/:bandId/members/:memberId` | RemoveBandMember |

## Premissas assumidas
- **`fanCount`** modelado agora; a "fama" (−5..30, separada) fica para depois.
- **Remoção durante o jogo** permite descer abaixo de 3 membros (o mínimo de 3 é
  regra apenas da criação). Revisável.
- **Imutabilidade:** `name/theme/origin/foundationYear` fixos após a criação;
  membro edita só `name/age/biography`.

## Alternativas consideradas
- **Um único módulo `bands` com membros como sub-recurso:** rejeitado —
  membro tem geração e ciclo próprios; dois agregados distintos.
- **`bands` embutindo `members[]` no domínio:** criaria ciclo entre módulos;
  preferimos compor na aplicação.
- **Colunas relacionais para skills + tabela de junção para características:**
  mais "relacional", porém verboso e distante do modelo; `jsonb`/`text[]`
  atendem melhor ao caso atual.
- **Geração com estado no servidor (candidatos temporários):** mais complexa e
  desnecessária; optamos por geração stateless + revalidação na persistência.
- **Membros diretamente no usuário (sem `Band`):** diverge do modelo do jogo.

## Consequências

**Positivas**
- Fundação limpa e escopada por dono, reutilizável pelos módulos de gameplay
  futuros (turnos, eventos, fama).
- Domínio sem ciclos; regras de jogo versionadas como constantes (fáceis de
  evoluir sem migration).
- Deleção em cascata coerente (usuário → bandas → membros).

**Negativas / trade-offs**
- `jsonb`/`text[]` são menos "consultáveis" que colunas/junções — aceitável
  enquanto não houver filtros por skill/traço no banco.
- A transação cruzando dois agregados vive na infraestrutura de `bands`, que
  passa a conhecer o ORM de `band_members` (acoplamento de infra consciente).
- Geração server-side exige portar (e manter) os dados de referência do
  frontend.

## Plano de implementação (fases)
1. **Fundação** — entidades de domínio, ORM, migrations das duas tabelas,
   repositórios, wiring. **✅ Concluída.**
2. **`bands`** — use cases (create transacional, list, get, delete, generate
   name) + controller + DTOs + Swagger.
3. **`band-members`** — portar dados + gerador (funções puras) → candidates +
   add/list/get/update/remove.
4. **Testes + Swagger** — unit tests dos use cases (incl. invariantes do
   gerador) e, opcionalmente, integração do fluxo de criação.

## Referências
- Convenções: [AGENTS.md](../../AGENTS.md)
- Base de domínio (somente leitura): repositório `game-music` (`src/types/`, `docs/`)
- Módulo de bandas: [src/modules/bands/](../../src/modules/bands/)
- Módulo de membros: [src/modules/band-members/](../../src/modules/band-members/)
