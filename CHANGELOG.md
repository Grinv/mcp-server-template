# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- `RateLimiter` now supports sliding-window limits (`RateRule[]`: e.g. N/s **and**
  M/min) on top of the minimum interval, not just a single interval.
- `lib/http.ts` parses a structured `message`/`error` field out of JSON error
  bodies instead of surfacing only a raw body slice.
- `jsonResult` serializes its text mirror as compact JSON (no pretty-print
  indentation) to save tokens for clients that feed the text to the model.
- `classifyStatus` maps `304 → not_modified` (new code) and `405 → bad_request`.
- Removed the unused `textResult` helper; default error messages are now generic
  and provider-agnostic (no leftover domain-specific text).

## [0.1.0]

### Added

- Initial template: reusable `lib/` carcass (http, rateLimit, cache, tokenStore,
  errors, logger, result), example client/tool, build tooling (tsup + tsc),
  `node:test` setup, `.mcpb` manifest, `server.json`, and GitHub Actions CI/release.
