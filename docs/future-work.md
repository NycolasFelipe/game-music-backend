# Trabalho futuro (backlog de ideias)

Ideias de gameplay **ainda não decididas nem implementadas**. Diferente dos
[ADRs](adr/) (que registram decisões **aceitas**), este documento é um backlog:
cada item deve virar um **ADR próprio** — com o design detalhado e as decisões
travadas — quando for priorizado para implementação.

Convenção dos esboços: *Motivação* (por que), *Esboço* (como, em traços),
*Integração* (o que já existe e é reaproveitado) e *Dependências*.

---

## 1. Salários por integrante

**Motivação.** Dar peso à gestão financeira: hoje o dinheiro só entra (obras,
royalties). Membros deveriam **custar** — um fluxo de saída recorrente que
obriga o jogador a equilibrar produção e caixa.

**Esboço.**
- Cada integrante tem um `salary` (coluna nova em `band_members`, ou uma tabela
  se houver histórico/renegociação). Valor sugerido derivado de skill/fama.
- No **tick do turno** (`AdvanceTurnUseCase`, ADR-0006) o total de salários é
  **debitado do caixa** — o espelho de saída da cauda de royalties (que é
  entrada). O turno passa a ter entradas **e** saídas.
- **Inadimplência** (caixa insuficiente): queda de humor dos membros e, em atraso
  prolongado, risco de **saída** do integrante (evento).
- **Expectativa por traço.** O salário que **mantém o membro feliz** depende da
  personalidade: um integrante **`greedy` (Ganancioso)** exige um salário bem mais
  alto para ficar satisfeito (e reclama/perde humor abaixo disso), enquanto traços
  como **`purist`/`spiritual`** se contentam com pouco (ligam menos para dinheiro).
  Ou seja, cada membro tem um "salário-alvo" derivado dos traços (+ skill/fama), e
  o humor reage ao quanto o salário pago fica acima/abaixo desse alvo.
- Endpoint para ajustar o salário de um membro; validação de faixa.

**Integração.** Economia (`balance`, ADR-0008/0009), turnos (débito no tick,
ADR-0006), humor (`happiness`), a "Evolução do caixa" das estatísticas.

**Dependências.** Economia (feita). Precisa de ADR + migration (`salary`) +
endpoint + a lógica de débito/inadimplência no tick.

---

## 2. Obras: análise da crítica e análise do público

**Motivação.** Sucesso é multidimensional. Uma obra pode ser **aclamada pela
crítica** e ignorada pelo público — ou o oposto (um "guilty pleasure"). Espelha
a divisão crítica × audiência (à la Metacritic) e enriquece o feedback de uma
obra além de uma nota única.

**Esboço.**
- Na **finalização** (`FinalizeReleaseUseCase`, ADR-0008), além de `quality`,
  computar dois escores:
  - **Crítica** — baseado em qualidade técnica + coerência/ambição de gênero +
    inovação (ex.: obras experimentais arriscam mais).
  - **Público** — baseado em acessibilidade + alcance/fama + formato (um single
    "grudento" agrada mais o público do que a crítica).
  - Podem **divergir** deliberadamente.
- Persistir em `releases` (duas colunas `numeric` ou um `jsonb reviews`); expor na
  view e exibir no `ReleaseCard` como **dois selos** (crítica / público).
- Consequências possíveis: **fãs** ganhos passam a pesar mais no escore de
  público; **prestígio/fama** (subir de nível) pesa mais na crítica.

**Integração.** Obras (ADR-0008, finalize/quality), fama (ADR-0007). Reaproveita
`quality`, gênero e fama; novo card com os dois selos.

**Dependências.** Obras (feito). ADR + migration (colunas de review) + ajustes no
cálculo de impacto e no `ReleaseCard`.

---

## 3. Evolução dos integrantes ao publicar uma obra

**Motivação.** Recompensar a produção e fazer a banda **amadurecer** ao trabalhar:
gravar discos deveria desenvolver quem participou, dando um loop de progressão.

**Esboço.**
- Na **finalização**, cada **membro creditado** ganha um incremento nas **skills
  dos aspectos que cobriu** (ex.: quem foi creditado em Letras sobe `lyrics`).
- Ganho **decrescente perto do teto** (`SKILL_MAX = 10`) e **escalado pela
  qualidade/tier** da obra (uma obra-prima ensina mais que um fracasso).
- Opcional: pequeno ganho de **humor** ("orgulho da obra") para os creditados.
- Skills passam a ser **estado mutável** — persistir via um método de repositório
  (ou `applyBandStateChanges` estendido para aceitar deltas de skill).

**Integração.** Obras (ADR-0008, finalize + credits), band-members (`skills`),
`applyBandStateChanges`. Reflete na aba **Integrantes** e no **"Perfil de
habilidades"** das estatísticas. Cria sinergia com o item 1 (membros melhores
justificam salários maiores) e o item 2 (banda evolui → obras melhores).

**Dependências.** Obras (feito). ADR + método de persistência de skills +
aplicação dos deltas no finalize.

---

## 4. Dinheiro para eventos internos do grupo

**Motivação.** Usar o caixa para **cuidar do elenco** — um "custo de manutenção
social" que fecha o loop econômico: produzir gera dinheiro; parte dele volta para
manter a banda unida (relacionamento/humor).

**Esboço.**
- **Catálogo de atividades** (dado de domínio, fonte da verdade no backend):
  festa, retiro, terapia de grupo, viagem, jantar — cada uma com **custo** e
  **efeito** (↑ relacionamento entre membros, ↑ humor). Custo/efeito podem escalar
  com nº de membros e fama.
- Endpoint `POST /bands/:bandId/activities` `{ activityId }` → **debita o caixa** e
  **aplica os efeitos** via `applyBandStateChanges` (humor/relacionamentos).
- Opcional: **risco** (uma festa pode dar errado → dispara um evento ativo, à la
  ADR-0004), tornando o gasto uma aposta.

**Integração.** Economia (`balance`), relacionamentos (ADR-0003), humor,
`applyBandStateChanges`, e possivelmente a máquina de eventos ativos (ADR-0004).
Pode ser um mini-módulo `activities` ou viver dentro de `bands`.

**Dependências.** Economia (feita) e relacionamentos (feito). ADR + catálogo +
endpoint.

---

## 5. Renda por shows ao vivo (pubs, covers, etc.)

**Motivação.** No início a banda quase não fatura com obras (fama baixa, alcance
pequeno). **Tocar ao vivo** — bares, pubs, tocar covers — é a **renda de base** e
o principal caminho para uma banda pequena juntar caixa e ganhar os primeiros
fãs. É fiel à indústria (turnê/ao vivo costuma ser a maior fonte de renda de um
artista) e resolve o "início pobre".

**Esboço.**
- **Catálogo de tipos de show** (dado de domínio, fonte da verdade no backend):
  bar/pub, casa de shows, festival, e "noite de covers" — cada um com
  **requisito de fama**, **cachê base**, **custo** (deslocamento/estrutura) e
  **efeitos** (dinheiro + alguns fãs + desgaste de humor/energia).
- **Cachê e recepção** escalam com a **performance da banda** (skills relevantes
  ao vivo — vocal/guitarra/bateria — e humor). Show ruim (skill/humor baixos)
  rende menos e pode até irritar a casa.
- **Covers** rendem menos e **constroem menos fãs próprios** (é música dos
  outros), mas são acessíveis desde o começo — um degrau antes das obras autorais.
- Ação por turno (ou que **consome** um turno): endpoint
  `POST /bands/:bandId/gigs` `{ gigId }` → credita o cachê no caixa e aplica os
  efeitos via `applyBandStateChanges`. Opcional: **risco** (público hostil, equipamento
  falha) via evento ativo (ADR-0004).

**Integração.** Economia (`balance`), fama (ADR-0007, requisito/escala), humor,
`applyBandStateChanges`, e a "Evolução do caixa" das estatísticas. Combina com o
item 1 (salários): shows pagam as contas do começo. Pode ser um mini-módulo
`gigs` ou viver junto de `bands`/`releases`.

**Dependências.** Economia (feita) e fama (feita). ADR + catálogo + endpoint.

---

## 6. Gestão de elenco: expulsar e recrutar (minigame de entrevista)

**Motivação.** Hoje o elenco é **fixo na criação** da banda. O jogador deveria
poder **demitir** quem não serve (skill baixa, humor tóxico, relações ruins) e
**recrutar** substitutos — gestão de elenco de longo prazo, com consequências
humanas.

**Esboço.**
- **Expulsar** — `DELETE /bands/:bandId/members/:memberId`, respeitando
  `BAND_MEMBERS_MIN` (3). Remove em cascata os **relacionamentos** e os
  **créditos** do membro. Efeitos colaterais: pode **abalar** humor/relações de
  quem gostava dele (perder um amigo) ou **aliviar** o grupo (saiu um desafeto) —
  em função dos níveis de relacionamento existentes.
- **Recrutar via entrevista (minigame)** — reaproveita a geração de candidatos
  (`POST /band-members/candidates`), mas com **revelação progressiva**: o jogador
  vê só **pistas parciais** (nem todas as skills/traços expostos) e conduz uma
  **entrevista** — perguntas que revelam atributos, com **risco** (traço oculto
  ruim, candidato que "vende bem" mas entrega menos). Ao final, contrata um.
- **Adicionar** — `POST /bands/:bandId/members` (respeitando `BAND_MEMBERS_MAX`,
  6): persiste o novo membro e **gera os relacionamentos** dele com os atuais
  (reusa `relationship.generator`).

**Integração.** band-members (geração de candidatos, `characteristics`, `skills`,
avatar), relacionamentos (ADR-0003, vínculos do novo membro), regras
`BAND_MEMBERS_MIN/MAX`, humor. A parte **nova de design** é o minigame de
entrevista (revelação parcial + perguntas + risco de traço oculto).

**Dependências.** band-members e relacionamentos (feitos). ADR + endpoints
add/remove membro + a mecânica de entrevista (o que é revelado, como, e o risco).

---

## 7. Chart global de artistas (paradas)

**Motivação.** Dar **contexto competitivo**: onde a sua banda está no cenário? Um
ranking global de artistas para comparar a sua fama/relevância com a de outros —
transforma a progressão solitária em algo com referência ("subi para o top 50").

**Esboço.**
- Um conjunto de **artistas rivais** (NPCs): catálogo curado por tier de fama
  (dado de domínio) ou gerados, com fama/nível que **evolui com o tempo** (sobe/
  desce a cada período).
- Tela/aba **"Paradas"** com um **ranking global por fãs/fama**, destacando a
  **posição da sua banda** no meio dos rivais.
- Opcional: rivais **lançam obras** (flavor na timeline) e podem disparar
  **eventos** (um rival te ofusca / colabora), ligando com a máquina de eventos.
- Endpoint `GET /charts` (ranking atual, com a sua banda posicionada).

**Integração.** Fama (ADR-0007) como métrica de ranqueamento; possivelmente
eventos (ADR-0004). Novo mini-módulo `charts`/`rivals` (catálogo + progressão) ou
dado de domínio + endpoint. UI: nova aba com a tabela de paradas.

**Dependências.** Fama (feita). ADR + catálogo/progressão de rivais + endpoint +
UI da parada.

---

## Ordem sugerida (não vinculante)

1. **Shows ao vivo** (item 5) — renda de base do início; destrava o começo do jogo
   (obras rendem pouco enquanto a fama é baixa).
2. **Salários** (item 1) — completa o lado de saída da economia; junto com os shows
   fecha o balanço entradas × saídas já no começo.
3. **Eventos internos** (item 4) — dá um uso interessante ao caixa e reaproveita
   relacionamentos/humor já prontos.
4. **Gestão de elenco** (item 6) — expulsar/recrutar; gestão de longo prazo, mas o
   minigame de entrevista é o de maior esforço de design.
5. **Evolução dos integrantes** (item 3) — loop de progressão; sinergia com os
   itens 1 e 5.
6. **Crítica × público** (item 2) — profundidade de feedback; independente dos
   demais, pode entrar a qualquer momento.
7. **Chart global de artistas** (item 7) — contexto competitivo; maior por exigir
   rivais/NPCs e sua progressão, mas muito bom para dar sensação de progresso.

Antes de implementar qualquer um: abrir um ADR (`NNNN-titulo.md`), travar as
decisões com o produto (como feito para obras/gravadoras) e só então codar.
