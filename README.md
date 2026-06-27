# mcp-server-template

A template for building a TypeScript [MCP](https://modelcontextprotocol.io)
server. It ships a reusable carcass — typed `fetch` client (timeouts, retries,
backoff), rate limiting, TTL cache, OAuth token store, structured errors, leveled
logging, MCP tool-result helpers — plus build tooling, `node:test` setup, `.mcpb`
packaging and GitHub Actions CI/release.

The server speaks standard MCP over stdio, so it works with any MCP client
(Claude Desktop/Code, Cursor, VS Code, Cline, …).

## Use it

Click **Use this template** on GitHub (or copy this directory), then follow the
checklist in [TEMPLATE.md](TEMPLATE.md). In short: rename, edit `src/config.ts`,
add your `src/clients/` and `src/tools/`, and update the manifest and docs. The
included `search` tool is a placeholder to delete.

## Develop

```sh
npm install
npm run build        # type-check + bundle to dist/index.js
npm test             # node:test (mocked, offline)
npm run lint
npm run format
npm run check:api    # live upstream health-check (add your endpoints)
npm run inspector    # run under the MCP Inspector
```

Runtime requires Node ≥ 18. Contributor/agent guidance lives in
[AGENTS.md](AGENTS.md) (the single source of truth; `CLAUDE.md` just links to it).

## Updating

Document how users update your server (keep this section in the generated repo):

- **`.mcpb` bundle:** download the new bundle from the releases page and reinstall.
- **From source:** `git pull && npm ci && npm run build`.
- **npx (if published):** unpinned `npx -y <package>` fetches the latest next run.

Tell users to **Watch → Releases**, and keep the [CHANGELOG](CHANGELOG.md) current.

## License

[MIT](LICENSE) © Grinv
