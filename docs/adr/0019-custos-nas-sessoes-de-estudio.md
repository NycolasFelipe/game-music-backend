# 0019 — Custos nas sessões de estúdio e primeiro disco viável

- **Status:** Aceita
- **Data:** 2026-11-09
- **Decisores:** Equipe de backend
- **Relacionada:** [0008 — Obras musicais](0008-obras-musicais.md),
  [0015 — Tempo de produção e saturação](0015-tempo-de-producao-e-saturacao.md)

## Contexto

O primeiro raio-x do jogo (`/tycoon-review completo`, simulação Monte Carlo com
1.000 partidas por perfil) encontrou dois problemas nas obras:

1. **Sessões de estúdio com resposta certa.** Toda sessão tinha uma opção que
   dominava as outras, sem custo nenhum:
   - perfeccionismo: caprichar ×1,08 contra ×0,99;
   - preguiça: insistir ×1,02 contra ×0,93;
   - conflito de visão: escolher um lado ×1,04 contra ×0,97 do meio-termo.

   Nas ideias malucas, o valor esperado de "topar" ficava abaixo de 1 em 4 dos 5
   traços (criativo 0,95; experimental 0,94; visionário 0,98; errático 0,92). Topar
   era uma armadilha. Os textos das opções já prometiam custos ("Cortar a sessão
   frustra o perfeccionista", "Contrariar a preguiça custa"), mas o código não os
   aplicava.
2. **O primeiro disco fracassava sempre.** A banda nasce com habilidades entre
   0 e 3, e a qualidade típica da primeira obra é cerca de 27. A faixa
   "medíocre" começava em 35, então 96% a 100% dos primeiros lançamentos eram
   "fracasso", em qualquer estilo de jogo. O primeiro lançamento "sólido" só saía
   por volta do turno 25.

## Decisão

### 1. Cada opção paga o que o texto promete

As opções ganham um campo `cost` (`CreationEventCost`), separado do efeito na
qualidade e guardado no mesmo JSON das opções, sem migration. O custo é cobrado
quando o jogador resolve a sessão.

| Sessão | Opção | Qualidade | Custo |
|---|---|---|---|
| Perfeccionismo | Deixar caprichar | ×1,25 (era ×1,08) | +1 turno de produção |
| Perfeccionismo | "Tá bom assim" | ×0,99 | Humor do perfeccionista −1 |
| Preguiça | Insistir no capricho | ×1,02 | Humor do preguiçoso −2 |
| Preguiça | Cortar caminho | ×0,98 (era ×0,93) | Nenhum |
| Conflito de visão | Ficar com um lado | ×1,04 | Humor de quem perdeu −1 e relação do par −1 |
| Conflito de visão | Meio-termo | ×0,97 | Nenhum |

As constantes ficam em `release.constant.ts` (`STUDIO_EXTRA_TAKES_TURNS`,
`OVERRULED_HAPPINESS_PENALTY`, `LAZY_INSIST_HAPPINESS_PENALTY`,
`VISION_CONFLICT_RELATIONSHIP_PENALTY`). A
conversão do custo em mudanças da banda é uma função pura
(`domain/creation/creation-cost.calculator.ts`). Integrantes que saíram desde a
abertura da sessão são ignorados.

O turno extra não cria repetição: cada tipo de sessão aparece no máximo uma vez
por obra (`excludeKinds`, ADR-0015 §3).

### 2. Ideias malucas com valor esperado perto de 1

A chance de sucesso foi ajustada para que topar seja uma aposta na variância, e
não uma perda esperada:

| Traço | Chance antes → depois | Valor esperado antes → depois |
|---|---|---|
| criativo | 0,30 → 0,45 | 0,95 → 1,00 |
| experimental | 0,25 → 0,42 | 0,94 → 1,00 |
| visionário | 0,35 → 0,41 | 0,98 → 1,00 |
| errático | 0,30 → 0,55 | 0,92 → 1,00 |
| gênio | 0,50 (sem mudança) | 1,05 |

### 3. Faixa medíocre começa em 25

`quality-tiers.ts`: o mínimo da faixa "medíocre" passa de 35 para 25. Uma banda
recém-formada consegue tirar o primeiro disco do fracasso com boas escolhas.
Na simulação, a banda que só grava, sem shows, passou a sobreviver em 82% das
partidas, contra 6% antes.

### 4. Calibração medida

Os valores da tabela do §1 saíram de uma simulação pareada: a mesma banda e a
mesma semente jogam 52 turnos no perfil equilibrado, uma vez sempre com a
opção "boa" e outra sempre com a "barata". A tabela compara só as partidas em
que a sessão apareceu.

| Sessão | Primeira versão | Fãs no T52 | Boa vence em | Valores finais | Fãs no T52 | Boa vence em |
|---|---|---|---|---|---|---|
| Perfeccionismo | ×1,08, +1 turno | −27% | 3% | ×1,25, +1 turno | −1,8% (±1,7) | 44% |
| Preguiça | cortar ×0,93, humor −1 | +12,5% | 91% | cortar ×0,98, humor −2 | +3,3% (±0,8) | 58% |
| Conflito de visão | ×1,04 / ×0,97, humor −1, relação −1 | +0,5% | 41% | sem mudança | +0,3% (±0,9) | 43% |

O turno extra pesa muito porque a banda encadeia obras: caprichar sempre corta
cerca de 4,8 lançamentos em 52 turnos. Com ×1,25, caprichar perde cerca de 20%
de fãs no T26 e empata no T52. É uma aposta de longo prazo. As políticas fixas
exageram as diferenças, porque um jogador real escolhe caso a caso.

## Consequências

**Positivas**
- As sessões de estúdio viram escolhas: qualidade contra tempo, humor ou
  relacionamento.
- Os textos das opções passam a dizer a verdade.
- O começo da partida tem uma primeira vitória possível.

**Negativas / trade-offs**
- O humor pesa pouco na qualidade (`HAPPINESS_QUALITY_WEIGHT = 0,15`): −1 de
  humor num integrante de 4 creditados custa cerca de 0,75% na obra. Por isso a
  preguiça precisou de penalidade maior (−2) e de uma opção barata menos ruim
  (×0,98).
- ×1,25 numa única sessão é um salto grande de qualidade: pode levar uma obra
  de "sólido" a "grande".
- A inflação de dinheiro acelera um pouco (saldo mediano no turno 52: 887 mil
  → 957 mil no perfil equilibrado). O dono do jogo decidiu que, no fim da
  partida, o dinheiro vira placar, então isso é aceito.
- O frontend não mostra o custo de forma estruturada, só nos textos das opções.
  As probabilidades e os custos continuam escondidos do cliente
  (`CreationEventOptionView`).
