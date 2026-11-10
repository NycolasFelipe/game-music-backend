# 0024 — Notícias da cena por época e três por turno

- **Status:** Aceita
- **Data:** 2026-11-09
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0005 — Eventos passivos](0005-eventos-passivos.md),
  [0006 — Turnos](0006-turnos.md)

## Contexto

O frontend passou a mostrar as notícias da cena (eventos passivos) no topo da
aba Turno, como um jornal ("Gazeta do Groove"), só com as notícias do ano
corrente. Jogando, dois problemas apareceram:

1. **Anacronismo.** Os textos foram portados do protótipo sem noção de época:
   em 1962 saía "Clipe de Sérgio Mendes bate 1 bilhão de visualizações", em
   1981 "a música viralizou nas redes sociais". Num jornal no topo da tela,
   isso quebra a imersão logo de cara.
2. **Jornal magro.** O avanço de turno gerava um evento passivo por turno; com
   o filtro "só o ano corrente", o jornal tinha uma manchete e no máximo uma
   nota.

## Decisão

### 1. Textos com ano de início (`desde`)
Modelos de notícia (`PassiveEventTemplate.desde`) e frases de avaliação
(`PUBLIC_REVIEWS`, agora `DatedPhrase`) ganham um ano opcional a partir do qual
fazem sentido. O gerador só sorteia o que cabe no ano do jogo (`fitsEra`); sem
`desde`, vale para qualquer ano. Marcados nesta ADR:

| Texto | Desde |
|---|---|
| Clipe com 1 bilhão de visualizações (pe-29) | 2012 |
| Recorde de streaming (pe-05), pausa por saúde mental (pe-10), volta às paradas por rede social (pe-25), avaliação "viralizou nas redes sociais" | 2010 |
| Remix que viraliza em plataformas digitais (pe-11) | 2008 |
| Festival beneficente (pe-27) | 1971 |
| Álbum triplo (pe-24) | 1970 |
| Grande festival internacional (pe-14) | 1967 |
| Documentário sobre o artista (pe-17) | 1965 |
| Linha de produtos (pe-21) | 1964 |

### 2. Três notícias por turno
`PASSIVE_EVENTS_PER_TURN = 3` (em `turns/domain/constants`). O relatório do
turno continua apontando a primeira (`passiveEvent`), sem mudança de contrato.

### 3. Aposentadoria só com carreira longa (registro)
Corrigido no mesmo ciclo (commit `11fd2be`): `carreira_longa` deixa de cair
para "qualquer artista" quando ninguém tem 30 anos de carreira, e `{anos}` sai
inteiro.

## Consequências

- O jornal tem até seis notícias por ano, todas plausíveis para a época.
- Em anos antigos, o tipo sorteado pode não ter modelo da época; o gerador
  tenta outro tipo (até `MAX_ATTEMPTS`), então a contagem por turno pode sair
  menor que três, raramente.
- Notícias já gravadas no banco não mudam.
- Textos novos precisam declarar `desde` quando citarem algo datado.

> **Emenda (2026-11-10):** a regra vale também para os comentários da crítica
> (`review-comments.ts`), escolhidos pelo ano de lançamento da obra. Frases
> com "playlist" saem a partir de 2000, com "streaming" ou "salvar música" a
> partir de 2008, e com "repeat" a partir de 1985. Portal, blog, podcast e
> canal só assinam críticas depois que existem (1997 a 2006). O público fala
> por carta, na fila do show ou ao telefone da rádio em qualquer época, no
> fanzine a partir de 1970, no fórum a partir de 1996 e nas redes a partir do
> ano de cada uma; o Twitter vale até 2022 e o X a partir de 2023.

> **Emenda (2026-11-10):** os nomes dos níveis de fama seguem o ano da banda
> (`FameLevelEntry.modern`). O nível 6 fala de fanzines e passa a blogs em
> 2000; o nível 9 é "Comentados · Sucesso no boca a boca" e vira "Virais ·
> Sucesso nas redes sociais" em 2008; o nível 15 é "Febre nacional, do rádio à
> televisão" e passa a "Trending topics e viralização global" em 2010.
