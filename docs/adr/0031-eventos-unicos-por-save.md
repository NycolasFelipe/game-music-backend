# 0031 — Eventos únicos por save: todo semestre, todo show e todo convívio

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0016 — Shows ao vivo](0016-shows-ao-vivo.md),
  [0017 — Confraternizações](0017-confraternizacoes.md),
  [0025 — Cobertura mínima de eventos ativos](0025-cobertura-minima-de-eventos-ativos.md),
  [0026 — Tom de voz dos textos](0026-tom-de-voz-dos-textos.md)

## Contexto

Hoje o avanço de turno sorteia um evento ativo com 35% de chance, e um modelo
volta depois de 6 turnos. O show e o convívio não têm decisão: o show mostra o
resultado na hora, e o convívio só vira evento quando a noite dá errado (uma das
12 tretas).

O dono quer mais decisões e nenhuma repetida dentro de uma partida:
- um evento ativo em todo semestre;
- uma decisão em todo show, durante a apresentação, que mexe no resultado do
  próprio show;
- uma decisão em toda saída de convívio, com a treta continuando à parte;
- nenhum desses eventos se repete num save.

Uma simulação com o código atual (semente 20261111, 800 partidas de 80 turnos
por perfil, shows, lançamentos, salários e eventos) mediu o maior tempo que
algum perfil passa em cada fase e quantos shows e convívios uma partida faz. O
dono escolheu cobrir o pior caso medido.

## Decisão

### 1. Evento ativo em todo semestre, sem repetir no save
- `ACTIVE_EVENT_CHANCE` passa de 0,35 para 1.
- O bloqueio de repetição deixa de ser a janela de 3 anos e passa a valer para
  todos os modelos que a banda já recebeu.
- Metas de modelos universais por fase (o maior tempo medido na fase):

| Fase | Meta | Hoje |
|---|---|---|
| Garagem (0–150 fãs) | 31 | 6 |
| Bares (151–2.000) | 71 | 8 |
| Casas (2.001–100.000) | 52 | 12 |
| Nacional (100.001–2.000.000) | 55 | 15 |

O teste de cobertura da ADR-0025 passa a usar essas metas.

### 2. Decisão durante o show
- Um catálogo por tipo de casa: noite de covers, bares, pubs, casas de show e
  festivais.
- Ao tocar, o jogo sorteia um modelo daquela casa que a banda ainda não viu e
  mostra a decisão antes do resultado.
- Cada opção traz um `performanceModifier`, que multiplica a variação do show
  (`evaluateGig`), e pode mexer em humor, relações e dinheiro, como as opções
  dos eventos ativos.
- O fluxo passa a ter dois passos: começar o show (gera e grava a decisão) e
  tocar com a opção escolhida (calcula o resultado). Uma decisão de show pendente
  segura o avanço de turno, como a sessão de estúdio.
- Metas por casa (o máximo de shows naquela casa numa partida): covers 80, bares
  80, pubs 78, casas de show 52, festivais 55.

### 3. Decisão em toda saída de convívio
- Um catálogo único, que serve a qualquer atividade; um modelo pode restringir as
  atividades em que faz sentido.
- Toda atividade gera uma decisão da noite, além do sorteio de treta, que
  continua como está.
- A banda faz no máximo um convívio por turno. Uma segunda tentativa no mesmo
  turno é recusada. Com isso, a saturação da ADR-0017 §2 (efeito reduzido a
  cada saída extra no turno) deixa de ter uso.
- Meta: 80 modelos (um convívio por turno nos 80 turnos).

### 4. Quando o catálogo acaba
O catálogo cobre o pior caso medido. Se uma partida passar dele (por exemplo,
mais de 80 turnos), nenhum modelo volta: o semestre fica sem
evento ativo, e o show ou o convívio acontece sem decisão, como era antes
desta ADR. O dono preferiu a regra de nunca repetir a garantir uma decisão em
todo caso.

### 5. Texto
Todo modelo novo segue a ADR-0026 (tom ácido, sem marca de época) e a ADR-0027
(gênero com o marcador de três formas). O conteúdo entra em lotes, cada um
revisado pelo dono numa página local antes de entrar no código.

## Consequências

- São cerca de 590 modelos novos: 168 eventos ativos, 345 de show e 80 de
  convívio.
- Todo semestre dentro do pior caso medido passa a ter pelo menos uma decisão que
  segura o avanço. Com show e convívio, um semestre ativo pode ter três ou mais.
- Um show começado e ainda sem decisão segura o avanço de turno até o jogador
  escolher a opção.
- Uma partida que passe do pior caso esgota o catálogo e volta a ter semestres,
  shows ou convívios sem decisão.
- O ritmo de 35% da ADR-0025 deixa de valer.
- O limite de um convívio por turno substitui a saturação da ADR-0017 §2, e a
  tela de convívio deixa de mostrar o efeito reduzido da próxima saída.
- Duas tabelas novas guardam as decisões de show e de convívio, com o modelo
  usado, para garantir que nada se repita.
