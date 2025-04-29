import { z } from "zod";

export const formLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export type FormLoginType = z.infer<typeof formLoginSchema>;


export const formRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
   .string()
   .min(1, "Password is required")
   .min(8, "Password must have at least 8 characters"),
})

export type FormRegisterType = z.infer<typeof formRegisterSchema>;
