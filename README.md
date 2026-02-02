# Interleaver BFF (Fastify + TypeScript)

Backend-for-Frontend that fronts downstream services for a Next.js frontend. It performs HTTP aggregation/orchestration only—no domain logic or persistence.

## Responsibilities
- Expose HTTP endpoints tailored for the frontend.
- Validate inputs/outputs with Zod.
- Orchestrate downstream HTTP clients; aggregate/reshape responses.
- Enforce platform concerns: auth context propagation, rate limiting, CORS, error normalization, and observability hooks.

## Explicit Non-Responsibilities
- No databases, ORMs, or persistence.
- No business/domain rules; those stay in upstream domains.
- No backend DTO leakage beyond adapters.

## Folder Ownership & Rules
- `src/modules/*`: Feature-first modules. Each module owns its routes/controller/service/adapter/schema/types. **Must not import other modules.**
- `src/clients/*`: Downstream HTTP clients. All outbound calls go here. Other layers should not call `fetch`/HTTP libraries directly.
- `src/core/*`: Cross-cutting primitives (logger, HTTP client).
- `src/plugins/*`: Fastify plugins (auth context, CORS, rate limit, swagger).
- `src/middlewares/*`: Global middlewares (error handling).
- `src/utils/*`: Small shared utilities; no I/O.
- `src/config/*`: Env validation and constants.
- `src/tests/*`: Integration/contract tests per feature.

## Architectural Constraints
1. Feature-first structure under `src/modules`.
2. Modules do not import each other; depend only on clients/core/utils/plugins/middlewares.
3. All backend API calls go through `src/clients`.
4. Controllers handle HTTP concerns only (validation, status, headers).
5. Services orchestrate/aggregate data; keep thin.
6. Adapters transform backend DTOs → frontend DTOs; prevent leakage of backend shapes.
7. Zod schemas validate request params and responses.
8. Strong typing—no `any`.
9. No DB/ORM/persistence.
10. Async/await everywhere.

## How to Run
```bash
npm install
npm run dev   # ts-node-dev on src/server.ts
npm run build # tsc -> dist
npm start     # node dist/server.js
```

## Linting & Type Safety
- `npm run lint` (enforces module boundaries and client-only HTTP calls)
- `npm run typecheck`

## Adding a New Module
1. Create `src/modules/<feature>/` with `*.routes|controller|service|adapter|schema|types.ts`.
2. Add routes registration to `src/app.ts` (feature-first).
3. Put downstream calls in a dedicated client under `src/clients/`.
4. Keep adapters as the only place mapping backend DTOs to frontend DTOs.
