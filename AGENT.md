# AGENT - Execution Contract (dynamic-ui-composer-xai-ui)

この文書は、このプロジェクト（Dynamic UI Composer & XAI UI Kit）を **ブレずに進めるための実行契約**。

- SSOT（最上位契約）：README.md
- 変更順序：README →（必要なら設計メモ）→ 実装 → テスト → ログ

---

## 0. Ground Rules

### 0.1 SSOT rules
- READMEに書いてない重要判断は、原則「未決」扱い（先にREADMEへ追記）
- “コードの方が真実” を禁止（ドリフト防止）

### 0.2 Decision Logging
- 重要な判断は必ず残す：
  - What（変更内容）
  - Why（根拠：要求/事故回避/運用）
  - Risk（トレードオフ）
  - Owner（誰が決めた）
  - Date（いつ）
- decision_log.md は **canonical bullet format**（`- What:` / `- Why:` / `- Risk:` / `- Owner:` / `- Date:` / `- Evidence:`）で統一する（見出し式は禁止）。

### 0.3 AI usage policy
- AIは提案役。採用は **テストと契約** で決める
- 生成物は必ず契約（Schema/SSOT）に照らして検証する

### 0.4 Repo / Git Hygiene (事故防止の運用契約)
#### Git rule（超重要）
- **commit/push は原則 repo ルートで行う**
  - 目的：ルート直下の憲法（README/AGENT/STATUS）と `decision_log.md` と、`web/` 実装を **同一コミット粒度で統制**する
- **`web/` 内で `../decision_log.md` を触るのは禁止**
  - 理由：作業ディレクトリがズレると、差分確認・ステージ対象・CI実行場所が混乱して事故源になる

#### Staging rule
- **`git add -A` をデフォルト禁止**
  - 理由：`node_modules/` や `.next/` 等の生成物が混入する事故が起きやすい
- 追加は **対象を限定**して行う
  - 例：`git add -- decision_log.md`
  - 例：`git add -- web`

#### Lockfile rule
- `pnpm-lock.yaml` は **初回追加はOK**
- 以後、`pnpm-lock.yaml` が変更されるコミットは **変更理由をコミットメッセージに含める**
  - 例：`chore(deps): bump <pkg> (lockfile updated)`
  - 目的：依存変更の意図を監査可能にし、差分レビューの負担を下げる

---

## 1. Workflow

Observe → Infer → Specify → Implement → Validate → Release → Learn

### 1.1 Observe
- JD/要求から「監査・説明可能性・マルチテナント差分」の条件を抽出する

### 1.2 Infer
必ずこの5点でワークフロー契約に落とす：

1) Inputs：UIProfile / explanationPayload / tenant terms / event log
2) Policy：PII・監査・差分表現（コンフィグ＋ルール）
3) Tools：typecheck/lint/test/storybook/e2e
4) Evals：DoD（再現性/説明可能性/安全な落ち方）
5) Logs：traceId / decisionId / eventId の関連

### 1.3 Specify
- READMEと `contracts/`（schema）に反映して、SSOTを確定する

### 1.4 Implement
- composer / xai / replay / audit を最小で繋ぐ

### 1.5 Validate
- schema validation / render tests / replay determinism を回す

### 1.6 Release
- デモ（最低1シナリオ） + 走らせ方 + 制約 を揃えて提出可能にする

### 1.7 Learn
- 面談/レビュー/運用の反応をログ化して次の改善へ

---

## 2. Phase Checklist

## Phase 0: Intake (Raw)
### Goal
- 要求（JD）を raw として保存し、転記ミスをゼロにする

### Output
- `raw.md`（募集文そのまま）
- `output.md`（要求→要件変換）
- `questions.md`（不足情報）
- `decision_log.md`（Go/No-Go）

---

## Phase 1: Triage (Go/No-Go)
### Go条件（例）
- `UIProfile` と `explanationPayload` の契約を決められる
- 差分を「コンフィグ＋ルール」で切れる
- MVPを 2〜数日でデモ化できる

### No-Go条件（例）
- テナント差分を「コード分岐」でしか扱えない運用
- 監査/証跡の要求があるのに、イベントログ/traceが設計できない

---

## Phase 2: Clarify (Missing Info)
### Questions（最小）
- UIProfileのSSOTはどこ？（BFF生成 or FE管理 or 共通ライブラリ？）
- explanationPayloadのフォーマットとversioningは？
- Replayに必要なイベント列は何？（UI state snapshotの粒度は？）
- PII/外部送信/ログ保管期間のポリシーは？

---

## Phase 3: Offer (Package)
入口 → MVP → 運用改善 の3段で提案（労働売り回避）

- Entry：契約定義（schema + interface）固定（固定期間/固定価格）
- MVP：composer + xai + replay を最小デモで実証
- Ops：テナント追加/差分追加を「コンフィグ＋ルール」で回す運用整備

---

## Phase 4: Plan (MVP Plan)

### MVP scope (minimum)
- UIComposer + ComponentRegistry
- XAI: ExplanationPanel + EvidenceList + ModelMetaPanel
- Audit: traceId付与 + event emitter（最小）
- Replay: 1シナリオの再生（固定データでもOK）

### Success criteria (Evals)
- サンプルUIProfileで画面合成できる
- type未登録の安全なフォールバックがある
- explanationPayloadが欠けてもUIが壊れない（部分表示）
- Replayが決定論的に同じ結果になる

---

## Phase 5: Build (Implement)

### Build rules
- Schemaにないプロパティアクセス禁止（any禁止）
- `if (tenant===...)` 禁止（例外はREADMEへ記録）
- UIイベント送信は必ず redaction を通す

---

## Phase 6: Validate (Quality Gate)

### Must pass
- `pnpm typecheck`（strict）
- `pnpm lint`
- `pnpm test`（contracts/composer/replay）
- Storybook（主要コンポーネントの表示確認）
- Replay determinism：同一イベント列→同一UI状態

### Security checklist
- XSS：HTMLをレンダしない（必要なら sanitizer を通す）
- PII：ログに入れない（redaction）
- 権限：UIProfileの表示権限制御の責任境界を明記（BFF推奨）

---

## Phase 7: Deliver (Delivery Pack)

### Delivery minimum
- demo（1シナリオ）
- how-to-run（README更新）
- schema（contracts）
- tests（回帰）
- decision log（判断履歴）

---

## Phase 8: Assetize (Compounding)

### 80/20
- 80%：composer/xai/replay/audit の汎用モジュール化
- 20%：案件固有のウィジェットと文言

### Output
- `templates/`（UIProfileテンプレ、explanationPayloadテンプレ）
- `linkedin_post.md`（学びを1テーマ1結論で資産化）

---

## 3. Standard Output Template (for each intake)

### 1) Client Output (Standard)
1. Summary（1段落）
2. Requirements (Translated)（要求→要件変換）
3. Scope（In / Out）
4. Risks / Assumptions（前提・リスク・Go/No-Go条件）
5. MVP Plan（最小デモ）
6. Deliverables（納品物）
7. Pricing / Next Step（入口→次フェーズ）

### 2) Questions
- 不足情報だけ

### 3) Save Pack
- `projects/dynamic-ui-composer-xai-ui/`
  - `raw.md`
  - `output.md`
  - `questions.md`
  - `decision_log.md`

## 4. Validation（反映後にやること）
- `git diff AGENT.md` で追記だけになってるの確認
- `pnpm test:run`（web側）を通してクリーンなままコミット

## 5. Risks / assumptions / open decisions
- **Risk:** ルール増やしすぎると運用が重くなる → 今回は「事故が起きた点」だけに絞ってる
- **別視点:** Branch protection / CI必須化もAGENTに追記できる（ただし、まずはGit hygieneで事故率を下げるのが先）
