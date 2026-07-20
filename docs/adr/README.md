# Architecture Decision Records (ADRs)

Este diretório registra as decisões de arquitetura relevantes do projeto usando o
formato [ADR](https://adr.github.io/) (baseado no modelo de Michael Nygard).

Cada ADR é imutável depois de aceita: para reverter ou alterar uma decisão,
crie uma nova ADR que a substitua (`Supersedes`/`Superseded by`).

## Convenções
- Arquivo: `NNNN-titulo-em-kebab-case.md` (numeração sequencial, começando em `0001`).
- Status: `Proposta` → `Aceita` → (`Substituída` | `Depreciada`).
- Estrutura mínima: Contexto, Decisão, Consequências.

## Índice
| # | Título | Status |
|---|--------|--------|
| [0001](0001-modulos-iniciais-usuarios-e-autenticacao.md) | Módulos iniciais: Usuários e Autenticação básica | Aceita |
| [0002](0002-modulos-bands-e-band-members.md) | Módulos `bands` e `band-members` | Aceita |
| [0003](0003-relacionamentos-entre-membros.md) | Relacionamentos entre membros | Aceita |
| [0004](0004-eventos-ativos.md) | Eventos ativos | Aceita |
| [0005](0005-eventos-passivos.md) | Eventos passivos (timeline) | Aceita |
| [0006](0006-turnos.md) | Turnos (avanço do tempo do jogo) | Aceita |
| [0007](0007-fama.md) | Fama (nível derivado de fãs) | Aceita |
| [0008](0008-obras-musicais.md) | Obras musicais (criação de discos) | Aceita |
| [0009](0009-gravadoras-e-contratos.md) | Gravadoras e contratos (economia realista) | Aceita (impl. pendente) |

## Veja também
- [Trabalho futuro](../future-work.md) — backlog de ideias de gameplay ainda não
  decididas (cada uma vira um ADR quando priorizada).
