# irongate

Lightweight industrial metrics broker built with Bun and Hono. Explores real-time data ingestion, SSE streaming, and middleware patterns in a factory-inspired context.

## Stack

- Runtime — Bun
- Framework — Hono
- Language — TypeScript
- Linting & formatting — Biome

## Technical decisions

**Biome** replaces the ESLint + Prettier combo — single tool, zero config conflicts, faster execution.

**In-memory store** — no database, metrics are stored in a `Map<string, Metric[]>` keyed by machine ID. O(1) access per machine, intentionally simple for exploration purposes.

**Zod validation** — request bodies are validated at the route level via `@hono/zod-validator`. The `Metric` type is derived directly from the Zod schema — single source of truth.

**SSE over WebSocket** — unidirectional server push is sufficient for streaming metrics to consumers. A pub/sub system using a `Set` of subscribers notifies connected clients on every new metric.

**Edge-ready architecture** — Hono is built on Web Standards (`Request`/`Response`). The app instance exposes a `fetch` handler compatible with Bun, Cloudflare Workers, and other runtimes without modification.

**Bruno** — API collections are committed to the repo, enabling a consistent and reproducible testing workflow without additional setup.

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/metrics` | Ingest a metric from a machine |
| GET | `/metrics` | Get all metrics |
| GET | `/metrics/:machineId` | Get metrics for a specific machine |
| GET | `/stream` | SSE stream of incoming metrics |
| GET | `/health` | Health check |

All routes except `/health` require an `Authorization: Bearer <token>` header.

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

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Bruno collections also rely on the same variables. Mirror `.env` values into the Bruno environment (see `bruno/` folder).

## Scripts

```bash
bun dev       # start dev server with hot reload
bun test      # run tests
bun check     # lint + format (Biome)
```

## Docker

```bash
docker compose up --build
```

Starts the app and runs the K6 load test automatically once the service is healthy.

## Load testing

K6 runs automatically via Docker Compose. 10 virtual users simulate 5 machines sending concurrent metrics over 30 seconds.

### Results

```
checks_succeeded: 100.00% — 600 out of 600
http_req_duration: avg=1.37ms  p(95)=2.27ms
http_req_failed:   0.00%
http_reqs:         600 — ~20 req/s
```

Response times stay under 2.3ms at p(95) under concurrent load — a direct benefit of Bun's performance over Node.js.

## Testing

Unit and integration tests use `bun test` with no extra dependencies. Routes are tested via `app.request()` without starting a real server.

### Scenarios covered

- Authentication required on protected routes
- Metric ingestion with valid payloads
- Validation errors on malformed payloads
- Retrieval of all stored metrics
- Retrieval of metrics for a specific machine

Manual API testing is done with Bruno. Collections are available in the `bruno/` directory.

## What I learned

- **Hono routing** — middleware pipeline, context object (`c`), typed request/response
- **Bun as a runtime** — `Bun.serve()`, `Bun.env`, native Web Standards support
- **SSE in practice** — persistent connections, subscriber pattern, cleanup on disconnect
- **Zod + Hono** — schema-first validation with derived TypeScript types
- **Biome** — unified linter and formatter, replaces the ESLint + Prettier setup
- **Testing with `bun test`** — no extra dependencies, `app.request()` to test routes without starting a real server
- **Docker + K6** — containerised load testing with health-gated service startup

## CI

GitHub Actions pipeline runs on every push to `main`:

- `bun check` — lint and format validation
- `bun test` — full test suite

Secrets are managed via a `dev` environment in GitHub repository settings.

## Next steps

- [ ] Add Grafana + InfluxDB for real-time K6 metrics visualisation
- [ ] Persist metrics to a time-series database (TimescaleDB or InfluxDB) to survive container restarts