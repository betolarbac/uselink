"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, CreateLinkType } from "@/lib/validators/link";
import { updateLink } from "../../actions/linksActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/types/typesLinks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFolders } from "@/hooks/useFolders";
import { useCategories } from "@/hooks/useCategories";
import { Switch } from "@/components/ui/switch";

interface LinkEditProps {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkUpdated: (updatedLink: Link) => void;
}

export function LinkEdit({
  link,
  open,
  onOpenChange,
  onLinkUpdated,
}: LinkEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { folders, isLoadingFolders, foldersError } = useFolders(open);
  const { categories, isLoadingCategories, categoriesError } =
    useCategories(open);
  const router = useRouter();

  const form = useForm<CreateLinkType>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
      description: link.description || "",
      customSlug: "",
      folderId: link.folderId || undefined,
      categoryId: link.categoryId || undefined,
      isPublic: link.isPublic,
    },
  });

  useEffect(() => {
    form.reset({
      title: link.title,
      url: link.url,
      description: link.description || "",
      customSlug: "",
      folderId: link.folderId || undefined,
      categoryId: link.categoryId || undefined,
      isPublic: link.isPublic,
    });
  }, [link, form]);

  async function onSubmit(data: CreateLinkType) {
    try {
      setIsSubmitting(true);
      await updateLink(link.id, data);

      const updatedLink = {
        ...link,
        ...data,
      };

      onLinkUpdated(updatedLink as Link);
      onOpenChange(false);

      router.refresh();
      toast.success("Link atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar link:", error);
      toast.error("Erro ao atualizar link!");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
          <DialogDescription>
            Atualize os detalhes do link selecionado.
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
                      placeholder="Descrição do link"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Link Público</FormLabel>
                    <FormDescription className="text-xs">
                      Se ativado, este link poderá aparecer na página
                      &quot;Discovery&quot; para outros usuários.
                    </FormDescription>
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
                      value={field.value}
                      disabled={isLoadingFolders}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma pasta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none" disabled>
                          Sem pasta
                        </SelectItem>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name} {folder.isSecret ? "🔒" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {foldersError && (
                      <p className="text-sm text-destructive mt-1">
                        Erro ao carregar pastas.
                      </p>
                    )}
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
                        <SelectItem value="none" disabled>
                          Sem pasta
                        </SelectItem>
                        {categories.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categoriesError && (
                      <p className="text-sm text-destructive mt-1">
                        Erro ao carregar categorias.
                      </p>
                    )}
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
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
