# 0026 — Tom de voz dos textos do jogo

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0004 — Eventos ativos](0004-eventos-ativos.md),
  [0005 — Eventos passivos](0005-eventos-passivos.md),
  [0024 — Notícias da cena por época](0024-noticias-da-cena-por-epoca.md),
  [0025 — Cobertura mínima de eventos ativos](0025-cobertura-minima-de-eventos-ativos.md)

## Contexto

O dono do jogo quer um tom sarcástico, típico de jogo tycoon. Parte dos textos
já tinha esse tom (as descrições dos traços em
`band-members/domain/data/characteristics.ts` e os comentários da crítica em
`releases/domain/data/review-comments.ts`), mas os eventos ativos e as notícias
da cena estavam neutros.

Para calibrar, o dono comparou quatro amostras em três versões (original,
leve e ácida) e escolheu a **ácida** em todas. A única frase rejeitada foi
"a produção promete devolver o dinheiro 'em breve', um conceito bastante
elástico": ironia explicada soa artificial.

## Decisão

### 1. Escopo
O tom vale para os eventos ativos (`events/domain/data/active-events/`), as
notícias da cena (`passive-event-templates.ts` e `passive-event-resources.ts`)
e os eventos de estúdio (`releases/domain/generation/creation-event.generator.ts`).
Os comentários da crítica e as cenas das atividades já estão no tom e ficam
como estão.

### 2. Nível
Ácido: quase toda descrição e todo resultado terminam com uma observação
irônica. O narrador fala de fora, em terceira pessoa, com a cara séria de quem
já viu muita banda dar errado.

### 3. Regras
1. **O fato vem antes da piada.** O jogador precisa entender o que aconteceu
   antes de rir: "A polícia encerra o ensaio: primeira plateia que a banda não
   conseguiu conquistar."
2. **O nome da opção diz o que o jogador faz**, sem piada que esconda a ação
   ou o risco. A ironia fica na descrição da opção e nos resultados.
3. **Piada no fim da frase, uma por frase.** Frases curtas.
4. **Detalhe concreto em vez de adjetivo.** Pijama, cartas aos jornais, troféu
   de plástico dourado: o detalhe faz a piada; "muito engraçado" não.
5. **Não explicar a ironia.** Nada de "um conceito bastante elástico", "o que
   é irônico", "ironicamente".
6. **Alvos:** a vaidade, a preguiça e as brigas da banda, a indústria
   (empresários, rádios, organizadores, gravadoras), o dinheiro e o público.
   Nunca o jogador ("você"), nunca aparência, origem, gênero, religião ou
   grupos reais.
7. **Sem época marcada.** Os textos valem de 1960 a 2050 (ADR-0024): nada de
   internet, celular, redes sociais, gírias ou memes de uma década. Notícias
   com marca de época continuam usando `desde`.
8. **Gênero neutro** quando o integrante pode ser de qualquer gênero:
   "chateado(a)" ou uma construção sem flexão.
9. **Sem palavrão.**
10. **Artistas reais.** As notícias da cena citam artistas reais do catálogo
    (`artists.ts`). Nelas a ironia mira a indústria, a imprensa, as
    gravadoras e o público, nunca o talento, o caráter ou a vida pessoal do
    artista. Saúde e acidentes ficam sem piada sobre a pessoa.
11. **Marcadores das notícias aparecem uma vez só.** O gerador troca só a
    primeira ocorrência de `{artista}`, `{artista1}`, `{nome_album}` etc.

### 4. Exemplos aprovados na calibração

| Original | No tom |
|---|---|
| O vizinho bate na porta da garagem pela terceira vez. {character1} quer continuar no volume máximo; {character2} quer baixar antes que chamem a polícia. | Terceira visita do vizinho esta noite, e ele não veio pedir autógrafo. {character1} defende que arte não tem volume; {character2} lembra que a polícia tem. |
| O som pifa na terceira música e o show termina às pressas. | O som pifa na terceira música, e a banda descobre ao vivo que eletricidade e água continuam sem se dar bem. |
| Mais um turno no estúdio, mas o acabamento agradece. | Mais um turno no estúdio. O disco fica melhor, e o técnico, mais velho. |
| {artista} anuncia álbum triplo com mais de 40 faixas inéditas. | {artista} anuncia álbum triplo com mais de 40 faixas inéditas, prova de que ninguém na gravadora teve coragem de dizer não. |

## Consequências

- Todos os textos do escopo são reescritos em lotes, revisados pelo dono num
  protótipo que mostra o antes e o depois de cada trecho. A reescrita muda só
  texto: ids, efeitos, chances e condições ficam iguais.
- Textos novos já nascem no tom.
- Eventos já gravados no banco mantêm o texto da época em que foram sorteados.
