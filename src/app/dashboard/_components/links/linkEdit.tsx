"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, CreateLinkType } from "@/lib/validators/link";
import { updateLink } from "../../actions/linksActions";
import { getFolders } from "../../folders/actions/folderActions";
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
import { Folder, Link } from "@/types/typesLinks";
import { useRouter } from "next/navigation";
import { getCategories } from "../../categories/actions/categoriesActions";
import { toast } from "sonner";

interface LinkEditProps {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkUpdated: (updatedLink: Link) => void;
}

type CategoriesType = {
  name: string;
  id: string;
};

export function LinkEdit({ link, open, onOpenChange, onLinkUpdated }: LinkEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<CategoriesType[]>([])

  const router = useRouter();

  const form = useForm<CreateLinkType>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
      description: link.description || "",
      customSlug: "",
      isSecret: false,
      folderId: link.folderId || undefined,
      categoryId: link.categoryId || undefined,
    },
  });

  useEffect(() => {
    form.reset({
      title: link.title,
      url: link.url,
      description: link.description || "",
      customSlug: "",
      isSecret: false,
      folderId: link.folderId || undefined,
      categoryId: link.categoryId || undefined,
    });
  }, [link, form]);

  useEffect(() => {
    async function loadFolders() {
      try {
        const folderData = await getFolders();
        setFolders(folderData);
      } catch (error) {
        console.error("Erro ao carregar pastas:", error);
      }
    }

  async function loadCategories() {
    try {
      const categoriesData = await getCategories();

      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

    if (open) {
      loadFolders();
      loadCategories();
    }
  }, [open]);

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