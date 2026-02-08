# Decision Log

## 2026-02-08 — Init skeleton (folders + decision log)
- What: Add minimal skeleton (src/tests/demo) to prep Contracts→Composer→XAI→Audit→Replay MVP.
- Why: Stabilize structure for SSOT-driven implementation and deterministic replay testing.
- Risk: Early structure may constrain refactors (acceptable for MVP).
- Owner: chanjun3
- Evidence: web/pnpm test:run PASS (web/tests/contracts/fixtures.test.ts)

## 2026-02-08 — Add demo fixtures + JSON validity tests
- What: Fill src/demo/*.json with a single MVP scenario input and add tests/contracts to ensure fixtures are valid JSON.
- Why: Lock deterministic demo inputs early so Composer/XAI/Replay can be developed against stable artifacts.
- Risk: Initially not schema-validated; now enforced via Zod contracts + Vitest fixture validation under /web.
- Owner: chanjun3
- Evidence: Zod contracts added (web/src/contracts/*) + fixtures validated (web/src/demo/*) + pnpm test:run PASS.

## 2026-02-08 — Adopt Next.js+TS scaffold for schema-first validation
- What: Adopt Next.js + TypeScript scaffold (under /web) to execute schema-first (Zod) contract validation with runnable tests.
- Why: Contracts validation needs a real TS toolchain to produce “running proof” early (avoid correct-but-not-runnable docs).
- Risk: More files / split root vs web; App Router learning cost (acceptable for MVP).
- Owner/Date: chanjun3 / 2026-02-08
