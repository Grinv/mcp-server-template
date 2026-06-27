// Server construction and stdio startup. Kept separate from the bin entry
// (index.ts) so tests can import buildServer without triggering startup.
// Wire your clients, tools and prompts here.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig, type Config } from "./config.js";
import { createLogger, type Logger } from "./lib/logger.js";
import { ExampleClient } from "./clients/example.js";
import { registerExampleTools } from "./tools/example.js";
import { VERSION } from "./version.js";

const INSTRUCTIONS =
  "Example MCP server template. Replace this text, the example client and the " +
  "example tools with your API. Describe here when to use each tool.";

/** Construct a fully-registered MCP server. Shared by start() and tests. */
export function buildServer(config: Config, logger: Logger): McpServer {
  const client = new ExampleClient(config, logger);

  const server = new McpServer(
    { name: "mcp-server-template", version: VERSION },
    { instructions: INSTRUCTIONS },
  );

  registerExampleTools(server, client);
  return server;
}

/** Load config, build the server, and serve over stdio until terminated. */
export async function start(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger(config.logLevel);
  const server = buildServer(config, logger);

  await server.connect(new StdioServerTransport());
  logger.info(`mcp-server-template ${VERSION} ready`);

  const shutdown = (signal: string): void => {
    logger.info(`received ${signal}, shutting down`);
    void server.close().finally(() => process.exit(0));
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (reason) => logger.error("unhandled rejection", reason));
  process.on("uncaughtException", (err) => {
    logger.error("uncaught exception", err);
    process.exit(1);
  });
}
