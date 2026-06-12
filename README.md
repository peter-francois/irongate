# irongate

Lightweight industrial metrics broker built with Bun and Hono. Explores real-time data ingestion, SSE streaming, and middleware patterns in a factory-inspired context.

## Stack

- Runtime — Bun
- Framework — Hono
- Language — TypeScript
- Linting & formatting — Biome

## Technical decisions

**Biome** replaces the ESLint + Prettier combo — single tool, zero config conflicts, faster execution.

## Getting started

```bash
git clone https://github.com/your-username/irongate
cd irongate
bun install
```

## Scripts

```bash
bun dev       # start dev server with hot reload
bun check     # lint + format (Biome)
```