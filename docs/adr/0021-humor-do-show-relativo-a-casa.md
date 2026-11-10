# 0021 — Humor do show relativo ao que a casa espera

- **Status:** Aceita
- **Data:** 2026-11-09
- **Decisores:** Equipe de backend
- **Relacionada:** [0016 — Shows ao vivo](0016-shows-ao-vivo.md),
  [0017 — Confraternizações](0017-confraternizacoes.md)

## Contexto

A revisão de fluidez (`/tycoon-review fluidez`) mostrou que todo show piorava o
humor da banda, em qualquer fase. A fórmula era
`-desgaste + (desempenho - 0,5) × 0,6`, mas o desempenho real fica entre 0,13 e
0,42 a partida inteira: `stageSkill` faz a média dos 5 instrumentos de cada
integrante, e ninguém é bom em todos. O ponto em que o show deixava de custar
humor (0,5) era inalcançável.

Na simulação (perfil equilibrado, 1.000 partidas, 52 turnos), cada show custava
de −0,35 a −0,62 de humor, e foi preciso um jantar em 42,5 dos 52 turnos para
compensar. No jogo pela API, foram 10 jantares em 14 turnos. O desempenho quase
não variava dentro de uma fase (p10 a p90 em torno de ±0,04), então show bom e
show ruim praticamente não existiam.

O dono do jogo definiu a intenção: **só show ruim cansa**. Show medíocre é
neutro e show bom anima.

## Decisão

1. **Cada casa declara o desempenho que espera** (`GigType.expectedPerformance`).
   Desempenho igual ao esperado é um show medíocre.
2. **O bônus mede a distância até a expectativa:**
   `humor = -desgaste + (desempenho - esperado) × 3`. `GIG_TRIUMPH_SWING` passa de
   0,6 para 3, para que a diferença entre show bom e ruim seja perceptível.
3. **O desgaste cai para 30% do valor anterior.** Ele continua existindo porque,
   sem ele, o bônus de salário (+0,15 por turno) leva o humor ao teto (5) e o
   humor deixa de importar.

| Casa | Desgaste antes → depois | Desempenho esperado |
|---|---|---|
| covers | 0,15 → 0,045 | 0,15 |
| bar | 0,10 → 0,03 | 0,15 |
| pub | 0,20 → 0,06 | 0,18 |
| casa de shows | 0,30 → 0,09 | 0,25 |
| festival | 0,50 → 0,15 | 0,35 |

As expectativas seguem o desempenho típico da fase em que cada casa é liberada.
Uma banda que acabou de liberar uma casa grande ainda está abaixo do que ela
espera, e o show cansa. Isso cria uma escolha entre dinheiro e fãs (casa maior)
e humor (casa do seu nível).

O campo `expectedPerformance` sai em `GET /gigs/types`, e o cliente pode
mostrá-lo como prévia antes do show.

## Resultado medido

Simulação com o código final (perfil equilibrado, 1.000 partidas, 52 turnos):

| Métrica | Antes | Depois |
|---|---|---|
| Δ humor no covers, p10 / p50 / p90 | −0,35 em todo show | −0,12 / −0,01 / +0,10 |
| Δ humor na casa de shows logo após liberar (T6–T15, p50) | −0,49 | −0,25 |
| Jantares em 52 turnos | 42,5 | 6,6 |
| Humor médio no T26 / T52 | 0,25 / 0,15 | 1,23 / 4,00 |
| Fãs no T52 (mediana) | 273 mil | 324 mil |
| Qualidade mediana das obras | 56 | 59 |

Também foram testados: sem desgaste (o humor chega ao teto no T52), desgaste a
50% (11,4 jantares) e expectativas mais baixas para as casas grandes (o humor
chega ao teto no T52).

## Consequências

**Positivas**
- Show medíocre fica neutro, e a diferença entre show bom e ruim é perceptível.
- O jantar deixa de ser tarefa obrigatória a cada turno.
- Escolher a casa vira uma decisão: subir de nível cedo custa humor.

**Negativas / trade-offs**
- Banda mais feliz toca e grava melhor: +19% de fãs no T52. A economia já
  inflacionava, e o dono do jogo aceitou o dinheiro como placar no fim da
  partida.
- No festival, a banda média fica abaixo do esperado até o fim (Δ humor p50 de
  −0,19 no T31–T52), então ele continua cansativo. É coerente com o texto da
  casa ("Exaustivo — e transformador").
- A causa estrutural fica para depois: `stageSkill` deveria pesar o instrumento
  de cada integrante, e não a média dos 5. Corrigir isso muda cachê e fãs, e
  exige uma nova simulação de economia.
