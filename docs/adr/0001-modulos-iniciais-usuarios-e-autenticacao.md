# 0001 — Módulos iniciais: Usuários e Autenticação básica

- **Status:** Aceita
- **Data:** 2026-07-18
- **Decisores:** Equipe de backend

## Contexto

O backend `game-music` partiu de um starter vazio do NestJS. A primeira fatia de
funcionalidade exigida é **autenticação básica de usuário** (login por
usuário/senha), que serve de fundação para todos os módulos protegidos futuros.

Restrições e premissas que moldaram as decisões abaixo:

- O projeto é **single-tenant** (ver [AGENTS.md](../../AGENTS.md), seção 1).
- A arquitetura em camadas do projeto (domínio, aplicação, infraestrutura,
  apresentação) e o padrão de **Use Cases sobre Services** já eram convenção
  documentada no `AGENTS.md` e precisavam ser exercitados de ponta a ponta pela
  primeira vez.
- A infra de testes já pressupunha **PostgreSQL + migrations** (Testcontainers e
  `npm run db:migration:run`), então a persistência real não podia ser adiada.
- Era necessário um **usuário-semente** (`user` / `user`) para permitir uso
  imediato em desenvolvimento.

## Decisão

Implementamos dois módulos acoplados — `users` (dono da persistência de usuários)
e `auth` (dono do fluxo de login e da autenticação por JWT) — seguindo as
decisões abaixo.

### 1. Arquitetura em camadas por módulo
Cada módulo segue as 4 camadas do `AGENTS.md`:
`domain/` (entidades e interfaces de repositório), `application/`
(use cases + DTOs de aplicação), `infrastructure/` (implementações TypeORM,
providers, strategies) e `presentation/http/` (controllers + DTOs de HTTP).

### 2. Use Cases em vez de Services
A lógica de login vive em [`LoginUseCase`](../../src/modules/auth/application/use-cases/login.use-case.ts)
— classe stateless com um único método público `execute()`. Nenhum
`@Injectable()` Service de negócio foi criado.

### 3. Padrão de repositório com token `Symbol` + `toDomain()`
- Interface `UsersRepository` em `domain/repositories/`, exposta via token
  `USERS_REPOSITORY = Symbol(...)`.
- Implementação `UsersTypeormRepository` em `infrastructure/persistence/typeorm/`,
  ligada ao token por `useExisting`.
- O repositório nunca devolve a ORM entity crua: mapeia para a entidade de
  domínio via um `toDomain()` privado. Isso mantém a camada de domínio livre de
  imports do TypeORM.

### 4. Autenticação stateless por JWT
- Login valida credenciais e emite um **access token JWT** (`@nestjs/jwt`),
  com payload `{ sub: userId, username }`.
- Proteção de rotas via **Passport** (`passport-jwt`): a
  [`JwtStrategy`](../../src/modules/auth/infrastructure/strategies/jwt.strategy.ts)
  extrai o Bearer token, valida assinatura/expiração e popula `request.user` com
  uma `AuthenticatedUserEntity`. O acesso é feito pelo `JwtAuthGuard`
  (`@UseGuards`) e pelo decorator de parâmetro `@CurrentUser()`.
- Segredo e expiração vêm de env (`JWT_SECRET`, `JWT_EXPIRES_IN`) via
  `@nestjs/config` — nunca hardcoded.

### 5. Hashing de senha com `bcryptjs`
Abstraído atrás de uma interface `PasswordHasher` (token `PASSWORD_HASHER`) no
módulo compartilhado `common/crypto`, para desacoplar os use cases do algoritmo
e facilitar testes. A implementação usa `bcryptjs` (JS puro).

### 6. Persistência com TypeORM + migrations versionadas
- Conexão configurada via `ConfigService` no `DatabaseModule`
  (`synchronize: false` — o schema só muda por migration).
- `DataSource` standalone (`src/database/data-source.ts`) para a CLI do TypeORM.
- Migration inicial cria a tabela `users` (id `uuid`, `username` único,
  `password_hash`, timestamps).

### 7. Usuário-semente via script `db:seed`
Um script idempotente (`npm run db:seed`) insere o usuário padrão `user`/`user`
usando o **hashing real** do bcrypt (em vez de um hash pré-computado dentro da
migration), mantendo migrations e dados de seed separados.

### 8. Validação global sem tocar no bootstrap de negócio
`ValidationPipe` (`whitelist: true`, `transform: true`) registrado como
`APP_PIPE` no `AppModule`, em vez de no `main.ts`.

### 9. Alias de import `@/`
Imports entre pastas usam o alias `@/*` → `src/*`; apenas imports da mesma pasta
usam `./`. Resolução garantida em todos os contextos (build via `tsc-alias`,
dev via `nest start`, testes via `moduleNameMapper`, CLI/seed via
`tsconfig-paths`).

## Endpoints resultantes

| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| `POST` | `/auth/login` | Pública | Valida credenciais e retorna `accessToken` + usuário |
| `GET`  | `/auth/me` | `JwtAuthGuard` | Retorna o usuário autenticado do token |

Documentação Swagger disponível em `/docs`.

## Alternativas consideradas

- **`bcrypt` (nativo) em vez de `bcryptjs`:** mais rápido, porém exige toolchain
  de build nativo na imagem Alpine do Docker. Optamos por `bcryptjs` para evitar
  atrito de build; a diferença de performance é irrelevante no volume atual.
- **Seed dentro da migration (hash pré-computado):** rodaria junto com
  `db:migration:run` (inclusive nos testes de integração), mas acopla dado a
  schema e exige um hash fixo no código. Preferimos um script de seed dedicado.
- **Sessão com estado / cookies:** descartado em favor de JWT stateless, mais
  simples para uma API e alinhado a clientes desacoplados.
- **`synchronize: true` do TypeORM:** conveniente em dev, mas perigoso e
  não-versionado. Rejeitado em favor de migrations explícitas.

## Consequências

**Positivas**
- Fundação de auth reutilizável: novos módulos protegidos só precisam aplicar
  `@UseGuards(JwtAuthGuard)` e ler `@CurrentUser()`.
- Camadas desacopladas e testáveis por mock (o `LoginUseCase` tem testes
  unitários cobrindo sucesso, usuário inexistente e senha inválida).
- Exercita e valida as convenções do `AGENTS.md` de ponta a ponta, servindo de
  referência para os próximos módulos.

**Negativas / trade-offs**
- Sem **refresh token** nem revogação: o access token vale até expirar. Suficiente
  para o estágio atual; deverá ser revisitado quando houver sessões longas.
- Sem sistema de **papéis/permissões** ainda — apenas autenticação. Autorização
  granular (`PermissionsGuard`, `@RequireRoles`) fica para uma ADR futura.
- O verbo em `bcryptjs` é ligeiramente mais lento que o nativo (aceitável).

## Referências
- Convenções: [AGENTS.md](../../AGENTS.md)
- Módulo de usuários: [src/modules/users/](../../src/modules/users/)
- Módulo de autenticação: [src/modules/auth/](../../src/modules/auth/)
- Infra de banco e seed: [src/database/](../../src/database/)
