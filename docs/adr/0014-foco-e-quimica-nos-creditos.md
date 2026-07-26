# 0014 — Foco e química nos créditos de uma obra

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0003 — Relacionamentos entre membros](0003-relacionamentos-entre-membros.md),
  [0008 — Obras musicais](0008-obras-musicais.md),
  [0012 — Evolução dos integrantes](0012-evolucao-dos-integrantes.md)
- **Emenda:** altera a fórmula de qualidade do ADR-0008 §3 e o ganho de skill do
  ADR-0012 §1.

## Contexto

A nota técnica de uma obra é `Σ (peso do aspecto × média das skills de quem
assinou ÷ SKILL_MAX)` (ADR-0008 §3). Três consequências indesejadas caíram no
colo quando a tela de créditos foi redesenhada:

1. **Assumir vários instrumentos é de graça.** Não há penalidade nem limite: um
   único integrante creditado nos seis aspectos rende exatamente o mesmo que seis
   especialistas de mesma skill. O "homem-orquestra" é sempre a jogada ótima.
2. **Dividir um instrumento é sempre ruim.** Como o aspecto é uma **média**,
   somar alguém abaixo do melhor só derruba a nota. O co-crédito nunca compensa —
   a não ser para treinar um novato (ADR-0012).
3. **O tamanho da banda não importa.** Três membros (o mínimo) cobrem seis
   aspectos sem custo algum, então recrutar não tem retorno mecânico.

Somadas, elas fazem a atribuição de créditos ter **uma resposta ótima
calculável aspecto a aspecto** (credite o melhor, sozinho, em cada um) — é
preenchimento de formulário, não decisão.

O aspecto **vazio** já é tratado bem: contribui zero, ou seja, custa exatamente o
peso que o estilo dá a ele. Isso fica como está.

## Decisão

### 1. Foco: espalhar um integrante custa eficiência
Cada integrante creditado recebe um **fator de foco** derivado do **número de
aspectos que ele assume** na obra, aplicado à contribuição dele **dentro de cada
aspecto**:

| aspectos | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| fator | 1,00 | 0,95 | 0,85 | 0,72 | 0,58 | 0,45 |

A curva é suave no começo (dobrar de função é quase grátis — é o normal numa
banda) e cai rápido a partir da quarta. Um trio que cobre tudo opera a **85%** da
própria competência; um quinteto em que só um dobra perde 5%.

O efeito de projeto é o que importa: a escolha **deixa de ser separável por
aspecto**. Creditar alguém em mais um lugar degrada o que essa pessoa entrega em
**todos** os outros, então a alocação vira um problema de verdade — e o tamanho
da banda passa a valer, dando propósito mecânico ao recrutamento (item 6 do
backlog).

Rejeitado o **limite rígido** ("no máximo N aspectos por pessoa"): com 3 membros
e 6 aspectos, qualquer teto abaixo de 2 tornaria a cobertura impossível, e um
erro de validação é pior experiência que um custo visível.

### 2. Química: dividir um instrumento pode valer a pena
Quando **dois ou mais** integrantes assinam o mesmo aspecto, a média daquele
aspecto é multiplicada por um **fator de química** derivado dos
**relacionamentos** entre eles (ADR-0003), pela média dos níveis de todos os
pares co-creditados:

```
chemistry = 1 + CHEMISTRY_WEIGHT (0.12) × (nívelMédio / RELATIONSHIP_LEVEL_MAX)
          → 0,88 … 1,12
```

Com isso, dois amigos de skill 8 e 7 rendem `7,5 × 1,12 = 8,4` — **melhor que o
8 sozinho**; dois desafetos rendem pior que qualquer um deles isolado. É a
primeira vez que o co-crédito tem uma razão positiva de existir, e finalmente
os relacionamentos influenciam algo além do sabor dos eventos.

Um aspecto com **um único** integrante tem química neutra (1): ninguém colabora
consigo mesmo.

### 3. O ganho de skill também dilui pelo foco
O aprendizado do ADR-0012 §1 passa a ser multiplicado pelo **mesmo fator de
foco**: quem se divide em seis frentes aprende menos em cada uma. Sem isso, o
homem-orquestra perderia nota mas continuaria evoluindo seis skills por obra —
o inverso do que a regra quer dizer.

A química **não** entra no aprendizado: gravar com um amigo melhora o resultado,
não a formação técnica de cada um.

### 4. Aspecto sem ninguém continua valendo zero
Sem penalidade extra e **sem renormalizar os pesos** entre os aspectos cobertos.
O zero já é proporcional (deixar a guitarra de fora num estilo que a pesa 28%
trava o teto em 72; deixar o piano num estilo que o pesa 4% é quase grátis), e
renormalizar tornaria a omissão **grátis** — matando a decisão que este ADR
existe para criar. A saída para bandas pequenas fica para um ADR próprio
(**músicos de sessão**: preencher um aspecto pagando, com skill medíocre, sem
química e sem evolução).

### 5. Transparência
`details` (jsonb) passa a guardar `focus` (fator médio de foco dos creditados) e
`chemistry` (fator médio dos aspectos divididos), ao lado dos fatores que já
existem. Obras antigas não têm os campos — sem backfill, como nos ADRs 0011/0012.

O **frontend** espelha as duas regras no prognóstico da tela de criação (que já é
declaradamente uma estimativa) e mostra, por integrante, quantas funções ele já
acumula e o que a química está somando ou tirando em cada aspecto dividido.

## Persistência
Nenhuma migration: só novos campos dentro de `releases.details` (`jsonb`).

## Alternativas consideradas
- **Teto rígido de aspectos por membro:** rejeitado (§1).
- **Penalidade extra para aspecto vazio (multiplicador ou trava de tier):**
  rejeitado — o zero proporcional já pune na medida do estilo.
- **Renormalizar os pesos entre os aspectos cobertos:** rejeitado (§4) — tornaria
  omitir instrumentos a jogada ótima.
- **Química ligada a traços de personalidade em vez de relacionamentos:**
  adiado — relacionamentos já existem, são visíveis e mutáveis; traços entrariam
  como refinamento futuro.
- **Fator de foco por *tempo* (formato) e não por contagem de aspectos:**
  rejeitado — o formato já escala custo, alcance e aprendizado; misturar as duas
  coisas dificultaria a leitura da regra.

## Consequências

**Positivas**
- A tela de créditos vira decisão: cobrir tudo com poucos, especializar, ou
  dividir um aspecto entre amigos passam a ser estratégias distintas.
- **Tamanho da banda passa a importar** — recrutar (item 6) ganha payoff.
- Relacionamentos (ADR-0003) ganham efeito mecânico direto.
- Bandas pequenas continuam viáveis por caminhos legítimos: aceitar o custo de
  foco, abrir mão dos aspectos leves ou escolher um estilo de peso concentrado
  (eletrônico/rap concentram ~55% em dois aspectos).

**Negativas / trade-offs**
- Duas constantes novas a balancear (curva de foco e `CHEMISTRY_WEIGHT`).
- A nota fica mais difícil de prever de cabeça; mitigado pelo prognóstico da tela
  de criação, que aplica as mesmas regras.
- Obras lançadas antes deste ADR foram avaliadas por outra fórmula — os números
  antigos não são comparáveis aos novos (não há recálculo).

## Referências
- Implementação: [src/modules/releases/domain/quality/release.calculator.ts](../../src/modules/releases/domain/quality/release.calculator.ts)
  e [src/modules/releases/domain/growth/growth.calculator.ts](../../src/modules/releases/domain/growth/growth.calculator.ts).
- Espelho no cliente: `game-music-frontend/src/features/releases/creation-forecast.ts`.
