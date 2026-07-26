# 0015 — Tempo de produção e saturação de mercado

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0006 — Turnos](0006-turnos.md),
  [0008 — Obras musicais](0008-obras-musicais.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md),
  [0011 — Crítica e público](0011-critica-e-publico.md)
- **Emenda:** altera o tick do ADR-0006 §6 e o ciclo de vida da obra do ADR-0008.

## Contexto

Um turno vale meio ano (`TURN_STEP = 0.5`), então cada ano tem dois turnos. A
obra hoje tem duas travas — **um rascunho por vez** e o turno **se recusa a
avançar** com um rascunho aberto — cujo efeito combinado é o oposto do que
aparentam: o jogo **obriga** a obra a nascer e morrer dentro do mesmo turno.

Nada limita **quantas** obras são finalizadas nesse intervalo: inicia, resolve as
sessões, lança, inicia de novo. O único freio é o caixa. Como cada lançamento
abre uma cauda de royalties de seis turnos (ADR-0008 §8), as caudas se empilham e
a jogada ótima vira **encher o turno de singles até o dinheiro acabar**.

O diagnóstico de fundo: **gravar é a única ação grande do jogo que não consome
tempo** — só dinheiro. O relógio do jogo não tem nenhuma relação com obras.

## Decisão

### 1. Produção consome turnos
Cada formato ganha um **tempo de produção** (em turnos), no catálogo:

| formato | Single | EP | Acústico | Ao vivo | LP | Álbum |
|---|---|---|---|---|---|---|
| turnos | 1 | 2 | 2 | 2 | 3 | 3 |

O rascunho nasce com `production_turns_left` = tempo do formato e **atravessa os
turnos**: cada `AdvanceTurn` desconta um. A obra só pode ser **lançada** quando
chega a zero.

O limite de obras por ano deixa de ser um número arbitrário e vira consequência:
com dois turnos por ano, ou saem dois singles, ou sai um EP, ou um álbum ocupa um
ano e meio. E o botão de avançar turno passa a significar algo para a
discografia, o que hoje não acontece.

Rejeitado o **teto rígido** ("N obras por ano"): entrega o mesmo limite sem
nenhuma razão de mundo, e vira parede em vez de decisão.

### 2. O turno deixa de barrar o rascunho — barra a **sessão pendente**
A regra "termine ou descarte a obra antes de avançar" se inverte: avançar o turno
é **como a gravação progride**. No lugar dela fica a regra irmã da dos eventos
ativos (ADR-0004): não se avança com uma **decisão de estúdio pendente** — a
banda está esperando o produtor. Assim as sessões não se acumulam.

### 3. As sessões de criação se espalham pela produção
Os eventos de criação deixam de ser gerados todos no início: nasce **uma sessão
por turno de produção**. A primeira sai ao iniciar a obra; cada turno seguinte
gera a próxima, enquanto ainda houver produção pela frente. O número de decisões
passa a **escalar com o porte da obra** (single 1, EP 2, álbum 3) em vez do teto
fixo de 3 para todo mundo.

Efeito colateral desejado: cada sessão é gerada com a banda **do momento** —
humor, relacionamentos e elenco podem ter mudado desde o início da gravação. Um
álbum longo é uma história que atravessa o ano.

### 4. Salários e eventos correm durante a produção
Nada é suspenso enquanto a banda grava: a folha (ADR-0010) é paga, os eventos
passivos e ativos acontecem, e um integrante pode até **sair por inadimplência no
meio da gravação** (os créditos dele passam a contar zero, como já acontece).
Um álbum de três turnos é uma aposta que precisa sobreviver a três folhas de
pagamento — é essa a tensão que o tempo de produção adiciona.

### 5. Saturação de mercado
A partir da **segunda obra lançada no mesmo ano civil**, o resultado comercial
cai:

```
SATURATION_FACTORS = [1, 0.6, 0.35, 0.2]   // índice = obras já lançadas no ano
```

O fator multiplica os **fãs ganhos** e as **duas receitas** (master e
publishing) — não a `quality`: a obra é tão boa quanto é, o que muda é o quanto o
mercado ainda tem apetite por ela. Inundar o mercado desvaloriza cada trabalho.

Com o tempo de produção do §1 a saturação quase só morde o **segundo single do
ano**, que é exatamente o caso que queríamos desencorajar sem proibir.

Rejeitado penalizar também **crítica e público** (ADR-0011): a crítica julga a
obra, não o calendário de lançamentos — e como aqueles escores são
informativos, o desconto seria cosmético.

### 6. O custo continua sendo cobrado no lançamento
Não mudamos o momento do débito (ADR-0008 §8): a produção não cobra nada
enquanto corre. Cobrar no início seria mais realista e aumentaria a tensão, mas
exigiria redesenhar o descarte (reembolso? custo afundado?) e mexer na economia
— fica como candidato a um ADR próprio. A pressão financeira durante a gravação
já existe pela folha (§4).

## Persistência
- `releases.production_turns_left` (`smallint not null default 0`) — migration
  `AddProductionTurnsToReleases`. Rascunhos que já existiam ficam com **0**
  (prontos para lançar): não havia produção pendente na regra antiga.

## Endpoints
Nenhum endpoint novo. A `ReleaseView` passa a expor `productionTurnsLeft`, e
`AdvanceTurnView` traz o andamento da gravação do turno (`production`).

## Alternativas consideradas
- **Teto rígido de obras por ano:** rejeitado (§1).
- **Saturação sozinha, sem tempo de produção:** rejeitada como solução única —
  resolveria o exploit econômico, mas manteria a obra como ação instantânea e o
  turno sem relação com a discografia.
- **Todas as sessões no início (como hoje), só com o lançamento travado pelo
  tempo:** rejeitado — a espera viraria tempo morto; espalhar as sessões é o que
  transforma a produção em jogo.
- **Desgaste de humor por obra:** adiado — o orgulho/frustração do ADR-0012 já
  mexe no humor; mais atrito só se o playtest pedir.
- **Custo cobrado no início da produção:** adiado (§6).

## Consequências

**Positivas**
- Fecha o exploit de encher o turno de lançamentos, sem proibir nada.
- O relógio do jogo passa a governar a discografia; avançar turno vira parte do
  processo criativo.
- Nasce a decisão do ano: **um disco grande ou duas apostas rápidas?**
- Substrato para contratos com gravadora (ADR-0009, pendente): "dois álbuns em
  três anos" só faz sentido se produzir custar tempo.
- Obras longas ficam mais interessantes: mais sessões, geradas com a banda como
  ela está em cada turno.

**Negativas / trade-offs**
- O ciclo fica mais lento — é o objetivo, mas exige rebalancear a economia inicial
  (o item 5 do backlog, shows ao vivo, ganha urgência como renda de base).
- Tempos por formato e curva de saturação são **chutes de balanceamento**;
  entram como constantes versionadas.
- O jogador precisa voltar à obra a cada turno para resolver a sessão; mitigado
  pela regra do §2 (o turno avisa e não deixa passar batido).
- Um álbum de três turnos pode ser interrompido por saídas de integrantes (§4) —
  intencional, mas frustrante se o balanceamento de salários estiver apertado.

## Referências
- Implementação: [src/modules/releases/](../../src/modules/releases/)
  (`start-release`, `advance-release-production`, `finalize-release`,
  calculadora) e [src/modules/turns/](../../src/modules/turns/) (tick).
- Migration: `src/database/migrations/*-AddProductionTurnsToReleases.ts`.
