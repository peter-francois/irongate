# irongate

Lightweight industrial metrics broker built with Bun and Hono. Explores real-time data ingestion, SSE streaming, and middleware patterns in a factory-inspired context.

## Stack

- Runtime => Bun
- Framework => Hono
- Language => TypeScript
- Linting & formatting => Biome

## Technical decisions

**Biome** replaces the ESLint + Prettier combo => single tool, zero config conflicts, faster execution.

**In-memory store** => no database, metrics are stored in a `Map<string, Metric[]>` keyed by machine ID. O(1) access per machine, intentionally simple for exploration purposes.

**Zod validation** => request bodies are validated at the route level via `@hono/zod-validator`. The `Metric` type is derived directly from the Zod schema => single source of truth.

**SSE over WebSocket** => unidirectional server push is sufficient for streaming metrics to consumers. A pub/sub system using a `Set` of subscribers notifies connected clients on every new metric.


## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/metrics` | Ingest a metric from a machine |
| GET | `/metrics` | Get all metrics |
| GET | `/metrics/:machineId` | Get metrics for a specific machine |
| GET | `/stream` | SSE stream of incoming metrics |

All routes require an `Authorization: Bearer <token>` header.

### Metric payload

```json
{
  "machineId": "machine-1",
  "kind": "temperature",
  "value": 72.4,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Supported kinds: `temperature`, `pressure`, `speed`, `presence`, `power`

## Getting started

```bash
git clone https://github.com/your-username/irongate
cd irongate
bun install
```

Create a `.env` file:

```
API_TOKEN=your-token
```

## Scripts

```bash
bun dev       # start dev server with hot reload
bun test      # run tests
bun check     # lint + format (Biome)
```

## What I learned

- **Hono routing** => middleware pipeline, context object (`c`), typed request/response
- **Bun as a runtime** => `Bun.serve()`, `Bun.env`, native Web Standards support
- **SSE in practice** => persistent connections, subscriber pattern, cleanup on disconnect
- **Zod + Hono** => schema-first validation with derived TypeScript types
- **Biome** => unified linter and formatter, replaces the ESLint + Prettier setup
- **Testing with `bun test`** => no extra dependencies, `app.request()` to test routes without starting a real server

## CI

GitHub Actions pipeline runs on every push to `main`:

- `bun check` => lint and format validation
- `bun test` => full test suite

Secrets are managed via a `dev` environment in GitHub repository settings.

## Next steps

- [ ] Investigate SSE connection closing after ~10s (likely a Bun `idleTimeout` issue)
- [ ] Build a simulation script => multiple machines sending concurrent metrics to observe the system under realistic load