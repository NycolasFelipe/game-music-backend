# 0004 — Eventos ativos

- **Status:** Aceita
- **Data:** 2026-07-19
- **Decisores:** Equipe de backend
- **Relacionada:** [0002](0002-modulos-bands-e-band-members.md), [0003 — Relacionamentos entre membros](0003-relacionamentos-entre-membros.md)

## Contexto

Os **eventos ativos** são o núcleo interativo do jogo: uma situação é
apresentada ao jogador com opções; a escolha aplica **consequências** ao estado
da banda (fama, felicidade dos membros, relacionamentos). O frontend
(`game-music`, somente leitura) tem templates ricos em elegibilidade e um
gerador/resolvedor; portamos essa lógica.

Existem também eventos **passivos** (timeline narrativa com um dataset de
artistas) — deixados fora de escopo nesta etapa.

## Decisão

### 1. Escopo: apenas eventos ativos
Passivos ficam para uma etapa futura (dependem de um dataset de artistas e são
menos centrais).

### 2. Módulo dedicado `events`, sem ciclos
`events` depende de `bands` (via `BANDS_REPOSITORY`) para ler o estado da banda
e aplicar consequências. Nenhum módulo depende de `events`, então não há ciclo
(diferente de relacionamentos, eventos não são disparados por create/add).

### 3. Templates como constantes estáticas (portadas)
Os 5 templates viram dados de regra de jogo (`ACTIVE_EVENT_TEMPLATES`), como
características/biografias. A autoria continua no frontend.

### 4. Ano por request
A elegibilidade usa `year`, fornecido no corpo do `POST` de geração. Mantém
eventos desacoplados de um sistema de **turnos** (não implementado — candidato a
ADR futura).

### 5. Geração stateless + anti-repetição por histórico
O gerador (funções puras) filtra templates elegíveis (tipo, ano, fãs,
características da banda), seleciona personagens com as restrições do template,
preenche placeholders e monta as opções visíveis. Para não repetir, consulta os
`templateId` usados pela banda numa janela de ±3 anos (a partir da tabela de
eventos, em vez de um cache em memória).

### 6. Resolução: sorteio no servidor + aplicação atômica
Consequências **ponderadas** (`chance`) são sorteadas **no `resolve`** (não na
geração). A consequência resolvida é aplicada:
- **Fama:** absoluta ou percentual (`base = fãs || 10`, `newFans = max(1, fãs + delta)`).
- **Felicidade:** `happinessChangePercent` explícito ou **derivado** (fama +
  tensão de relacionamento + tipo do evento); `delta = %·5/100`, aplicado aos
  personagens **envolvidos** (ou a toda a banda se nenhum).
- **Relacionamentos:** `level += change`, clamp −5..5.

Tudo é aplicado **atomicamente** por `BANDS_REPOSITORY.applyBandStateChanges`
(uma transação sobre `bands`, `band_members` e `member_relationships`), pois o
`Band` é a raiz do agregado e use cases não injetam `DataSource`.

### 7. Opções não expõem consequências
A view de evento devolve só `id/label/description` das opções — as consequências
(e probabilidades) ficam no servidor, evitando spoiler antes da escolha.

### 8. Restrições de nível de relacionamento são aplicadas
Diferentemente do frontend (que declara `min/maxRelationshipLevel` nos templates
mas **não** as usa), a geração **aplica** essas restrições: em eventos de par, só
seleciona uma dupla cujo nível de relacionamento esteja dentro de
`[minRelationshipLevel, maxRelationshipLevel]`. É uma divergência **intencional**
do frontend (correção de um comportamento incompleto). Para eventos individuais
(1 personagem) não há par, então a restrição não se aplica.

## Persistência (`active_events`)
`id`, `band_id` (FK→bands, cascade), `template_id`, `year` (numeric),
`type`, `title`, `description`, `involved_character_ids` (text[]),
`options` (jsonb, com as consequências resolvidas), `resolved`,
`chosen_option_id`, `outcome` (jsonb), timestamps. As opções resolvidas ficam no
`jsonb`, então a resolução é determinística (lê a opção escolhida, sorteia o
resultado, aplica).

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/bands/:bandId/events` | Gera um evento elegível (`{ year }`) |
| `GET`  | `/bands/:bandId/events` | Lista os eventos da banda |
| `GET`  | `/bands/:bandId/events/:eventId` | Um evento |
| `POST` | `/bands/:bandId/events/:eventId/resolve` | Resolve (`{ optionId }`) e aplica |

Todos sob `@UseGuards(JwtAuthGuard)`, escopados por dono.

## Alternativas consideradas
- **Templates em tabela (autoráveis):** adiaria o núcleo; a autoria é do
  frontend. Preferimos constantes estáticas.
- **`currentYear` na banda (turnos):** mais estado; optamos por `year` por
  request e deixamos turnos para uma ADR própria.
- **Sortear consequências na geração:** exporia/fixaria o resultado; sorteamos
  no `resolve`.

## Consequências

**Positivas**
- Núcleo jogável completo: gerar → escolher → aplicar, fiel ao frontend
  (matemática de fama/felicidade/relacionamento idêntica).
- Aplicação atômica mantém o agregado consistente; `ON DELETE CASCADE` limpa
  eventos ao apagar a banda.
- Sem ciclos de módulo; gerador/resolvedor puros e cobertos por testes.

**Negativas / trade-offs**
- Sem turnos: o `year` é responsabilidade do cliente.
- `options` em `jsonb` são pouco consultáveis (aceitável; são conteúdo servido).

## Referências
- Base (somente leitura): `game-music/src/utils/activeEventGenerator.ts`,
  `src/store/gameStore.ts`, `src/data/activeEventTemplates.ts`, `src/types/event.ts`
- Implementação: [src/modules/events/](../../src/modules/events/)
- Migration: `src/database/migrations/*-CreateActiveEventsTable.ts`
