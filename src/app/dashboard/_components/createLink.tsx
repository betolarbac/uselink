"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, CreateLinkType } from "@/lib/validators/link";
import { createLink } from "../actions/linksActions";
import { getFolders } from "../folders/actions/folderActions";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder } from "@/types/typesLinks";
import { useRouter } from "next/navigation";
import { getCategories } from "../categories/actions/categoriesActions";
import { useCompletion } from "@ai-sdk/react";

type CategoriesType = {
  name: string;
  id: string;
};

export function CreateLink() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadFolders() {
      try {
        const folderData = await getFolders();
        setFolders(folderData);
      } catch (error) {
        console.error("Erro ao carregar pastas:", error);
      }
    }

    if (open) {
      loadFolders();
    }
  }, [open]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    if (open) {
      loadCategories();
    }
  }, [open]);

  const form = useForm<CreateLinkType>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      customSlug: "",
      isSecret: false,
      folderId: undefined,
      categoryId: undefined,
    },
  });

  const currentUrlValue = form.watch("url");

  const {
    completion,
    complete,
    isLoading: isGeneratingDescription,
    error: completionError,
    setCompletion,
  } = useCompletion({
    api: "/api/generate-description",
    onFinish: (_prompt, fullCompletionText) => {
      form.setValue("description", fullCompletionText, {
        shouldValidate: true,
        shouldDirty: true,
      });
      console.log("Geração de descrição finalizada.");
    },
    onError: (err) => {
      console.error("Erro ao gerar descrição com IA:", err);
      alert(`Erro ao gerar descrição: ${err.message}`);
    },
  });

  useEffect(() => {
    if (
      isGeneratingDescription ||
      completion !== form.getValues("description")
    ) {
      form.setValue("description", completion, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [completion, form, isGeneratingDescription]);

  async function handleGenerateDescriptionClick() {
    const urlValue = form.getValues("url");

    const isUrlValid = await form.trigger("url");
    if (!isUrlValid || !urlValue) {
      alert("Por favor, insira uma URL válida para gerar a descrição.");
      return;
    }
    form.setValue("description", "");
    setCompletion("");
    complete("", {
      body: { url: urlValue },
    });
  }

  async function onSubmit(data: CreateLinkType) {
    try {
      setIsSubmitting(true);
      await createLink(data);

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar link:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start gap-2 dark:text-white">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline-flex">Novo Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo link</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do link que você deseja salvar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isGeneratingDescription}
                      placeholder="Descrição do link"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateDescriptionClick}
                    disabled={isGeneratingDescription || !currentUrlValue}
                    className="px-2 py-1"
                  >
                    {isGeneratingDescription ? (
                      "Gerando..."
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Gerar com IA
                      </>
                    )}
                  </Button>
                  {completionError && (
                    <FormMessage className="text-red-500">
                      {completionError.message}
                    </FormMessage>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="folderId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Pasta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma pasta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Sem pasta</SelectItem>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name} {folder.isSecret ? "🔒" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma Categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Sem pasta</SelectItem>
                        {categories.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="dark:text-white"
              >
                {isSubmitting ? "Salvando..." : "Salvar link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
