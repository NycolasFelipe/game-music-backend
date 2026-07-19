# 0005 — Eventos passivos (timeline)

- **Status:** Aceita
- **Data:** 2026-07-19
- **Decisores:** Equipe de backend
- **Relacionada:** [0004 — Eventos ativos](0004-eventos-ativos.md)

## Contexto

Os **eventos passivos** são flavor narrativo: uma "timeline do mundo" com
artistas fictícios (colaborações, polêmicas, turnês, aposentadorias, etc.). São
**puramente narrativos** — não afetam o estado da banda. Ficaram fora de escopo
na [ADR-0004](0004-eventos-ativos.md); agora os implementamos, portando a lógica
do frontend (`game-music`, somente leitura).

## Decisão

### 1. Timeline persistida por banda
Cada save (banda) tem sua própria timeline. Tabela `passive_events` (FK→bands,
cascade). A anti-repetição usa o histórico da banda (janela de ±3 anos), em vez
de um cache em memória.

### 2. Mesmo módulo `events`
Passivos e ativos convivem no bounded context `events` (que já depende de
`bands`). Ao contrário dos ativos, não há resolução nem consequências.

### 3. Dados como constantes estáticas (portadas)
237 artistas, ~30 templates (com ids adicionados para anti-repeat) e recursos
(nomes de singles/álbuns/turnês, motivos, avaliações) viram constantes de regra
de jogo.

### 4. Geração stateless + `year` por request
O gerador (funções puras) escolhe o tipo por probabilidade, filtra templates,
filtra artistas **ativos no ano** por compatibilidade, seleciona artistas,
preenche placeholders e evita repetições. O `year` vem no corpo do request
(consistente com os eventos ativos; turnos ainda não existem). Gera até `count`
eventos por chamada, encadeando a anti-repetição dentro do lote.

### 5. Correção sobre o frontend: `carreira_longa` usa o ano do jogo
O filtro `carreira_longa` (≥ 30 anos de carreira) passa a comparar contra o
**ano do jogo**, não contra o ano real do sistema (`new Date().getFullYear()`)
como no frontend. Divergência **intencional** — o comportamento do frontend era
um bug latente para uma timeline histórica.

## Persistência (`passive_events`)
`id`, `band_id` (FK→bands, cascade), `template_id`, `year` (numeric), `type`,
`description`, `artists` (text[]), `created_at`.

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/bands/:bandId/passive-events` | Gera eventos passivos (`{ year, count? }`) |
| `GET`  | `/bands/:bandId/passive-events` | Lista a timeline da banda |

Ambos sob `@UseGuards(JwtAuthGuard)`, escopados por dono.

## Alternativas consideradas
- **Stateless (sem DB):** simples, mas sem timeline nem anti-repetição entre
  chamadas. Rejeitado.
- **Módulo `passive-events` dedicado:** mais isolamento, mais boilerplate;
  optamos por coesão no `events`.
- **Portar `carreira_longa` fielmente (ano real):** manteria o bug; corrigimos.

## Consequências

**Positivas**
- Timeline por save, coerente com o modelo do jogo; cascade limpa ao apagar a
  banda.
- Gerador puro e coberto por testes; dados versionados como constantes.

**Negativas / trade-offs**
- Sem turnos: o `year` é responsabilidade do cliente.
- Algumas tags de compatibilidade dos templates (`ambos_ativos`,
  `ativo_recente`) não têm filtro dedicado e recaem em "todos os ativos" —
  replicando o comportamento do frontend (os artistas já são filtrados por
  atividade no ano). Candidato a refino futuro.
- O dataset de artistas contém algumas duplicatas herdadas da fonte (ex.: "Donna
  Summer") — portadas verbatim.

## Referências
- Base (somente leitura): `game-music/src/utils/eventGenerator.ts`,
  `src/data/artists.ts`, `src/types/event.ts`
- Implementação: [src/modules/events/](../../src/modules/events/) (dados,
  gerador, use cases e presentation de eventos passivos)
- Migration: `src/database/migrations/*-CreatePassiveEventsTable.ts`
