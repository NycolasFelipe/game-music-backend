# 0003 — Relacionamentos entre membros

- **Status:** Aceita
- **Data:** 2026-07-18
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — Módulos `bands` e `band-members`](0002-modulos-bands-e-band-members.md) (revisita a decisão 5, que havia deixado relacionamentos fora de escopo)

## Contexto

A [ADR-0002](0002-modulos-bands-e-band-members.md) deixou os **relacionamentos
entre membros** para uma etapa futura. Agora os implementamos.

Modelo de referência (frontend `relationship.ts`): pares **não-direcionais**
(A-B == B-A), `level` inteiro **−5..5**, distribuição inicial ponderada e
centrada em 0 (neutro), e todos os pares entre os membros de uma banda.

## Decisão

### 1. Relacionamentos pertencem ao agregado `Band` (módulo `bands`)
No modelo do jogo, `Band` possui `members[]` **e** `relationships[]`. Colocar os
relacionamentos no módulo `bands` (o agregado raiz) evita ciclos entre módulos:
`band-members` já depende de `bands`, e `bands` não depende de `band-members`
(apenas de arquivos-folha). Nenhum módulo novo foi criado.

### 2. Persistência (`member_relationships`)
Tabela com `band_id` (FK→bands, cascade), `member_a_id`/`member_b_id`
(FK→band_members, cascade), `level` (smallint), timestamps. O par é armazenado em
**ordem canônica** (`member_a_id` < `member_b_id`) com índice **único**
`(member_a_id, member_b_id)`, garantindo A-B == B-A e evitando duplicatas.

### 3. Geração automática (fiel ao jogo)
- **Ao criar a banda**: a transação do `bands` repo (que já grava banda +
  membros) passa a gerar todos os pares entre os membros, atomicamente.
- **Ao adicionar um membro**: `AddBandMember` chama
  `MEMBER_RELATIONSHIPS_REPOSITORY.syncForMember`, criando (idempotentemente) os
  pares faltantes entre o novo membro e os existentes.
- **Ao remover um membro**: o `ON DELETE CASCADE` das FKs remove os pares dele.

### 4. Composição na leitura da banda
`GET /bands/:id` passa a incluir `relationships[]` (além de `members[]`),
refletindo o shape `Band` do frontend. Há também o endpoint dedicado.

### 5. Atualização de nível (upsert idempotente)
`PUT /bands/:bandId/relationships` com `{ memberId1, memberId2, level }` faz
upsert do nível, canonicalizando o par e validando que **ambos** os membros
pertencem à banda (senão 404). Reenviar o par (em qualquer ordem) atualiza o
mesmo registro — não duplica.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/bands/:bandId/relationships` | Lista os relacionamentos da banda |
| `PUT` | `/bands/:bandId/relationships` | Define (upsert) o nível entre dois membros |

Todos sob `@UseGuards(JwtAuthGuard)` e escopados por dono (via `BANDS_REPOSITORY`).

## Alternativas consideradas
- **Módulo `relationships` dedicado dependendo de `bands`/`band-members`:**
  rejeitado — a geração automática exigiria `bands`/`band-members` dependerem do
  módulo de relacionamentos, criando ciclos (necessitando `forwardRef`).
- **Geração explícita sob demanda** (endpoint `:generate`): descartada em favor
  da geração automática, mais fiel ao jogo.
- **Relacionamentos direcionais / par não-canônico:** rejeitado — o domínio é
  não-direcional; a ordem canônica + índice único é mais simples e correta.

## Consequências

**Positivas**
- Fluxo fiel ao jogo: a banda nasce (e cresce) com seus relacionamentos.
- Sem ciclos de módulo; cascade mantém a consistência ao remover membros.
- Ordem canônica + índice único elimina duplicatas e ambiguidade A-B/B-A.

**Negativas / trade-offs**
- O módulo `bands` cresce (agora dono de duas subentidades do agregado).
- A escrita de `member_relationships` acontece em três pontos (create em `bands`
  repo, `syncForMember` no relationships repo, `setLevel`) — coerente com o
  padrão já usado para `band_members`, mas exige atenção.
- O `syncForMember` no `AddBandMember` roda numa transação separada da criação do
  membro (não atômico); como é idempotente, é regenerável e de baixo risco.

## Referências
- Base de domínio (somente leitura): `game-music/src/types/relationship.ts`
- Implementação: [src/modules/bands/](../../src/modules/bands/) (entities,
  generation, repositories, use-cases e presentation de relacionamentos)
- Migration: `src/database/migrations/*-CreateMemberRelationshipsTable.ts`
