# 0016 — Shows ao vivo (a renda de base)

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0006 — Turnos](0006-turnos.md),
  [0007 — Fama](0007-fama.md),
  [0008 — Obras musicais](0008-obras-musicais.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md),
  [0012 — Evolução dos integrantes](0012-evolucao-dos-integrantes.md),
  [0015 — Tempo de produção](0015-tempo-de-producao-e-saturacao.md)
- **Origem:** promove o item 5 do [backlog](../future-work.md) para decisão travada.

## Contexto

No começo do jogo a banda quase não fatura com obras: a receita escala com a
fama (`reachFactor`, ADR-0008) e uma banda anônima vende pouco — ainda por cima
em parcelas, ao longo de seis turnos. Do outro lado, a folha de pagamento corre
**todo turno** desde o primeiro (ADR-0010), e o ADR-0015 acabou de tornar o ciclo
de produção mais lento de propósito: um álbum ocupa três turnos antes de render
um centavo.

Faltava a renda que sustenta uma banda pequena na vida real: **tocar ao vivo**.
Bar, pub, noite de covers — dinheiro que entra **no mesmo turno**, sem depender
de fama alta nem de estúdio. É também o degrau que dá o que fazer nos turnos em
que a obra está sendo gravada.

## Decisão

### 1. Um show por turno — a agenda do semestre
Cada turno vale meio ano, então um "show" aqui **não é uma noite**: é a
**temporada** da banda naquele circuito (a série de apresentações do semestre).
Por isso vale **um por turno**, e por isso os cachês são de temporada, não de
noite.

A temporada **não consome o turno**: a banda pode tocar **enquanto grava**
(ADR-0015). O preço disso não é uma regra nova — é o **desgaste de humor** (§4),
que realimenta a qualidade da obra em produção pelo `moodModifier` (ADR-0008 §3).
Rodar a estrada durante a gravação do álbum é uma decisão com consequência, não
uma proibição.

### 2. Catálogo por circuito, com requisito de fama
`domain/data/gig-types.ts` (dado de domínio, no padrão dos formatos de obra):

| circuito | fama mín. | cachê base | custo | fãs base | desgaste |
|---|---|---|---|---|---|
| Noite de covers | 0 | 600 | 80 | 8 | 0,15 |
| Bares e botecos | 0 | 450 | 60 | 40 | 0,10 |
| Pubs e casas noturnas | 3 | 1 200 | 250 | 180 | 0,20 |
| Casas de show | 7 | 4 000 | 900 | 900 | 0,30 |
| Festivais | 12 | 15 000 | 3 500 | 6 000 | 0,50 |

O **requisito de fama** (nível derivado dos fãs, ADR-0007) é o portão: ninguém
chama uma banda anônima para um festival. O **custo** (deslocamento, estrutura)
é debitado junto com o cachê, e a banda precisa ter caixa para bancá-lo.

**Covers** é o degrau zero: paga **mais** que tocar o próprio repertório num bar
(a casa sabe o que vai receber), mas constrói pouquíssimo público próprio — o
`ownFansMultiplier` corta os fãs ganhos. É música dos outros.

### 3. O cachê e o público dependem da performance
Uma função pura (`domain/gig/gig.calculator.ts`) calcula a temporada:

```
stageSkill   = média ponderada das skills de palco dos integrantes
               (vocal, guitarra, baixo, bateria, piano — letras não sobem no palco)
mood         = 1 + (humor médio / 5) × GIG_MOOD_WEIGHT (0.2)
performance  = clamp(stageSkill/SKILL_MAX × mood × variância, 0, 1)
cachê        = base × (GIG_FEE_FLOOR (0.5) + performance) × fameFactor
fãs          = round(base × performance × ownFansMultiplier × fameFactor)
```

- **`fameFactor`** = `1 + log10(1 + fãs) × GIG_FAME_WEIGHT (0.2)` — a mesma ideia
  do `reachFactor` das obras, mas mais fraca: quem limita a casa é a casa.
- **`variância`** (±10%) entra como parâmetro, sorteada pelo caso de uso — a
  calculadora permanece pura e testável, como nos demais domínios.

Uma banda ruim ou infeliz tira metade do cachê e quase nenhum fã; uma banda
afiada tira 1,5×. É o "show ruim rende menos" do backlog, sem uma regra à parte.

### 4. Humor: desgaste da estrada, ou a noite que valeu
```
humorΔ = −desgaste + (performance − 0.5) × GIG_TRIUMPH_SWING (0.6)
```
Uma temporada morna cansa; uma temporada excelente **compensa** o cansaço e pode
até levantar a banda. Aplica-se a **todos os integrantes** (todo mundo sobe no
palco), clampado em `[HAPPINESS_MIN, HAPPINESS_MAX]`.

### 5. Tocar ao vivo treina o palco
Cada integrante evolui um pouco na **sua skill principal**, quando ela é de palco
— reaproveitando a curva do ADR-0012 (`grownSkill`, com retorno decrescente perto
do teto), com um peso pequeno (`GIG_SKILL_GAIN_WEIGHT = 0.25`) e a performance da
temporada no lugar da qualidade da obra. Estrada forma músico; menos que um
disco, mas forma.

### 6. Histórico próprio, aplicação atômica
Cada temporada vira uma linha em `band_gigs` (append-only: circuito, ano,
cachê, custo, fãs, performance, humor) — é o extrato que explica o caixa e
alimenta a aba de shows. Os efeitos (caixa, fãs, humor, skills) entram numa única
chamada de `applyBandStateChanges`, como no lançamento de uma obra.

O limite de **um por turno** é verificado contando as temporadas já registradas
no **ano vigente da banda** (`played_at_year`, que avança de 0,5 em 0,5).

### 7. Sem risco aleatório de desastre no MVP
Nada de "equipamento falha" ou "público hostil" como evento: a variância do §3 já
faz uma temporada render mal, e a máquina de eventos ativos (ADR-0004) é o lugar
certo para desastres — entram depois, se o playtest pedir.

## Persistência
- Tabela `band_gigs` — migration `CreateBandGigsTable`. Cascateia com a banda.
- Nenhuma coluna nova em `bands`: o limite por turno sai do próprio histórico.

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/gigs/types` | Catálogo de circuitos (requisito, cachê, custo, fãs) |
| `POST` | `/bands/:bandId/gigs` | Toca a temporada `{ gigTypeId }` e aplica os efeitos |
| `GET` | `/bands/:bandId/gigs` | Histórico de temporadas da banda |

## Alternativas consideradas
- **Show consome o turno:** rejeitado — com a produção já ocupando turnos
  (ADR-0015), o jogador ficaria sem nada para fazer; o custo em humor é um preço
  melhor que um bloqueio.
- **Vários shows por turno:** rejeitado — repõe o exploit que o ADR-0015 acabou
  de fechar (repetir a ação até o caixa encher).
- **Cachê fixo por circuito:** rejeitado — sem performance, a decisão de quando
  subir de circuito perde o tempero e as skills não importariam ao vivo.
- **Turnê multi-turno (com custo e retorno maiores):** adiada — bom candidato a
  um ADR próprio, junto de contratos (ADR-0009).
- **Registrar a temporada na timeline (evento passivo):** adiado — acoplaria
  `gigs` ao módulo de eventos; o histórico próprio já conta a história.

## Consequências

**Positivas**
- Destrava o começo do jogo: entra dinheiro **no mesmo turno**, sem depender de
  fama nem de estúdio, cobrindo a folha enquanto a primeira obra é gravada.
- Dá o que fazer nos turnos de produção e cria a tensão "rodar a estrada
  atrapalha o disco" sem nenhuma regra nova.
- Faz as skills importarem fora do estúdio e dá **outro caminho de progressão**
  (§5) para bandas que ainda não conseguem gravar.
- A fama vira portão de circuitos, dando um objetivo concreto a subir de nível.

**Negativas / trade-offs**
- Mais uma tabela de números para balancear (cachês, custos, fãs, desgastes);
  entram como dado de domínio versionado.
- Se o cachê de festival ficar generoso demais, obras viram acessório — é o risco
  a vigiar no playtest.
- O jogador tende a tocar **todo** turno (é quase sempre positivo); o freio é o
  humor, que pode não ser suficiente. Se não for, o próximo passo é energia
  própria ou desgaste crescente por temporadas seguidas.

## Referências
- Base: **design novo** (o frontend `game-music`, somente leitura, não modela
  shows). Reaproveita `describeFame` (ADR-0007), `applyBandStateChanges` e a
  curva de aprendizado do ADR-0012.
- Implementação: [src/modules/gigs/](../../src/modules/gigs/).
- Migration: `src/database/migrations/*-CreateBandGigsTable.ts`.
