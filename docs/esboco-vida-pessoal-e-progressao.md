# Esboço: vida pessoal dos integrantes e progressão

- **Status:** Esboço com as decisões do dono e três revisões; ainda sem ADR e sem implementação
- **Data:** 2026-11-13
- **Itens do backlog:** [10 e 11 do trabalho futuro](future-work.md)
- **Toca em:** [0010 — Salários](adr/0010-salarios-por-integrante.md),
  [0012 — Evolução](adr/0012-evolucao-dos-integrantes.md),
  [0016 — Shows](adr/0016-shows-ao-vivo.md),
  [0017 — Confraternizações](adr/0017-confraternizacoes.md),
  [0021 — Humor do show](adr/0021-humor-do-show-relativo-a-casa.md),
  [0022 — Painel do turno](adr/0022-painel-do-turno.md),
  [0026 — Tom](adr/0026-tom-de-voz-dos-textos.md),
  [0031 — Eventos únicos](adr/0031-eventos-unicos-por-save.md),
  [0032 — Clima](adr/0032-clima-da-banda-com-peso-nas-escolhas.md)

Duas ideias do dono, desenhadas juntas porque uma alimenta a outra:

1. **Vida pessoal:** cada integrante pode entrar num arco próprio (vício,
   problemas com a lei, saúde, ego) que escala ao longo de vários turnos e pode
   terminar em reabilitação, prisão, saída ou morte.
2. **Progressão:** dar ao jogador escolhas de crescimento (especializações dos
   integrantes e uma estrutura da banda) e um motivo para continuar jogando
   depois que o dinheiro vira placar.

O corpo do documento descreve o estado atual do desenho. O
[histórico de decisões](#histórico-de-decisões) registra o que o dono decidiu em
cada revisão, as [números da simulação](#números-da-simulação) trazem os valores
propostos para a ADR, e as [referências](#referências-da-pesquisa) resumem o levantamento
feito em outros jogos.

---

## O que o jogo já tem e o que falta

| Sistema | Hoje | Lacuna |
|---|---|---|
| Humor | −5..5, volta 5% ao neutro por turno; ≤ −4 por dois avanços faz o integrante sair (ADR-0032) | O integrante só tem um jeito de "dar errado", e ele é lento e previsível |
| Traços | 32 traços fixos com opostos e raridade (`characteristics.ts`) | Traços como Errático, Deslumbrado e Carente de Validação têm pouco peso mecânico |
| Saídas | Arquivo de ex-integrantes com motivo `salario_atrasado` ou `humor`; toda saída custa 10% dos fãs. Demitir pela API só apaga o integrante, sem Arquivo nem perda de fãs | As saídas se parecem e não geram história, e demitir escapa da regra |
| Skills | Sobem com os créditos e com os shows (só a principal), com teto assintótico em 10 (ADR-0012) | A evolução acontece sozinha, e o jogador nunca escolhe *como* alguém cresce |
| Show | A performance é a média dos integrantes (`stageSkill`) | Tirar o integrante mais fraco melhora o show |
| Fama | 30 níveis; uma partida típica chega a ~700 mil fãs (nível 14) em 80 turnos | Os níveis 0 a 6 passam em poucos turnos e os 12 a 14 levam ~46 turnos, então a sensação de avanço some na segunda metade |
| Dinheiro | Restrição só no começo; vira placar depois do T14 (intenção do dono) | Faltam usos para o dinheiro no fim do jogo e tensão vinda de outros sistemas |

**O placar da partida são os fãs** (decisão do dono). Toda regra deste esboço
é julgada pelo efeito em fãs; o dinheiro só pesa no começo.

---

# Parte 1: vida pessoal dos integrantes

## 1.1 Conceito: condições com estágios

Uma **condição** é um estado persistente de um integrante que avança em
estágios. Cada avanço de estágio passa por um **momento** (um evento pessoal com
escolha). Entre os momentos, o jogo mostra **sinais** no painel. O modelo vem de
três referências: a escada tolerância → dependência → abstinência de vícios do
RimWorld, o estresse acumulado com quebras do Crusader Kings 3 e o *storylet*
(narrativa por qualidades) da Failbetter, em que cada trecho só aparece quando o
estado permite.

```
  pressão sobe (traços, humor, fama, exposição)
          │
          ▼
  [sinal no painel] ──► fila ──► [momento: estágio 1] ──► sinais ──► fila ──► [momento: estágio 2] ──► … ──► desfecho
                                        │                                            │
                                        └── intervir / conversar ────────────────────┴──► recuperação
```

### Catálogo inicial (quatro condições)

| Condição | Estágios | Desfechos possíveis |
|---|---|---|
| **Vício** (texto sem nomear substância, para valer em qualquer época) | 1. Uso social · 2. Hábito · 3. Dependência · 4. Crise (UTI) | Recuperação sozinho, reabilitação, recaída, hospitalização, morte |
| **Encrenca com a lei** | 1. Ocorrência · 2. Processo · 3. Julgamento | Absolvição, multa, serviço comunitário, prisão por N turnos; pena longa vira saída |
| **Saúde do instrumento** (tendinite, calo vocal, coluna do baterista) | 1. Dor · 2. Lesão · 3. Afastamento | Recuperação, cirurgia, sequela (teto de uma skill cai) |
| **Ego** (o integrante que se acha maior que a banda) | 1. Projeto paralelo · 2. Disco solo · 3. Ultimato | Volta humilde, concessão de crédito ou salário, saída para carreira solo |

Burnout e escândalo como arcos próprios ficam para uma segunda leva. O
vazamento do "encobrir" (1.3) entra já no primeiro corte, junto com o vício.

## 1.2 Pressão e fila

### De onde vem a pressão

A cada avanço de turno, cada integrante sem condição ativa rola o risco de
começar uma. O risco cresce com fatores que o jogo já conhece:

```
risco(condição) = base(fase de fama)
                × traços
                × humor (≤ −2 aumenta: o integrante procura consolo)
                × exposição (festa no convívio, opções de evento do tipo "liberar o camarim", shows seguidos)
                × histórico (quem já teve a condição tem chance maior de recaída, limitado a ×2 junto com os traços)
```

- **Fase de fama:** quase nulo na garagem e crescente nas casas e no nacional,
  onde há dinheiro e acesso. Isso põe o risco na metade do jogo que precisa de
  tensão.
- **Traços que aumentam o risco:** Errático, Deslumbrado, Carente de Validação e
  Inseguro (vício); Cabeça Quente e Paranoico (lei); Perfeccionista e
  Workaholic (saúde); Individualista, Deslumbrado e Genial (ego).
- **Traços que reduzem:** Estável, Profissional e Leal, cada um na sua condição.
- **Porta de entrada escolhida:** o vício também começa por uma opção que o
  jogador escolhe (1.4).
- **Um arco só começa se o catálogo tiver a cadeia inteira de momentos ainda não
  usados no save** (todos os estágios e uma recaída). A cadeia fica reservada ao
  abrir o arco. Assim a falta de texto reduz o número de arcos, e nenhum estágio
  fica sem momento (ADR-0031 §4).

### Fila de momentos

- **Arcos sem limite** (decisão do dono): cada integrante pode ter o próprio
  arco aberto.
- **Um momento por turno.** Os momentos esperam numa fila, e **um estágio só
  avança no turno em que o seu momento aparece**. Assim nenhum arco pula uma
  decisão enquanto espera, e o jogador nunca perde dois integrantes no mesmo
  semestre por azar.
- **A UTI ocupa a vaga do turno** em que aparece, na frente de qualquer outro
  momento.
- **A fase sombria tem relógio.** Nos estágios 2 e 3 do vício, a pressão sobe
  numa taxa fixa por turno, mesmo enquanto o momento espera na fila. Esperar não
  congela o risco.

## 1.3 Agência: as posturas

Cada momento oferece um conjunto fixo de *posturas*, com textos próprios por
condição e estágio. O nome da opção diz o que o jogador faz (ADR-0026 §3.2).

Os custos em dinheiro usam a **receita do turno anterior**, com mínimo de **1×
a folha do turno**, para não sumirem no fim do jogo nem zerarem num turno sem
receita. Como o dinheiro vira placar depois do T14, toda postura tem também um
custo fora do dinheiro (decisão do dono).

| Postura | Custo | Efeito | Conta como recusa? |
|---|---|---|---|
| **Intervir** | 10% da receita do turno anterior, humor do integrante e alguns turnos de afastamento (clínica, advogado, fisioterapia) | Encerra a condição ou a faz regredir ao estágio 1, com boa chance | Não |
| **Conversar** | Barato em dinheiro; ocupa o tempo de um colega | Funciona melhor quando alguém tem relação ≥ 3 com o integrante (≥ 2 com *Banda família*); esse amigo entra no elenco do momento | Não (decisão do dono) |
| **Ignorar** | Nenhum agora | Mantém o bônus da condição (1.4) e deixa a pressão subir | Sim |
| **Encobrir** | 10% da receita do turno anterior, dobrando a cada uso no mesmo arco, e relação com quem sabe do segredo | Evita a perda de fãs agora. No fim do arco, o jogo checa uma vez se vazou, com chance de 1 − 0,75^(usos de encobrir); se vazar, a perda evitada volta em dobro | Sim |
| **Expulsar** | Humor de quem gostava do integrante | Saída imediata. Do estágio 2 ao penúltimo custa 5% dos fãs, a menos que o integrante esteja em risco de sair por humor (≤ −4); no estágio 1, no último ou em risco por humor, 10% | Encerra o arco |

O jogador sempre vê o estágio atual quando o momento aparece. A pressão entre um
momento e outro fica escondida e é comunicada por sinais em texto no painel
("{character1} chegou ao ensaio de óculos escuros. O ensaio era em lugar
fechado."). A previsão do turno (ADR-0022) mostra o risco do próximo momento em
faixa: baixo, alto ou iminente.

## 1.4 A tentação: risco com recompensa

Para que "ignorar" seja uma escolha de verdade, as condições rendem alguma
coisa enquanto duram.

- **Vício, porta de entrada:** o padrão mais sólido da pesquisa (Crusader Kings
  3, Darkest Dungeon, Rockstar!) é o vício nascer como *alívio que o jogador
  escolhe*. Quando um integrante está com humor ≤ −2, o convívio e alguns
  eventos ganham uma opção do tipo "deixar {character1} relaxar do jeito
  {character1:dele|dela|de sempre}": o humor sobe na hora e a pressão de vício
  sobe junto. O sorteio do tick é o caminho secundário.
- **Vício, estágios 2 e 3, a "fase sombria"** (aposta nossa, aprovada pelo dono;
  nenhum jogo pesquisado faz isso):
  - **Na obra:** se pelo menos um creditado em letras ou composição está na fase
    sombria, a obra ganha +5% a +10% de qualidade. O bônus vale **uma vez por
    obra**, por mais creditados que estejam na fase.
  - **No palco:** com alguém na fase sombria, a decisão do show (ADR-0031 §2)
    ganha uma opção extrema, noite genial ou desastre, com a chance mostrada
    antes da escolha.
- **Ego, estágio 1:** o projeto paralelo traz fãs novos para a banda principal
  enquanto o integrante ainda está nela.
- **Encrenca com a lei, estágio 1:** dependendo do estilo da banda, a ocorrência
  dá fama de "perigosos" (fãs sobem um pouco em estilos agressivos e caem em
  estilos mais comportados).
- **Saúde:** sem recompensa. A tentação é continuar tocando para não perder o
  cachê, e o custo é a sequela.

## 1.5 Regras contra a frustração

A perda permanente só é justa quando o jogador viu o desastre chegando e
escolheu não agir.

1. **Morte só no último estágio do vício**, e só depois de pelo menos duas
   recusas no arco (ignorar ou encobrir). Intervir e conversar nunca contam como
   recusa, então a falta de dinheiro não força uma morte. Nenhuma condição
   começa já grave.
2. **UTI antes da morte.** O estágio de crise leva a um estado de UTI que dura
   um turno e ocupa a vaga de momento desse turno, no modelo da Death's Door do
   Darkest Dungeon. Nesse turno ainda dá para intervir, com custo alto. Se o
   jogador deixar passar também essa chance, o integrante morre com 20% de
   chance; senão, sobrevive e o arco volta ao estágio 1 (decisão do dono, depois
   da simulação: com morte certa, o descuidado perdia alguém em 57% a 67% das
   partidas).
2b. **Recuperação e recaída.** Ao recusar, o arco pode se encerrar sozinho, com
   30%, 15% e 5% de chance nos estágios 1, 2 e 3. Cada arco tem no máximo uma
   recaída: a segunda volta ao estágio 1 encerra o arco.
3. **Pelo menos um sinal no painel antes de cada momento.** Os sinais ficam fora
   da regra de nunca repetir, para nunca faltarem. A previsão mostra o risco em
   faixa.
4. **A morte vale em todo save.** O dono descartou uma opção para desligá-la. As
   regras 1 a 3 são a única proteção do jogador, então os testes do motor de
   condições precisam garantir cada uma delas.
5. **Metas de frequência**, a medir por simulação como na ADR-0032. Proposta
   inicial: morte em menos de 2% das partidas do jogador atento e em 15% a 25%
   das do descuidado; prisão em 10% a 20% das partidas; pelo menos um arco
   aberto em 80% das partidas.

## 1.6 Desfechos

### Afastamento (reabilitação, prisão, lesão)

O integrante continua na banda com um status `afastado até o turno X`. Enquanto
afastado, ele não toca e não pode ser creditado.

- **Salário:** quem está em reabilitação ou lesionado continua recebendo. Quem
  está preso tem o salário suspenso, e a suspensão não conta como atraso
  (ADR-0010).
- **Humor do preso:** cai 0,2 por turno, sem a penalidade de salário, e o
  `lowMoodTurns` fica congelado até ele voltar.
- **Pena longa:** uma prisão acima de um limite (proposta: 8 turnos) vira saída
  com motivo `prisao` e custa os 10% de fãs de qualquer saída.
- **Cobertura no palco:** o instrumento do afastado passa a ser coberto pelo
  próximo integrante com aquela skill principal ou com a especialização
  "segunda função" naquele instrumento (2.2 B). Se ninguém cobrir, a banda pode
  contratar um **músico de aluguel** para aquele instrumento, com skill de
  mín(skill do afastado, piso da fase) × 0,8 e custo de 5% da receita do turno
  anterior por turno. Por essa fórmula, afastar alguém nunca melhora o show.
- **Bloqueio do show:** só quando 2 entre voz, guitarra e bateria (os maiores
  pesos de palco) ficam descobertos por afastamento e sem músico de aluguel. A
  tela de criação e a de recrutamento mostram a cobertura de palco da banda.

### Obra em produção com alguém fora

Quem sai ou é afastado no meio de uma produção, por qualquer motivo (morte,
expulsão, prisão, reabilitação), conta na obra pela **fração dos turnos de
produção que trabalhou**. A mesma regra para todos impede que a morte renda mais
que a reabilitação.

### Morte

- O integrante vai para o Arquivo com o motivo `morte`.
- **Fãs:** a morte custa os 10% de qualquer saída (ADR-0032 §5), ou 7% com
  *Banda família* (2.2 A).
- **Luto:** cada colega perde humor proporcional à relação que tinha com o
  falecido; pela metade com *Banda família*. Quem tinha relação negativa sente
  menos. O luto é calculado antes do arquivamento, enquanto as relações ainda
  existem.
- **Efeito póstumo:** royalties ×1,2 por 2 turnos, só das obras finalizadas antes
  de o arco chegar ao estágio 3. Os fãs não sobem. O efeito é pequeno de
  propósito, para que lançar um disco no turno da UTI não renda nada a mais. É o
  lado cínico da indústria, que o tom do jogo já trata como alvo.
- **Obra tributo:** a próxima obra pode ser dedicada ao integrante, com um texto
  próprio na revelação e um bônus de público limitado a 25% dos fãs que a morte
  custou.

### Saída para carreira solo

Saída comum com motivo `carreira_solo`. O ex-integrante virar um rival na
parada depende do item 7 do backlog (chart de artistas).

### Banda com menos de 3 integrantes

Abaixo de 3 integrantes, por qualquer perda definitiva, o avanço fica bloqueado
até o jogador recrutar (item 6 do backlog), e a banda nunca acaba. Para que isso
nunca trave a partida por falta de caixa, a lista de recrutamento sempre traz um
**candidato da casa**: contratação sem custo, skills de 0 a 2 e salário-alvo
×0,8. Os outros candidatos são gerados e gravados pelo servidor, escolhidos por
id, com skills de 0 a 3 mais um bônus da fase de fama, e custam ≈ 2× o
salário-alvo. Demitir passa pelo mesmo caminho das saídas: Arquivo, −10% de fãs
e golpe no humor de quem gostava do demitido.

## 1.7 Show por cobertura

O show deixa de usar a média dos integrantes e passa a cobrar a **cobertura de
cada instrumento**: a skill do melhor integrante disponível cuja skill principal
é aquele instrumento (ou que tem a "segunda função" nele), com os pesos de palco
atuais (`STAGE_SKILL_WEIGHTS`). As letras continuam fora do palco (ADR-0016).

Como a performance passa a crescer com a skill principal (de ~0,25 no começo a
0,8–1,0 no fim), uma expectativa fixa por casa deixaria o humor preso em +5. Por
isso a casa passa a esperar o nível que a banda já mostrou (**plateia
exigente**, decisão do dono):

```
esperado = máx(expectativa atual da casa, 0,85 × média das últimas 4 performances)
```

O fator 0,85 saiu da simulação (com 0,9, o humor do jogador atento ficava em
+1,84 no T26, abaixo do alvo). Uma queda (por exemplo, por um afastamento) pesa
no humor. No fim do jogo, o humor do jogador atento chega a +4,3, um pouco acima
do teto de +4; o dono aceitou, porque a tensão do fim vem dos arcos pessoais.

**Covers e bar não exigem saldo mínimo**: o custo da casa sai do cachê. Assim
uma banda sem caixa sempre consegue tocar, e o candidato da casa nunca entra num
laço de saídas por salário (0,4% das partidas na simulação). O cachê também sobe com a cobertura e precisa ser
recalibrado na simulação, que deve mostrar o humor de quem toca todo semestre na
maior casa entre +2 e +4 (ADR-0032).

## 1.8 Encaixe nas regras atuais

- **Canal próprio, fora do evento do semestre.** Os momentos não consomem o
  evento ativo único do semestre (ADR-0031). Eles seguram o avanço como as
  outras decisões. O dono aceitou turnos com 5 ou 6 decisões; a simulação mede
  com que frequência isso acontece.
- **Nunca repetir no save.** Cada momento é um modelo e segue a regra da
  ADR-0031, com a cadeia reservada ao abrir o arco (1.2). O tamanho do catálogo
  sai da simulação: arcos por partida × estágios × recaídas, no pior caso de 6
  integrantes.
- **Clima (ADR-0032):** humor baixo alimenta a pressão, e cada crise derruba o
  humor dos colegas próximos. A simulação precisa mostrar que isso não vira uma
  espiral de saídas.
- **Traços dinâmicos (item 8 do backlog):** os desfechos são o gatilho natural.
  Quem sai da reabilitação pode ganhar Estável; quem sai da prisão pode ganhar
  Paranoico. O traço novo substitui o oposto (Estável tira Errático e
  Deslumbrado), ou um traço sorteado quando o integrante já tem 4.
- **Notícias da cena (ADR-0024):** o processo e a morte viram notícia na
  timeline da própria banda.

## 1.9 Tom dos textos

O tom ácido continua (ADR-0026), com uma regra nova a travar: **a piada mira a
indústria, o entorno e a vaidade, e nunca o sofrimento do integrante.** É a
mesma regra que a ADR-0026 §3.10 já aplica a artistas reais, estendida aos
personagens. Exemplos para calibrar:

- Sinal: "{character1} escreveu quatro músicas numa noite. Ninguém lembra de ter
  visto {character1:ele|ela|essa pessoa} dormir desde terça."
- Prisão: "A polícia levou o carro, a guitarra e o setlist. O advogado diz que o
  setlist foi o mais difícil de explicar."
- Efeito póstumo: "O distribuidor mandou flores e, no mesmo envelope, o plano de
  relançamento."
- Morte (sem piada sobre a pessoa): "{character1} morreu na madrugada de quinta.
  O ensaio de sexta não aconteceu."

A morte sem piada é uma exceção à ADR-0026 §2 ("quase todo resultado termina com
uma observação irônica") e precisa de emenda explícita àquela ADR.

## 1.10 Persistência (traços largos)

- Tabela nova `member_conditions`: `band_id` (FK só para a banda),
  `member_id`, `former_member_id` (preenchido na saída), `kind`, `stage`,
  `pressure`, `started_turn`, `refusals`, `cover_ups`, `queued_since`,
  `reserved_templates`, `flags` (`jsonb`), `resolved_at`, `outcome`. O histórico
  não some em cascata quando o integrante sai.
- Os modelos de momento usados ficam numa tabela por banda, como nos eventos
  ativos.
- `band_members.unavailable_until` (`numeric(6,1)`, nulo quando disponível).
- `DepartureReason` ganha `morte`, `carreira_solo`, `prisao`, `expulsao` e
  `demissao`.
- A pressão, a transição de estágio e a fila ficam em funções puras, usadas pelo
  tick e pela previsão do turno, no padrão da ADR-0032. A previsão converte a
  pressão em faixa.
- A receita de cada turno passa a ser gravada no snapshot de `turns`, que hoje
  não a guarda, para servir de base aos custos.

---

# Parte 2: progressão

## 2.1 Diagnóstico

A evolução das skills (ADR-0012) é boa como base, mas é automática: o jogador
escolhe quem creditar e o resto acontece sozinho. A fama sobe rápido no começo e
quase para no fim. O que falta é o jogador **escolher como a banda cresce** e ter
**marcos** distribuídos pela partida inteira.

As armadilhas que a pesquisa aponta são três: árvores com uma escolha óbvia
(o "imposto de perk", que todo mundo pega), poder que se acumula e trivializa o
fim (bola de neve) e pontos comprados com o recurso que já sobra. No nosso caso
o dinheiro sobra no fim, então **pontos de progressão não vêm do caixa.**

## 2.2 Proposta em três camadas

### Camada A: carreira da banda (prioridade)

Uma árvore da banda com quatro ramos. Os pontos vêm de **marcos da carreira**.
Cada nó custa de 2 a 3 pontos e, depois de comprado, cobra de **3% a 5% da
receita do turno anterior** por turno, com o mesmo mínimo das posturas (1× a
folha). Os pontos medem conquista, e o dinheiro do fim de jogo ganha um destino.

**Marcos (fonte de pontos).** Cerca de 25 marcos, dos quais uma partida típica
alcança de 12 a 15, o bastante para comprar **cerca de metade da árvore**. Pelo
menos 40% dos marcos ficam depois do T40, para a progressão não acabar cedo.
Exemplos: primeira obra sólida, primeiro show numa casa de shows, primeiro
festival, uma obra-prima, 10 shows seguidos sem show ruim, sobreviver a uma
década com a formação original. Nenhum marco premia passar por uma crise
pessoal, para não incentivar provocar o arco.

**Ramos e nós de exemplo.**

| Ramo | Nós | Ligação |
|---|---|---|
| **Palco** | Técnico de som (apaga o pior desfecho da decisão do show, ADR-0031 §2) · Roadie fixo (menos desgaste) · Turnê (show de vários turnos com cachê e fãs maiores) | Shows (ADR-0016/0021) |
| **Estúdio** | Produtor fixo (bônus de qualidade) · Estúdio caseiro (sessão mais barata) · Selo próprio (alternativa ao contrato de gravadora; depende da ADR-0009) | Obras (ADR-0008/0015/0019), gravadoras (ADR-0009) |
| **Negócios** | Empresário (cachê maior, salário-alvo maior) · Merchandising (renda por fã) · Assessoria de imprensa (vazamento custa menos fãs) | Economia, salários (ADR-0010) |
| **Bastidores** | Terapeuta da banda (humor negativo volta mais rápido) · Advogado de plantão (pena menor) · Clínica de confiança (reabilitação mais curta) · Babá de camarim (menos exposição ao vício) | **Parte 1** e clima (ADR-0032) |

**Pares exclusivos.** Alguns pares de nós se excluem, para a árvore ter
identidade:

- *Selo próprio* × *Contrato com major*: independência contra alcance. Só entra
  depois da ADR-0009.
- *Banda família* × *Banda empresa*. A família tem luto pela metade, "conversar"
  funcionando a partir de relação 2, convívio rendendo mais e **saídas custando
  7% dos fãs em vez de 10%**. A empresa tem cachê e qualidade maiores, e as
  relações sobem menos.
- *Turnê sem fim* (muito dinheiro e fãs, desgaste e risco de vício maiores) ×
  *Residência fixa* (renda estável, fãs crescem devagar).

**Trocar de lado** num par custa 1 ponto, com efeito na hora, ou uma transição
de 4 a 6 turnos com os dois lados desligados.

Os nós de fim de árvore trazem risco junto com poder, porque o dono quer tensão
no fim do jogo. *Turnê sem fim* é o modelo: o nó mais forte do ramo Palco é
também o que mais alimenta a Parte 1.

### Camada B: especializações dos integrantes

Quando a parte inteira de **qualquer skill com crédito** de um integrante cruza
4, 6 ou 8, o jogador escolhe uma entre duas ou três especializações daquele
instrumento. O momento já existe no jogo: é o `leveledUp` da ADR-0012, que hoje
só comemora. Fica **no máximo uma especialização aberta por turno**; as outras
esperam.

- **Segunda função:** uma especialização de palco num instrumento que não é o
  principal deixa o integrante cobrir aquele instrumento no show (1.7). Sem isso,
  especializações de palco fora da skill principal não teriam efeito.
- **Nomes sem flexão de gênero** (ADR-0027). Os nomes abaixo são de trabalho.

| Instrumento | Nível 6, exemplos (escolha uma) |
|---|---|
| Vocal | *Presença de palco* (mais fãs no show, risco de ganhar Deslumbrado) · *Voz de estúdio* (mais qualidade na obra, menos no show) |
| Guitarra | *Virtuosismo* (performance maior, relação com quem divide o palco sobe menos) · *Arranjo* (bônus quando creditado com outros) |
| Bateria | *Metrônomo* (a variação do show nunca fica abaixo de 1,0: +2,5% de performance média e sem noites ruins) · *Espetáculo* (+50% de fãs nas noites do quartil de cima) |
| Letras | *Poesia* (mais crítica) · *Refrão fácil* (mais público, menos crítica) |

Com qualquer skill com crédito, o catálogo fica em ~100 especializações e chega
a 24 a 36 escolhas numa partida. O limite de uma por turno espalha essas
escolhas pelo jogo.

### Camada C: legado entre partidas (depois)

Ao fim de uma partida (T80, ou um fim formal ainda a definir, já que a banda
nunca acaba), a banda entra num **Hall da Fama** da conta (no espírito das
preferências da conta, ADR-0018), com uma ficha: fãs, obras, quem morreu, quem
saiu. Os desbloqueios são de variedade, para não deixar a partida seguinte mais
fácil: novas origens, épocas de fundação, traços raros no sorteio de candidatos,
a aparição de um integrante lendário de um save antigo como notícia da cena. O
modelo é o do Wildermyth: poucos integrantes promovidos a lenda, que podem
voltar como candidatos raros no recrutamento.

## 2.3 Riscos e como medir

- **Bola de neve:** a árvore não pode fazer a banda boa ficar boa mais rápido.
  A simulação compara fãs no T80 com e sem árvore.
- **Escolha óbvia:** para cada par exclusivo, a simulação mostra perfis
  diferentes ganhando com cada lado, inclusive *Banda família* × *Banda empresa*
  medido em fãs.
- **Dinheiro:** medir se o custo dos nós consome a sobra do fim de jogo sem
  apertar o começo.
- **Interface:** quatro ramos com 3 a 5 nós cabem numa tela. Mais que isso pede
  outro desenho.

---

## Ordem sugerida

0. **Pré-requisitos:**
   - recrutamento (item 6 do backlog) com candidato da casa, candidatos do
     servidor e demissão como saída;
   - show por cobertura com plateia exigente;
   - decisões de show e de convívio da ADR-0031 §2-§3, que ainda não estão no
     código;
   - receita do turno gravada no snapshot.
1. **Parte 1 com uma condição só (vício)**, de ponta a ponta: pressão, fila,
   sinais, momentos, posturas com vazamento, afastamento, músico de aluguel,
   UTI e morte. É a fatia que mais muda o fim do jogo e testa o motor de
   condições.
2. **Camada A com o ramo Bastidores e o par Banda família × Banda empresa**, que
   dão ferramentas contra a Parte 1 e provam marcos e custo por turno.
3. **As outras três condições** e **os outros ramos**.
4. **Camada B** (especializações com segunda função).
5. **Camada C** (legado), por último.

---

## Histórico de decisões

Todas as decisões são do dono, em 2026-11-13. A seção indica onde cada uma está
no corpo.

### Primeiras respostas

| Tema | Decisão | Seção |
|---|---|---|
| Morte | Entra sempre, sem opção do save para desligar | 1.5 |
| Canal dos momentos | Canal próprio, além do evento do semestre | 1.8 |
| Salário do afastado | Reabilitação recebe, prisão não, sem contar como atraso | 1.6 |
| Fase sombria | Entra | 1.4 |
| Pontos da árvore | Marcos da carreira | 2.2 A |
| Custo dos nós | Por turno em dinheiro | 2.2 A |
| Hall da Fama | Depois | 2.2 C |

### Primeira revisão (tycoon-review): veredito crítico

| Achado | Decisão | Seção |
|---|---|---|
| A morte sem perda de fãs e com bônus póstumo era a melhor saída | A morte custa 10% dos fãs; póstumo só em royalties | 1.6 |
| Banda de 3 que perde alguém travaria sem recrutamento | Aluguel só para afastado; recrutamento como pré-requisito | 1.6, ordem |
| `stageSkill` faz média, e afastar o mais fraco melhora o show | Show por cobertura de instrumento | 1.7 |
| Custo fixo dos nós não escala | 3% a 5% da receita do turno anterior | 2.2 A |
| Pontos compram quase a árvore inteira | Compra ~50%; nós de 2 a 3 pontos; 40% dos marcos depois do T40 | 2.2 A |
| Especializações acabam no T30 | Qualquer skill com crédito | 2.2 B |
| Marco que premia a crise | Sai da lista | 2.2 A |

### Segunda revisão (revisor independente): veredito crítico

| Achado | Decisão | Seção |
|---|---|---|
| Royalties póstumos ×1,5 por 4 turnos tornavam a morte lucrativa | Placar = fãs; póstumo ×1,2 por 2 turnos, só obras anteriores ao estágio 3 | 1.6 |
| Demitir é grátis e contratar aceita skill 10 | Candidatos do servidor, contratação ≈ 2× salário-alvo, demissão como saída | 1.6 |
| Show por cobertura levaria o humor a +5 | Recalibrar e simular (depois substituído por plateia exigente) | 1.7 |
| Vários arcos com um momento por turno | Arcos sem limite, com fila; estágio só avança com o seu momento | 1.2 |
| Encobrir sem custo atrasado no primeiro corte | Vazamento junto com o vício; encobrir conta como recusa | 1.3 |
| Aluguel contado por cabeças | Por instrumento descoberto | 1.6 |
| Custos em dinheiro somem no fim | Base na receita do turno anterior | 1.3 |
| Decisões por turno | Todas seguram o avanço; 5 ou 6 por turno aceitos | 1.8 |
| Pressão escondida × previsão exata | Previsão em faixa | 1.3 |
| Sinais e unicidade | Sinais fora da regra de nunca repetir | 1.5 |
| Preso perdendo humor | −0,2 por turno, `lowMoodTurns` congelado | 1.6 |
| Nós de variação sem efeito | Agem na decisão do show | 2.2 A |
| Banda família dominada | Efeitos fora do dinheiro | 2.2 A |
| Banda sem gente | Recrutar é obrigatório; a banda nunca acaba | 1.6 |

### Terceira revisão (revisor independente): veredito crítico

| Achado | Decisão | Seção |
|---|---|---|
| Recrutar obrigatório trava a partida sem caixa | Candidato da casa, sem custo de contratação | 1.6 |
| Expectativa fixa por casa erra o humor nas duas pontas | Plateia exigente | 1.7 |
| Regra "faltam 2 dos 3 do estilo" ambígua (bloquearia 64% das bandas de 3) | Bloqueio só por afastamento, entre voz, guitarra e bateria | 1.6 |
| Fase sombria sem relógio e acumulando ×1,46 | Relógio nos estágios 2 e 3, bônus uma vez por obra, regride ao estágio 1, cadeia reservada | 1.2, 1.4 |
| Expulsar a 5% vira demissão pela metade | 5% só a partir do estágio 2 e nunca para quem está em risco por humor | 1.3 |
| Morto 100%, afastado 50%, expulso 0% na obra | Fração dos turnos trabalhados para todos; tributo ≤ 25% dos fãs perdidos | 1.6 |
| Custos em dinheiro não pesam depois do T14 | Custos além do dinheiro; vazamento checado uma vez no fim do arco; mínimo de 1× a folha | 1.3 |
| Especializações demais e de palco sem efeito | Segunda função e uma especialização aberta por turno | 2.2 B |
| Metrônomo sem valor | Piso de variação 1,0 | 2.2 B |
| Troca de lado barata demais | 1 ponto na hora ou 4 a 6 turnos de transição | 2.2 A |
| Banda família ainda dominada em fãs | Saídas custam 7% em vez de 10% | 2.2 A |
| Prisão longa | Vira saída `prisao` | 1.6 |
| Conversar e a regra da morte | Conta como intervir | 1.3, 1.5 |
| Custo dos nós e tamanho da árvore | 3% a 5% da receita; compra ~50% | 2.2 A |
| Fase sombria no palco | Opção extrema na decisão do show | 1.4 |

### Simulação

| Achado | Decisão | Seção |
|---|---|---|
| Com morte certa após a UTI, o descuidado morria em 57% a 67% das partidas | UTI ignorada mata em 20%; recuperação sozinho (30/15/5%); uma recaída por arco | 1.5 |
| Com 0,9, o humor do atento ficava em +1,84 no T26 | Plateia exigente com 0,85 | 1.7 |
| Humor do atento em +4,3 no fim do jogo | Aceito | 1.7 |
| Banda sem caixa presa num laço de saídas (0,4% das partidas) | Covers e bar sem saldo mínimo | 1.7 |

---

## Números da simulação

Monte Carlo com as funções puras do domínio, 500 partidas de 80 turnos por
perfil, semente 20261113 (conferida com 20261114). Script em
`scratchpad/sim/sim.ts` da sessão. **[C]** marca valor calibrado contra uma
meta; **[E]** marca valor estimado, com efeito medido mas sem meta que o fixe.

### Resultado por perfil

| Perfil | Fãs T80 (mediana) | Humor T26 / T52 | Mortes | Prisão | Saída por humor |
|---|---|---|---|---|---|
| Atento, escolhe bem | 613 mil | +2,06 / +3,93 | 0% | 0% | 1,4% das partidas |
| Atento, escolhe ao acaso | 581 mil | +2,06 / +3,83 | 2,0% | 12,6% | 1,4% |
| Descuidado | 398 mil | +0,94 / +2,05 | 20,2% | 18,6% | 0,6% |
| Cínico (tenta os exploits) | 584 mil | +1,90 / +3,89 | 5,0% | 6,6% | 0% |
| Equilibrado (referência) | 615 mil | +1,70 / +3,86 | 0% | 0% | 1,6% |

- Pelo menos um arco aparece em 93% a 97% das partidas (mediana de 3 arcos).
- O cínico termina abaixo do atento: −23 mil fãs (IC95 ±7 mil). Cada exploit
  isolado também perde: segurar a fase sombria −15,8 mil, expulsar no estágio 2
  −9,9 mil, deixar o mais fraco morrer −7,6 mil.
- Não há espiral: o atento perde alguém por humor em 1,4% das partidas, abaixo
  dos 5% medidos na ADR-0032.

### Valores propostos

1. **Receita do turno anterior:** bruta (cachê do show mais royalties do
   avanço). Mediana do atento: 21,8 mil no T26 e 47,4 mil no T80. O mínimo de 1×
   a folha só pesa no começo. **[C]**
2. **Pressão:**
   - Chance de abrir um arco por integrante e por turno, em garagem / bares /
     casas / nacional: vício 0 / 0,08% / 0,2% / 0,35%; lei 0 / 0,06% / 0,15% /
     0,22%; saúde 0 / 0,04% / 0,1% / 0,15%; ego 0 / 0 / 0,08% / 0,15%. **[C]**
   - Traço de risco ×1,5, traço protetor ×0,6, histórico +0,5 por arco anterior,
     tudo junto limitado a ×2. Humor: ×(1 + 0,35 × máx(0, −humor − 1)).
     Exposição: festa ×1,5, casa de shows ou festival ×1,15. **[E]**
   - "Deixar relaxar": +1,5 de humor na hora e +15 pontos percentuais no risco
     de vício naquele avanço. **[E]**
   - Dentro do arco, a pressão sobe 0,12 por turno em média (saúde 0,15, ego
     0,10), com o limite de cada estágio em 1. Fase sombria: +0,12 fixo por
     turno. Do estágio 1 até a UTI, ignorando tudo: 12 a 16 turnos. **[E]**
   - Previsão: baixo abaixo de 0,5; iminente quando a pressão mais o
     incremento esperado chega a 1; alto entre os dois. **[E]**
3. **Fila:** UTI primeiro, depois gravidade, depois chegada. Na prática quase
   nunca há dois momentos esperando (p90 de 1). Se o integrante sai, o momento é
   descartado e os modelos reservados não usados voltam ao catálogo.
4. **Intervir:** encerra o arco com 75% / 55% / 40% nos estágios 1 a 3, senão
   volta ao estágio 1; afasta 0 / 1 / 2 turnos; −0,5 de humor. Na UTI: 30% da
   receita (mínimo 3× a folha), 2 turnos internado, encerra em 40% ou volta ao
   estágio 1. **[C]**
5. **Perdas:** ignorar custa 0% / 1% / 2% dos fãs nos estágios do vício;
   expulsar tira 0,3 × relação de humor de cada colega; luto de
   0,5 + 0,35 × relação (0,25 com relação negativa); crise tira 0,5 de quem tem
   relação ≥ 3. **[E]**
6. **Lei e ego:**
   - Estilos agressivos: punk, metal, grunge, rap-hiphop, funk-carioca, gótico,
     cyberpunk e skate-streetwear. Comportados: kpop, pop-mainstream,
     sertanejo, MPB, indie-folk, folk-rock, jazz e samba-raiz. O estágio 1 dá
     ±2% dos fãs.
   - Sentença (absolvição / multa / serviço / prisão): quem interveio sempre
     0/60/40/0; só no julgamento 35/30/20/15; nunca no julgamento 25/20/15/40.
     Pena de 2 a 12 turnos; acima de 8 vira saída. Multa de 15% da receita.
     **[C]**
   - Ego: projeto paralelo +0,5% dos fãs por turno; no ultimato, intervir sobe o
     salário 30%, e ignorar leva à carreira solo em 70%. **[E]**
7. **Saúde:** a sequela baixa o teto de skill do integrante em 1,5. Pede um
   campo de teto por integrante usado na folga de `grownSkill`. **[E]**
8. **Afastados:** volta ao neutro normal e `lowMoodTurns` congelado.
9. **Show:**
   - Multiplicador do cachê por casa (covers / bar / pub / casa de shows /
     festival): 1 / 1 / 1 / 0,89 / 0,75. De `baseFans`: 1 / 1 / 1 / 0,71 /
     0,54. Com isso, cachê e fãs por show repetem os de hoje. **[C]**
   - Piso de skill por fase do músico de aluguel e do candidato da casa: 1 / 2 /
     3 / 4,5. **[C]**
   - O afastado não entra no humor do show.
10. **Especialização:** cerca de 19 cruzamentos por partida (15 de obras, 4 de
    shows). Com uma aberta por turno, a fila chega a 4 e nada sobra no fim. O
    cruzamento pelo show conta; atendimento por chegada; sem limite por
    integrante.
11. **Decisão do show (proposta, não simulada):** o "quartil de cima" é a
    variação do show acima de 1,05; o "pior desfecho" é a opção de menor
    `performanceModifier`.
12. **Transição de par exclusivo:** fora do alcance da simulação.
13. **Catálogo de momentos:** com os modelos não usados voltando ao catálogo,
    bastam uns 15 de vício (4 do estágio 1, 5 do 2, 3 do 3 e 3 de UTI) e 6 a 8
    de cada outra condição. Momentos por partida: 6 no atento, 11 no descuidado.
14. **Emenda à ADR-0026:** a morte e a página de despedida ficam sem piada
    nenhuma (decisão do dono nos protótipos).

### Decisões que seguram o avanço

| Perfil | Turnos com ≥ 5 por partida | Turnos com ≥ 6 |
|---|---|---|
| Atento | 1,9 | 0,05 |
| Descuidado | 6,4 | 0,83 |

No atento, 77% dos turnos têm 3 ou 4 decisões.

### Marcos

Os exemplos do esboço saem em quase toda partida até o T40. O conjunto de 25
marcos precisa de alguns raros para uma partida típica ficar em 12 a 15:
750 mil fãs (24% das partidas), uma noite memorável (21%), obra-prima até o T40
(12%) e todos os pares com relação 4 (26%). Com esse conjunto, a mediana é 15
marcos, 58% deles depois do T40. Custo dos nós a 4% da receita: o atento compra
6 nós e paga 16% do caixa final, sem nunca ficar negativo.

## Requisitos levantados nos protótipos

- **Registro de eventos por integrante:** entrada, primeiros shows e obras,
  níveis, especializações, brigas e arcos. Alimenta a linha do tempo da página
  de despedida.
- **Contadores no Arquivo:** salários recebidos, shows por integrante e receita
  da banda no período.
- **Data de nascimento:** o jogo só guarda a idade. A data completa ("12 de
  março de 1968") sai de um hash do id do integrante, no mesmo modelo da
  ADR-0033, coerente com a idade. Em aberto: hoje o integrante envelhece na
  virada do ano (ADR-0006); com data de nascimento, o natural é envelhecer no
  primeiro turno depois do aniversário.
- **Nome nos créditos de obras antigas:** quem saiu aparece pelo nome, e não
  como "ex-integrante".
- **Página de despedida:** título "A [função] da [banda]" (o artigo segue o
  instrumento, "A voz", "O baixo"); nome longo de banda encurtado pela primeira
  palavra. Três colunas de reação (imprensa, fãs, jornal de música) com foto,
  montadas a partir de dados do integrante. Relação com cada colega em texto,
  com o nome do nível. Nenhum número de fãs no texto narrativo e nenhuma piada.

## Referências da pesquisa

Levantamento feito em 2026-11-13. **[V]** marca o que foi conferido em fonte e
**[M]** o que vem de memória, sem confirmação. Os números dos wikis variam com a
versão do jogo.

### Vida pessoal e eventos graves

| Jogo | Mecânica | O que aproveitamos |
|---|---|---|
| **Rockstar!** (1989) [V] | Na turnê, festas e anfetamina viram a atividade principal; "certo nível de vício" é preciso para manter o humor. A crítica do Obscuritory diz que o desastre chega sem regra clara e que a reabilitação é só chata. | O vício precisa de regra legível, e o afastamento precisa de algum ganho (1.4, 1.6). |
| **ROCKBEASTS** (2026) [V] | Banda dos anos 90 com Health, Hype, Mood e Cash. Um conflito mal resolvido com um integrante trancou parte da casa no show seguinte. | Drama pessoal vira penalidade concreta no próximo show (1.6). |
| **Hollywood Animal** (2025) [V] | O álcool é o vício mais comum e a maioria é "viciado funcional". O vício gera eventos raros e serve de material para chantagem. Encobrir crimes é ferramenta central. A felicidade do elenco foi chamada de microgestão tediosa. | A postura "encobrir" como dívida que estoura depois (1.3). Eventos raros demais somem da percepção do jogador. |
| **The Movies** (2005) [M] | Estrelas estressadas bebem e o jogador as manda para a reabilitação, onde ficam fora por um tempo. A crítica chamou isso de "babá de gente". | Fila com um momento por turno, para a crise não virar microgestão (1.2). |
| **Crusader Kings 3** [V] | O estresse sobe ao agir contra os traços e com mortes próximas. Em 100/200/300, um *mental break* oferece um *coping trait* (como beberrão), que alivia o estresse e cobra depois. Intervalo mínimo de 5 anos entre breaks. | O vício como alívio escolhido (1.4) e um intervalo mínimo entre momentos graves. |
| **Darkest Dungeon** [V] | Aos 100 de estresse, aflição (75%) ou virtude (25%). Aos 200, ataque cardíaco e Death's Door. No bar: 5,9% de sumir uma semana, 3,9% de virar *Tippler* (só alivia bebendo), 3,9% de *Resolution* (nunca mais bebe). | Estado intermediário antes da morte (1.5) e desfechos que marcam traços (1.7). |
| **RimWorld** [V] | Breaks em 35/20/5% de humor, deslocados pelos traços. Tolerância sobe a cada dose e aumenta a chance de vício; abstinência longa cura; overdose raramente mata. | A escada tolerância → dependência → abstinência dos estágios do vício (1.1). |
| **This War of Mine** [V] | Humor em escada (Sad, Depressed, Broken); Broken pode ir embora ou se matar. A cura é outro morador conversar. | A postura "conversar" com o amigo da banda no elenco (1.3). |
| **Football Manager** [V/M] | Propensão a lesão é atributo oculto, estimado pelo histórico e pelos relatórios. Promessas não cumpridas pioram a moral. | Pressão escondida comunicada por sinais (1.3). |
| **Failbetter / Emily Short** [V] | *Storylets*: trechos com pré-requisitos e efeitos, recombináveis sem explodir a árvore. Os estados de falha de Fallen London (prisão, loucura) eram procurados pelos jogadores porque eram conteúdo. | Cada momento é um storylet; a prisão precisa ser conteúdo e não só castigo. |

**O "clube dos 27"** [V]: estudos (BMJ 2011; PNAS 2024) mostram que o risco aos
27 é igual ao de idades vizinhas, apesar de músicos jovens morrerem mais que a
população geral. Por isso o esboço põe o risco na fama e não na idade. O mito
fica fora do jogo, inclusive das piadas, porque depende de mortes reais e marca
época (ADR-0026 §3.7 e §3.10).

### Progressão

| Jogo | Mecânica | O que aproveitamos |
|---|---|---|
| **Two Point Hospital** [V] | Até 5 qualificações por funcionário, com slots liberados pelo rank; o treino tira o funcionário do serviço. | Custo de oportunidade nas especializações (2.2 B). |
| **Football Manager** [V] | Potencial (PA) é teto e não garantia; profissionalismo e determinação decidem quanto se realiza. | Os traços já existentes podem pesar no ganho de skill. |
| **Punch Club** [V] | Atributos decaem todo dia, e no fim o jogador treina só para não regredir. Um dos três caminhos domina os outros. | Evitar decaimento punitivo e caminho dominante (2.3). |
| **Motorsport Manager** [V] | Prédios do QG liberam tecnologia e cobram manutenção mensal; expandir demais quebra o caixa. | Custo por turno dos nós da árvore (2.2 A). |
| **Hollywood Animal** [V] | Árvores lentas, e um update empurrou todos para um estilo só. | Exemplo de escolha óbvia a evitar. |
| **Hades** [V] | Talentos em pares exclusivos, troca grátis e reembolso barato. | Pares exclusivos com troca de custo moderado (2.2 A). |
| **Rogue Legacy 2** [V] | Cada melhoria encarece todas as outras; traços ruins do herdeiro pagam +25% a +200% de ouro. | Alternativa ao custo por turno; defeitos que pagam bônus. |
| **Wildermyth** [V] | Heróis promovidos a lenda voltam em campanhas futuras com custo em pontos de legado. | Integrante lendário como candidato raro (2.2 C). |
| **Cities: Skylines** [M] | Marcos de população liberam serviços. | Pontos por marco em vez de moeda (2.2 A). |

**Armadilhas registradas:** o *skill tax* (nó fraco que só existe para destravar
outro), a bola de neve (dinheiro que compra dinheiro decide o jogo cedo) e a
manutenção que consome todo o tempo.

### Fontes principais
- https://obscuritory.com/sim/rockstar/
- https://www.thumbculture.co.uk/rockbeasts-pc-preview
- https://store.steampowered.com/app/2680550/Hollywood_Animal/
- https://www.neonlightsmedia.com/blog/hollywood-animal-early-access-review-tycoon
- https://ck3.paradoxwikis.com/Stress
- https://darkestdungeon.wiki.gg/wiki/Tavern
- https://darkestdungeon.wiki.gg/wiki/Death%27s_Door
- https://rimworldwiki.com/wiki/Drug_addiction
- https://rimworldwiki.com/wiki/Mental_break
- https://www.gamepressure.com/thiswarofmine/negative-physical-and-mental-states/ze6d40
- https://emshort.blog/2019/11/29/storylets-you-want-them/
- https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/
- https://en.wikipedia.org/wiki/27_Club
- https://two-point-hospital.fandom.com/wiki/Staff
- https://punchclub.wiki.gg/wiki/Perks_(Punch_Club_1)
- https://motorsportmanagerpc.fandom.com/wiki/Headquarters
- https://hades.wiki.fextralife.com/Mirror+of+the+Night
- https://wildermyth.com/wiki/Legacy
- https://waywardstrategy.com/2020/07/06/anti-snowball-design/
