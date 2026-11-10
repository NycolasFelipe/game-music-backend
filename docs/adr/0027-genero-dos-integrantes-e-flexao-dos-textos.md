# 0027 — Gênero dos integrantes e flexão dos textos

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0017 — Confraternizações](0017-confraternizacoes.md),
  [0023 — Aparência dos integrantes](0023-aparencia-dos-integrantes-e-cenario-da-banda.md),
  [0026 — Tom de voz dos textos](0026-tom-de-voz-dos-textos.md)

## Contexto

Os integrantes têm gênero no banco (`male` ou `female`), mas os textos dos
eventos não usavam essa informação. Quando uma frase precisava flexionar, ela
trazia as duas formas juntas: "passa a noite calado(a)". O dono do jogo achou
que isso quebra a leitura e pediu que o texto use a forma certa do personagem.
Pediu também um terceiro gênero, neutro.

## Decisão

### 1. Três gêneros

`GENDERS` passa a ser `male`, `female` e `neutral`. A coluna `gender` já é
`varchar(16)`, então não há migração.

- O jogador define o gênero **só na criação da banda**, ao editar um candidato.
  Depois disso o gênero fica fixo.
- O sorteio de candidatos gera **10% de neutros** (`NEUTRAL_CANDIDATE_SHARE`); o
  resto se divide igualmente entre masculino e feminino.
- Um integrante neutro tira o primeiro nome de qualquer uma das duas listas,
  usa o avatar 🧑, não tem barba, tem 35% de chance de brinco (entre os 15% dos
  homens e os 55% das mulheres) e um penteado do conjunto dos dois.
- A biografia de um integrante neutro sai só dos modelos sem marcador de gênero.
  Cada habilidade precisa de pelo menos três desses modelos.

### 2. Flexão nos textos dos eventos

Um trecho que muda com o gênero é escrito com o marcador
`{characterN:masculino|feminino|neutro}`. O gerador troca o marcador pela forma
do personagem `N` antes de preencher os nomes:

```
{character2} passa a noite {character2:calado|calada|sem dizer uma palavra}.
```

- **A forma neutra é uma construção sem flexão**, não a terminação em "-e".
  Ela vale também quando o gênero não é conhecido.
- O marcador funciona no título, na descrição, nas opções, nos resultados e nos
  rótulos de resultado (`resultLabel`).
- Rótulos de resultado que falam da banda inteira usam um substantivo ("Vaia",
  "Ovação") em vez de flexionar.
- O teste do catálogo confere que todo marcador tem três formas e aponta para um
  personagem que o evento tem.

### 3. Notícias da cena

O catálogo de artistas reais não guarda gênero e inclui bandas. As notícias
continuam escritas sem flexão, com construção neutra para todos.

## Consequências

- O "(a)" sai de todos os textos. A regra 8 da ADR-0026 passa a apontar para
  esta ADR.
- Textos novos com flexão precisam das três formas; a neutra dá mais trabalho de
  escrita do que acrescentar "(a)".
- Eventos já gravados no banco mantêm o texto da época em que foram sorteados.
- O retrato do frontend trata o neutro como uma mistura: sem barba e com cabelo
  de qualquer um dos dois conjuntos.
