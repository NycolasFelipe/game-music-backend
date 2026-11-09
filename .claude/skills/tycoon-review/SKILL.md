---
name: tycoon-review
description: "Análise crítica do game-music (tycoon de banda por turnos): economia, progressão, qualidade das decisões, aleatoriedade e fluidez do turno, com números tirados do código e simulação Monte Carlo opcional. Use ao revisar ou propor mudanças de mecânica, balanceamento, ritmo ou experiência do turno. Argumento opcional: economia | progressao | decisoes | fluidez | simular | completo, ou o nome de um sistema (salarios, lancamentos, shows, atividades, eventos)."
argument-hint: "[economia|progressao|decisoes|fluidez|simular|completo|<sistema>]"
user-invocable: true
---

# /tycoon-review

Revisão crítica das mecânicas do game-music. O objetivo é encontrar
problemas com evidência, não aprovar o que existe.

## Antes de começar

1. Leia `references/mapa-do-jogo.md` (onde ficam fórmulas, constantes e
   telas) e `references/criterios.md` (métricas e protocolo anti-bajulação).
   Para o modo `fluidez`, leia também `references/fluidez.md`. Para o modo
   `simular`, leia `references/simulacao.md`.
2. Localize os repositórios. O backend é a pasta com
   `src/modules/turns`; o frontend é a pasta irmã `game-music-frontend`.
3. O mapa é um retrato antigo. Abra os arquivos citados e confirme os
   valores que for usar. Se algo mudou, use o código e liste as divergências
   no fim do relatório para atualizar o mapa.
4. Leia a ADR do sistema analisado (`docs/adr/`). Ela diz a intenção do
   design, e o relatório deve julgar o código contra essa intenção.

## Modos

Se o argumento estiver vazio, pergunte qual modo usar, com `completo` como
recomendação apenas se o usuário quiser uma visão geral.

| Modo | Pergunta que responde | Seções de `criterios.md` / `fluidez.md` |
|---|---|---|
| `economia` | O dinheiro gera escolhas ou sobra/falta? | criterios 1, 2, 3, 7 |
| `progressao` | Os marcos chegam na hora certa? Há platôs? | criterios 2, 6 |
| `decisoes` | Existe estratégia dominante ou opção morta? | criterios 4, 5 |
| `fluidez` | O turno tem prévia, impacto e resolução claros? Há tempo morto? | fluidez 1 a 5 |
| `simular` | O que acontece em centenas de partidas? | simulacao.md |
| `completo` | Todos os anteriores, com simulação curta | tudo |
| `<sistema>` | Os modos aplicados a um só sistema | conforme o sistema |

## Fluxo

1. **Coleta.** Leia fórmulas e constantes envolvidas. Anote cada número com
   arquivo:linha. Separe o que é intenção (ADR) do que está implementado.
2. **Cálculo.** Faça as contas por turno para os perfis passivo, ganancioso e
   equilibrado em T1, T4, T12, T26 e T52. Quando a variância importar ou
   houver mais de duas regras interagindo, rode a simulação em vez de fazer
   a conta à mão.
3. **Evidência de interface** (modo fluidez). Leia os componentes citados no
   mapa. Se o ambiente local estiver no ar (frontend em `localhost:5173`, API
   em `localhost:3000`, usuário `user`/`user`), jogue alguns turnos pela API
   para ver o que o turno realmente devolve.
4. **Achados.** Um achado por vez, cada um com número, fonte e consequência
   para o jogador.
5. **Perguntas obrigatórias.** Termine com pelo menos duas perguntas que o
   dono do jogo precisa responder para decidir (por exemplo: "qual saldo você
   espera que um jogador equilibrado tenha no turno 26?"). Use
   `AskUserQuestion` uma pergunta por vez.

## Formato do relatório

```
## Tycoon review: <modo ou sistema>

Fontes lidas: <arquivos>
Evidência: código | simulação (semente, N partidas) | jogo pela API

### Veredito: CRÍTICO | PREOCUPANTE | SAUDÁVEL | NÃO AVALIADO

### Achados
| # | Severidade | Achado (com número) | Fonte | Efeito no jogador |

### Projeção (quando aplicável)
| Turno | Passivo | Ganancioso | Equilibrado |

### Recomendações
| Prioridade | Mudança proposta | Valor atual → sugerido | Risco da mudança |

### Perguntas para o designer

### Divergências entre o mapa e o código
```

Escolha o veredito pelo pior achado:

- **CRÍTICO**: estratégia dominante, partida decidida por sorteio,
  economia sem dreno, ou progressão que trava.
- **PREOCUPANTE**: desvios que um ajuste de números resolve.
- **NÃO AVALIADO**: faltou dado ou alvo para julgar; diga o que faltou.
- **SAUDÁVEL**: cada valor foi comparado a um alvo declarado e nenhum
  achado acima apareceu.

## Regras

- Escreva em português.
- Siga o protocolo anti-bajulação de `criterios.md`: nenhuma avaliação sem
  número e fonte.
- Não altere código do jogo durante a revisão. Proponha a mudança e espere o
  dono decidir. Se ele pedir a implementação, siga o `AGENTS.md` do
  repositório (inclusive `npm run check`).
- Scripts de simulação vão para o diretório temporário da sessão, a menos
  que o dono peça para versioná-los.
- Recomendações de número vêm com o efeito esperado calculado, não só com a
  direção ("reduzir X").

## Skills relacionados

- `/balance-review`: revisão de economia e progressão com rubricas genéricas.
- `/balance-check`: procura outliers e estratégias degeneradas em dados.
- `/feel-pass`: avalia se uma mecânica jogável parece viva.
- `/player-experience`: simula uma persona jogando, momento a momento.
- Agente `economy-designer`: desenho de fontes, drenos e curvas.
