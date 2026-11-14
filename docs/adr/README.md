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
| [0010](0010-salarios-por-integrante.md) | Salários por integrante | Aceita |
| [0011](0011-critica-e-publico.md) | Obras: análise da crítica e análise do público | Aceita |
| [0012](0012-evolucao-dos-integrantes.md) | Evolução dos integrantes ao publicar uma obra | Aceita |
| [0013](0013-ajuste-automatico-de-salarios.md) | Ajuste automático de salários (opção do save) | Aceita |
| [0014](0014-foco-e-quimica-nos-creditos.md) | Foco e química nos créditos de uma obra | Aceita |
| [0015](0015-tempo-de-producao-e-saturacao.md) | Tempo de produção e saturação de mercado | Aceita |
| [0016](0016-shows-ao-vivo.md) | Shows ao vivo (a renda de base) | Aceita |
| [0017](0017-confraternizacoes.md) | Confraternizações (dinheiro para cuidar do elenco) | Aceita |
| [0018](0018-preferencias-do-usuario.md) | Preferências do usuário (da conta, não do save) | Aceita |
| [0019](0019-custos-nas-sessoes-de-estudio.md) | Custos nas sessões de estúdio e primeiro disco viável | Aceita |
| [0020](0020-relatorio-do-turno.md) | Relatório do turno (dinheiro e fãs explicados) | Aceita |
| [0021](0021-humor-do-show-relativo-a-casa.md) | Humor do show relativo ao que a casa espera | Aceita |
| [0022](0022-painel-do-turno.md) | Painel do turno (pendências, prévias e previsão) | Aceita |
| [0023](0023-aparencia-dos-integrantes-e-cenario-da-banda.md) | Aparência dos integrantes e cenário da foto da banda | Aceita |
| [0024](0024-noticias-da-cena-por-epoca.md) | Notícias da cena por época e três por turno | Aceita |
| [0025](0025-cobertura-minima-de-eventos-ativos.md) | Cobertura mínima de eventos ativos por fase de fama | Aceita |
| [0026](0026-tom-de-voz-dos-textos.md) | Tom de voz dos textos do jogo | Aceita |
| [0027](0027-genero-dos-integrantes-e-flexao-dos-textos.md) | Gênero dos integrantes e flexão dos textos | Aceita |
| [0028](0028-escolha-do-elenco-dos-eventos.md) | Escolha do elenco dos eventos ativos | Aceita |
| [0029](0029-teto-do-convivio-nas-relacoes.md) | Teto do convívio nas relações | Aceita |
| [0030](0030-estilo-da-banda-e-permanente.md) | O estilo da banda é permanente e vale para toda obra | Aceita |
| [0031](0031-eventos-unicos-por-save.md) | Eventos únicos por save: todo semestre, todo show e todo convívio | Aceita |
| [0032](0032-clima-da-banda-com-peso-nas-escolhas.md) | Clima da banda com peso nas escolhas | Aceita |
| [0033](0033-data-de-cada-turno.md) | Data de cada turno | Aceita |

## Veja também
- [Trabalho futuro](../future-work.md) — backlog de ideias de gameplay ainda não
  decididas (cada uma vira um ADR quando priorizada).
