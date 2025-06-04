import { useState, useEffect } from 'react';
import { getCategories } from '@/app/dashboard/categories/actions/categoriesActions';
import type { Category as CategoryType } from '@/types/typesLinks'; 

interface UseCategoriesReturn {
  categories: CategoryType[];
  isLoadingCategories: boolean;
  categoriesError: Error | null;
}

export function useCategories(enabled: boolean = true): UseCategoriesReturn {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    async function loadCategoriesData() {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Erro ao carregar categorias no hook useCategories:", err);
        setCategoriesError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar categorias'));
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategoriesData();
  }, [enabled]);

  return { categories, isLoadingCategories, categoriesError };
}