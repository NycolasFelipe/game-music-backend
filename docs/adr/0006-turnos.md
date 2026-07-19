# 0006 — Turnos (avanço do tempo do jogo)

- **Status:** Aceita
- **Data:** 2026-07-19
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — bands/band-members](0002-modulos-bands-e-band-members.md),
  [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0005 — Eventos passivos](0005-eventos-passivos.md)

## Contexto

Até aqui o `year` era responsabilidade do cliente: os endpoints de eventos
(ativos e passivos) recebiam o ano no corpo do request, pois não havia relógio
de jogo no backend. Os **turnos** introduzem esse relógio e tornam o "avançar o
tempo" a ação central do loop, orquestrando os sistemas já existentes.

Portamos a mecânica do frontend `game-music` (somente leitura). Detalhe
importante: o **código** do frontend avança em **meio ano (semestre)** por
turno, embora o doc de design fale em 1 ano — seguimos o código.

## Decisão

### 1. `current_year` no agregado `bands`
O ano vivo é estado do save, então mora na tabela `bands`
(`current_year numeric(6,1)`), inicializado com `foundation_year` na criação da
banda. Alternativa (uma tabela de turnos como ponteiro do ano) foi rejeitada
para não termos duas fontes de verdade do ano e evitar que os eventos precisem
de um join para descobrir o ano corrente.

### 2. Passo de meio ano (semestre)
`TURN_STEP = 0.5`. Frações `.5` denotam o 2º semestre de um ano-calendário. O
mapper formata o período (`"2003 - 2º semestre"`), replicando o frontend.

### 3. Avançar é um "tick" completo e faithful
`POST /bands/:bandId/turns/advance` executa, em ordem:
1. gera **1 evento passivo** para o novo ano (flavor da timeline);
2. avança `current_year` em `+0.5` e, **só ao cruzar o ano-calendário**
   (`floor(novo) !== floor(anterior)`), **envelhece todos os membros em +1** —
   atômico via `BANDS_REPOSITORY.advanceTurn`;
3. rola **35%** (`ACTIVE_EVENT_CHANCE`) de gerar um **evento ativo** (decisão)
   bloqueante.

Reusa os use cases existentes (`GeneratePassiveEventsUseCase`,
`GenerateActiveEventUseCase`) em vez de duplicar geradores — `TurnsModule`
importa `EventsModule`, que passa a exportá-los (grafo acíclico
`turns → events → bands`).

### 4. Bloqueio com evento ativo pendente
Avançar é recusado (`409 Conflict`) enquanto a banda tiver eventos ativos não
resolvidos — espelha a regra do frontend (o botão "Avançar" fica desabilitado
com decisões pendentes). Para isso, `ActiveEventsRepository` ganhou
`countUnresolved(bandId)`.

### 5. Timeline de turnos persistida
Cada avanço grava um snapshot append-only em `turns` (ano, `fan_count` no
momento, e referências ao evento passivo/ativo gerados). É histórico/auditoria;
o ano vivo continua no `bands`. `GET /bands/:bandId/turns` lista a timeline
(ordem cronológica).

### 6. Sem economia passiva
Fãs, felicidade e relacionamentos **não** mudam ao avançar o tempo — como no
frontend, só se alteram pela **resolução de eventos ativos** (ADR-0004). Por
isso o `fan_count` do snapshot é estável no turno (o evento ativo recém-gerado
está pendente, e advance está bloqueado enquanto houver pendências).

## Persistência

- `bands.current_year` (`numeric(6,1)`, NOT NULL) — migration
  `AddCurrentYearToBands` faz backfill dos registros existentes com
  `foundation_year`.
- `turns`: `id`, `band_id` (FK→bands, cascade), `year` (`numeric(6,1)`),
  `fan_count_snapshot`, `passive_event_id` (uuid, nullable), `active_event_id`
  (uuid, nullable), `created_at`.

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/bands/:bandId/turns/advance` | Avança 1 turno (½ ano) e roda o tick |
| `GET`  | `/bands/:bandId/turns` | Lista a timeline de turnos da banda |

Ambos sob `@UseGuards(JwtAuthGuard)`, escopados por dono. O `advance` responde
`200` (é uma ação, não a criação de um recurso REST).

## Alternativas consideradas
- **Ano em tabela de turnos (ponteiro):** rejeitado — duas fontes de verdade.
- **Turns como contador fino** (só avança o ano; eventos ficam nos endpoints
  manuais): rejeitado — o turno deixaria de ser o "tick" único do jogo.
- **Turno = 1 ano (doc de design):** rejeitado — seguimos o código do frontend
  (semestre).

## Consequências

**Positivas**
- O turno é a ação central e atômica; ano e idade dos membros nunca divergem.
- Reaproveita geração de eventos sem duplicação; cascade limpa turns ao apagar a
  banda.
- Coberto por testes unitários (avanço, rollover de idade, roll de ativo,
  tolerância a "sem evento elegível", bloqueio 409, banda inexistente) e
  validado e2e no Postgres.

**Negativas / trade-offs**
- `passive_event_id`/`active_event_id` são referências soltas (sem FK) para não
  acoplar `turns` às tabelas de eventos; ficam órfãos após o cascade dos eventos
  (aceitável para histórico).
- O snapshot de evento passivo/ativo e o avanço do ano não estão na mesma
  transação (o snapshot é gravado por último); como é só histórico, a
  não-atomicidade é tolerável.
- `GenerateActiveEventUseCase` sinaliza "nenhum evento elegível" via
  `NotFoundException`; o tick a captura e trata como "sem evento no turno".
  Candidato a um tipo de retorno mais explícito no futuro.
- O cliente ainda pode chamar os endpoints de eventos com um `year` arbitrário
  (não foram removidos); o turno é a forma canônica, mas não a única.

## Referências
- Base (somente leitura): `game-music/src/store/gameStore.ts` (`advanceYear`),
  `src/components/game/GameScreen.tsx` (`handleAdvanceYear`, `formatPeriod`)
- Implementação: [src/modules/turns/](../../src/modules/turns/); alterações no
  agregado em [src/modules/bands/](../../src/modules/bands/) (`current_year`,
  `advanceTurn`) e em [src/modules/events/](../../src/modules/events/)
  (`countUnresolved`, exports)
- Migrations: `src/database/migrations/*-AddCurrentYearToBands.ts`,
  `*-CreateTurnsTable.ts`
