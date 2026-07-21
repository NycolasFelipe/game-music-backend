# 0010 — Salários por integrante

- **Status:** Aceita
- **Data:** 2026-07-20
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — bands/band-members](0002-modulos-bands-e-band-members.md),
  [0003 — Relacionamentos entre membros](0003-relacionamentos-entre-membros.md),
  [0006 — Turnos](0006-turnos.md),
  [0007 — Fama](0007-fama.md),
  [0008 — Obras musicais](0008-obras-musicais.md)
- **Emenda:** amplia o ADR-0006 §6 / a emenda do ADR-0008 (ver "Emenda ao ADR-0006").
- **Origem:** promove o item 1 do [backlog](../future-work.md) para decisão travada.

## Contexto

Hoje o dinheiro só **entra** (obras: pico + cauda de royalties, ADR-0008). Os
membros não **custam** nada. Sem uma saída recorrente, a gestão financeira não
tem peso: não há por que equilibrar produção e caixa. Os **salários** introduzem
o fluxo de saída — o espelho da cauda de royalties (que é entrada) — e ligam três
sistemas já prontos: economia (`balance`), humor (`happiness`) e o tick do turno
(ADR-0006).

Além do custo, salário vira uma **alavanca de gestão de pessoas**: cada membro
tem um **salário-alvo** derivado da personalidade (traços), da competência
(skills) e do tamanho da banda (fama). Pagar acima/abaixo do alvo mexe no humor;
não pagar (caixa insuficiente) gera **inadimplência** que, se prolongada, faz o
integrante **sair**.

## Decisão

### 1. Modelo híbrido: valor corrente no membro + histórico em tabela própria
O salário corrente de cada membro é uma coluna em `band_members`
(`salary numeric(12,2)`), lida de graça em toda view de membro (como `happiness`
e `balance`). O **histórico de renegociação** vive em uma tabela append-only
`member_salaries` (um registro por acordo: valor, ano de vigência, motivo). Toda
alteração escreve nos dois — a coluna é a **fonte da verdade de gameplay** (evita
N+1 nas leituras) e a tabela é o **log de auditoria** (permite exibir a evolução
do salário e futuras renegociações). Rejeitamos "só coluna" (perderia o
histórico) e "só tabela" (todo caminho de leitura precisaria derivar o corrente
via `DISTINCT ON`).

### 2. Salário-alvo derivado de traços + skill + fama
Uma função pura (`domain/salary/salary.calculator.ts`) calcula o alvo:
```
avgSkill    = média das 6 skills (0..10)
skillFactor = 1 + SALARY_SKILL_WEIGHT × (avgSkill / SKILL_MAX)      // 1..2
fameFactor  = 1 + SALARY_FAME_MAX_BONUS × (fãs / (fãs + SALARY_FAME_HALF_FANS))  // 1..2, assintótico
traitFactor = Π SALARY_TRAIT_MULTIPLIERS[traço]                     // greedy ↑, purist/spiritual ↓
target      = clamp( SALARY_BASE × skillFactor × fameFactor × traitFactor, SALARY_MIN, SALARY_MAX )
```
Os multiplicadores de traço codificam a expectativa por personalidade: um
**`greedy` (Ganancioso)** exige bem mais (×1.6) para ficar satisfeito;
**`dazzled` (Deslumbrado)** também sobe (×1.3); **`purist` (Purista)** e
**`spiritual`** se contentam com pouco (×0.6/×0.7) — ligam menos para dinheiro.
Como o catálogo garante que traços opostos não coexistem (`greedy` × `purist`),
o produto nunca combina exigências contraditórias.

### 3. Salário inicial = salário-alvo
Na **criação da banda** (`createWithMembers`, transacional) e ao **adicionar um
membro** (`AddBandMember`), o salário inicial é o próprio alvo (com `fãs` = fama
atual; 0 na fundação). Assim a banda nasce **balanceada** — todo mundo satisfeito
— e o desequilíbrio só aparece quando o jogador não acompanha (skill/fama sobem,
o alvo sobe) ou corta salários. Os membros pré-existentes são retro-preenchidos
por migration (ver Persistência).

### 4. Débito da folha no tick (saída ↔ entrada)
No `AdvanceTurn` (ADR-0006), logo após a cauda de royalties (entrada), roda a
**folha** (`PaySalariesUseCase`): o caixa disponível é
`saldo + royalties`; cada membro é pago **na ordem**, integralmente, enquanto
houver caixa. O saldo final = `caixa − total pago`. Pagamentos e royalties se
combinam numa única gravação atômica via `applyBandStateChanges`. A folha nunca
deixa o saldo negativo: quando o caixa não cobre um salário, o membro fica
**inadimplente** (não pago neste turno) em vez de forçar saldo negativo.

### 5. Humor reage ao salário (nova dimensão passiva do tick)
- **Pago ≥ alvo:** pequeno ganho de humor (`SALARY_PAID_HAPPINESS_BONUS`).
- **Pago < alvo (subpagamento):** perda proporcional ao déficit relativo
  (`(alvo − pago)/alvo × SALARY_UNDERPAY_HAPPINESS_PENALTY`).
- **Não pago (caixa insuficiente):** perda maior fixa
  (`SALARY_UNPAID_HAPPINESS_PENALTY`) e **incremento do contador de atraso**.
O novo humor é absoluto e `clamp`ado a `[HAPPINESS_MIN, HAPPINESS_MAX]`, aplicado
junto do saldo no mesmo `applyBandStateChanges`.

### 6. Inadimplência: aviso, paciência por traço e saída na timeline
Cada membro tem `salary_unpaid_turns` (turnos consecutivos sem pagamento). Pagar
zera; não pagar incrementa. Enquanto o contador é `>= 1` e ainda abaixo do
limite, o membro está **em aviso**: a saída **nunca é instantânea** e a UI mostra
"sairá em N turnos se o salário não for pago" (`salaryTurnsUntilDeparture`).

O limite de tolerância é **por personalidade** (`salaryPatience`): um `greedy`
(Ganancioso) aguenta só 1 turno; um `loyal` (Leal), 6; sem traço relevante,
`SALARY_DEFAULT_PATIENCE` (3). Com vários traços mapeados, vale o **menor** (o
mais impaciente governa). Ao atingir a paciência, o membro **sai** no mesmo tick
— a remoção do `band_members` cascateia os **relacionamentos** e o **histórico de
salário** (FKs `ON DELETE CASCADE`, ADR-0003).

A saída é **registrada na linha do tempo** como um **evento passivo interno**
(`saida_integrante`) via `RecordMemberDeparturesUseCase` (ADR-0005), aparecendo
na timeline como qualquer outro evento. Para não poluir o gerador de eventos
passivos (que sorteia por probabilidade), os tipos passivos passam a se dividir
em **gerados** (mundo/artistas) e **internos** (banda); só os gerados têm peso de
sorteio. A saída é determinística no limite (não probabilística) para ser
testável; um gatilho por evento ativo fica como desdobramento futuro. Não há piso
de membros no tick (o mínimo de 3 é regra só da criação, ADR-0002).

**Contagem oculta.** O número de turnos até a saída **não é exposto** ao jogador
(nem na view do membro, nem no `AdvanceTurn`): a API só sinaliza o **risco**
(`salaryAtRisk` / `atRiskMemberIds`). Manter o prazo secreto é uma decisão de
game feel (mais tenso/gamificado).

### 6b. Ex-membros arquivados (snapshot)
A saída **não é um simples delete**: antes de remover o `band_members`, o membro
é **arquivado** em `former_members` (`ArchiveMemberDeparturesUseCase`) — um
snapshot congelado com dados, skills, traços, **humor**, **último salário**,
**turnos sem receber**, motivo, ano de saída e um **snapshot dos
relacionamentos** (nome do outro membro + nível). Assim os ex-membros continuam
visíveis mesmo depois de removidos. O `AdvanceTurn` retorna os snapshots das
saídas do turno (`departures`) para o cliente abrir um **modal de saída**, e
`GET /bands/:bandId/former-members` lista o histórico (aba "Ex-integrantes"). O
snapshot roda **antes** do `applyBandStateChanges` que faz a remoção.

### 7. Ajuste de salário a qualquer momento
`PATCH /bands/:bandId/members/:memberId/salary` `{ amount }` grava um novo acordo
(coluna + histórico, motivo `ajuste`, ano de vigência = `current_year`), validado
em `[SALARY_MIN, SALARY_MAX]`. O efeito (custo e humor) aparece no próximo tick.
`GET /bands/:bandId/members/:memberId/salary/history` lista os acordos
(cronológico decrescente).

### 8. Exposição nas views
Toda view de membro passa a trazer `salary` (corrente, **inteiro** — sem
decimais), `salaryTarget` (calculado a partir da fama atual, também inteiro),
`salaryUnpaidTurns` e `salaryAtRisk` (booleano; o prazo exato é oculto, §6). O
`AdvanceTurn` responde um resumo da folha (`salariesDue`, `salariesPaid`,
`salariesFullyPaid`), os **snapshots das saídas do turno** (`departures`) e os
membros em risco (`atRiskMemberIds`, sem contagem). O salário é validado como
inteiro (`@IsInt`) e `targetSalary` arredonda para inteiro.

## Emenda ao ADR-0006

O ADR-0006 §6 dizia que o tick é neutro para fãs, felicidade e relacionamentos; o
ADR-0008 abriu exceção só para **dinheiro** (royalties). Este ADR amplia a
exceção: com os salários, o tick passa a mover **também o humor** (satisfação/
inadimplência) e pode **remover membros** (saída por atraso). Fãs e
relacionamentos continuam neutros no tick (só mudam por resolução de eventos). A
mudança é deliberada: salário sem consequência no humor não teria peso.

## Persistência

- `band_members.salary` (`numeric(12,2)`, NOT NULL, default 0) — migration
  `AddSalaryToBandMembers` retro-preenche os membros existentes com `SALARY_BASE`.
- `band_members.salary_unpaid_turns` (`smallint`, NOT NULL, default 0) — mesma
  migration.
- `member_salaries`: `id` (uuid), `member_id` (FK→band_members, cascade),
  `band_id` (FK→bands, cascade), `amount` (`numeric(12,2)`), `effective_year`
  (`numeric(6,1)`), `reason` (`varchar(32)`: `inicial` | `ajuste`), `created_at`.
  Índice em `member_id`. Migration `CreateMemberSalariesTable` semeia um acordo
  `inicial` por membro existente (valor = coluna `salary`, ano = `current_year`
  da banda).

- `former_members`: snapshot append-only dos membros que saíram (dados, humor,
  salário, `unpaid_turns`, `reason`, `left_at_year`, `relationships` em `jsonb`),
  FK→bands cascade, índice em `band_id`. Migration `CreateFormerMembersTable`.

Migrations (sequência a partir de `1752000015000`): `AddSalaryToBandMembers`,
`CreateMemberSalariesTable`, `CreateFormerMembersTable`.

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `PATCH` | `/bands/:bandId/members/:memberId/salary` | Ajusta o salário de um membro |
| `GET`   | `/bands/:bandId/members/:memberId/salary/history` | Histórico de acordos |

Sob `@UseGuards(JwtAuthGuard)`, escopados por dono; uuids via `ParseUUIDPipe`. O
débito da folha não tem endpoint próprio — roda dentro do `AdvanceTurn`.

## Alternativas consideradas
- **Só coluna `salary` (sem histórico):** rejeitado — o produto pediu histórico/
  renegociação; o log só é capturável a partir do dia 1.
- **Só tabela (corrente derivado do último acordo):** rejeitado — encareceria
  toda leitura de membro com um `DISTINCT ON`; a coluna denormalizada resolve.
- **Saída por evento probabilístico:** adiado — a saída determinística no limite
  de atraso é testável e suficiente; o gatilho por evento (ADR-0004) pode vir
  depois sem migração.
- **Débito em transação única com o snapshot do turno:** não perseguido — segue o
  padrão já aceito (estado da banda atômico; snapshot do turno é histórico).
- **Salário inicial fixo/zero:** rejeitado — nasceria banda desbalanceada
  (membros infelizes) já na criação; o alvo dá um ponto de partida neutro.

## Consequências

**Positivas**
- Fecha o lado de **saída** da economia; o tick passa a ter entradas (royalties)
  e saídas (folha), com balanço líquido no saldo.
- Reaproveita `applyBandStateChanges` (estendido para atraso e remoção),
  `happiness`, o cálculo de fama e o tick — sem duplicação.
- Personalidade vira mecânica: traços de dinheiro (`greedy`/`purist`/…) mudam a
  expectativa salarial e, por consequência, o humor e o risco de saída.
- Cascade limpa histórico e relacionamentos ao sair/apagar um membro.
- Coberto por testes unitários (calculadora de alvo/humor, folha, ajuste, tick
  com débito/inadimplência/saída).

**Negativas / trade-offs**
- O tick deixa de ser neutro para humor e passa a poder remover membros — emenda
  explícita ao ADR-0006.
- O corrente vive em dois lugares (coluna + último acordo do histórico); a coluna
  é a fonte da verdade e o único caminho de escrita é o repositório, que grava os
  dois juntos — a divergência é evitada por construção.
- Muitos parâmetros econômicos (`SALARY_BASE`, pesos, multiplicadores de traço,
  `SALARY_ARREARS_LIMIT`, deltas de humor) exigem **balanceamento por
  playtesting**; começam como constantes versionadas. Sinergia futura com shows
  ao vivo (item 5, renda de base) para sustentar a folha no começo.
- Créditos de obras (`releases.credits`) referenciam ids de membros; a saída de um
  membro deixa referências soltas nos créditos históricos (aceitável, como as
  referências soltas de eventos em `turns`, ADR-0006).

## Referências
- Base: **design novo** (o frontend `game-music`, somente leitura, não modela
  economia nem salários). Reaproveita `Skills`, `characteristics`, `happiness`, o
  cálculo de fama e o tick.
- Implementação: [src/modules/band-members/](../../src/modules/band-members/)
  (salário, folha, ajuste), alterações no agregado em
  [src/modules/bands/](../../src/modules/bands/) (`applyBandStateChanges`
  estendido, salário inicial) e em [src/modules/turns/](../../src/modules/turns/)
  (débito da folha no tick).
- Migrations: `src/database/migrations/*-AddSalaryToBandMembers.ts`,
  `*-CreateMemberSalariesTable.ts`.
