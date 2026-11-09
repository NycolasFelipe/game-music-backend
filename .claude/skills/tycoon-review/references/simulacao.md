# Simulação Monte Carlo

Use quando a pergunta for "o que acontece ao longo de muitas partidas?"
(curva de saldo, chance de perder integrantes, estratégia dominante). Uma
conta feita à mão com valores médios esconde a variância; a simulação mostra
a distribuição.

## Princípios

1. **Reutilize as funções puras do domínio.** Não copie fórmulas. Importe
   `targetSalary`, `computePayroll`, `computeAutoRaises`, `evaluateRelease`,
   `royaltyPayout`, `evaluateGig`, `evaluateActivity`, `grownSkill`,
   `calculateFameLevel`, `computeBandStateChanges`, `rollConsequence` e os
   geradores. Assim a simulação acompanha o jogo quando os números mudarem.
2. **Reimplemente só a orquestração**, que vive nos casos de uso: a ordem do
   tick, a contagem de saturação, a regra de 1 show por turno, o produto dos
   modificadores de evento e o sorteio da variação. Cite o arquivo:linha de
   cada regra reimplementada no topo do script.
3. **Semente fixa.** O jogo usa `Math.random()`. No script, substitua
   `Math.random` por um gerador semeado (por exemplo mulberry32) antes de
   importar qualquer módulo do domínio, e registre a semente no resultado.
4. **Nada de banco nem Nest.** O script roda isolado.

## Onde e como rodar

- Escreva o script no diretório temporário da sessão. Só coloque dentro do
  repositório (`scripts/sim/`) se o dono pedir.
- Rode a partir da raiz do backend para o alias `@/` funcionar:

```bash
npx ts-node -r tsconfig-paths/register -P tsconfig.json <caminho>/sim.ts
```

- Se o `ts-node` reclamar de tipos, use `--transpile-only`.

## Perfis de jogador

Simule pelo menos estes perfis, cada um com 500 a 1000 partidas de 40 turnos:

| Perfil | Comportamento |
|---|---|
| Passivo | Só avança turno e responde eventos com a primeira opção |
| Showman | Faz o melhor show disponível todo turno e nunca lança nada |
| Estúdio | Lança o formato mais caro que o caixa permite, orçamento estúdio |
| Equilibrado | Show todo turno, lançamento quando o caixa passa de 2× o custo, atividade quando o humor médio fica abaixo de 0 |
| Avarento | Mantém o reajuste automático desligado e nunca reajusta salários |

Ajuste os perfis à pergunta do usuário. O objetivo é descobrir se alguma
estratégia simples domina as outras.

## Métricas a reportar

Para cada perfil, mediana e percentis 10 e 90 em T4, T12, T26 e T40:

- Saldo e fãs.
- Nível de fama e turno em que atinge 3, 7 e 12.
- Integrantes perdidos e turno da primeira saída.
- Razão fonte/dreno por turno.
- Turnos consecutivos sem decisão disponível (tempo morto).
- Qualidade média dos lançamentos e proporção de "fracasso".

## Sinais de alerta

- Um perfil vence os outros em todas as métricas: estratégia dominante.
- O perfil passivo termina com mais saldo que o equilibrado: agir é punido.
- Percentil 10 do saldo chega a zero antes de T12: o azar decide a partida.
- O saldo passa de 2× o custo do item mais caro e nunca mais cai: o dinheiro
  deixou de ser restrição.
- A fama trava num nível por mais de 10 turnos: platô de progressão.

## Saída

Entregue uma tabela por perfil, a semente usada, o número de partidas e a
lista das regras reimplementadas. Diga explicitamente o que a simulação
simplificou (por exemplo, escolhas de evento fixas).
