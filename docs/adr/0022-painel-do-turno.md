# 0022 — Painel do turno (pendências, prévias e previsão)

- **Status:** Aceita
- **Data:** 2026-11-09
- **Decisores:** Equipe de backend
- **Relacionada:** [0006 — Turnos](0006-turnos.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md),
  [0013 — Ajuste automático de salários](0013-ajuste-automatico-de-salarios.md),
  [0015 — Tempo de produção e saturação](0015-tempo-de-producao-e-saturacao.md),
  [0016 — Shows ao vivo](0016-shows-ao-vivo.md),
  [0017 — Confraternizações](0017-confraternizacoes.md),
  [0020 — Relatório do turno](0020-relatorio-do-turno.md)

## Contexto

O frontend será reconstruído com uma tela única de turno ("Turno"), que junta
o que hoje fica espalhado entre Visão geral, Agenda e Discografia: o que
bloqueia o fechamento, o show da temporada, a confraternização, a obra no
estúdio e quanto vai sobrar no caixa depois do avanço.

O protótipo dessa tela calculava as prévias e a previsão no navegador, copiando
fórmulas do backend (`gig.calculator.ts`, royalties, folha). Isso duplica regra
de jogo no cliente e quebra em silêncio quando o balanceamento muda (como na
ADR-0021).

## Decisão

Novo endpoint `GET /bands/:bandId/turns/panel` (dono da banda; 404 se a banda
não for do usuário), que devolve `TurnPanelView`:

| Campo | Conteúdo |
|---|---|
| `year`, `period` | Relógio da banda (mesmo formato do `TurnView`) |
| `performance` | Desempenho de palco atual (0..1), com `evaluateGig` e variância neutra |
| `pending` | Lista do que espera o jogador (ver abaixo) |
| `gig.playedThisTurn` | A temporada já tocada no semestre atual (`GigView`) ou `null` |
| `gig.previews` | Uma prévia por casa do catálogo (ver abaixo) |
| `activity.heldThisTurn` | Se a banda já fez uma confraternização neste semestre |
| `studio.release` | A obra em criação (`id`, `title`, `format`, `turnsLeft`, `ready`) ou `null` |
| `studio.launchesThisYear` | Obras lançadas no ano civil atual |
| `studio.nextMarketMultiplier` | Fator de saturação que o próximo lançamento teria (`SATURATION_FACTORS`) |
| `forecast` | Previsão do próximo avanço (ver abaixo) |

**Pendências (`pending`).** Cada item tem `kind`, `id`, `releaseId`, `title` e
`blocking`:
- `active-event`: evento ativo não resolvido (`blocking: true`, `releaseId:
  null`, `title` do evento).
- `studio-session`: sessão de estúdio não resolvida da obra em criação
  (`blocking: true`, `releaseId` da obra, `title` é o enunciado da sessão).
- `release-ready`: a obra terminou a produção, não tem sessão pendente e pode
  ser lançada (`blocking: false`, `id` e `releaseId` da obra).

Os dois primeiros são os mesmos que fazem o avanço responder 409.

**Prévias de show (`gig.previews`).** Para cada casa: `gigTypeId`, `label`,
`minFameLevel`, `available` (nível de fama suficiente), `expectedPerformance`
(o que a casa espera, ADR-0021), `fee`, `cost`, `net`, `fansGained` e
`happinessDelta`. Os valores saem de `evaluateGig` com o estado atual da banda e
variância 1. O show real sorteia a variância em `1 ± GIG_VARIANCE` de forma
uniforme, então a prévia é o valor central da faixa, não uma garantia. A prévia
não considera se o caixa cobre o custo; o cliente compara `cost` com
`forecast.balance`.

**Previsão (`forecast`).** Simula o tick sem gravar nada, com as mesmas funções
puras que o avanço usa:
- `royalties` e `royaltyPayouts`: `royaltyPayout` sobre as obras que ainda
  rendem (como `AccrueReleaseRoyaltiesUseCase`).
- `salaryRaises`: soma dos aumentos de `computeAutoRaises` com o caixa depois
  dos royalties, só quando o save tem `autoSalaryAdjust` e o caixa cobre a nova
  folha (como `AutoAdjustSalariesUseCase`). Zero caso contrário.
- `payroll`: folha devida depois dos aumentos (`computePayroll().totalDue`).
- `balanceAfter`: `balance + royalties - totalPaid`. Quando o caixa não cobre a
  folha, `computePayroll` paga só quem cabe, como no tick.
- `atRiskMemberIds`: quem ficaria com salário atrasado e continua na banda.
- `departingMemberIds`: quem sairia da banda por salário atrasado neste avanço.

O tick não tem outra fonte de dinheiro: eventos passivos não mexem no caixa e
eventos ativos só mexem quando o jogador os resolve. Por isso a previsão é
exata para o estado do momento; ela muda quando o jogador toca um show, faz uma
atividade, lança uma obra ou resolve um evento.

Organização no código:
- `PreviewGigsUseCase` (módulo `gigs`, exportado) calcula as prévias de show.
- `ForecastTurnUseCase` (módulo `turns`) calcula a previsão.
- `GetTurnPanelUseCase` (módulo `turns`) valida o dono, junta pendências,
  estúdio e atividade e chama os dois acima.
- `TurnsModule` passa a importar `GigsModule` e `ActivitiesModule`.

## Consequências

**Positivas**
- A tela de turno sai de uma chamada só, sem regra de jogo no cliente.
- Mudanças de balanceamento aparecem nas prévias sem mexer no frontend.
- O jogador vê antes do avanço quanto vai sobrar e quem fica sem salário.

**Negativas / trade-offs**
- O endpoint lê várias tabelas (banda, eventos, obras, sessões, shows,
  atividades) a cada chamada. O cliente deve invalidar o painel depois de cada
  ação do turno.
- A prévia de show mostra o valor central; o resultado real varia em
  `± GIG_VARIANCE` no desempenho.
- `departingMemberIds` é um campo a mais em relação ao relatório do avanço
  (ADR-0020), que só lista as saídas depois que acontecem.
