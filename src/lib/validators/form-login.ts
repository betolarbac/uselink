import { z } from "zod";

export const formLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export type FormLoginType = z.infer<typeof formLoginSchema>;
