# 0023 — Aparência dos integrantes e cenário da foto da banda

- **Status:** Aceita
- **Data:** 2026-11-09
- **Decisores:** Equipe de backend
- **Relacionada:** [0002 — Módulos bands e band-members](0002-modulos-bands-e-band-members.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md)

## Contexto

O frontend reconstruído adota a identidade visual "revista": cada integrante
aparece como um retrato em retícula (foto impressa em preto e branco) e a banda
aparece numa foto de grupo na capa. O protótipo sorteava no navegador o
penteado, a barba, os óculos, os brincos e a roupa a partir do id do
integrante, e o cenário da foto a partir do id da banda.

Sortear no cliente tem dois problemas: a aparência depende do algoritmo de
sorteio do frontend (qualquer mudança no código troca o rosto de todo mundo) e
outros clientes não conseguiriam desenhar a mesma pessoa. A aparência é dado do
personagem, como o nome e o avatar, então deve ficar no backend.

O `avatar` (emoji) continua sendo a fonte do tom de pele e da cor e textura do
cabelo. A aparência guarda só o que o emoji não diz.

## Decisão

**Integrante.** Novo campo `appearance` (jsonb, obrigatório) em
`band_members` e `former_members`:

| Campo | Valores |
|---|---|
| `hairStyle` | `short`, `quiff`, `long`, `buzz`, `bald`, `curly`, `afro`, `bob`, `bun`, `curlylong` |
| `beard` | `none`, `stubble`, `full`, `goatee` |
| `glasses` | `none`, `round`, `sun` |
| `earring` | booleano |
| `shirt` | `crew`, `v`, `jacket` |
| `shirtTone` | `4`, `6`, `8`, `10` (escuridão na escala de retícula) |

Regras de geração (`generateAppearance`, função pura com sorteio injetável):
- Avatar com 🦲 → `bald`.
- Mulher: avatar com 🦱 → `curlylong`; senão `long`, `long`, `bob`, `bun`,
  `long` (sorteio uniforme na lista).
- Homem: avatar com 🦱 → `curly` ou `afro`; senão `short`, `quiff`, `long`,
  `buzz`, `short`.
- Barba só para homem com 19 anos ou mais, com 45% de chance (`stubble`,
  `full` ou `goatee`).
- Óculos: 12% `sun`, 15% `round`, resto `none`.
- Brinco: 55% para mulher, 15% para homem.
- Camisa: `crew`, `v`, `jacket`, `crew`; tom uniforme entre 4, 6, 8 e 10.

Onde a aparência nasce:
- Candidatos (`POST /band-members/candidates`) já vêm com `appearance`.
- `POST /band-members/avatar` aceita `age` opcional e devolve `{ avatar,
  appearance }`: trocar o avatar troca a aparência junto, porque o penteado
  depende do emoji.
- Criação de banda e contratação aceitam `appearance` opcional em cada
  integrante (validado contra os catálogos). Sem o campo, o backend gera, então
  clientes antigos continuam funcionando.
- Ex-integrantes guardam a aparência no snapshot da saída.

**Banda.** Novo campo `photoScene` (varchar, obrigatório) em `bands`:
`ensaio` (sala de ensaio), `palco`, `muro` (rua) ou `estudio`. Sorteado na
criação da banda e fixo depois. É só cenário da foto de capa; não tem efeito
de jogo.

**Exposição.** `appearance` sai em todas as views de integrante (banda,
integrante, candidato, ex-integrante) e `photoScene` em todas as views de
banda.

**Migração.** As colunas entram anuláveis, as linhas existentes recebem valores
sorteados em SQL com as mesmas distribuições (aproximadas: o sorteio de óculos
usa dois `random()` independentes, o que dá ~15% de `round`), e depois as
colunas viram `NOT NULL`.

## Consequências

**Positivas**
- O mesmo integrante tem o mesmo rosto em qualquer tela e em qualquer cliente.
- O frontend desenha sem regra de sorteio própria.
- A aparência pode virar mecânica no futuro (por exemplo, um evento que muda o
  visual) sem migrar dados de cliente.

**Negativas / trade-offs**
- Dois campos a mais em respostas que já são grandes.
- Integrantes existentes ganham uma aparência nova e aleatória na migração; o
  protótipo sorteava outra, então o rosto visto no protótipo não se mantém.
- Trocar o avatar de um candidato troca o penteado e o resto do visual.
