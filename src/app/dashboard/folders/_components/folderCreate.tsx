"use client";
//import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
//import { Switch } from "@/components/ui/switch";
import { FolderPlus, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFolderSchema, CreateFolderType } from "@/lib/validators/folders";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createFolder } from "../actions/folderActions";
import { useRouter } from "next/navigation";

export default function FolderCreate() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreateFolderType>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      isSecret: false,
      password: "",
      parentId: null,
    },
  });
// TODO:  falta ajustar senhas nas pastas cadastradas
  async function onSubmit(data: CreateFolderType) {
    try {
      setIsSubmitting(true);
      await createFolder(data.name, data.isSecret);

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 dark:text-white">
          <FolderPlus className="h-4 w-4" />
          Nova Pasta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Criar Nova Pasta</DialogTitle>
              <DialogDescription>
                Crie uma nova pasta para organizar seus links
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Pasta</FormLabel>
                    <FormControl>
                      <Input placeholder="Minha Pasta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                   {/*
              <FormField
                control={form.control}
                name="isSecret"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2">
                        Pasta Secreta
                        <Badge variant="outline" className="ml-2">
                          Premium
                        </Badge>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("isSecret") && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha da Pasta</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Senha para proteger a pasta"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              */}
            </div>
            <DialogFooter>
              <Button type="submit" className="dark:text-white" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader className="h-5 w-5 animate-spin"/> <span>Criando...</span></>) : "Criar Pasta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
