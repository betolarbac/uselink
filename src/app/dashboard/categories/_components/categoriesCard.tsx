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

interface CategoriasCardProps {
  id: string;
  name: string;
  linksCount: number | string;
}

export default function CategoriesCard(dataCategory: CategoriasCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteCategory = () => {
    startTransition(async () => {
      await deleteCategory(dataCategory.id);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full" />
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
