import { z } from "zod";

export const NavItemSchema = z.object({
  id: z.string().min(1),
  labelKey: z.string().min(1),
  to: z.string().min(1),
});

export const LayoutSchema = z.object({
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()).optional(),
});

export const WidgetSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()).optional(),
  bind: z.string().optional(),
  hidden: z.boolean().optional(),
});

export const PageSchema = z.object({
  layout: LayoutSchema.optional(),
  widgets: z.array(WidgetSchema).default([]),
});

export const UiVariantSchema = z.object({
  page: z.string().min(1),
  overrides: z
    .object({
      widgets: z
        .array(
          z.object({
            id: z.string().min(1),
            hidden: z.boolean().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export const UIProfileSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  task: z.string().min(1).optional(),
  locale: z.string().min(1).optional(),
  termsDictionaryRef: z.string().optional(),

  navigation: z.array(NavItemSchema).default([]),

  pages: z.record(z.string(), PageSchema),

  uiVariants: z.record(z.string(), UiVariantSchema).optional(),
});

export type UIProfile = z.infer<typeof UIProfileSchema>;

