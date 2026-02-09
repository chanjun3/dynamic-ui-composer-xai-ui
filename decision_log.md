# Decision Log
<!-- TEMPLATE (MUST): copy/paste for new entries
## YYYY-MM-DD — <short title>
- What: <what changed>
- Why: <why it was necessary>
- Risk: <risk/trade-off + mitigation>
- Owner: <owner>
- Date: <YYYY-MM-DD (TZ)>
- Evidence: <commit hash / test pass / etc.> (optional)
-->

## 2026-02-09 — Enforce PR + required CI on master (public repo)
- What: Add GitHub Actions workflow `web-ci` under `.github/workflows/web-ci.yml`, fix install to use npm, ensure workflow runs on `pull_request` (so required checks report back to PRs), and configure classic branch protection on `master` with required status check `test` + “up to date before merge”. Switch repo visibility to **public** to ensure protections are enforced.
- Why: Make the repo **fail-closed** at GitHub level: no merge to `master` unless CI passes, and PRs always receive the required check result (prevents “Expected” deadlock).
- Risk: Public visibility exposes repo contents and Actions logs; mitigation: keep secrets out of git, avoid committing sensitive files (keys, .env), and rely on CI/branch protection to prevent unsafe merges.
- Owner: chanjun3
- Date: 2026-02-09 (Asia/Tokyo)
- Evidence: `web-ci` SUCCESS; PR #1 merged with required checks satisfied; commits `1b3b730` (CI green baseline) and merge result `e19440e` on `master`.

## 2026-02-08 — Add web/ Next.js app + root-commit rule
- What: Add `web/` Next.js app; commit/push from repo root; keep generated artifacts ignored (`web/node_modules/`, `web/.next/`).
- Why: Make demo runnable + prevent accidental commits caused by working-directory confusion.
- Risk: Bigger repo footprint (notably lockfile). Mitigation: strict staging (avoid `git add -A`, prefer `git add -- decision_log.md` / `git add -- web`).
- Owner: chanjun3
- Date: 2026-02-08 (Asia/Tokyo)
- Evidence: commit `937a425`; `pnpm test:run` PASS.

## 2026-02-08 — Init skeleton (folders + decision log)
- What: Add minimal skeleton (src/tests/demo) to prep Contracts→Composer→XAI→Audit→Replay MVP.
- Why: Stabilize structure for SSOT-driven implementation and deterministic replay testing.
- Risk: Early structure may constrain refactors (acceptable for MVP).
- Owner: chanjun3
- Date: 2026-02-08 (Asia/Tokyo)
- Evidence: `pnpm test:run` PASS (web/tests/contracts/fixtures.test.ts)

## 2026-02-08 — Add demo fixtures + JSON validity tests
- What: Fill src/demo/*.json with a single MVP scenario input and add tests/contracts to ensure fixtures are valid JSON.
- Why: Lock deterministic demo inputs early so Composer/XAI/Replay can be developed against stable artifacts.
- Risk: Initially not schema-validated; now enforced via Zod contracts + Vitest fixture validation under `web/`.
- Owner: chanjun3
- Date: 2026-02-08 (Asia/Tokyo)
- Evidence: Zod contracts added (web/src/contracts/*) + fixtures validated (web/src/demo/*) + `pnpm test:run` PASS.

## 2026-02-08 — Adopt Next.js+TS scaffold for schema-first validation
- What: Adopt Next.js + TypeScript scaffold (under `web/`) to execute schema-first (Zod) contract validation with runnable tests.
- Why: Contracts validation needs a real TS toolchain to produce “running proof” early (avoid correct-but-not-runnable docs).
- Risk: More files / split root vs web; App Router learning cost (acceptable for MVP).
- Owner: chanjun3
- Date: 2026-02-08 (Asia/Tokyo)
