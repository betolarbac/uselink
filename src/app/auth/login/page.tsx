"use client";

import type React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { formLoginSchema, FormLoginType } from "@/lib/validators/form-login";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, Loader } from "lucide-react";
import { loginWithEmail } from "@/lib/auth/auth";
import { loginWithGoogle } from "@/lib/auth/client-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormLoginType>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormLoginType) {
    setIsLoading(true);
    try {
      const user = await loginWithEmail(data.email, data.password);
      if (user) {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando para o dashboard...",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro no Login", {
        description: "Email ou senha inválidos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const user = await loginWithGoogle();
      if (user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Entrar no UseLInk</h1>
            <p className="text-sm text-muted-foreground">
              Entre com seu email e senha para acessar sua conta
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1 mb-4">
                      <div className="flex justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="hover:underline-offset-4 hover:underline"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          type="password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full dark:text-white"
                  disabled={isLoading}
                >
                  Entrar
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    <>Entrar</>
                  )}
                </Button>
              </form>
            </Form>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>

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
