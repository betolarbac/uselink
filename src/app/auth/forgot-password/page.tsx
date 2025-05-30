"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth/auth";
import {
  formForgotPasswordSchema,
  formForgotPasswordType,
} from "@/lib/validators/form-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {
  const form = useForm<formForgotPasswordType>({
    resolver: zodResolver(formForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: formForgotPasswordType) {
    const result = await resetPassword(data.email);
    if (result.success) {
      alert(result.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Esqueceu sua senha?</h1>
            <p className="text-sm text-muted-foreground">
              Para redefinir sua senha, por favor digite o endereço de e-mail da
              sua conta do Todoist.
            </p>
          </div>
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1 mb-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          autoComplete="username"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full dark:text-white">
                  Redefinir minha senha
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/auth/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Registre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
