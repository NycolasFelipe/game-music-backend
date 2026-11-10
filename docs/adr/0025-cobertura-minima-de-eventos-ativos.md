# 0025 — Cobertura mínima de eventos ativos por fase de fama

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0006 — Turnos](0006-turnos.md), [0007 — Fama](0007-fama.md),
  [0017 — Confraternizações](0017-confraternizacoes.md)

## Contexto

O avanço de turno sorteia um evento ativo com 35% de chance
(`ACTIVE_EVENT_CHANCE`). O catálogo tem 5 modelos sorteáveis, e quase todos
exigem um traço de personalidade ou uma faixa de relação entre o par. Quando
nenhum modelo cabe na banda, o turno passa sem evento. Uma simulação com os
geradores do jogo (4.000 bandas aleatórias por faixa de fãs) mostrou:

| Fãs | Média de modelos possíveis | Bandas sem nenhum |
|---|---|---|
| 0–150 | 0,6 a 1,0 | 20–38% |
| 151–10.000 | 0,4 (só o 0001, que exige `plagiarist`) | 58% |
| 10.001–2.000.000 | 1,0 | 24% |
| acima de 2.000.000 | 2,0 | 0% |

Além disso, um modelo que saiu fica bloqueado por 3 anos (6 turnos). Na
prática, a chance real de evento cai para cerca de 10% por turno. As duas
bandas do banco local avançaram 12 turnos e não receberam nenhum evento ativo.

Uma segunda simulação (semente 424242, 800 partidas por perfil, 80 turnos,
reaproveitando as funções puras de lançamento, show, salário e fama) mediu
quanto tempo cada fase dura:

| Fase | Jogador equilibrado (show + lançamento) | Só shows |
|---|---|---|
| Garagem (0–150 fãs) | 3 turnos | 17 |
| Bares (151–2.000) | 3 turnos | 23 a 31 |
| Casas (2.001–100.000) | ~34 turnos (T6 a T40) | começa em T48 |
| Nacional (100.001–2.000.000) | ~42 turnos (T40 a T80) | não chega |
| Estrelas (acima de 2.000.000) | nenhuma partida chega em 80 turnos | não chega |

## Decisão

### 1. Parâmetros de design

- A chance de evento ativo continua em **35% por turno**. Com o catálogo
  completo, o jogador equilibrado vê cerca de 28 decisões em 80 turnos (hoje,
  cerca de 8).
- Uma partida típica dura **80 turnos (40 anos)**.

### 2. Fases e metas

As fases seguem os níveis de fama que liberam novos shows (3, 7 e 12). A meta
é o número de eventos esperados na fase (0,35 × turnos na fase, arredondado),
com piso de 6, que cobre o bloqueio de 6 turnos. Para a garagem e os bares
vale a duração do jogador que só faz show, que é o caso mais longo.

| Fase | Fãs | Níveis de fama | Duração usada | Meta de modelos universais |
|---|---|---|---|---|
| Garagem | 0–150 | 0–2 | 17 turnos | 6 |
| Bares | 151–2.000 | 3–6 | 23 turnos | 8 |
| Casas | 2.001–100.000 | 7–11 | 34 turnos | 12 |
| Nacional | 100.001–2.000.000 | 12–15 | 42 turnos | 15 |

A fase Estrelas (acima de 2 milhões) fica sem meta enquanto for inalcançável em
80 turnos.

### 3. O que conta como modelo universal

Um modelo conta para a meta quando qualquer banda pode recebê-lo:

- é sorteável (não é `confraternizacao`);
- não exige traço da banda, dos envolvidos nem de posição;
- se envolve um par, não limita a relação a menos que a escala inteira
  (−5 a 5); num modelo solo, o gerador ignora esse limite;
- tem pelo menos uma opção visível sem exigência de traço;
- vale em todos os anos que uma partida alcança (1960 a 2050).

Modelos com traço ou relação continuam bem-vindos, mas não contam para a meta.
Eles dependem da formação, e a frequência dos traços muda se a raridade
declarada passar a valer no gerador de integrantes (hoje ela é ignorada).

### 4. Composição de cada fase

Entre os modelos universais de cada fase, devem existir:

- pelo menos **2 solo** (`requiredCharacters: 1`), para bandas que encolheram
  com saídas;
- pelo menos **2 de cada categoria sorteada** (`conflito_membros`,
  `oportunidade_externa`, `decisao_criativa`). Modelos genéricos (`type: ""`)
  contam no total, mas não em nenhuma categoria.

Para usar os traços que não aparecem em nenhum evento, prefira opções com
`visibleIf*` dentro de modelos universais, em vez de modelos inteiros que
exigem o traço.

### 5. Teste de cobertura

`src/modules/events/domain/data/active-event-templates.spec.ts` confere as
metas. Para cada fase, ele procura o pior ponto (faixa de fãs × ano) e conta
os modelos universais possíveis ali, de modo que modelos com faixas parciais
também contam. Cada fase tem um campo `enforced`: ela começa pulada e é ligada
quando atinge a meta, para que o catálogo nunca mais fique abaixo dela.

## Consequências

- Faltam 41 modelos universais (6 + 8 + 12 + 15). Um modelo que vale para
  várias fases conta em todas, ao custo de textos menos específicos.
- O ritmo do jogo muda: na fase de casas, os eventos passam de 1 a cada 10
  turnos para 1 a cada 3.
- O Roubo do Microfone (0002), único modelo universal de hoje, exige mais de 2
  milhões de fãs e não é visto em 80 turnos. Baixar o mínimo dele é uma decisão
  à parte.
- As notícias da cena (eventos passivos) ficam fora desta ADR, porque dependem
  do ano e não da fama.
