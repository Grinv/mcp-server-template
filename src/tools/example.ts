// Example tool registration. Replace with your own tools. Write `description`
// and per-field `.describe()` text for the calling model, set `annotations`
// (readOnly/destructive/idempotent/openWorld), and wrap handlers in guard() so
// failures become actionable tool errors instead of thrown exceptions.
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ExampleClient } from "../clients/example.js";
import { jsonResult } from "../lib/result.js";
import { guard } from "./guard.js";

export function registerExampleTools(server: McpServer, client: ExampleClient): void {
  server.registerTool(
    "search",
    {
      title: "Search",
      description: "Example tool — search the upstream API by keyword. Replace with real tools.",
      inputSchema: {
        query: z.string().min(1).describe("Search query."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    ({ query }) => guard(async () => jsonResult(await client.search(query))),
  );
}
