import { z } from "zod";

export const categoriesSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export type CategoriesType = z.infer<typeof categoriesSchema>