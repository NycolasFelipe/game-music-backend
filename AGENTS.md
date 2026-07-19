# AGENTS.md

## 1. Project Stack & Environment
- Framework: NestJS
- Language: TypeScript
- Primary Database: PostgreSQL
- Architecture: Single-tenant application.
- Package Manager: npm
- Validation (mandatory): always run `npm run check` before finishing. It runs, in order, `typecheck` (`tsc --noEmit` over the whole project — src **and** tests), `lint` and the unit tests. The task is **not done** until `npm run check` passes.
- Testing (iterative): while developing, run `npm run test:unit -- --testPathPatterns="<affected-module>"` for the module you changed (e.g. `auth`, `bands`). Never run the full `npm test` unless explicitly requested. The final `npm run check` still runs the whole unit suite.

## 2. Core NestJS Architecture & Conventions
- Modularity: Keep modules encapsulated. Export explicitly via `exports`. Never use global modules unless strictly necessary.
- Dependency Injection: Always use Constructor Injection. Never use `ModuleRef` or global service locators to resolve dependencies dynamically.
- Data Flow: Controllers strictly accept Data Transfer Objects (DTOs) and forward them to **Use Cases**. Controllers must not contain business logic.
- Module Structure (Layered Architecture): Each module follows 4 layers:
  ```
  src/modules/<module>/
  ├── application/          # Use cases, DTOs, processors
  │   ├── dto/
  │   ├── use-cases/
  │   └── processors/       # Background job handlers (if applicable)
  ├── decorators/           # Custom Swagger decorators per module
  ├── domain/               # Entities & repository interfaces
  │   ├── entities/
  │   └── repositories/
  ├── infrastructure/       # TypeORM implementations, DI providers
  │   └── persistence/
  │       ├── typeorm/
  │       └── providers/
  ├── presentation/         # HTTP controllers & DTOs
  │   └── http/
  │       ├── controllers/
  │       └── dto/
  └── <module>.module.ts
  ```
- **Controller per file**: Each file must contain **exactly 1 controller class**. Never define multiple controllers in the same file. Create a separate file for each controller (e.g., `<entity>-<action>.controller.ts`).
- Use Cases over Services: **Do not create `@Injectable()` Services.** Business logic must be implemented as **Use Cases** — single-responsibility, stateless classes with a single public method (e.g., `execute()` or `handle()`). Each use case should solve exactly one business operation. Never accumulate multiple responsibilities into one class; split them into distinct use cases (e.g., `Create<Entity>UseCase`, `Update<Entity>UseCase`, `List<Entity>UseCase`).
- Use Case Naming: Name files with the `.use-case.ts` suffix (e.g., `create-<entity>.use-case.ts`, `login.use-case.ts`).
- Use Case Registration: Register use cases as providers in their respective module — one provider entry per use case. Do not barrel-export many use cases from a single module file.
- DTO Layers (Separation of Concerns):
  - **Presentation DTOs** (`src/modules/<module>/presentation/http/dto/`): Used by **Controllers**. Decorated with `class-validator` and `class-transformer` for input validation and serialization. These DTOs are tightly coupled to the HTTP contract (query params, body, route params).
  - **Application DTOs** (`src/modules/<module>/application/dto/`): Used by **Use Cases**. Plain classes (not interfaces) without validation decorators. These represent the typed, validated data that the use case receives after the controller has already validated and transformed the input. They define the application contract, independent of the transport layer.
- **Rule**: Controllers validate HTTP input via Presentation DTOs, then map them to Application DTOs before forwarding to Use Cases. Use Cases never reference Presentation DTOs directly.
- Use Case Orchestration: Use cases can inject and call other use cases for complex workflows. Keep each use case focused on a single responsibility even when orchestrating.

## 3. Code Style & Rules
- File Naming: Lowercase, kebab-case separated by dots (e.g., `create-<entity>.use-case.ts`, `auth.controller.ts`).
- Path Imports: Use the `@/*` alias for cross-directory imports (e.g., `@/common/...`, `@/modules/users/...`). Only same-directory imports use relative `./` paths. Never use deep relative chains (`../../../`).
- Response Structure: Never return raw database entities. Use serialization or explicit maps to target specific response shapes.
- Repository `toDomain()` mapping: Never return raw ORM entities from the repository. Implement a private `toDomain()` method to map ORM records to domain entities (e.g., `private toDomain(orm: OrmEntity): DomainEntity`). This keeps domain entities clean of ORM imports.
- Type Safety: Prohibit the usage of `any`. Explicitly type all use case responses and repository returns using Interfaces or Types.
- Direct database access from Use Cases is prohibited: Use cases must **never** inject `DataSource`, use `@InjectDataSource()`, or run SQL queries directly via `this.dataSource.query()`. All database interaction must go exclusively through the **repositories** injected via `@Inject(REPOSITORY_TOKEN)`. This keeps the domain layer independent of infrastructure and makes unit testing with mocks straightforward.
- Error Handling: Always throw built-in NestJS HTTP Exceptions (e.g., `NotFoundException`, `BadRequestException`) rather than generic Node `Error`.
- Logger Pattern: Each use case should instantiate a logger at class level: `private readonly logger = new Logger(Create<Entity>UseCase.name)`.
- Use Case Signature: The first parameter of `execute()` is always the authenticated actor (`actor: AuthenticatedUserEntity`), followed by the typed input DTO. Exception: unauthenticated flows (e.g. login) take only the input DTO.
- Defining input/output types/classes inside Use Cases is prohibited: Input and output types and classes (DTOs, inputs, results) must **not** be defined inside the use case file. Every DTO must have its own file under `application/dto/`. This preserves single responsibility, makes unit testing easier and avoids duplication.
- **JSDoc Documentation**: Every public method of every class (use cases, controllers, repositories, processors, listeners, validators, utils) **must** have a JSDoc comment documenting:
  - The purpose of the method.
  - `@param` for each parameter (type and description).
  - `@returns` with the return type and description.
  - `@throws` when applicable.
  - Private helper methods and `toDomain()` should also be documented for maintainability.
  - Use cases **must** document the `execute()` method with the full JSDoc describing the flow, delegation and edge cases.
- Swagger Documentation: Every controller method **must** have a custom decorator using `@nestjs/common`'s `applyDecorators` to document the endpoint via `@nestjs/swagger` (`@ApiOperation`, `@ApiBody`, `@ApiResponse`, `@ApiParam`, `@ApiQuery`, etc.).
  - **Where**: Create a dedicated decorator file per module (e.g., `src/modules/<module>/decorators/api-<module>.decorator.ts`).
  - **Naming**: Prefix with `Api` + action in PascalCase (e.g., `@ApiLogin()`, `@ApiCreate<Entity>()`, `@ApiList<Entity>()`).
  - **Example**: `src/modules/auth/decorators/api-auth.decorator.ts`

- **Response Structure (List Endpoints)**: Paginated list endpoints must follow the standard format:
  ```ts
  {
    limit: number;                // Number of records returned
    offset: number;               // Page offset
    data: T[];                    // Array of list data
    count: number;                // Total records (without pagination)
    parameters?: ParameterDto[];  // Available filter metadata
  }
  ```
  - `limit`, `offset`, `data` and `count` at root level — no nested `meta` object.
  - `parameters` is optional and includes `allowed_values` with full entity objects for entity filters (e.g., a category as `[{ id, name }]`).
  - Define a shared `ParameterDto` under `src/common/dto/` for filter metadata.

## 4. Repository Pattern (Domain-Driven)
- **Interface + Symbol Token**: Define a repository interface in `domain/repositories/` and export a `Symbol` for DI injection (e.g., `export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY')`).
- **Implementation**: Place the TypeORM implementation in `infrastructure/persistence/typeorm/` and register the provider via `useExisting` in `infrastructure/persistence/providers/`.
- **`toDomain()` mapping**: Never return raw ORM entities. Implement a private `toDomain()` method to map ORM records to domain entities.
- **Transactions**: Use `this.dataSource.transaction()` for multi-step write operations.
- **Method naming**: Use clear, intent-revealing names describing the lookup or mutation (e.g., `findById`, `findByUsername`, `updateById`).

## 5. Testing Requirements
- Unit Tests: Every use case must have a corresponding `.spec.ts` file covering the public method and all edge cases (success, validation errors, not-found, etc.).
- Repository mocks: Use `jest.fn()` and `jest.Mocked<>` with repository Symbol tokens: `{ provide: USERS_REPOSITORY, useValue: mockRepo }`.
- Test setup: Use `Test.createTestingModule()` from `@nestjs/testing` to create the test module.
- Never hit the database in unit tests.
- Integration tests: Use `supertest` for HTTP calls, a shared integration context helper for seeding, and Testcontainers for a real PostgreSQL database. Set `jest.setTimeout(120000)` for long-running integration tests.
- Command (iterative): Run `npm run test:unit -- --testPathPatterns="<affected-module>"` to check the module you changed. Do not run the full `npm test` unless explicitly requested.
- Final validation: `npm run check` (typecheck + lint + unit tests) must pass before finishing — see section 1.

## 6. Guards & Permissions
- **JwtAuthGuard**: Applied globally or per-controller with `@UseGuards(JwtAuthGuard)`. Extracts the Bearer token, verifies the JWT, and populates `request.user`.
- **PermissionsGuard** (when granular permissions are introduced): Used alongside `@RequirePermissions(PermissionCode.ACTION)` to validate granular permissions.
- **Hardcoded strings in `@RequirePermissions()` are prohibited**: Always use the `PermissionCode` enum imported from `@/common/constants/access-control.constant`. Never pass string literals (e.g. `'MANAGE_SETTINGS'`). The enum guarantees type-safety, eases refactors and prevents inconsistencies across modules.
- **Role guard**: `@RequireRoles()` for role-based access control (e.g., `ADMIN`, `USER`).
- **Elevated role bypass**: A top-level role (e.g., `ADMIN`) may bypass granular permission checks where appropriate.
- Always apply guards at the class level: `@UseGuards(JwtAuthGuard, PermissionsGuard)`.

## 7. Security & Constraints
- Environment Variables: Never hardcode secrets. Inject environment configurations exclusively via the NestJS `@nestjs/config` module.
- Prohibited Actions: Do not modify `main.ts` unless explicitly directed. Do not delete existing configuration files (`tsconfig.json`, `nest-cli.json`).
- **Frontend `game-music` is read-only reference**: The `game-music` frontend repository will be **completely rebuilt** in the future. Never modify it — use it **only** as a domain/reference base (types, game rules, data) when designing the backend.
