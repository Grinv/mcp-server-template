# Client configuration

This is a standard stdio MCP server. After `npm ci && npm run build`, point any
MCP client at `node /ABS/PATH/<repo>/dist/index.js`. Replace `/ABS/PATH/<repo>`
with the absolute path to your clone. The `env` block is optional.

> Once published to npm, the command becomes `npx -y <package>` with no path.

## Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": ["/ABS/PATH/<repo>/dist/index.js"],
      "env": { "API_KEY": "..." }
    }
  }
}
```

## Cursor / VS Code / Cline / others

Use the same stdio pattern:

- command: `node`
- args: `["/ABS/PATH/<repo>/dist/index.js"]`
- env (optional): your API credentials.
