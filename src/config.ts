// Loads and validates configuration from environment variables. Adapt the
// schema to your API: add credentials (API key, OAuth client, etc.) and any
// tunables. Empty strings are treated as unset so .mcpb (which passes empty
// strings for unconfigured user_config fields) does not crash startup.
import { z } from "zod";
import type { LogLevel } from "./lib/logger.js";

const EnvSchema = z.object({
  // --- Replace with your API's credentials/settings. ---
  API_KEY: z.string().min(1).optional(),
  API_BASE_URL: z.string().url().default("https://api.example.com"),

  // --- Generic tunables (usually keep as-is). ---
  HTTP_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  HTTP_RETRIES: z.coerce.number().int().nonnegative().default(2),
  CACHE_TTL_MS: z.coerce.number().int().nonnegative().default(300_000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "silent"]).default("info"),
});

export interface Config {
  apiBaseUrl: string;
  apiKey: string | undefined;
  httpTimeoutMs: number;
  httpRetries: number;
  cacheTtlMs: number;
  logLevel: LogLevel;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const cleaned = Object.fromEntries(
    Object.entries(env).filter(([, v]) => v !== undefined && v !== ""),
  );
  const parsed = EnvSchema.parse(cleaned);

  return {
    apiBaseUrl: parsed.API_BASE_URL,
    apiKey: parsed.API_KEY,
    httpTimeoutMs: parsed.HTTP_TIMEOUT_MS,
    httpRetries: parsed.HTTP_RETRIES,
    cacheTtlMs: parsed.CACHE_TTL_MS,
    logLevel: parsed.LOG_LEVEL,
  };
}
