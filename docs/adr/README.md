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
| [0002](0002-modulos-bands-e-band-members.md) | Módulos `bands` e `band-members` | Aceita (concluída) |
| [0003](0003-relacionamentos-entre-membros.md) | Relacionamentos entre membros | Aceita |
| [0004](0004-eventos-ativos.md) | Eventos ativos | Aceita |
