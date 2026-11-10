# 0032 — Clima da banda com peso nas escolhas

- **Status:** Proposta
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0017 — Confraternizações](0017-confraternizacoes.md),
  [0021 — Humor do show relativo à casa](0021-humor-do-show-relativo-a-casa.md),
  [0029 — Teto do convívio nas relações](0029-teto-do-convivio-nas-relacoes.md),
  [0031 — Eventos únicos por save](0031-eventos-unicos-por-save.md)

## Contexto

Numa partida real (1980 a 1992), o gráfico "Clima da banda" mostra o humor
médio chegando a 4,6 em dois anos e a relação média parando entre 2 e 2,5.
Depois disso, nenhuma escolha mexe nas duas linhas.

Uma revisão com simulação (semente 20261111, 300 a 400 partidas de 80 turnos
por perfil) mediu o peso das escolhas como a diferença entre um jogador que
sempre escolhe a melhor opção para o clima e um que sempre escolhe a pior. No
código atual, essa diferença no T26 é de **0,12 a 0,34 ponto de humor**, numa
escala de 10. As causas:

- **Eventos fracos.** Um evento converte `happinessChangePercent` em pontos com
  `× 5/100`, então "−8%" vira −0,4. A melhor e a pior opção diferem em 0,22 de
  humor na mediana do catálogo.
- **Nada volta.** Humor e relação só se acumulam até ±5. Entre T13 e T80, 66% a
  87% dos integrantes ficam com humor ≥ 4,5, conforme o perfil.
- **Ganho automático.** O salário pago dá +0,15 de humor a cada turno, sem
  decisão nenhuma. Um semestre de salário vale 70% da diferença típica entre
  duas opções de um evento.
- **Convívio como piso.** Com convívio todo turno, 99% dos pares ficam no teto
  de +3. Quem escolhe mal nos eventos volta a +3 no turno seguinte.
- **Sem risco.** Humor e relação ruins tiram no máximo 20% do show e 15% do
  disco, e ninguém sai da banda por isso.

## Decisão

O dono quer que o topo seja raro: quem escolhe bem fica entre +2 e +4, e o +5
só aparece em picos que caem sozinhos.

### 1. Eventos pesam três vezes mais no humor e o dobro na relação
- A conversão de `happinessChangePercent` passa de `× 5/100` para `× 15/100`
  (`consequence-resolver.ts`). Um "−8%" passa a valer −1,2.
- Toda mudança de relação vinda de um evento é multiplicada por 2 no
  resolvedor, sem reescrever os modelos.
- As duas regras valem para eventos ativos, tretas de convívio e as decisões de
  show e de convívio da ADR-0031.

### 2. O humor volta devagar ao neutro
- No avanço de turno, depois da folha, cada integrante perde 5% da distância
  entre o humor e 0.
- A relação não volta sozinha. Na simulação, essa regra apagou o efeito das
  escolhas: quem escolhia mal chegou a terminar melhor que quem escolhia bem.

### 3. Salário pago vale menos humor
- `SALARY_PAID_HAPPINESS_BONUS` passa de 0,15 para 0,05. As perdas por salário
  atrasado ou abaixo do alvo continuam como estão.

### 4. O convívio leva a relação até +2
- `ACTIVITY_RELATIONSHIP_CAP` passa de 3 para 2 (emenda à ADR-0029). De +3 a +5,
  a relação só vem de eventos.

### 5. Integrante infeliz sai da banda, e toda saída leva fãs
- Quem termina **dois avanços seguidos com humor ≤ −4** sai da banda no segundo
  avanço, depois da folha e da volta ao neutro.
- **Toda saída custa 10% dos fãs**, seja por humor, seja por salário atrasado
  (arredondado, nunca abaixo de 1). Duas saídas no mesmo avanço custam 10% e
  depois mais 10% do que sobrou.
- A saída fica no Arquivo de ex-integrantes com o motivo `humor`, ao lado de
  `salario_atrasado`.
- A previsão do turno avisa quem sai no próximo avanço, e o painel avisa quem
  está em humor ≤ −4, como já faz com o salário atrasado.

## Medição (cenário escolhido, com o evento em todo semestre da ADR-0031)

Diferença entre a melhor e a pior escolha no T26 (humor / relação):

| Perfil | Código atual | Esta ADR, sem saída |
|---|---|---|
| Equilibrado (convívio só com humor médio < 0) | 0,13 / 1,17 | 0,41 / 2,73 |
| Só shows | 0,34 / 1,53 | 2,40 / 3,83 |
| Social (1 convívio por turno) | 0,12 / 0,80 | 3,28 / 2,70 |

Saída por humor e fãs perdidos (400 partidas por perfil):

| Perfil | Partidas com saída por humor | Saídas por partida | Fãs perdidos (média) |
|---|---|---|---|
| Atento (convívio quando alguém chega a −2), escolhe bem | 5% | 0,06 | 11 |
| Atento, escolhe ao acaso | 17% | 0,18 | 249 |
| Atento, escolhe mal | 33% | 0,45 | 1.105 |
| Descuidado (convívio só com média < 0), escolhe bem | 59% | 0,80 | 9.955 |
| Descuidado, escolhe mal | 83% | 1,41 | 24.478 |

## Consequências

- O humor do jogador atento no T26 cai de ~4,8 para ~2,5, e o +5 vira pico.
- O descuido com o humor ou com o salário passa a custar integrantes e fãs. O jogador precisa
  olhar o painel e reagir com convívio ou com as escolhas dos eventos.
- Os eventos ficam com efeitos maiores sem mudar os textos.
- A previsão do turno passa a calcular a volta ao neutro e a saída por humor.
  Por isso, as duas regras vivem em funções puras usadas pelo tick e pela
  previsão.
- O perfil equilibrado simulado, que quase não faz convívio e toca sempre na
  maior casa, continua com pouca diferença de humor (0,41). Para ele, o peso
  vem da decisão de show da ADR-0031.
