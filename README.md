# Dynamic UI Composer & XAI UI Kit (AG-UI)

このリポジトリは、**マルチテナントB2B SaaS** で「画面差分」を **コード分岐ではなくコンフィグ＋ルール** で扱い、さらに **XAI（説明可能性）×監査対応** を前提に「AIの判断をユーザが信頼できる形」で提示するための **フロントエンド基盤** を作るためのものです。

- 対象：React / Next.js / TypeScript のWeb UI
- 中核：
  - **Dynamic UI Composer**：`UIProfile(JSON)` から画面を組み立てる
  - **XAI / Audit UI Components**：AIの判断根拠・エビデンス・モデルメタ・決裁履歴・リプレイを可視化する

---

## 1. Goals

### 1.1 What we are building
- `UIProfile(JSON)` を解釈して **画面（ナビ/レイアウト/ウィジェット）を動的合成** できる仕組み
- ロール/タスク/テナント単位で **UI構成を切り替え** られる仕組み（差分はコンフィグ＋ルール）
- AIレイヤから渡される `explanationPayload` を **人間に説明可能** な形で表示する共通UI
- 監査人向けに、**チャット＋画面状態＋決裁履歴** を同期して再生できる **Replay View**

### 1.2 Non-goals
- モデル学習/推論基盤の実装（ここはAIレイヤ/バックエンド側）
- ルールエンジンのフル実装（最小は評価インタフェースと表現/契約を提供）
- テナントごとの個別カスタムをコードで増やすこと（禁止）

---

## 2. Key Principles

1) **差異はコード分岐ではなくコンフィグ＋ルール**  
- 例：`if (tenant===...)` は原則NG  
- 許容：`UIProfile`/`rules`/`featureFlags` による切替

2) **説明可能性と監査可能性はUIの機能要件**  
- “AIが言ってるから”をUIで許さない  
- 何を根拠に、どのルールが適用され、どのモデル/バージョンで判断したかを提示する

3) **契約で壊れない（Schema-first）**  
- `UIProfile` と `explanationPayload` は **JSON Schema / Zod** で型とバリデーションを固定する  
- “なんとなく動く”を禁止する

4) **再生可能（Replayable）**  
- 監査は「その時そう見えた」だけでは足りない  
- 画面状態と意思決定のイベント列から **決定論的に再生** できることを目標にする

---

## 3. Architecture Overview

### 3.1 Data Flow (high level)
1. BFFが `UIProfile` を返す（role/task/tenant/contextで選択）
2. フロントは `UIComposer` が `UIProfile` を読み込み、`ComponentRegistry` からウィジェットを解決して描画
3. AI結果がある場合、`explanationPayload` を `XAI Components` に渡して可視化
4. 監査/証跡用に、UIイベント・決裁イベント・チャットを `Audit Event Store` に送る（BFF経由推奨）
5. `Replay View` はイベント列を読み込み、タイムラインで同期再生する

### 3.2 Components
- `UIComposer`
  - `UIProfile` → 画面合成
- `ComponentRegistry`
  - `widget.type` → React Component を解決
- `RuleEvaluator` (interface)
  - `rules` → 真偽値 / 値 を返す（実体はバックエンド or 共通ライブラリ想定）
- `XAI Components`
  - `ExplanationPanel`
  - `EvidenceList`
  - `ModelMetaPanel`
  - `DecisionHistoryView`
- `Replay View`
  - Chat + UI State + Approval History の同期再生

---

## 4. Contracts

### 4.1 UIProfile (minimal example)
```json
{
  "id": "risk-assessment-v1",
  "tenantId": "acme",
  "role": "auditor",
  "task": "risk_assessment",
  "locale": "ja-JP",
  "termsDictionaryRef": "tenant/acme/terms.json",
  "navigation": [
    { "id": "nav-home", "labelKey": "nav.home", "to": "/home" }
  ],
  "pages": {
    "home": {
      "layout": { "type": "TwoColumn", "props": { "left": 7, "right": 5 } },
      "widgets": [
        { "id": "w-form", "type": "AssessmentForm", "props": { "schemaRef": "forms/risk.json" } },
        { "id": "w-xai", "type": "ExplanationPanel", "bind": "ai.explanation" }
      ]
    }
  },
  "uiVariants": {
    "default": { "page": "home" },
    "chat": { "page": "home", "overrides": { "widgets": [{ "id": "w-form", "hidden": true }] } }
  }
}
```

### 4.2 explanationPayload (minimal example)
```json
{
  "decisionId": "dec_2026_02_04_001",
  "timestamp": "2026-02-04T10:15:30.000Z",
  "model": { "provider": "openai", "name": "gpt-4.x", "version": "2026-01-15" },
  "rulesApplied": [
    { "ruleId": "policy.control.required", "result": true, "inputs": ["tenantPolicy:acme_v3"] }
  ],
  "evidence": [
    { "chunkId": "doc:policy#p4", "source": "policy.pdf", "title": "統制要件", "score": 0.82 }
  ],
  "confidence": 0.74,
  "explanation": "（ここは表示用の短文。詳細はEvidenceとRuleで担保）"
}
```

> NOTE: 実際の項目はプロダクト側の契約に合わせて拡張する。拡張しても破綻しないよう、Zod/Schemaでversioningする。

---

## 5. i18n / Tenant Terms Dictionary

- 多言語：`react-i18next`
- テナント用語差し替え：`termsDictionary`
  - 例：「統制」 vs 「コントロール」  
  - `UIProfile.termsDictionaryRef` を起点に差し替える（コード分岐しない）

---

## 6. Security / Compliance

- **PIIをUIイベントログに載せない**（送信前にRedaction）
- `UIProfile` / `explanationPayload` の **表示はサニタイズ**（XSS防止）
- 監査向けの「誰が/いつ/何を見て/何を決裁したか」は **追跡ID（traceId）** で関連付け

---

<a id="evals"></a>
## 7. Evals (Definition of Done)

- `UIProfile` の差分だけで、role/task/tenantごとに画面が切り替わる
- `ComponentRegistry` が未登録typeを検出し、落ち方が安全（例：UnknownWidget）
- `explanationPayload` が Evidence / Applied Rules / Model Meta / Decision History を最低限表示できる
  - Decision History（MVPは表示枠 or プレースホルダで可）
  を最低限表示できる
- `Replay View` がイベント列から **同じ順序・同じ状態** を再現できる（最低1シナリオ）

---

## 8. MVP (Demo-Ready)

### Goal
「Dynamic UI Composer + XAI UI + Audit/Replay」の価値を、1シナリオで体感できるデモを作る。
完成度よりも **説明可能性と再現性** を優先する（監査で“追える”ことが最重要）。

### In Scope (MVP)
- **Contracts**
  - `UIProfile` と `explanationPayload` のZod/Schemaを定義し、versioning前提でバリデーションする
- **Dynamic UI Composer**
  - `UIProfile(JSON)` からナビ/レイアウト/ウィジェットを動的合成
  - `ComponentRegistry` による `widget.type` 解決
  - 未登録typeは `UnknownWidget` にフォールバック（UIを落とさない）
- **XAI UI (minimum)**
  - `ExplanationPanel` / `EvidenceList` / `ModelMetaPanel` を表示
  - `explanationPayload` が欠けても部分表示で耐える
- **Audit (minimum)**
  - `traceId` / `decisionId` をUI上で確認できる
  - UIイベントは送信前に redaction を通す（PIIを載せない）
- **Replay View (minimum)**
  - 1シナリオのイベント列から、同じ順序・同じ画面状態を再現（決定論）
  - データは固定JSONでも可（まずは再生の骨格を優先）

### Out of Scope (MVPではやらない)
- モデル学習/推論基盤の実装
- ルールエンジンのフル実装（最小は評価インタフェース）
- テナントごとのコード分岐による個別カスタムの増殖
- 本番向けの永続Event Store（MVPはファイル/メモリで可）

### Demo Scenario (example)
- `risk-assessment` の `UIProfile` でページ合成（フォーム + XAIパネル）
- AI結果がある場合は `recommendedUiVariant` で表示を切替（例：chat variant）
- イベント列（UI操作 + decision）を保存し、Replayで同じ画面を再生する

### Success Criteria
- See: [Evals (Definition of Done)](#evals)

---

## 9. Project Structure (suggested)

> NOTE: 実装（Next.jsアプリ）は `web/` 配下に集約する。  
> ルート直下は「憲法（README/AGENT/STATUS）＋意思決定ログ（decision_log.md）」を中心に置く。

```text
decision_log.md
README.md
AGENT.md
STATUS.md
web/
├─ src/
│  ├─ contracts/   # zod schemas, types
│  ├─ composer/    # UIComposer, registry, renderer（今後）
│  ├─ rules/       # RuleEvaluator interface + adapters（今後）
│  ├─ xai/         # ExplanationPanel, EvidenceList, ...（今後）
│  ├─ replay/      # Replay View (timeline, player)（今後）
│  ├─ i18n/        # dictionaries, tenant terms（今後）
│  ├─ audit/       # event emitters, redaction, traceId（今後）
│  └─ demo/        # sample profiles + mock data
├─ tests/
│  ├─ contracts/   # schema validation tests
│  ├─ composer/    # render tests（今後）
│  └─ replay/      # deterministic playback tests（今後）
└─ public/
```

---

## 10. How to run (placeholder)

- `pnpm i`
- `pnpm dev`
- `pnpm test`
- `pnpm storybook`

> NOTE: 実プロジェクトのスクリプトに合わせて調整。

---

## 11. Decision Log

重要な設計変更は `decision_log.md` に残す：

- What（何を変えた）
- Why（根拠）
- Risk（リスク/トレードオフ）
- Next（次アクション）

---

## 12. License
TBD

proof: branch protection
