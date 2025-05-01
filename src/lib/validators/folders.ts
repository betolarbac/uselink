import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  isSecret: z.boolean(),
  password: z.string().optional(), // só será usado se for `isSecret === true`
  parentId: z.string().nullable().optional(), // pode ser null ou undefined
});

export type CreateFolderType = z.infer<typeof createFolderSchema>