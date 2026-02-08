import { z } from "zod";

export const ModelMetaSchema = z.object({
  provider: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1).optional(),
});

export const RuleAppliedSchema = z.object({
  ruleId: z.string().min(1),
  result: z.boolean(),
  inputs: z.array(z.string()).optional(),
});

export const EvidenceSchema = z.object({
  chunkId: z.string().min(1),
  source: z.string().min(1),
  title: z.string().min(1).optional(),
  score: z.number().min(0).max(1).optional(),
});

export const ExplanationPayloadSchema = z.object({
  decisionId: z.string().min(1),
  timestamp: z.string().min(1),
  model: ModelMetaSchema.optional(),
  rulesApplied: z.array(RuleAppliedSchema).default([]),
  evidence: z.array(EvidenceSchema).default([]),
  confidence: z.number().min(0).max(1).optional(),
  explanation: z.string().optional(),
});

export type ExplanationPayload = z.infer<typeof ExplanationPayloadSchema>;
