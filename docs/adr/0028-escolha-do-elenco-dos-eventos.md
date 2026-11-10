# 0028 — Escolha do elenco dos eventos ativos

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0017 — Confraternizações](0017-confraternizacoes.md),
  [0025 — Cobertura mínima de eventos ativos](0025-cobertura-minima-de-eventos-ativos.md)

## Contexto

O gerador herdado do frontend separava os pares com relação 0 ou menor e, se
houvesse algum, sorteava **só entre eles**, qualquer que fosse o tipo do evento.
Numa partida real (banda de 5 integrantes, 10 pares), 9 pares estavam com
relação 4 ou 5 e só um estava em −5. Esse par recebeu todos os eventos de dupla:
brigas, oportunidades e decisões criativas. Como quase toda briga piora a
relação, o par continuava sendo o único hostil, e o ciclo se fechava.

## Decisão

Todo par que cumpre as exigências do modelo (traços, posições e faixa de
relação, ADR-0004 §8) entra no sorteio, com um peso:

- **Peso base 1.**
- **Briga entre integrantes** (`conflito_membros`): cada ponto de hostilidade
  (relação abaixo de 0) soma 1 ao peso (`HOSTILITY_WEIGHT_PER_LEVEL`). Um par em
  −5 pesa 6.
- **Outros tipos** (oportunidade externa, decisão criativa, genéricos): todos os
  pares pesam igual.
- **Rodízio:** cada integrante que esteve no evento anterior da banda multiplica
  o peso por 0,5 (`RECENT_INVOLVEMENT_FACTOR`). O mesmo par duas vezes seguidas
  pesa um quarto. Vale também para eventos solo.

Na banda do contexto, o par em −5 passa a receber cerca de 40% das brigas
(6 de 15) e 10% dos outros eventos de dupla. Logo depois de aparecer, cai para
cerca de 20% das brigas.

Ficam como estão:
- a treta de confraternização, que cai no par mais hostil **entre os
  convidados** (ADR-0017 §3): quem levou os dois sabia do risco;
- o conflito de visão no estúdio, que só existe entre creditados com relação
  negativa.

## Consequências

- O evento passa a circular pela banda, e um par brigado deixa de monopolizar a
  história.
- Uma banda sem nenhum par hostil continua recebendo brigas: o sorteio pega
  qualquer par, como já acontecia quando não havia par problemático.
- O caso de uso lê o último evento da banda para o rodízio
  (`findByBandId`, do mais novo para o mais antigo).
