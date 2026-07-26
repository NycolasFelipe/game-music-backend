# 0012 — Evolução dos integrantes ao publicar uma obra

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — bands/band-members](0002-modulos-bands-e-band-members.md),
  [0008 — Obras musicais](0008-obras-musicais.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md),
  [0011 — Crítica e público](0011-critica-e-publico.md)
- **Origem:** promove o item 3 do [backlog](../future-work.md) para decisão travada.

## Contexto

As `skills` de um integrante são **fixas desde a geração** (0..3 na criação, ADR-0002):
nada no jogo as move. Isso deixa o loop de produção sem progressão — gravar dez
discos não torna a banda melhor, só mais rica e mais famosa. O jogador não tem
como **formar** um músico: o elenco sorteado na fundação é o teto de qualidade da
banda para sempre.

Este ADR fecha o loop: **produzir desenvolve quem produziu**. Ao finalizar uma
obra (ADR-0008), cada **membro creditado** evolui nos **aspectos que cobriu** —
com ganho **decrescente perto do teto** e **escalado pela qualidade** da obra e
pelo **porte do formato**. Além do progresso técnico, a obra mexe no humor de
quem a fez (orgulho ou frustração).

A sinergia com o que já existe é direta: skill maior → obras melhores (ADR-0008)
e **salário-alvo maior** (ADR-0010 §2) — evoluir a banda **custa** mais folha,
o que dá tensão à decisão de quem creditar.

## Decisão

### 1. Ganho por par (membro creditado × aspecto)
Na finalização (`FinalizeReleaseUseCase`), para cada aspecto do `credits` e cada
membro creditado nele:

```
headroom      = (SKILL_MAX − skill) / SKILL_MAX                        // 1 → 0 perto do teto
qualityFactor = SKILL_GAIN_QUALITY_FLOOR + SKILL_GAIN_QUALITY_SPAN × (quality / 100)
ganho         = SKILL_GAIN_BASE × qualityFactor × formatWeight × headroom
skill'        = min(SKILL_MAX, skill + ganho)
```

- **`headroom`** dá o retorno decrescente: em skill 2 o ganho é integral; em 8,
  um quinto; em 10, zero. Ninguém **chega** a 10 — o teto é assintótico, o que é
  a curva certa para um jogo de longo prazo (e evita "banda perfeita" em 20 turnos).
- **`qualityFactor`** (0.4 … 1.6) é o "uma obra-prima ensina mais que um fracasso":
  contínuo sobre `quality`, não por tier — os degraus do tier já governam a
  economia; aqui a leitura fina é mais justa.
- **`formatWeight`** vem do catálogo de formatos (`skillGain`): um single ensina
  pouco (0.6), um álbum é uma temporada inteira de estúdio (1.4).

Só quem está **creditado** evolui, e só **nos aspectos em que foi creditado**:
quem tocou baixo no disco não melhora a escrita de letras.

### 2. Sem diluição por coautoria — creditar junto é **formar**
Um aspecto com três membros creditados dá o ganho **cheio aos três** (não se
divide). Isso é deliberado: creditar um novato ao lado de um veterano **puxa a
média de skill para baixo** (e portanto a `quality`, ADR-0008 §3) — o jogador
**paga em qualidade** para treinar alguém. É a mecânica de aprendizado do jogo, e
ela já se auto-limita: espalhar créditos para "farmar" evolução produz obras
piores, que por sua vez ensinam menos (§1) e rendem menos.

### 3. Skills passam a ser decimais (estado mutável)
`skills` deixa de ser inteiro e passa a valer **0..10 com 2 casas** (a coluna já
é `jsonb` — nenhuma migration). A progressão fica **visível a cada obra** em vez
de esperar um degrau inteiro, e as leituras existentes continuam válidas
(`computeSkillScore` divide por `SKILL_MAX`, `targetSalary` tira a média). O
**nível** (a parte inteira) continua sendo a linguagem de UI: quando a parte
inteira cresce, a obra registra um **`leveledUp`** — é o momento de comemorar.
O front exibe com 1 casa.

Rejeitada a alternativa "XP oculto + nível inteiro": exigiria coluna/tabela nova
e esconderia do jogador exatamente o feedback que esta feature existe para dar.

### 4. `primarySkill` não é recalculado
O "instrumento principal" continua o da geração, mesmo que outra skill o
ultrapasse: ele guia a **biografia** já escrita do personagem (ADR-0002) e é
identidade, não ranking. Trocá-lo automaticamente criaria incoerência entre a
biografia e a estrela exibida no card.

### 5. Orgulho da obra (humor)
Os creditados reagem ao resultado, proporcionalmente à qualidade:

```
humorΔ = clamp((quality − PRIDE_NEUTRAL_QUALITY) / 50, −1, 1) × PRIDE_HAPPINESS_MAX
```

Uma obra-prima dá **+0.5** de humor; um fracasso tira até **0.5** (é frustração,
não só orgulho — simétrico e mais interessante que um bônus unilateral). Quem não
foi creditado não sente nada: não era obra dele. O humor entra clampado em
`[HAPPINESS_MIN, HAPPINESS_MAX]` e realimenta a próxima obra pelo `moodModifier`
(ADR-0008 §3).

### 6. Aplicação atômica, **depois** da avaliação
A obra é avaliada com as skills **de quem a gravou** — a evolução é consequência,
não insumo. Os novos valores absolutos de `skills` e `happiness` entram na
**mesma** chamada de `applyBandStateChanges` que já grava saldo e fãs, portanto
na mesma transação. `BandStateChangesInput` ganha `memberSkills`
(`{ memberId, skills }`, valores absolutos, no padrão das demais chaves).

Créditos apontando para membros que **não estão mais na banda** (saíram por
inadimplência, ADR-0010 §6) são ignorados — coerente com a `quality`, que já os
ignora.

### 7. Registro na própria obra (sem migration)
O que cada obra formou é persistido em `releases.details.growth` (o `jsonb` já
existente), como uma lista de
`{ memberId, name, happinessDelta, gains: [{ skill, from, to, leveledUp }] }`.
Assim a discografia conta a história ("foi neste disco que Ana virou nível 5") sem
tabela nova, sem coluna nova e sem consulta extra — a `ReleaseView` já expõe
`details`. Guarda-se o **nome** junto do id porque o membro pode sair da banda
depois; o registro histórico precisa continuar legível.

Obras lançadas antes desta feature ficam sem `growth` (undefined) — sem backfill,
como no ADR-0011 §7.

### 8. Exibição
- **Modal de revelação** (ADR-0011 §5) ganha uma etapa final "A banda evoluiu",
  depois da crítica e do público: por membro creditado, os aspectos que subiram
  (`Letras 4.2 → 4.6`), com destaque quando houve `leveledUp`, e o humor.
- **`ReleaseCard`** mostra a evolução junto dos créditos, de forma compacta.
- A aba **Integrantes** e o "Perfil de habilidades" das estatísticas passam a se
  mover sozinhos — nenhuma mudança além de formatar decimais.

## Persistência
Nenhuma migration. `band_members.skills` (`jsonb`) passa a receber decimais e
`releases.details` (`jsonb`) passa a guardar `growth`.

## Endpoints
Nenhum endpoint novo. `POST /bands/:bandId/releases/:releaseId/finalize` passa a
devolver, em `details.growth`, o que a obra formou.

## Alternativas consideradas
- **Ganho diluído entre os coautores do aspecto:** rejeitado — a média de skill
  já penaliza creditar gente fraca; diluir puniria duas vezes e mataria a
  mecânica de mentoria (§2).
- **Ganho por tier (fracasso → obra-prima) em vez de contínuo:** rejeitado — os
  tiers governam a economia; aqui um degrau faria uma obra de 74 ensinar bem menos
  que uma de 75 sem motivo narrativo.
- **XP oculto acumulando até subir um nível inteiro:** rejeitado — nova
  coluna/tabela e feedback pior (ver §3).
- **Evoluir todos os membros da banda (não só os creditados):** rejeitado — anula
  a decisão de quem creditar, que é o coração da mecânica.
- **Recalcular `primarySkill`:** rejeitado (§4).
- **Tabela de histórico de evolução (`member_skill_changes`):** adiado — o
  registro por obra em `details.growth` já conta a história; uma tabela própria só
  se aparecer consulta agregada ("evolução do membro no tempo").

## Consequências

**Positivas**
- Fecha o loop de progressão: produzir → evoluir → obras melhores → mais fama.
- Dá **peso à escolha dos créditos**: creditar o novato treina, mas custa
  qualidade — decisão de curto vs longo prazo a cada obra.
- Casa com a economia existente: skill maior sobe o **salário-alvo** (ADR-0010),
  então uma banda que evolui precisa faturar mais para manter o elenco feliz.
- Cálculo **puro e testável** (sem `Math.random` — a variância já entrou na
  `quality`) e sem migration.

**Negativas / trade-offs**
- Mais parâmetros de balanceamento (`SKILL_GAIN_*`, `skillGain` por formato,
  `PRIDE_*`) — constantes versionadas, sujeitas a playtesting.
- Skills decimais quebram a suposição "inteiro" de qualquer leitura futura que
  formate sem arredondar (as atuais foram ajustadas).
- Custo de folha cresce sozinho ao longo da campanha (via salário-alvo); se o
  balanceamento da receita não acompanhar, a evolução vira armadilha econômica.
- `details.growth` guarda nome do membro (denormalizado) — é registro histórico,
  não fonte de verdade.

## Referências
- Base: **design novo** (o frontend `game-music`, somente leitura, não modela
  evolução de skills).
- Implementação: [src/modules/releases/](../../src/modules/releases/)
  (`domain/growth/`, `finalize-release.use-case.ts`) e
  [src/modules/bands/](../../src/modules/bands/) (`applyBandStateChanges`).
