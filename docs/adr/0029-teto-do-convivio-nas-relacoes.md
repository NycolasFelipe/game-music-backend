# 0029 — Teto do convívio nas relações

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0017 — Confraternizações](0017-confraternizacoes.md),
  [0025 — Cobertura mínima de eventos ativos](0025-cobertura-minima-de-eventos-ativos.md),
  [0028 — Escolha do elenco dos eventos ativos](0028-escolha-do-elenco-dos-eventos.md)

## Contexto

Na partida real da Solitary Mist, a relação média subiu de 0,7 para 4,1 em 16
turnos, e 9 dos 10 pares terminaram em +4 ou +5. Uma simulação com os geradores
do jogo (semente 20261110, 800 partidas de 80 turnos por perfil) reproduziu o
quadro e mostrou a causa.

Uma confraternização dá o ganho a **todos os pares** de convidados de uma vez. Um
jantar com 5 pessoas soma +10 pontos de relação, e uma viagem soma +20. Um evento
mexe em um par, cerca de meio ponto em média. Para quem faz convívio em 1 de cada
3 turnos:

| | T20 | T40 | T80 |
|---|---|---|---|
| Relação média | 4,4 | 4,8 | 4,8 |
| Pares em +4/+5 | 85% | 96% | 96% |

Numa partida, o convívio soma +57 pontos e os eventos tiram 16. Só 4% das brigas
caem num par com relação negativa, então o peso por hostilidade da ADR-0028 quase
nunca age. Três modelos alcançáveis exigem relação de no máximo 3 ou 0 (0001,
0003 e 0004) e somem do sorteio.

## Decisão

Uma confraternização leva um par **até +3** (`ACTIVITY_RELATIONSHIP_CAP`, em
`activity.constant.ts`). Os níveis +4 e +5 só vêm de eventos.

- O ganho para no teto: um par em +2 numa viagem (+2) vai a +3.
- Um par que os eventos já levaram acima de +3 **fica onde está**. A noite não
  esfria uma amizade.
- Pares negativos sobem normalmente. A terapia continua sendo a que mais conserta.
- A API devolve o teto em `relationshipCap` na lista de atividades, e o seletor
  mostra "relação +2 (até +3)".

Com o teto, o mesmo perfil fica assim na simulação:

| | T20 | T40 | T80 |
|---|---|---|---|
| Relação média | 2,9 | 3,3 | 3,4 |
| Pares em +4/+5 | 16% | 30% | 38% |

Também foi testado um desgaste de 25% de chance por turno de −1 nos pares acima
de +1. Ele deixou 56% dos pares em +4/+5 no T40 e fazia o jogador perder relação
sem ver por quê. O teto ficou por ser visível na hora da escolha.

## Consequências

- A química do disco (ADR-0014) para de dar o bônus máximo de graça: com média
  3,3, o ganho é de cerca de +8%, e não +12%.
- O convívio continua consertando pares ruins, e o dinheiro deixa de comprar a
  amizade máxima.
- A briga em par negativo continua rara (4% das brigas). Trazer pares hostis de
  volta exige que os eventos derrubem mais as relações, e isso é uma decisão à
  parte.
- No mesmo trabalho, o gerador passou a tirar os modelos recentes antes do
  sorteio, e não depois. A simulação não mostrou diferença no ritmo: são 28
  eventos em 80 turnos nas duas formas, e o sorteio de 35% sempre acha modelo.
  A mudança tirou uma falha intermitente de um teste, que deixava 1 modelo livre
  entre 46.
