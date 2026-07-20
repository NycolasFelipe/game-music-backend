# 0009 — Gravadoras e contratos (economia realista)

- **Status:** Aceita (implementação pendente — fase pós-MVP)
- **Data:** 2026-07-19
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — bands/band-members](0002-modulos-bands-e-band-members.md),
  [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0006 — Turnos](0006-turnos.md),
  [0007 — Fama](0007-fama.md),
  [0008 — Obras musicais](0008-obras-musicais.md)
- **Emenda:** estende a economia do ADR-0008 (camada de contrato) e o tick do
  ADR-0006 (cadência, ofertas, eventos obrigatórios).

## Contexto

Com as obras musicais (ADR-0008) a banda produz discos no **modo independente**:
autofinancia, alcança pouco, e fica com 100% de uma receita pequena. Falta a
peça que dá tensão econômica de longo prazo: as **gravadoras**. Uma gravadora
banca e divulga a banda (mais alcance, mais fãs, mais dinheiro), mas cobra caro
por isso — retém um percentual, adianta dinheiro que precisa ser **recuperado**,
e impõe exigências que podem atritar com a personalidade dos membros.

Como o frontend de referência `game-music` **não modela nada disso** (nem obras,
nem economia — confirmado em varredura), este é um **design novo**. As decisões
de fidelidade à indústria (sem cadeado de formato, adiantamento recuperável,
trilhas separadas de gravação e composição) foram tomadas junto ao produto e já
estão **parcialmente ancoradas no schema do ADR-0008** (duas trilhas de receita).

Este ADR registra a **decisão de arquitetura**; a implementação é uma fase
posterior ao MVP (o núcleo de obras independente das Fases 1–5 já roda e foi
validado e2e).

## Decisão

### 1. Módulo novo `labels`
Mesma estrutura em camadas dos demais módulos. Guarda as **gravadoras**
(catálogo) e os **contratos** (vínculo banda↔gravadora). Grafo de dependências
acíclico: `labels → bands`; `releases → labels` (a obra lê o contrato ativo para
aplicar cut/recoupment/alcance); `turns → labels` (cadência, ofertas, eventos
obrigatórios). Registrar `LabelsModule` antes de `ReleasesModule` e `TurnsModule`.

### 2. Catálogo curado por tier (dado de domínio)
As gravadoras são um conjunto **fixo, nomeado e versionado** em
`labels/domain/data/labels.ts` (como os gêneros/temas — fonte da verdade no
backend), organizadas por tier: **Indie → Regional → Nacional → Major**. Cada
tier define os multiplicadores e o rigor das exigências (ver §6). "Independente"
(sem contrato) é um **estado**, não uma gravadora. Geração procedural e nomes
gerados foram rejeitados no MVP (mais difícil de balancear e dar identidade).

### 3. Formato é escolha, não permissão (realismo)
Confirmado o que o ADR-0008 §4 já adotou: **sem cadeado de formato**. Uma banda
independente pode tentar qualquer formato; a gravadora não "libera" formatos —
ela destrava **orçamento, alcance e distribuição**. Um selo maior torna formatos
ambiciosos viáveis por reduzir o custo efetivo e amplificar o alcance, não por
conceder permissão.

### 4. Contratação: propostas + mercado
A banda consegue um contrato por **dois caminhos** (ambos):
- **Propostas espontâneas** — no tick do turno (ADR-0006), quando a fama/qualidade
  recente da banda cruza o limiar de um tier, uma gravadora daquele tier gera uma
  **oferta** (A&R vindo atrás). Ofertas têm validade (expiram após N turnos).
- **Mercado** — a banda navega o catálogo de gravadoras compatíveis com sua fama
  e se candidata a um selo.

### 5. Termos fixos por gravadora
Cada gravadora oferece **termos fixos** (aceita ou recusa; sem negociação no
MVP): `cut` (percentual retido), `advance` (adiantamento), `cadenceTurns`
(cadência mínima de produção) e o pacote de exigências. Negociação vai-e-vem fica
para um ADR futuro.

### 6. Economia realista: duas trilhas + recoupment
A economia do ADR-0008 ganha uma **camada de contrato**. Há duas trilhas de
receita, já separadas no schema do 0008:
- **Gravação (master):** ao **assinar**, a gravadora paga o `advance` →
  `balance += advance` e `recoupmentRemaining = advance`. Sob contrato, o **custo
  de produção é financiado** pela gravadora (somado ao `recoupmentRemaining`, não
  debitado do caixa). A parte da banda na receita de gravação é
  `master × (1 − cut)`; enquanto `recoupmentRemaining > 0`, essa parte **abate o
  adiantamento** (não cai no caixa); depois de recuperado, o excedente pinga no
  caixa. O **alcance/fãs** é multiplicado pelo fator do tier (selo maior → mais
  fãs).
- **Composição (publishing):** vai **direto para o caixa da banda**, sempre —
  **sem cut e sem recoupment** (atribuída ao crédito de Letras). É o que a banda
  recebe mesmo estando "no vermelho" do adiantamento; é o que faz o contrato ser
  um dilema real e dá peso a quem é creditado em Letras.

No **modo independente** nada disso se aplica (comportamento atual do 0008: paga
o custo, alcance baixo, 100% das duas trilhas).

### 7. Exigências da gravadora
- **Cadência** — se a banda ficar mais de `cadenceTurns` sem lançar, o tick
  aplica uma **penalidade** (multa do caixa e/ou perda de fãs) e, em quebra grave
  ou reincidência, **rescinde** o contrato.
- **Cut** — retido da trilha de gravação (§6).
- **Eventos obrigatórios** — periodicamente (chance por turno sob contrato) a
  gravadora impõe um **evento ativo** (turnê, comercial, colab forçada) que
  **irrita membros com certos traços** (ex.: `purist`, `spiritual`, `greedy`),
  mexendo em humor/relacionamento. Reaproveita a máquina de eventos ativos
  (ADR-0004) e o catálogo de características.

### 8. Encaixe no tick e nas obras
- `FinalizeReleaseUseCase` e `AccrueReleaseRoyaltiesUseCase` (ADR-0008) passam a
  ser **cientes do contrato**: se houver contrato ativo, aplicam cut, recoupment
  e o alcance do tier sobre a trilha de gravação; a de composição segue direta.
- `AdvanceTurnUseCase` (ADR-0006) ganha, no tick: geração de ofertas (banda sem
  contrato), checagem de cadência (banda com contrato) e a chance de evento
  obrigatório. Continua **neutro para fãs/humor/relacionamentos por si só** — as
  mudanças vêm de resolução de eventos e das regras de contrato aqui descritas.

## Persistência

Gravadoras são **dado de domínio** (sem tabela). Novas tabelas:
- `contracts`: `id`, `band_id` (FK→bands, cascade), `label_id` (varchar, refere o
  catálogo), `status` (`ativo`|`encerrado`), `cut` (`numeric`), `advance`
  (`numeric`), `recoupment_remaining` (`numeric(12,2)`), `cadence_turns` (int),
  `last_release_year` (`numeric(6,1)`, nullable), `signed_at_year`
  (`numeric(6,1)`), `created_at`. Índice em `band_id`.
- `label_offers`: `id`, `band_id` (FK→bands, cascade), `label_id`, `terms`
  (`jsonb` — cut/advance/cadence/exigências), `status`
  (`pendente`|`aceita`|`recusada`|`expirada`), `created_at`, `expires_at_year`
  (`numeric(6,1)`). Índice em `band_id`.

Migrations: `CreateContractsTable` + `CreateLabelOffersTable`, com os **próximos
números livres na época da implementação** (as `013000`/`014000` já foram usadas
por snapshots de turno). Sem novas colunas em `bands` (o recoupment mora no
contrato).

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/labels` | Catálogo de gravadoras por tier (metadados) |
| `GET`  | `/bands/:bandId/label-offers` | Ofertas pendentes para a banda |
| `GET`  | `/bands/:bandId/labels/market` | Gravadoras compatíveis com a fama atual |
| `POST` | `/bands/:bandId/contracts` | Assinar (de uma oferta ou do mercado) |
| `GET`  | `/bands/:bandId/contract` | Contrato ativo da banda |
| `POST` | `/bands/:bandId/contract/terminate` | Rescindir (com penalidade) |

Escopados por dono, sob `@UseGuards(JwtAuthGuard)`; assinar responde `201`,
ações respondem `200`.

## Alternativas consideradas
- **Cadeado de formato para banda independente:** rejeitado por realismo — formato
  é escolha artística; a gravadora muda custo/alcance, não permissão (§3).
- **Adiantamento como bônus não-recuperável:** rejeitado — sem recoupment o
  contrato vira "dinheiro grátis"; o recoupment é o que o torna um dilema (§6).
- **Receita agregada (uma trilha só):** rejeitado — separar gravação de composição
  é o que mantém uma renda fluindo durante o recoupment e dá sentido ao crédito de
  Letras (§6).
- **Gravadoras geradas proceduralmente:** rejeitado no MVP — difícil balancear e
  dar identidade; catálogo curado por tier (§2).
- **Termos negociáveis:** adiado — mini-sistema à parte; termos fixos já criam
  decisão interessante (§5).

## Consequências

**Positivas**
- Fecha o ciclo econômico de longo prazo: independente (autofinanciado, baixo
  alcance) → assinar (adiantamento + alcance, mas cut + recoupment + exigências) →
  recuperar o adiantamento → lucro de gravação.
- Fiel à indústria (advance recuperável, cut, master vs publishing, A&R +
  demo-shopping, obrigações de promo) sem inflar demais o escopo.
- Reaproveita eventos ativos, características, fama e o schema de duas trilhas já
  existente; nenhuma coluna nova em `bands`.

**Negativas / trade-offs**
- `FinalizeRelease`/`AccrueReleaseRoyalties` deixam de ser "independentes" e
  passam a consultar o contrato ativo — acoplamento `releases → labels` novo (mas
  acíclico).
- O tick do turno cresce (ofertas + cadência + eventos obrigatórios), ficando mais
  caro por avanço.
- Muitos parâmetros por tier (cut, advance, cadence, multiplicadores, chance de
  evento) exigem **balanceamento por playtesting**; começam como constantes.
- Recoupment é estado contábil que evolui por várias operações (assinar, finalizar,
  royalties) — exige cuidado de atomicidade em cada passo.

## Referências
- Base: **design novo** — o frontend `game-music` (somente leitura) não modela
  gravadoras nem economia. Reaproveita características (traits), fama e o schema de
  duas trilhas de receita do ADR-0008.
- Decisões de produto travadas: modo independente vs assinada, contratação por
  propostas + mercado, catálogo curado por tier, termos fixos, economia realista
  (sem cadeado de formato, adiantamento recuperável, master + publishing).
- Implementação: **pendente** (fase pós-MVP) — módulo `src/modules/labels/`;
  alterações previstas em `src/modules/releases/` (contrato-ciente) e
  `src/modules/turns/` (ofertas/cadência/eventos obrigatórios); migrations
  `*-CreateContractsTable.ts`, `*-CreateLabelOffersTable.ts`.
