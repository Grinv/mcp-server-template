import { test } from "node:test";
import assert from "node:assert/strict";
import { connectServer } from "./helpers.js";
import { installFetch, mockFetch, jsonResponse } from "./helpers.js";

test("example search tool returns structured results end-to-end", async () => {
  const mock = mockFetch(() => jsonResponse({ results: [{ id: 1, title: "Example" }] }));
  const restore = installFetch(mock);
  const { client, close } = await connectServer();
  try {
    const res = await client.callTool({ name: "search", arguments: { query: "hello" } });
    assert.notEqual(res.isError, true);
    const structured = res.structuredContent as { results: { title: string }[] };
    assert.equal(structured.results[0]!.title, "Example");
  } finally {
    restore();
    await close();
  }
});

test("the server advertises the example tool", async () => {
  const { client, close } = await connectServer();
  try {
    const { tools } = await client.listTools();
    assert.ok(tools.map((t) => t.name).includes("search"));
  } finally {
    await close();
  }
});
