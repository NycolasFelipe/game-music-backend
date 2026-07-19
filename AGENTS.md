# AGENTS.md

## 1. Project Stack & Environment
- Framework: NestJS
- Language: TypeScript
- Primary Database: PostgreSQL
- Package Manager: npm (Always run `npm run lint` before finishing)
- Testing: Run `npm run test:unit -- --testPathPatterns="<affected-module>"` with the pattern of the module you changed (e.g. `leads`, `pipelines`, `auth`).
  Never run the full `npm test` unless explicitly requested.

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
- **Controller per file**: Each file must contain **exactly 1 controller class**. Never define multiple controllers in the same file. Create a separate file for each controller (e.g., `whatsapp-template.controller.ts`, `whatsapp-message.controller.ts`).
- Use Cases over Services: **Do not create `@Injectable()` Services.** Business logic must be implemented as **Use Cases** — single-responsibility, stateless classes with a single public method (e.g., `execute()` or `handle()`). Each use case should solve exactly one business operation. Never accumulate multiple responsiblities into one class; split them into distinct use cases (e.g., `CreateLeadUseCase`, `AssignLeadUseCase`, `CalculateLeadScoreUseCase`).
- Use Case Naming: Name files with the `.use-case.ts` suffix (e.g., `create-lead.use-case.ts`, `assign-lead.use-case.ts`).
- Use Case Registration: Register use cases as providers in their respective module — one provider entry per use case. Do not barrel-export many use cases from a single module file.
- DTO Layers (Separation of Concerns):
  - **Presentation DTOs** (`src/modules/<modulo>/presentation/dto/`): Used by **Controllers**. Decorated with `class-validator` and `class-transformer` for input validation and serialization. These DTOs are tightly coupled to the HTTP contract (query params, body, route params).
  - **Application DTOs** (`src/modules/<modulo>/application/dto/`): Used by **Use Cases**. Plain classes (not interfaces) without validation decorators. These represent the typed, validated data that the use case receives after the controller has already validated and transformed the input. They define the application contract, independent of the transport layer.
- **Rule**: Controllers validate HTTP input via Presentation DTOs, then map them to Application DTOs before forwarding to Use Cases. Use Cases never reference Presentation DTOs directly.
- Use Case Orchestration: Use cases can inject and call other use cases for complex workflows (e.g., `CreateLeadUseCase` calls `LeadsGovernancePolicyUseCase`, `LeadsRulesUseCase`, `CalculateLeadScoreUseCase`). Keep each use case focused on a single responsibility even when orchestrating.

## 3. Code Style & Rules
- File Naming: Lowercase, kebab-case separated by dots (e.g., `create-lead.use-case.ts`, `auth.controller.ts`).
- Response Structure: Never return raw database entities. Use serialization or explicit maps to target specific response shapes.
- Repository `toDomain()` mapping: Never return raw ORM entities from the repository. Implement a private `toDomain()` method to map ORM records to domain entities (e.g., `private toDomain(orm: OrmEntity): DomainEntity`). This keeps domain entities clean of ORM imports.
- Type Safety: Prohibit the usage of `any`. Explicitly type all use case responses and repository returns using Interfaces or Types.
- Direct database access from Use Cases is prohibited: Use cases must **never** inject `DataSource`, use `@InjectDataSource()`, or run SQL queries directly via `this.dataSource.query()`. All database interaction must go exclusively through the **repositories** injected via `@Inject(REPOSITORY_TOKEN)`. This keeps the domain layer independent of infrastructure and makes unit testing with mocks straightforward.
- Error Handling: Always throw built-in NestJS HTTP Exceptions (e.g., `NotFoundException`, `BadRequestException`) rather than generic Node `Error`.
- Logger Pattern: Each use case should instantiate a logger at class level: `private readonly logger = new Logger(CreateLeadUseCase.name)`.
- Use Case Signature: The first parameter of `execute()` is always the authenticated actor (`actor: AuthenticatedUserEntity`), followed by the typed input DTO.
- Defining input/output types/classes inside Use Cases is prohibited: Input and output types and classes (DTOs, inputs, results) must **not** be defined inside the use case file. Every DTO must have its own file under `application/dto/`. This preserves single responsibility, makes unit testing easier and avoids duplication.
- **JSDoc Documentation**: Every public method of every class (use cases, controllers, repositories, processors, listeners, validators, utils) **must** have a JSDoc comment documenting:
  - The purpose of the method.
  - `@param` for each parameter (type and description).
  - `@returns` with the return type and description.
  - `@throws` when applicable.
  - Private helper methods and `toDomain()` should also be documented for maintainability.
  - Use cases **must** document the `execute()` method with the full JSDoc describing the flow, delegation and edge cases.
- Swagger Documentation: Every controller method **must** have a custom decorator using `@nestjs/common`'s `applyDecorators` to document the endpoint via `@nestjs/swagger` (`@ApiOperation`, `@ApiBody`, `@ApiResponse`, `@ApiParam`, `@ApiQuery`, etc.).
  - **Where**: Create a dedicated decorator file per module (e.g., `src/modules/<modulo>/decorators/api-<modulo>.decorator.ts`).
  - **Naming**: Prefix with `Api` + action in PascalCase (e.g., `@ApiCreateLead()`, `@ApiListPipelines()`, `@ApiFindPipelineById()`).
  - **Examples**:
    - `src/modules/leads/decorators/api-leads.decorator.ts`
    - `src/modules/pipelines/decorators/api-pipelines.decorator.ts`

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
  - `parameters` is optional and includes `allowed_values` with full entity objects for entity filters (e.g., units as `[{ id, name }]`).
  - See `ParameterDto` in `src/common/dto/parameter.dto.ts` and examples in `buildListParameters()` from rules use cases.

## 4. Repository Pattern (Domain-Driven)
- **Interface + Symbol Token**: Define a repository interface in `domain/repositories/` and export a `Symbol` for DI injection (e.g., `export const LEADS_REPOSITORY = Symbol('LEADS_REPOSITORY')`).
- **Implementation**: Place the TypeORM implementation in `infrastructure/persistence/typeorm/` and register the provider via `useExisting` in `infrastructure/persistence/providers/`.
- **`toDomain()` mapping**: Never return raw ORM entities. Implement a private `toDomain()` method to map ORM records to domain entities.
- **Transactions**: Use `this.dataSource.transaction()` for multi-step write operations.
- **Method naming**: Suffix with `AndCompanyId` for multi-tenant scoping (e.g., `findByIdAndCompanyId`, `updateByIdAndCompanyId`).

## 5. Testing Requirements
- Unit Tests: Every use case must have a corresponding `.spec.ts` file covering the public method and all edge cases (success, validation errors, not-found, etc.).
- Repository mocks: Use `jest.fn()` and `jest.Mocked<>` with repository Symbol tokens: `{ provide: LEADS_REPOSITORY, useValue: mockRepo }`.
- Test setup: Use `Test.createTestingModule()` from `@nestjs/testing` to create the test module.
- Never hit the database in unit tests.
- Integration tests: Use `supertest` for HTTP calls, `createIntegrationContext()` for seeding, and Testcontainers for a real PostgreSQL database. Set `jest.setTimeout(120000)` for long-running integration tests.
- Command: Run `npm run test:unit -- --testPathPatterns="<affected-module>"` to check compliance. Do not run the full `npm test` unless explicitly requested.

## 6. Guards & Permissions
- **JwtAuthGuard**: Applied globally or per-controller with `@UseGuards(JwtAuthGuard)`. Extracts Bearer token, verifies JWT, and populates `request.user`.
- **PermissionsGuard**: Used alongside `@RequirePermissions(PermissionCode.ACTION)` to validate granular permissions.
- **Hardcoded strings in `@RequirePermissions()` are prohibited**: Always use the `PermissionCode` enum imported from `src/common/constants/access-control.constant`. Never pass string literals (e.g. `'MANAGE_SETTINGS'`). The enum guarantees type-safety, eases refactors and prevents inconsistencies across modules.
- **Role guard**: `@RequireRoles()` for role-based access control (e.g., SUPER_ADMIN, ADMIN, AGENT).
- **Unit scope**: `@RequireUnitScope()` to restrict access to specific units.
- **SUPER_ADMIN bypass**: SUPER_ADMIN role bypasses permission checks in non-admin routes.
- Always apply guards at the class level: `@UseGuards(JwtAuthGuard, PermissionsGuard)`.

## 7. Security & Constraints
- Environment Variables: Never hardcode secrets. Inject environment configurations exclusively via the NestJS `@nestjs/config` module.
- Prohibited Actions: Do not modify `main.ts` unless explicitly directed. Do not delete existing configuration files (`tsconfig.json`, `nest-cli.json`).