# 0013 — Ajuste automático de salários (opção do save)

- **Status:** Aceita
- **Data:** 2026-07-26
- **Decisores:** Equipe de backend
- **Relacionada:** [0006 — Turnos](0006-turnos.md),
  [0010 — Salários por integrante](0010-salarios-por-integrante.md),
  [0012 — Evolução dos integrantes](0012-evolucao-dos-integrantes.md)
- **Emenda:** amplia o tick do ADR-0006 §6 / ADR-0010 §4.

## Contexto

O salário-alvo de um membro sobe sozinho ao longo da campanha: com **fama**
(ADR-0010 §2) e, agora, com a **evolução das skills** (ADR-0012). Quem não
reajusta manualmente vê o humor do elenco derreter por subpagamento sem nunca ter
tomado uma decisão errada — é micromanagement puro, não estratégia.

Este ADR adiciona uma **opção do save**: com ela ligada, o jogo reajusta os
salários a cada turno. É uma escolha de conforto (quem gosta de negociar
continua no manual), não uma mudança de balanceamento.

## Decisão

### 1. Opção por save, persistida no backend
`bands.auto_salary_adjust` (`boolean not null default false`). Não é preferência
de UI: quem executa o reajuste é o **tick do turno**, que roda no servidor —
guardar isso no cliente deixaria a regra do jogo fora do jogo. Alterada por
`PATCH /bands/:id/settings` e exposta na `BandView`.

### 2. Só aumenta, e só se o caixa cobrir a folha nova
A cada turno, para cada membro, o salário proposto é `max(salário, alvo)`:
- **Nunca corta.** Reduzir salário porque o alvo caiu (a fama recuou, por
  exemplo) seria uma quebra de acordo pelas costas do jogador; o automático é
  uma comodidade, e comodidade não demite ninguém.
- **Tudo ou nada, dentro do caixa.** Os reajustes só entram se a folha
  resultante couber no caixa disponível do turno (`saldo + royalties`). Caso
  contrário **nenhum** reajuste acontece neste turno e o jogo segue com os
  salários atuais. Assim o automático nunca provoca inadimplência — que é o
  gatilho de saída de membros (ADR-0010 §6) — e o jogador nunca perde alguém por
  causa de uma opção de conforto.

O critério é **tudo ou nada** (e não "vai reajustando enquanto o caixa aguenta")
porque o reajuste parcial dependeria da ordem dos membros: quem viesse primeiro
ganharia aumento e o último ficaria sem, sem nenhuma razão de jogo.

### 3. Roda no tick, entre a receita e a folha
Ordem do turno: royalties (entrada) → **ajuste automático** → folha de pagamento.
O ajuste enxerga o caixa **depois** dos royalties, então uma obra que rendeu bem
neste turno já banca o aumento no mesmo turno. Os salários novos são gravados
antes da folha, portanto já são pagos com o valor reajustado.

### 4. Motivo próprio no histórico
O log de acordos (`member_salaries`, ADR-0010 §1) ganha o motivo
`automatico`, distinto de `ajuste` (manual) e `inicial`. O histórico continua
contando quem decidiu o quê.

### 5. O turno reporta o que reajustou
`AdvanceTurnView` passa a trazer `salaryRaises` (`{ memberId, name, from, to }`),
para a UI mostrar "Ana: 400 → 460" no resumo do turno. Sem isso o dinheiro sairia
do caixa sem explicação visível.

## Persistência
- `bands.auto_salary_adjust` (`boolean not null default false`) — migration
  `AddAutoSalaryAdjustToBands`. Saves existentes ficam com a opção **desligada**
  (o comportamento atual).

## Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| `PATCH` | `/bands/:id/settings` | Altera as opções do save (hoje: `autoSalaryAdjust`) |

## Alternativas consideradas
- **Sempre igualar ao alvo (sobe e desce):** rejeitado — cortar salário
  automaticamente é hostil e produziria quedas de humor que o jogador não pediu.
- **Reajuste parcial enquanto o caixa aguenta:** rejeitado — resultado dependente
  da ordem dos membros (§2).
- **Guardar a opção só no cliente:** rejeitado — o tick roda no servidor.
- **Reajustar apenas na virada de ano:** rejeitado no MVP — o alvo se move todo
  turno (fama/skills); esperar meio ano deixaria o humor cair no meio do caminho.

## Consequências

**Positivas**
- Elimina micromanagement sem tirar a decisão de quem quer negociar salários.
- Não pode causar inadimplência nem saída de membros (§2), então é seguro deixar
  ligado a campanha inteira.
- Puro e testável: a regra vive numa função do calculador de salários; o tick só
  a aplica.

**Negativas / trade-offs**
- A folha cresce sozinha; um jogador desatento pode achar que o caixa "some" —
  daí o relatório no resumo do turno (§5).
- Mais uma opção por save (superfície de configuração cresce); se aparecerem
  outras, `settings` deve virar um `jsonb` em vez de uma coluna por opção.

## Referências
- Implementação: [src/modules/band-members/](../../src/modules/band-members/)
  (`salary.calculator`, `auto-adjust-salaries.use-case`),
  [src/modules/bands/](../../src/modules/bands/) (`update-band-settings.use-case`)
  e [src/modules/turns/](../../src/modules/turns/) (`advance-turn.use-case`).
- Migration: `src/database/migrations/*-AddAutoSalaryAdjustToBands.ts`.
