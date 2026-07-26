# 0017 — Confraternizações (dinheiro para cuidar do elenco)

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0003 — Relacionamentos](0003-relacionamentos.md),
  [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md),
  [0016 — Shows ao vivo](0016-shows-ao-vivo.md)
- **Promove:** item 4 do [future-work](../future-work.md).

## Contexto

O caixa hoje só tem duas saídas: **produzir obras** e **pagar salários**. As duas
são obrigações. Não existe nenhuma forma de o jogador **gastar por escolha** para
melhorar a banda — e, ao mesmo tempo, humor e relacionamentos (ADR-0003) são
estados que só *pioram* com o tempo: salário atrasado, desgaste de estrada
(ADR-0016), eventos ruins. O jogador vê a relação entre dois integrantes
apodrecer e não tem nenhuma alavanca além de esperar.

Este ADR fecha esse loop: produzir gera dinheiro, e parte do dinheiro volta para
manter a banda inteira.

## Decisão

### 1. O jogador escolhe quem vai
Uma confraternização não é um botão que afeta "a banda": é uma **lista de
convidados**. Cada atividade tem uma faixa de vagas (`minParticipants` …
`maxParticipants`), e o efeito recai **só sobre quem foi**:

- **humor** — cada participante ganha `happinessGain`;
- **relacionamento** — `relationshipGain` é somado a **cada par entre os
  participantes**, e só a eles.

É isso que transforma o gasto numa decisão em vez de uma compra. Levar a banda
inteira ao jantar espalha um pouco para todo mundo; levar **só os dois que se
odeiam** ao retiro concentra tudo onde dói. O jogador olha o mapa de
relacionamentos e escolhe onde investir.

O custo acompanha: `baseCost + costPerParticipant × participantes`, multiplicado
por `1 + nível de fama × 0,06`. Banda famosa tem gosto caro — o mesmo jantar
custa quase o triplo no nível 30.

### 2. Sem limite por turno, com retorno decrescente
Diferente dos shows (ADR-0016 §6), **nada impede** uma segunda atividade no mesmo
turno. O freio é o efeito, não a regra: a n-ésima confraternização do período
rende `ACTIVITY_SATURATION_FACTORS[n]` = `[1; 0,5; 0,25; 0,1]` do previsto — e o
**custo continua cheio**.

Uma regra dizendo "só uma por turno" seria uma parede arbitrária; isto é uma
resposta do mundo. A segunda festa do semestre não tem a mesma graça, e o jogador
descobre isso pagando, que é como o jogo ensina o resto das suas regras.

Nos relacionamentos a saturação usa **`floor`**, não arredondamento: `level` é
`smallint`, e meio nível não existe. Na prática a segunda atividade do turno já
não move relacionamento nenhum — só humor, e pela metade.

### 3. A festa pode acabar mal, e vira decisão
Toda atividade tem uma `troubleChance`. Ela **não é fixa**: sobe com a hostilidade
de quem foi convidado.

```
chance = troubleChance + max(0, -piorRelação) × 0,06   (teto de 0,8)
```

Levar dois desafetos de nível −5 para uma festa é a única forma de consertar
aquela relação **e** a forma mais provável de piorá-la. O risco não é um imposto
aleatório: é o preço exato da jogada que mais compensa.

Quando o dado cai mal, o jogo **não resolve sozinho** — instancia um **evento
ativo** (ADR-0004) com o par mais hostil da lista de convidados. O evento entra na
fila normal de decisões e **segura o turno** como qualquer outro. Novos templates
com o tipo `confraternizacao`, que o gerador aleatório nunca sorteia (ele só
escolhe entre `conflito_membros`, `oportunidade_externa` e `decisao_criativa`):
são acessíveis **apenas** por esta porta.

Os efeitos bons são aplicados **de qualquer forma**. A festa aconteceu; o que deu
errado veio depois. Isso evita a leitura de "joguei dinheiro fora" e mantém a
aposta legível: você comprou humor e um risco.

### 4. Catálogo como dado de domínio
Cinco atividades versionadas em `activities.ts`, cada uma com um perfil distinto:

| atividade | base | /pessoa | vagas | humor | relação | risco |
|---|---|---|---|---|---|---|
| 🍽️ Jantar da banda | 120 | 60 | 2–6 | +0,4 | +1 | 5% |
| 🎉 Festa | 400 | 150 | 3–6 | +1,0 | +1 | 25% |
| ✈️ Viagem de fim de semana | 900 | 350 | 2–6 | +1,2 | +2 | 15% |
| 🏕️ Retiro criativo | 1 500 | 400 | 2–6 | +0,5 | +2 | 8% |
| 🛋️ Terapia de grupo | 800 | 300 | 2–4 | 0 | +3 | 2% |

A **terapia** é o extremo do eixo: não melhora o humor de ninguém (não é
divertido), quase não dá errado e é de longe a que mais conserta relação. A
**festa** é o oposto: barata em humor por real gasto, e a que mais explode.

### 5. Persistência e histórico
`band_activities` (append-only): atividade, ano, custo, **ids dos participantes**
(`jsonb`), deltas aplicados, se deu problema e o id do evento gerado. É o
histórico que responde `countByBandAndYear` para a saturação do §2 — nenhuma
coluna nova em `bands`.

## Consequências

- O caixa ganha uma **saída opcional**, e com ela a primeira decisão econômica que
  não é sobre produção: gastar em obra (retorno em dinheiro) ou em gente
  (retorno em humor, que volta como qualidade via `moodModifier` do ADR-0008).
- O mapa de relacionamentos (ADR-0003) deixa de ser leitura e vira **alvo**.
- Custos e chances são **chutes de balanceamento**, versionados como constantes.
  O ponto delicado é o multiplicador de fama: se ficar agressivo demais, bandas
  grandes param de confraternizar justo quando têm dinheiro.
- Uma atividade pode gerar um evento que bloqueia o turno logo depois de o jogador
  ter gastado — combinação frustrante se ele estava com pressa. É intencional
  (é o risco que ele comprou), mas merece atenção no playtest.
- Fica de fora: atividades que consomem turno, efeitos por traço (um `greedy`
  reagir diferente a uma viagem cara) e atividades individuais (levar **um**
  integrante para conversar). Todas cabem depois sem quebrar o formato.

## Referências
- Implementação: [src/modules/activities/](../../src/modules/activities/) e
  os templates `confraternizacao` em
  [active-event-templates.ts](../../src/modules/events/domain/data/active-event-templates.ts).
- Migration: `src/database/migrations/*-CreateBandActivitiesTable.ts`.
