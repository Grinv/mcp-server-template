// Pre-deploy health check for the upstream API(s) this server depends on.
// TEMPLATE: add one check per endpoint your tools rely on. Each should assert a
// 200 (or the expected status) plus a minimal shape, so a release can be gated
// against upstream drift. Wired into release.yml before packing.
//
// Run: `npm run check:api`.

const BASE = process.env.API_BASE_URL ?? "https://api.example.com";
const SPACING_MS = 300;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** @type {{name:string, run:() => Promise<void>}[]} */
const checks = [
  // Example — replace with real endpoints:
  // {
  //   name: "search",
  //   run: async () => {
  //     const res = await fetch(`${BASE}/search?q=test`, { headers: { Accept: "application/json" } });
  //     if (res.status !== 200) throw new Error(`expected 200, got ${res.status}`);
  //     const body = await res.json();
  //     if (!Array.isArray(body.results)) throw new Error("missing `results`");
  //   },
  // },
];

if (checks.length === 0) {
  console.log(`No API checks defined yet (BASE=${BASE}). Add checks in scripts/check-api.mjs.`);
  process.exit(0);
}

const failures = [];
for (const check of checks) {
  try {
    await check.run();
    console.log(`  ok   ${check.name}`);
  } catch (err) {
    failures.push(check.name);
    console.error(`  FAIL ${check.name}: ${err instanceof Error ? err.message : String(err)}`);
  }
  await delay(SPACING_MS);
}

if (failures.length) {
  console.error(`\n${failures.length}/${checks.length} API checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} API checks passed.`);
