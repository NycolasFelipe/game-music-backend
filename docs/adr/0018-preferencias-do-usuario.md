# 0018 — Preferências do usuário (da conta, não do save)

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0013 — Ajuste automático de salários](0013-ajuste-automatico-de-salarios.md)

## Contexto

O jogo passou a ter dois lugares que desenham as mesmas pessoas de duas formas —
**cartões** ou o **grafo** de relacionamentos: a seção de Relacionamentos e o
seletor de convidados das confraternizações (ADR-0017). A escolha entre eles
estava no `localStorage`.

Isso está errado por dois motivos. Primeiro, **não é uma configuração de jogo**:
é como aquela pessoa gosta de olhar para uma banda, e vale igual em todos os
saves dela. Segundo, morre ao trocar de navegador ou limpar o cache — e o jogador
não tem por que reaprender a própria preferência em cada máquina.

O ADR-0013 já enfrentou a pergunta "cliente ou servidor?" para o ajuste
automático de salários, mas por outro motivo: lá a regra é executada pelo tick,
então guardar no cliente deixaria a **regra do jogo fora do jogo**. Aqui não há
regra nenhuma — é só um gosto. O que manda é o **escopo**: o gosto é da conta.

## Decisão

### 1. `users.preferences`, não `bands.settings`
Preferências que não mudam o jogo vivem no **usuário**. A distinção que fica:

- **`bands.*`** — decisões que afetam a simulação daquele save (o
  `auto_salary_adjust` do ADR-0013 muda o caixa e a folha).
- **`users.preferences`** — como a interface se apresenta, igual em todo save.

Se um dia uma preferência precisar divergir entre saves, ela troca de casa; até
lá, duplicá-la por banda seria pedir ao jogador que configurasse a mesma coisa
várias vezes.

### 2. Um `jsonb` com whitelist, não uma coluna por opção
`preferences jsonb not null default '{}'`. Não há consulta nem restrição sobre
esses valores — são gostos de UI, e uma coluna por opção custaria uma migration
por gosto novo.

O preço do blob é o risco de virar lixeira, e é por isso que **nada entra sem
passar pelo schema**: `mergeUserPreferences` parte dos defaults, aplica só as
chaves conhecidas com valores conhecidos e devolve um objeto completo. Uma chave
desconhecida não é erro — é **descartada em silêncio**, porque um cliente velho
mandando um campo morto não é motivo para falhar um `PATCH` de preferência.

O mesmo merge roda na **leitura** (`toDomain`): uma linha gravada antes de a
opção existir devolve um objeto completo, sem backfill.

### 3. `PATCH` parcial em `/users/me/preferences`
Sem parâmetro de rota — sempre o usuário do token, então não há id para errar
nem autorização para checar. `PATCH` mexe só no que nomeia; o resto fica.

### 4. Hoje: uma preferência só
`peopleView: "cards" | "graph"`, **compartilhada** pela seção de Relacionamentos
e pelo seletor de convidados. São a mesma pergunta ("como eu quero ver essas
pessoas?") feita em duas telas, e responder duas vezes seria burocracia. Se o
playtest mostrar que as duas telas pedem leituras diferentes, vira `peopleView` +
`guestPickerView` sem quebrar nada — o merge já ignora o que não conhece.

## Consequências

- O jogador escolhe uma vez, e vale em qualquer máquina e em qualquer save.
- O frontend passa a **depender da rede** para uma decisão de layout. Enquanto a
  requisição não volta, a tela mostra o default (`cards`) e pode piscar uma vez
  por sessão; a mutação é otimista para o toggle não parecer travado.
- Preferência agora é dado de servidor: cada opção nova é um campo no schema, um
  ramo no merge e uma linha no DTO. Deliberado — é o que impede o blob de virar
  depósito.
- Fica de fora: tema (claro/escuro), idioma e qualquer coisa que precise valer
  antes do login. Essas continuam locais por natureza — não há usuário para
  pendurá-las.

## Referências
- Implementação: [src/modules/users/](../../src/modules/users/)
  (`user-preferences.constant`, use cases e `UserPreferencesController`).
- Migration: `src/database/migrations/*-AddPreferencesToUsers.ts`.
