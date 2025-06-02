"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteCategory } from "../actions/categoriesActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CategoriasCardProps {
  id: string;
  name: string;
  color: string;
  linksCount: number | string;
}

export default function CategoriesCard(dataCategory: CategoriasCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteCategory = () => {
    startTransition(async () => {
      try {
        await deleteCategory(dataCategory.id);
      router.refresh();
      toast.success("Categoria deletada");
      } catch (error) {
        console.error(error);
        toast.error("Error ao deletar categoria");
      }
    });
  };

  return (
    <Card className="max-w-80" style={{ borderColor: dataCategory.color }}>
      <CardHeader className="pb-2 px-0">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{dataCategory.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDeleteCategory}
            disabled={isPending}
          >
            <Trash2 />
          </Button>
        </div>
        <div
          className="h-1 w-full"
          style={{ backgroundColor: dataCategory.color }}
        />
      </CardHeader>
      <CardContent>
        <CardDescription>
          <Badge variant="outline" className="bg-muted">
            0 links
          </Badge>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
