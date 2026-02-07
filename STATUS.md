# STATUS - Dynamic UI Composer & XAI UI Kit (AG-UI)

**Last updated:** 2026-02-06 (Asia/Tokyo)

## TL;DR
- **SSOT:** README.md（思想・契約・DoD）
- **いまの最優先:** "Schema-firstで壊れない" を先に固定 → その上で Composer / XAI / Audit / Replay を **1シナリオでデモ可能**にする
- **いま作るべき“動く証拠”**：
  - `UIProfile` / `explanationPayload` の **Zod/Schema**
  - `ComponentRegistry` + **UnknownWidget** フォールバック
  - XAI最小3点（Explanation / Evidence / ModelMeta）
  - traceId 付与 + redaction 経由の event emit
  - イベント列からの **deterministic replay（最低1シナリオ）**

---

## Links
- README（SSOT / DoD / MVP）: `README.md`
- Execution contract（運用契約）: `AGENT.md`
- Requirements raw（JD原文）: `raw.md`
- Decision log（重要判断）: `decision_log.md`

---

## Roadmap

### Now（最短でデモに寄せる）
**Goal:** Contracts→Composer→XAI→Audit→Replay を "細く" つないで、MVPシナリオが通る状態にする。

1) **Contracts（Schema-first）**
- [ ] `src/contracts/uiProfile.ts`（zod）
- [ ] `src/contracts/explanationPayload.ts`（zod）
- [ ] `src/contracts/events.ts`（zod）
- [ ] サンプルJSONを `src/demo/*` に置いて schema validate テスト

2) **Composer（落ち方が安全）**
- [ ] `ComponentRegistry`（register/resolve）
- [ ] 未登録 `widget.type` → **UnknownWidget**
- [ ] `UIComposer`（navigation / layout / widgets の最小）
- [ ] `uiVariants` の overrides（hidden だけでもOK）

3) **XAI UI（最小3点）**
- [ ] `ExplanationPanel`
- [ ] `EvidenceList`
- [ ] `ModelMetaPanel`
- [ ] `explanationPayload` 欠損でも部分表示（落ちない）

4) **Audit（最小）**
- [ ] `traceId` 生成・伝播
- [ ] `redaction`（まずは通すだけで勝ち）
- [ ] `emitEvent`（MVPは in-memory / console で可）

5) **Replay（決定論）**
- [ ] イベント列（JSON）ロード
- [ ] タイムラインUI（まずはリスト）
- [ ] 同一イベント列 → 同一UI（スナップショット or 文字列比較でOK）

---

### Next（MVPを“見せる形”にする）
**Goal:** 面談・レビューで「はい、監査できる」じゃなく「ほら、追える」を見せる。

- [ ] `src/demo/` に 1シナリオを完成（risk-assessment）
- [ ] `recommendedUiVariant` 相当の入力で UI variant 切替（chat など）
- [ ] Storybook（主要コンポーネント）
- [ ] README の "How to run" を実運用コマンドに寄せる

---

### Later（積み上げフェーズ）
- [ ] `DecisionHistoryView` の実装（MVPはプレースホルダ可）
- [ ] RuleEvaluator adapter（interface + mock）
- [ ] i18n / termsDictionary のサンプル一式
- [ ] Event Store を BFF 経由に差し替える境界（API/契約）

---

## MVP Demo Scenario（最低1本）
**シナリオ名:** `risk-assessment`

- `UIProfile` でページ合成（フォーム + XAI パネル）
- AI結果あり → `recommendedUiVariant=chat` で UI 切替（例：フォーム非表示）
- UI操作 + decision をイベント列に保存（MVPはJSONでOK）
- `Replay View` で同イベント列を再生し、**同じ順序・同じ状態**を再現

---

## Definition of Done（参照）
- README の Evals を正とする：`README.md#evals`

---

## Quality Gate（最低限）
- [ ] `pnpm typecheck`（strict）
- [ ] `pnpm lint`
- [ ] `pnpm test`（contracts/composer/replay）
- [ ] Replay determinism：同一イベント列→同一UI状態

---

## Risks / Assumptions

### Risks
- Schemaを後回しにすると、UI / Replay / Audit が "それっぽく" なって後で全部崩れる（いちばん高コスト）
- テナント差分をコード分岐で入れ始めると、マルチテナント運用が破綻する（禁止ルールの形骸化）

### Assumptions
- UIProfile は BFF 供給が基本（role/task/tenant/context で選択）
- explanationPayload は versioning 前提で拡張する
- Replay は "イベント列" が正で、UIはそこから決定論で復元する

---

## Open Questions（不足情報 / 決めポイント）
> 迷ったら README へ追記して SSOT を更新。重要判断は decision_log.md に残す。

- UIProfile のSSOTはどこ？（BFF生成 / FE管理 / 共通ライブラリ）
- explanationPayload の versioning 方針（v0/v1 の互換ルール）
- Replay に必要なイベント列の最小（UI snapshot 粒度、diffかfullか）
- PII/外部送信/ログ保管期間のポリシー（redactionの要件）

---

## Decision Log（運用ルール）
- 重要な判断は `decision_log.md` に追記する：
  - What / Why / Risk / Owner / Date

---

## Update Rules（運用ルール）
- **更新タイミング:** PRを出すたびに、このSTATUSの `Now/Next/Later` を1回は見直す（放置するとすぐ腐る）
- **移動の作法:**
  - 進捗が出たら `Now → Done` へ移動（Doneは短く残す）
  - ブロックしたら `Now → Risks / Open Questions` に理由を書く
- **重要判断:** README（SSOT）追記 + `decision_log.md` 記録（What/Why/Risk/Owner/Date）

## Done（直近）
- （まだなし）
