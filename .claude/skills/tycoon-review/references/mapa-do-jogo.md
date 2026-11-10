# Mapa das mecânicas do game-music

Retrato do código no commit `b9feba4` (2026-07-26). Os números mudam com o
desenvolvimento: **confira cada valor no arquivo indicado antes de usá-lo num
relatório** e, se divergir, use o do código e anote a divergência para
atualizar este mapa.

Abreviações: `B` = `game-music-backend/src/modules`, `F` =
`game-music-frontend/src` (o frontend fica numa pasta irmã do backend).

## Turno

- Endpoint `POST /bands/:bandId/turns/advance`, caso de uso
  `B/turns/application/use-cases/advance-turn.use-case.ts`.
- **1 turno = 1 semestre.** `TURN_STEP = 0.5` e `ACTIVE_EVENT_CHANCE = 0.35`
  em `B/turns/domain/constants/turn.constant.ts`. O ano vira a cada 2 turnos.
- Ordem do tick:
  1. Bloqueia (409) se houver evento ativo sem resposta ou evento de estúdio
     pendente. Lançamento em produção não bloqueia.
  2. Avança o relógio; na virada de ano a idade sobe 1 (sem efeito mecânico).
  3. Gera 3 eventos passivos (`PASSIVE_EVENTS_PER_TURN`, só texto, não altera
     estado), respeitando o `desde` de cada modelo (ADR-0024).
  4. Avança a produção dos lançamentos e abre 1 evento de criação se ainda
     restarem turnos.
  5. Credita royalties.
  6. Reajuste automático de salários, se `autoSalaryAdjust` estiver ligado.
  7. Folha de pagamento; integrantes sem pagamento acumulam atraso e saem
     quando `atraso >= paciência`.
  8. Sorteia evento ativo (100%, ADR-0031): nenhum modelo se repete no save, e o
     semestre fica sem evento quando o catálogo da fase acaba.
  9. Grava snapshot (fãs, saldo, humor médio, relação média).
- **Fãs só mudam no tick quando alguém sai** (−10% por saída, ADR-0032). No
  resto, mudam por lançamento, show e evento.
- **Painel do turno (ADR-0022):** `GET /bands/:bandId/turns/panel`
  (`get-turn-panel.use-case.ts`) lê sem gravar: pendências (evento ativo e
  sessão de estúdio bloqueiam; obra pronta não), show já tocado no semestre e
  prévia de cada casa (`PreviewGigsUseCase`, `evaluateGig` com variância 1, ou
  seja o centro da faixa `± GIG_VARIANCE`), se houve confraternização, obra no
  estúdio com a saturação do próximo lançamento e a previsão do avanço
  (`forecast-turn.use-case.ts`: royalties, reajuste automático, folha, caixa
  final, quem fica em atraso e quem sai). A previsão usa as mesmas funções
  puras do tick, então é exata para o estado do momento.

## Recursos

| Recurso | Faixa | Onde |
|---|---|---|
| Saldo | começa em 5000, sem teto; a folha nunca deixa negativo | `B/bands/domain/constants/band.constant.ts` (`STARTING_CAPITAL`) |
| Fãs | inteiro ≥ 1 | `BandEntity.fanCount` |
| Nível de fama | 0..30, derivado dos fãs | `B/bands/domain/fame/fame.constant.ts`, `fame.calculator.ts` |
| Humor do integrante | -5..5 | `B/band-members/domain/constants/member-rules.constant.ts` |
| Habilidades (6) | 0..10; nascem entre 0 e 3; nunca decaem | `skill.constant.ts`, `character.generator.ts` |
| Relação entre pares | -5..5 inteiro | `B/bands/domain/constants/relationship.constant.ts` |
| Salário | 0..1.000.000 por turno, mais contador de atraso | `band-member.entity.ts` |
| Traços | 2 a 4 por integrante | `B/band-members/domain/data/characteristics.ts` |
| Tamanho da banda | 3..6 na criação, sem mínimo depois | `band.constant.ts` |

## Drenos e fontes

### Salários (dreno, todo turno)

`B/band-members/domain/salary/salary.calculator.ts` (funções puras).

- `targetSalary` = `SALARY_BASE(80) × (1 + habilidadeMédia/10) × (1 + fãs/(fãs+5000)) × Π multiplicadores de traço`.
- Multiplicadores: ganancioso 1,6; deslumbrado 1,3; profissional 1,1;
  romântico 0,85; espiritual 0,7; purista 0,6 (`salary.constant.ts`).
- Paciência (turnos sem pagamento até sair, mínimo entre os traços):
  ganancioso 1, deslumbrado 2, profissional 2, romântico 4, estável 4,
  espiritual 5, purista 5, leal 6; padrão 3.
- Humor: pago ≥ alvo +0,15; abaixo do alvo `-0,5 × % de déficit`; sem
  pagamento -1.
- `computePayroll` paga na ordem do banco, cada um inteiro ou nada.
- `computeAutoRaises` sobe todos para o alvo só se a folha nova couber no
  caixa. Salário nunca é reduzido automaticamente.
- Ajuste manual (`PATCH .../members/:id/salary`) aceita qualquer valor, sem
  custo.

### Lançamentos (fonte principal e dreno)

Módulo `B/releases`.

- Iniciar só **verifica** o saldo; o custo é cobrado ao finalizar. Cancelar
  rascunho é grátis. Um lançamento em criação por vez.

| Formato | Custo base | Alcance | Receita base | Ganho de habilidade | Turnos |
|---|---|---|---|---|---|
| single | 800 | 400 | 1200 | 0,6 | 1 |
| ep | 2000 | 1000 | 3000 | 0,9 | 2 |
| lp | 4000 | 2500 | 7000 | 1,2 | 3 |
| album | 6000 | 4000 | 12000 | 1,4 | 3 |
| acoustic | 2500 | 1200 | 3500 | 0,9 | 2 |
| live | 3000 | 1800 | 5000 | 0,8 | 2 |

`data/release-formats.ts`.

| Orçamento | Custo × | Qualidade × |
|---|---|---|
| caseiro | 0,6 | 0,9 |
| estudio | 1 | 1 |
| grande | 1,8 | 1,15 |

`data/budget-tiers.ts`.

- **Estilo (ADR-0030):** a obra grava o `theme` da banda, escolhido na criação e
  sem rota de troca. O perfil de peso por instrumento
  (`data/release-genre-profiles.ts`, 8 arquétipos para 26 estilos) e a recepção
  seguem esse estilo, então a formação precisa cobrir o que ele cobra.
- `evaluateRelease` (`domain/quality/release.calculator.ts`):
  - qualidade = `clamp(habilidade × humor × orçamento × eventos × variação, 0, 1) × 100`.
  - variação uniforme ±8%.
  - foco por quantidade de aspectos creditados: `[1, 1, .95, .85, .72, .58, .45]`.
  - química = `1 + 0,12 × relaçãoMédia/5`; humor = `1 + humorMédio/5 × 0,15`.
  - alcance = `1 + log10(1+fãs) × 0,4`.
  - saturação por obras no mesmo ano: `[1, .6, .35, .2]`.
- Faixas de qualidade (`data/quality-tiers.ts`), mínimo → fãs× / receita×:
  fracasso 0 → .3/.3, medíocre 25 → .7/.7 (era 35 até a ADR-0019), sólido 55 → 1/1, grande 75 →
  1,6/1,7, obra-prima 90 → 2,5/3.
- Receita: master = `receitaBase × faixa × alcance × saturação`; publishing
  = 25% do master. **Nada é pago na hora** (`UPFRONT_FRACTION = 0`); tudo vira
  royalty em 6 turnos (50, 25, 12,5, 6,25, 3,125, 3,125%) via `royaltyPayout`.
- Eventos de criação (`domain/generation/creation-event.generator.ts`): até
  3, um por turno de produção, cada tipo uma vez por obra; ligados a traços ou
  a pares em conflito; multiplicam a qualidade. Ideia maluca: chance de 41 a
  55%, valor esperado ≈ 1 (gênio 1,05). Desde a ADR-0019 as opções têm
  `cost`: caprichar (×1,25) +1 turno de produção; insistir contra a preguiça
  −2 de humor (cortar ×0,98); contrariar alguém −1 de humor;
  escolher um lado no conflito −1 de humor para quem perdeu e −1 na relação.
  Custo aplicado em `resolve-creation-event.use-case.ts` via
  `domain/creation/creation-cost.calculator.ts`.
- Notas de crítica e público (`review.calculator.ts`) são **só informativas**.
- Crescimento de habilidade e orgulho: `domain/growth/growth.calculator.ts`.

### Shows (fonte "de base", ADR-0016)

`B/gigs`. Um show por turno, exige nível de fama mínimo e saldo ≥ custo.

| Tipo | Fama mín. | Cachê | Custo | Fãs | Desgaste | Desempenho esperado | Fãs próprios × |
|---|---|---|---|---|---|---|---|
| covers | 0 | 600 | 80 | 8 | .045 | .15 | .3 |
| bar | 0 | 450 | 60 | 40 | .03 | .15 | 1 |
| pub | 3 | 1200 | 250 | 180 | .06 | .18 | 1 |
| casa-shows | 7 | 4000 | 900 | 900 | .09 | .25 | 1 |
| festival | 12 | 15000 | 3500 | 6000 | .15 | .35 | 1 |

`data/gig-types.ts`. `evaluateGig` (`domain/gig/gig.calculator.ts`):
desempenho = habilidade de palco × humor × variação ±10%; cachê = `base ×
(0,5 + desempenho) × atração`; atração = `1 + log10(1+fãs) × 0,2`; humor de
todos muda `-desgaste + (desempenho - esperado) × 3` (ADR-0021). O desempenho
real fica entre 0,13 e 0,42 a partida inteira, porque `stageSkill` faz a média
dos 5 instrumentos de cada integrante.

### Atividades (dinheiro → humor e relação)

`B/activities`. **Um convívio por turno** (`ACTIVITY_LIMIT_PER_TURN`, ADR-0031 §3);
o segundo devolve 409. A saturação `[1, .5, .25, .1]` continua no cálculo, mas só
o primeiro fator age.
Custo = `(base + porPessoa × n) × (1 + 0,06 × nívelDeFama)`. Chance de
confusão cresce com o pior par e, quando acontece, gera um evento ativo que
bloqueia o turno seguinte. O ganho de relação vale para todos os pares de
convidados e para em +2 (`ACTIVITY_RELATIONSHIP_CAP`, ADR-0029 e ADR-0032 §4): de +3 a +5
só vêm de eventos, e um par acima de +2 não muda.

| Atividade | Base | Por pessoa | Humor | Relação | Confusão |
|---|---|---|---|---|---|
| jantar | 120 | 60 | .4 | 1 | .05 |
| festa | 400 | 150 | 1 | 1 | .25 |
| viagem | 900 | 350 | 1,2 | 2 | .15 |
| retiro | 1500 | 400 | .5 | 2 | .08 |
| terapia | 800 | 300 | 0 | 3 | .02 |

### Eventos ativos

`B/events/domain/generation/active-event.generator.ts`, consequências em
`consequence-resolver.ts`. Templates em `B/events/domain/data/active-events/`,
um arquivo por grupo (`ported`, `garagem`, `bares`, `casas`, `nacional`,
`activity-fallout`), juntados em `B/events/domain/data/active-event-templates.ts`.

- **214 templates sorteáveis** e 12 de "confraternização" (gerados por
  atividade; `fallout-event.generator.ts` só repete uma treta depois que a
  banda viu todas, voltando a mais antiga). Cada fase de fama tem modelos universais próprios: garagem
  (`0101` a `0131`, até 150 fãs, efeito em fãs absoluto), bares (`0201` a
  `0271`, 151 a 2.000), casas (`0301` a `0352`, 2.001 a 100.000) e nacional
  (`0401` a `0455`, 100.001 a 2.000.000). Todos têm uma opção extra ligada a
  um traço, e os 32 traços aparecem em algum evento. Acima de 2 milhões de fãs
  só há o 0002, que ninguém alcança em 80 turnos. Um template **não se repete
  no save** (ADR-0031 §1): `generate-active-event.use-case.ts` passa ao gerador
  todos os modelos que a banda já viu (`usedTemplateIds`), e o gerador os tira
  antes de sortear. Sem modelo livre, o semestre fica sem evento (§4).
- **Ritmo medido antes da ADR-0031 (2026-11-10, semente 20261110, 800 partidas
  de 80 turnos):** 28 eventos do avanço por partida (p10 22, p90 34), com o
  sorteio de 35%. Quem faz convívio em 1 de cada 3 turnos soma ~5
  tretas. Antes do teto da ADR-0029, esse perfil tinha 96% dos pares em +4/+5 no
  T40; com o teto, 30%.
- **Elenco (ADR-0028):** todo par que cumpre o modelo entra no sorteio. Brigas
  pesam `1 + hostilidade` (par em −5 pesa 6); os outros tipos sorteiam por igual.
  Cada integrante do evento anterior multiplica o peso por 0,5.
- **Gênero nos textos (ADR-0027):** o marcador
  `{characterN:masculino|feminino|neutro}` escolhe a forma pelo gênero do
  personagem (`male`, `female`, `neutral`). 10% dos candidatos sorteados saem
  neutros; o gênero só é definido na criação da banda.
- **Cobertura mínima (ADR-0025, metas da ADR-0031):** metas de modelos universais por fase de
  fama (garagem 31, bares 71, casas 52, nacional 55), com pelo menos 2 solo e 2
  por categoria sorteada. O teste
  `B/events/domain/data/active-event-templates.spec.ts` confere as metas, e as
  quatro fases estão ligadas (`enforced: true`). Na simulação de 80 turnos, o
  jogador equilibrado passa ~34 turnos na fase de casas e ~42 na nacional, e
  ninguém passa de 2 milhões de fãs.
- `moneyChange` **não altera o saldo**; só desloca o humor em ±6%.
- **Peso dos eventos (ADR-0032 §1):** `happinessChangePercent` vira pontos com
  `× 15/100` e toda mudança de relação vale o dobro
  (`events/domain/constants/consequence-weight.constant.ts`). "−8%" vale −1,2,
  só para os envolvidos.

### Clima (humor e relação)

- Fontes de humor: salário pago +0,05 por turno (`salary.constant.ts`),
  convívio, show (`-desgaste + (desempenho - esperado) × 3`), sessões de
  estúdio, orgulho do lançamento e eventos.
- **Volta ao neutro (ADR-0032 §2):** no tick, depois da folha, o humor perde 5%
  da distância até 0 (`MOOD_DRIFT_RATE`, `band-members/domain/mood/mood.calculator.ts`).
  A relação não volta sozinha.
- **Saída por humor (ADR-0032 §5):** humor ≤ −4 no fim de 2 avanços seguidos
  (`low_mood_turns`) tira o integrante, com motivo `humor` no Arquivo. **Toda
  saída** (humor ou salário) custa 10% dos fãs, composto (`fansAfterDepartures`).
  A previsão do turno usa as mesmas funções e mostra quem sai, quem está em
  risco e os fãs perdidos. Os fãs agora mudam no tick quando alguém sai.
- Medição antes da ADR-0032 (semente 20261111): de T13 a T80, 66% a 87% dos
  integrantes ficavam com humor ≥ 4,5, e escolher bem ou mal nos eventos mudava
  0,1 a 0,3 de humor no T26. Com as regras novas (simuladas), quem escolhe bem
  fica entre 2,5 e 4,5 e o jogador atento perde alguém por humor em 5% a 33% das
  partidas, conforme escolhe.

## Aleatoriedade

Tudo usa `Math.random()`, sem semente. `evaluateRelease` e `evaluateGig`
recebem a variação como parâmetro (puros). O sorteio fica nos casos de uso
(`advance-turn`, `finalize-release`, `play-gig`, `hold-activity`,
`resolve-creation-event`) e nos geradores de domínio.

## Estados de fim

Não existe falência, game over nem vitória. A única pressão de derrota é a
saída de integrantes por salário atrasado. A banda pode chegar a 0
integrantes sem regra para isso. Progressão: nível de fama 0 a 30, que
libera tipos de show nos níveis 3, 7 e 12.

## Decisões do jogador por turno

Avançar turno; responder evento (bloqueia); iniciar, responder sessão de
estúdio, finalizar e cancelar lançamento; 1 show; atividades; ajustar
salário; ligar reajuste automático. Contratar e demitir existem só no backend:
o frontend não chama esses endpoints. Desde a ADR-0020, o resultado do avanço
traz `report`: caixa antes e depois do tick, royalties por obra, folha paga e a
variação de caixa e fãs desde o turno anterior. `PUT relationships`
define qualquer nível de relação de graça e funciona como atalho de debug.
A criação de banda aceita habilidades de 0 a 10 vindas do cliente.

Aparência (ADR-0023, sem efeito de jogo): cada integrante tem `appearance`
(penteado, barba, óculos, brinco, camisa e tom), gerada em
`B/band-members/domain/generation/appearance.generator.ts` a partir do gênero,
da idade e do avatar; a banda tem `photoScene` (`ensaio`, `palco`, `muro`,
`estudio`), sorteado na criação. Servem só aos retratos e à foto de capa do
frontend "revista".

## Interface (fluidez)

- `F/pages/BandTurnTab.tsx`: botão "Fechar a edição"; vira "Resolver N
  decisões" quando há bloqueio. O avanço não mostra mais resumo em toast; o
  fechamento com a previsão fica na própria aba, e saídas abrem o
  `DepartureModal`.
- `F/features/decisions/components/DecisionsModal.tsx`: fila central de
  decisões (ADR 0001 do frontend). O resultado de um evento aparece no
  próprio encarte (`EventOutcome`), com fãs, humor e relações que mudaram.
- `F/features/releases/components/ReleaseRevealModal.tsx`: revelação
  animada das notas.
- `F/features/gigs/components/GigsColumn.tsx` e
  `F/features/activities/components/ActivitiesPanel.tsx`: colunas Palco e
  Convívio com as últimas temporadas e saídas (clicáveis, com detalhe) e um
  botão que abre o encarte de escolha; o resultado aparece no mesmo encarte.
  O desempenho do show é mostrado em palavras (`gigs/format.ts`), não em 0..1.
- `F/features/bands/components/BandTrends.tsx` e `BandStatistics.tsx`:
  gráficos por turno. `BandHeader.tsx`: fãs, caixa e barra de fama.

## Documentação de design

- `game-music-backend/docs/adr/0001` a `0028`: uma ADR por sistema (turnos
  0006, fama 0007, obras 0008, salários 0010, shows 0016, atividades 0017,
  relatório do turno 0020, humor do show 0021, painel do turno 0022,
  aparência 0023, notícias por época 0024, cobertura de eventos ativos 0025,
  tom de voz dos textos 0026, gênero e flexão 0027, elenco dos eventos 0028).
  Leia a ADR do sistema antes de julgar: ela registra a intenção.
- `game-music-backend/docs/future-work.md`: backlog de ideias.
- `game-music-frontend/docs/adr/0001-central-de-decisoes.md`.

## Testes

Specs puras dos calculadores ficam ao lado de cada arquivo `domain/**`
(`*.calculator.spec.ts`). Não há testes de integração (a pasta configurada
em `test/jest-integration.json` não existe).
