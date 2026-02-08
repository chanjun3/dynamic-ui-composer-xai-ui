# Decision Log

## 2026-02-08 — Init skeleton (folders + decision log)
- What: Add minimal skeleton (src/tests/demo) to prep Contracts→Composer→XAI→Audit→Replay MVP.
- Why: Stabilize structure for SSOT-driven implementation and deterministic replay testing.
- Risk: Early structure may constrain refactors (acceptable for MVP).
- Owner: chanjun3

## 2026-02-08 — Add demo fixtures + JSON validity tests
- What: Fill src/demo/*.json with a single MVP scenario input and add tests/contracts to ensure fixtures are valid JSON.
- Why: Lock deterministic demo inputs early so Composer/XAI/Replay can be developed against stable artifacts.
- Risk: Not schema-validated yet; structural guarantees will be added when Zod contracts land.
- Owner: chanjun3
