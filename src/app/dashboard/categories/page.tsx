import type React from "react";
import { Tag } from "lucide-react";
import CreateCategories from "./_components/categoriesCreate";
import CategoriesCard from "./_components/categoriesCard";
import { getCategories } from "./actions/categoriesActions";

export default async function CategoriesPage() {
  const categoriesData = await getCategories();
  const categories = categoriesData || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">
            Crie categorias para organizar seus links
          </p>
        </div>

        <CreateCategories />
      </div>

      {categories.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <Tag className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Nenhuma categoria criada
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Crie categorias para classificar seus links
          </p>

          <CreateCategories />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoriesCard
              id={category.id}
              key={category.id}
              name={category.name}
              color={category.color}
              linksCount={category.links.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
