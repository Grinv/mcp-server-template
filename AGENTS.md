# AGENTS.md

Single source of truth for working on this repository — for **any** model or
agent (Claude, and others). `CLAUDE.md` only references this file; keep all
shared guidance here.

This repository is a **template** for building TypeScript MCP servers. See
[TEMPLATE.md](TEMPLATE.md) for the step-by-step checklist to spin up a new server.

## Architecture

A standard stdio MCP server. The design separates a **reusable carcass** from a
thin **domain layer**, so a new server only rewrites the domain layer.

```
src/
  index.ts        # bin entry — calls start()
  server.ts       # buildServer() + start(); wires clients/tools/prompts   [domain wiring]
  config.ts       # env → validated Config (zod)                          [domain]
  lib/            # GENERIC carcass — reuse as-is:
    http.ts       #   fetch wrapper: timeout, retries, backoff, UA, error mapping
    rateLimit.ts  #   min-interval + sliding-window limiter (e.g. N/s and M/min)
    cache.ts      #   in-memory TTL cache
    tokenStore.ts #   OAuth refresh-token persistence (use only if your API needs it)
    errors.ts     #   ApiError + status classification + secret redaction
    logger.ts     #   leveled stderr logger (redacts secrets)
    result.ts     #   MCP tool-result builders (jsonResult/errorResult/apiErrorToResult)
  clients/        # one client per upstream API                           [domain]
  tools/
    guard.ts      #   GENERIC — wraps a tool body, turns errors into results
    *.ts          #   tool registrations                                  [domain]
  prompts.ts      # optional MCP prompts                                  [domain]
  __tests__/      # node:test; helpers.ts is generic infra
scripts/          # build-tests.mjs, run-tests.mjs (generic), check-api.mjs (domain)
```

**Reuse model:** copy this template (GitHub "Use this template") and rewrite only
the `[domain]` parts: `config.ts`, `clients/`, domain `tools/`, `prompts.ts`,
`check-api.mjs`, the manifest tool list, and the docs. The `lib/` carcass, build
tooling, tests infra and CI come for free. Extract `lib/` into a shared package
only once duplication across servers actually hurts (YAGNI) — not before.

## Commands

```sh
npm run build          # tsc --noEmit + tsup → dist/index.js (single ESM bundle)
npm test               # build tests with esbuild, run with node:test
npm run test:coverage  # same, with coverage (CI gate: lines >= 80%)
npm run lint           # eslint
npm run format         # prettier --write
npm run check:api      # live upstream health-check (network)
npm run inspector      # run under the MCP Inspector
```

## Conventions

- **Docs and in-code text are English** (README, docs, comments, tool
  descriptions, error messages).
- Runtime floor is **Node ≥ 18** (global `fetch`); tsup targets `node18`. Tests
  may run on newer Node but must not raise the runtime floor.
- Log to **stderr only** — stdout is the MCP protocol channel. Use the logger;
  it redacts credentials.
- Tool failures return `{ isError: true }` results (via `guard()` / `result.ts`),
  never thrown — the agent should get an actionable message.
- Write tool `description`s and per-field `.describe()` text for the calling
  model; set `annotations` (readOnly/destructive/idempotent/openWorld).
- Keep dependencies minimal. New deps need a clear justification (supply-chain):
  Dependabot uses a cooldown and there is no auto-merge; review every bump.
- **Never commit secrets.** Credentials come from env vars / OS keychain only.
- Cross-platform: macOS, Linux and Windows. Avoid POSIX-only shell in npm
  scripts (use the Node helper scripts).
- **Commits:** author/committer `Grinv <4070730+Grinv@users.noreply.github.com>`;
  do **not** add a `Co-Authored-By` trailer.

## Before opening a PR

Run `npm run build && npm test && npm run lint && npm run format:check`, and
update `CHANGELOG.md` (Unreleased section).
