# 0033 — Data de cada turno

- **Status:** Aceita
- **Data:** 2026-11-13
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0006 — Turnos](0006-turnos.md),
  [0024 — Notícias da cena por época](0024-noticias-da-cena-por-epoca.md),
  [0026 — Tom de voz dos textos](0026-tom-de-voz-dos-textos.md)

## Contexto

Cada turno é meio ano (ADR-0006), e o jogo escrevia o período como
"2003 - 2º semestre" no backend e "2003 · 2º semestre" no frontend. O dono quer
que a passagem do tempo pareça natural, com uma data de verdade, sem expressões
genéricas como "1º semestre". Os textos que falavam em "semestre" como duração
tinham o mesmo problema.

## Decisão

### 1. Cada turno cai num dia do calendário
- O primeiro turno de um ano cai num dia entre **1º de janeiro e 31 de julho**.
- O segundo turno cai num dia entre **1º de agosto e 31 de dezembro**.
- Assim a data sempre avança de um turno para o outro.

### 2. O dia é sorteado por banda, sem gravar nada
- O dia sai de um hash FNV-1a de `id da banda | turno`, dentro da faixa do
  turno, considerando ano bissexto.
- O mesmo save mostra sempre a mesma data, e saves diferentes têm calendários
  diferentes. Não há migration nem coluna nova.
- A função existe no backend (`turns/domain/calendar/turn-date.calculator.ts`)
  e uma cópia idêntica no frontend (`utils/period.ts`). As duas compartilham
  vetores de teste, para que nunca divirjam.

### 3. Duas formas de escrever
- **Por extenso**, no cabeçalho, nas manchetes e nos encartes:
  "14 de setembro de 1995".
- **Abreviada**, em listas e legendas: "14 set. 1995".
- O primeiro dia do mês é escrito "1º".

### 4. "Semestre" sai dos textos
- Os rótulos de período passam a ser datas.
- Os textos que usavam "semestre" como duração passam a falar em meses ou anos,
  **sempre de forma aproximada**: como o dia de cada turno é sorteado, a
  distância entre dois turnos varia, e "seis meses depois" estaria errado. Os
  textos usam "alguns meses", "os meses seguintes", "meses", "cerca de um ano".
  A saída por salário atrasado conta o tempo do mesmo jeito: "alguns meses",
  "cerca de um ano", "mais de um ano", "cerca de dois anos".
- Prazos que pertencem à história, e não ao relógio do jogo, podem ser exatos
  ("seis meses de estrada", "seis meses para buscar o violão").

## Consequências

- O campo `period` das views de turno, do painel e do avanço passa a trazer a
  data por extenso.
- Tudo o que acontece num turno (show, convívio, lançamento, notícia) mostra a
  mesma data.
- Mudar a fórmula do hash muda as datas de todos os saves já existentes. Os
  vetores de teste existem para impedir que isso aconteça por acidente.
- Textos novos não devem usar "semestre"; o turno é contado em meses ou anos.
