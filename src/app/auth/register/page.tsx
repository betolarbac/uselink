"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerWithEmail } from "@/lib/auth/auth"
import { formRegisterSchema, FormRegisterType } from "@/lib/validators/form-login"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"

export default function RegisterPage() {
  const router = useRouter()

  const form = useForm<FormRegisterType>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    }
  })

 async function onSubmit(data: FormRegisterType) {
    try {
      await registerWithEmail(data.email, data.password, data.name)

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Criar uma conta</h1>
            <p className="text-sm text-muted-foreground">Registre-se para começar a organizar seus links</p>
          </div>
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField 
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="space-y-1 mb-4">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} autoComplete="username" />
                    </FormControl>
                  </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem className="space-y-1 mb-4">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} autoComplete="username" />
                    </FormControl>
                  </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem className="space-y-1 mb-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} type="password" autoComplete="current-password" />
                    </FormControl>
                  </FormItem>
                )}
                />

                <Button type="submit" className="w-full dark:text-white">Registrar</Button>
              </form>
            </Form>
          
            <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}