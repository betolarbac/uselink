"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, CreateLinkType } from "@/lib/validators/link";
import { createLink } from "../actions/linksActions";
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
import { Loader, Plus, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { useFolders } from "@/hooks/useFolders";
import { useCategories } from "@/hooks/useCategories";

export function CreateLink() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInterruptedAIRef = useRef(false);
  const router = useRouter();
  const {folders, isLoadingFolders, foldersError} = useFolders(open);
  const {categories, isLoadingCategories, categoriesError} = useCategories(open)


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
    stop,
    isLoading: isGeneratingDescription,
    error: completionError,
    setCompletion,
  } = useCompletion({
    api: "/api/generate-description",
    onFinish: (_prompt, fullCompletionText) => {
      if(!userInterruptedAIRef.current) {
        form.setValue("description", fullCompletionText, {
          shouldValidate: true,
          shouldDirty: true,
        });
        console.log("Geração de descrição finalizada.");
      }

      userInterruptedAIRef.current = false;
    },
    onError: (err) => {
      console.error("Erro ao gerar descrição com IA:", err);
      toast.error("Erro na IA", {description: `Não foi possível gerar a descrição: ${err.message}`})
      userInterruptedAIRef.current = false;
    },
  });

  useEffect(() => {
    if (!open && isGeneratingDescription) {
      stop();
      userInterruptedAIRef.current = false;
    }
  }, [open, isGeneratingDescription, stop]);

  async function handleGenerateDescriptionClick() {
    const urlValue = form.getValues("url");

    const isUrlValid = await form.trigger("url");
    if (!isUrlValid || !urlValue) {
      alert("Por favor, insira uma URL válida para gerar a descrição.");
      return;
    }
    userInterruptedAIRef.current = false;
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
      toast.success("Link Criado!", {
        description: `O link "${data.title}" foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao criar link:", error);
      toast.error("Erro ao criar link", {
        description: "Não foi possível salvar o link. Tente novamente.",
      });
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
                      value={isGeneratingDescription && !userInterruptedAIRef.current ? completion : field.value}
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
                     <>
                      <Loader className="h-4 w-4 mr-2 animate-spin"/>
                      Gerando...
                     </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
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
                      disabled={isLoadingFolders}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma pasta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none" disabled>Sem pasta</SelectItem>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name} {folder.isSecret ? "🔒" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {foldersError && <p className="text-sm text-destructive mt-1">Erro ao carregar pastas.</p>}
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
                      disabled={isLoadingCategories}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma Categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none" disabled>Sem pasta</SelectItem>
                        {categories.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categoriesError && <p className="text-sm text-destructive mt-1">Erro ao carregar categorias.</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting || isGeneratingDescription}
                className="dark:text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>Salvar link</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
