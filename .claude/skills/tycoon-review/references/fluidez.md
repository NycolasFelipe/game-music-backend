# Critérios de fluidez para tycoon por turnos

Em jogo de ação, fluidez é medida em frames. Num tycoon por turnos ela é
medida em **cliques, leituras e espera** entre a intenção do jogador e a
consequência visível.

## 1. O turno como cadeia de feedback

Todo turno satisfatório segue quatro batidas:

```
PRÉVIA → AÇÃO → IMPACTO → RESOLUÇÃO
```

| Batida | Função | Sinais saudáveis | Quando falta |
|---|---|---|---|
| Prévia | Mostrar o que vai acontecer antes de confirmar | Custo, risco e efeito estimado visíveis antes do clique | O jogador age às cegas e atribui o resultado à sorte |
| Ação | Confirmar a decisão | Resposta imediata ao clique (estado de carregamento, botão desabilitado) | Clique duplo, dúvida se funcionou |
| Impacto | Mostrar o que mudou | Relatório do turno com variações (antes → depois), destaque do que foi mais importante | "O que aconteceu?" O jogador precisa caçar a mudança em várias telas |
| Resolução | Levar à próxima decisão | O relatório termina apontando o que pede atenção agora | O jogador volta a uma tela neutra sem saber o que fazer |

Para cada ação do jogador (encerrar turno, contratar, demitir, ajustar
salário, iniciar lançamento, marcar show, atividade, responder evento),
preencha:

| Ação | Prévia | Ação | Impacto | Resolução | Batida mais fraca |
|---|---|---|---|---|---|

## 2. Tempo morto

Tempo morto é quando o jogador não tem decisão a tomar e nada novo acontece.

| Situação | Veredito |
|---|---|
| Turno sem decisão real, de vez em quando | Normal, funciona como respiro |
| 2 turnos seguidos sem decisão real | Suspeito |
| 3 ou mais turnos seguidos só clicando "avançar" | Achado: o jogador está esperando o jogo |
| Espera de rede/processamento acima de 1 s sem feedback | Achado de interface |

Pergunte: em qual fase da partida o jogador passa mais turnos seguidos sem
decidir nada? Esse trecho é onde o abandono acontece.

## 3. Custo de interação

Conte, para as tarefas mais frequentes:

- Cliques do início do turno até encerrá-lo, num turno típico.
- Telas visitadas para entender "estou ganhando ou perdendo dinheiro?".
- Telas visitadas para responder a um evento.

Tarefa que acontece todo turno e exige mais de 3 telas ou mais de 5 cliques
é candidata a atalho, resumo ou ação em lote.

## 4. Clareza

- O saldo e a variação do último turno estão visíveis o tempo todo?
- Cada número importante tem explicação acessível (tooltip, detalhamento)?
- Eventos aleatórios dizem por que aconteceram e o que influenciou o
  resultado?
- Mudanças negativas aparecem com o mesmo destaque das positivas? Esconder
  perdas gera a sensação de injustiça mais tarde.
- O vocabulário é consistente entre backend, interface e textos de evento?

## 5. Ritmo da partida

Descreva a curva de intensidade em blocos de turnos (1-5, 6-15, 16-30, 31+):

| Bloco | Decisões novas que aparecem | Tensão (baixa/média/alta) | Novidade de conteúdo |
|---|---|---|---|

Sinalize platôs de três blocos com a mesma intensidade e quedas bruscas
(exemplo: o jogo fica trivial depois que o dinheiro passa a sobrar).

## 6. Como coletar evidência

Prefira evidência a suposição, nesta ordem:

1. Jogar de verdade pela API ou pelo navegador e registrar o que aparece a
   cada turno.
2. Ler os componentes do frontend que exibem o resultado do turno e as
   notificações.
3. Ler o caso de uso de avanço de turno para saber o que o backend devolve e
   o que a interface descarta.

Quando a avaliação vier só da leitura do código, diga isso no relatório.
