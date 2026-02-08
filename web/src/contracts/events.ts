import { z } from "zod";

export const EventBaseSchema = z.object({
  eventId: z.string().min(1),
  traceId: z.string().min(1),
  timestamp: z.string().min(1),
  type: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const EventsSchema = z.array(EventBaseSchema);

export type AuditEvent = z.infer<typeof EventBaseSchema>;
export type AuditEvents = z.infer<typeof EventsSchema>;

