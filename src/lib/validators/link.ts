// lib/validators/link.ts
import { z } from "zod";

export const createLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  customSlug: z.string().optional(),
  folderId: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
});

export type CreateLinkType = z.infer<typeof createLinkSchema>
