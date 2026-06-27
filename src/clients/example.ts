// Example API client. Replace this with one client per upstream API you wrap.
// Reuses the generic HttpClient (timeouts, retries, backoff, User-Agent) and
// TtlCache from lib/. Trim/shape responses before returning them to keep tool
// output token-efficient.
import { HttpClient } from "../lib/http.js";
import { TtlCache } from "../lib/cache.js";
import type { Config } from "../config.js";
import type { Logger } from "../lib/logger.js";

export class ExampleClient {
  readonly #http: HttpClient;
  readonly #cache: TtlCache<Record<string, unknown>>;

  constructor(config: Config, logger: Logger) {
    this.#http = new HttpClient({
      baseUrl: config.apiBaseUrl,
      logger,
      timeoutMs: config.httpTimeoutMs,
      retries: config.httpRetries,
      defaultHeaders: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {},
    });
    this.#cache = new TtlCache(config.cacheTtlMs);
  }

  async search(query: string): Promise<Record<string, unknown>> {
    return this.#cache.wrap(`search:${query}`, () =>
      this.#http.getJson<Record<string, unknown>>("search", { query: { q: query } }),
    );
  }
}
