# Critérios de análise: economia, progressão e decisões

Unidade de tempo: **turno**. Toda projeção usa turnos do jogo e, quando fizer
sentido, minutos reais por turno (quanto tempo o jogador leva para decidir e
encerrar um turno).

## 1. Mapa de fontes e drenos (faucets e sinks)

Para cada recurso (dinheiro, fama, moral, qualidade etc.), liste:

| Fonte/dreno | Tipo | Fórmula (arquivo:linha) | Valor típico por turno | Depende de |
|---|---|---|---|---|

Depois calcule, para um jogador típico:

- **Razão fonte/dreno** = entrada média por turno ÷ saída média por turno.

| Razão | Diagnóstico | Consequência |
|---|---|---|
| > 1,2 | Inflacionária | O dinheiro perde significado; o jogador acumula sem ter onde gastar |
| 0,9 a 1,1 | Saudável | Gastar exige escolha; o jogador sempre quer um pouco mais |
| < 0,8 | Deflacionária | O jogador não consegue pagar o básico e a sensação é de punição |

Se a razão não puder ser calculada por falta de números, o achado é este:
"a economia não tem modelo quantitativo; monte a projeção antes de ajustar
qualquer valor".

## 2. Projeção no tempo

Uma análise estática esconde os problemas. Projete sempre o saldo em
**T1, T4, T12, T26, T52** (ajuste se um turno não for uma semana) para três
perfis de jogador:

- **Passivo**: encerra turnos sem agir, ou com a ação mais barata.
- **Ganancioso**: escolhe sempre a opção de maior retorno imediato.
- **Equilibrado**: alterna entre investir e economizar.

Sinalize:

- O turno em que o saldo passa de **2× o custo da coisa mais cara disponível**.
  A partir dali o dinheiro deixa de ser uma restrição.
- O turno em que algum perfil quebra (saldo negativo sem saída).
- Se o perfil passivo termina **melhor** que o equilibrado. Isso indica que
  agir é punido.

## 3. Curvas de custo e receita

- Custos que crescem linearmente contra receitas que crescem linearmente
  produzem um jogo resolvido cedo. Em tycoon, custos de escala costumam
  crescer mais rápido que a receita (exemplo: `base * 1,15^nível`), e isso
  mantém a tensão.
- Verifique **efeitos compostos**: bônus de +10% em três sistemas somam cerca
  de 33%, não 10%. Rastreie multiplicadores que se empilham (fama × qualidade ×
  clima, por exemplo).
- Verifique **limites e travas** (clamps). Um valor sem teto sempre vira o
  objetivo único do jogador ótimo.

## 4. Qualidade das decisões

Um tycoon vive de decisões com trade-off. Para cada decisão disponível no turno:

| Decisão | Custo | Retorno esperado | Risco | Existe opção que a domina? |
|---|---|---|---|---|

- **Estratégia dominante**: uma opção que é melhor ou igual em todos os
  cenários. É achado crítico, porque elimina a escolha.
- **Opção morta**: uma opção que nunca vale a pena. Remova ou rebalanceie.
- **Decisão sem informação**: o jogador escolhe sem ver custo, risco ou
  probabilidade. Isso é sorteio, e precisa de prévia na interface.
- **Razão de decisões significativas** = turnos em que o jogador toma uma
  decisão real ÷ total de turnos.

| Razão | Veredito |
|---|---|
| > 0,5 | Engajante |
| 0,3 a 0,5 | Aceitável |
| 0,2 a 0,3 | Repetitivo; quem não gosta de repetição abandona aqui |
| < 0,2 | Esteira; risco alto de abandono |

## 5. Aleatoriedade

Para cada sorteio (eventos, notas de review, consequências):

- Qual a distribuição e qual o pior caso realista (percentil 5)?
- O pior caso pode encerrar a partida sem que o jogador tenha errado? Se sim,
  é achado crítico: o azar decide o jogo.
- Existe proteção contra azar (piso, sequência máxima de eventos ruins)?
- O jogador entende, depois do fato, por que o resultado aconteceu?
- O RNG é injetável/semeável? Sem isso não há simulação reproduzível.

## 6. Marcos de progressão

| Marco | Alvo sugerido (por turnos) | Real | Veredito |
|---|---|---|---|
| Primeira ação com consequência visível | Turno 1 | | |
| Primeira escolha com trade-off | Turnos 1 a 3 | | |
| Primeiro "deu certo" (lançamento ou show bem-sucedido) | Turnos 3 a 8 | | |
| Primeira crise que exige reação | Turnos 6 a 15 | | |
| Mudança de fase (o jogo pede outra estratégia) | Turnos 20 a 40 | | |
| Conteúdo começa a se repetir | | | |

Os alvos são ponto de partida e devem ser ajustados com o dono do jogo.
Sinalize marcos que ficam a mais de 2× ou a menos de 0,5× do alvo.

## 7. Anti-padrões de tycoon

- Dinheiro em ponto flutuante. Use inteiros (centavos) ou decimal fixo.
- Métricas críticas escondidas. O jogador precisa ver o detalhamento de
  receitas e despesas para otimizar.
- Acúmulo infinito sem limite ou dreno que escale junto.
- Começo com cara de "simulador de espera": as primeiras decisões precisam vir
  cedo e dar vitórias rápidas.
- Dreno fixo que não escala com a receita (por exemplo, salários que viram
  irrelevantes no meio do jogo).
- Pico de dificuldade causado por um único sorteio.
- Recurso secundário (moral, relacionamento) que nunca afeta o resultado. Se
  ele não muda nada, ele é decoração.

## 8. Protocolo anti-bajulação

Frases proibidas no relatório: "a economia parece equilibrada", "o ritmo está
bom", "os jogadores vão achar justo", "o balanceamento parece ok".

Toda afirmação precisa de número e de fonte (os valores abaixo são
ilustrativos):

```
Errado: "Os salários parecem bem calibrados."
Certo:  "Salário total no turno 1: 1.200 (salary.calculator.ts:88).
         Receita média de show no turno 1: 900 (gig.calculator.ts:40).
         Razão 0,75: deflacionária. Sem lançamento, o perfil passivo
         quebra no turno 7."
```

Quando um valor não tiver alvo declarado, escreva "sem alvo declarado, não
julgado". Ausência de dado nunca é aprovação.
