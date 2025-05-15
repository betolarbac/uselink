import { z } from "zod";

export const categoriesSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string()
});

export type CategoriesType = z.infer<typeof categoriesSchema>