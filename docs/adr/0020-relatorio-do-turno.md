# 0020 — Relatório do turno (dinheiro e fãs explicados)

- **Status:** Aceita
- **Data:** 2026-11-09
- **Decisores:** Equipe de backend
- **Relacionada:** [0006 — Turnos](0006-turnos.md),
  [0008 — Obras musicais](0008-obras-musicais.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md)

## Contexto

A revisão de fluidez (`/tycoon-review fluidez`) jogou 14 turnos pela API. Em 12
deles, o saldo variou durante o avanço por valores que a resposta não
explicava: de 853 a 5.873 num turno, até 9 vezes a folha daquele turno. A causa
são os royalties. O tick calcula e credita os royalties (ADR-0008 §8), mas a
resposta de `POST /bands/:bandId/turns/advance` só trazia a folha, os reajustes,
a produção, os eventos e as saídas.

Os royalties são a principal fonte de renda depois dos primeiros turnos. Sem
eles na resposta, o jogador não consegue responder "estou ganhando ou perdendo
dinheiro?" nem ligar um lançamento ao dinheiro que ele rende. O frontend atual
será reconstruído, então a correção precisa estar no contrato do backend.

## Decisão

A resposta do avanço ganha o campo `report` (`TurnReportView`):

| Campo | Significado |
|---|---|
| `balanceBefore` | Caixa quando o jogador avançou, depois das ações do turno e antes do tick |
| `royalties` | Total de royalties creditado pelo tick |
| `royaltyPayouts` | Um item por obra que pagou: `releaseId`, `title`, `amount`, `turnsLeft` (parcelas que faltam) e `remaining` (valor que falta) |
| `salariesPaid` | Folha paga pelo tick |
| `balanceAfter` | Caixa depois do tick |
| `fanCount` | Fãs depois do tick (o tick não muda fãs) |
| `sinceLastTurn` | `balanceDelta` e `fanCountDelta` desde o fechamento do turno anterior, ou `null` no primeiro turno |

O tick obedece a `balanceAfter = balanceBefore + royalties - salariesPaid`.

`sinceLastTurn` compara com o snapshot do turno anterior (`balanceSnapshot` e
`fanCountSnapshot`), então inclui tudo o que o jogador fez no turno: shows,
lançamentos, atividades e eventos. Turnos antigos sem `balanceSnapshot` dão
`null`.

Mudanças de apoio:
- `AccrueReleaseRoyaltiesUseCase` devolve `RoyaltyAccrualView` (`total` e
  `payouts`) em vez de só o número.
- `TurnsRepository.findLatestByBandId` busca o turno anterior antes de gravar o
  novo.

## Consequências

**Positivas**
- A variação de caixa do tick passa a ser explicada por completo.
- O cliente pode mostrar entradas e saídas do turno e a cauda de royalties de
  cada obra sem fazer outras chamadas.

**Negativas / trade-offs**
- Uma consulta a mais por avanço (o turno anterior).
- O relatório explica o tick, mas não detalha as ações do turno uma a uma.
  `sinceLastTurn` dá o total; o detalhamento por show, lançamento e atividade
  continua nas respostas de cada ação.
