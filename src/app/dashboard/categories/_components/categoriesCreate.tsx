"use client";

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
import { categoriesSchema, CategoriesType } from "@/lib/validators/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createCategory } from "../actions/categoriesActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateCategories() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState("#3b82f6");
  const router = useRouter();

  const form = useForm<CategoriesType>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  });

  async function onSubmit(data: CategoriesType) {
    try {
      setIsSubmitting(true);
      await createCategory(data);

      form.reset();
      setOpen(false);
      router.refresh();
      toast.success("Categoria criada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar categoria!");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-white">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Criar Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para classificar seus links
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Categoria</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Trabalho, Lazer, Estudo..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setColor(e.target.value);
                            }}
                            className="h-10 w-10 cursor-pointer p-1"
                          />

                          <Input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setColor(e.target.value);
                            }}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="dark:text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />{" "}
                    <span>Criando...</span>
                  </>
                ) : (
                  "Criar Categoria"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
