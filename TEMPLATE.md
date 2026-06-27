# Using this template

A checklist for turning this template into a new MCP server (e.g. TMDB, Steam).
The generic carcass (`src/lib/`, build tooling, tests infra, CI) is reused as-is;
you mostly rewrite the domain layer.

## 1. Rename

- [ ] `package.json`: `name`, `description`, `bin`, `keywords`, repo/author URLs.
- [ ] `src/version.ts`: `USER_AGENT` string.
- [ ] `manifest.json`: `name`, `display_name`, `description`, URLs, `tools`, `user_config`.
- [ ] `server.json`: `name` (`io.github.<owner>/<repo>`), `repository`, asset URL.
- [ ] `src/server.ts`: server `name` and `INSTRUCTIONS`.
- [ ] Workflows: `.mcpb` filename in `.github/workflows/release.yml`.
- [ ] `README.md`, `CHANGELOG.md`, this file as needed.

## 2. Configuration (`src/config.ts`)

- [ ] Replace the example env vars (`API_KEY`, `API_BASE_URL`) with your API's
      credentials and settings. Keep the empty-string filtering (needed for `.mcpb`).
- [ ] Add an auth model if needed. For OAuth-with-refresh, reuse
      `src/lib/tokenStore.ts` (see the `mal-mcp` server for a worked example);
      otherwise delete it.

## 3. Domain layer

- [ ] `src/clients/` — one client per upstream API, built on the generic
      `HttpClient` + `TtlCache`. Trim responses for token efficiency.
- [ ] `src/tools/` — replace `example.ts` with your tools. Rich `description`s,
      per-field `.describe()`, correct `annotations`, bodies wrapped in `guard()`.
- [ ] `src/prompts.ts` — add prompts if useful (optional).
- [ ] `scripts/check-api.mjs` — add a check per upstream endpoint you depend on.

## 4. Tests & docs

- [ ] Replace `src/__tests__/example.test.ts` with tests for your tools/clients
      (mock `globalThis.fetch` via `helpers.ts`). Keep coverage ≥ 80%.
- [ ] Update `docs/clients.md`; add `docs/auth.md` if your API needs credentials.

## 5. Verify

```sh
npm install
npm run build && npm test && npm run lint && npm run format:check
npx mcpb validate manifest.json
```

Then create the repo, push, and tag `v0.1.0` to trigger the release workflow.
