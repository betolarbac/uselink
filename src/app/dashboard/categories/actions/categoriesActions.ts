"use server"
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { CategoriesType } from "@/lib/validators/categories";

export async function getCategories() {
  const user = await getCurrentUser();

  return await prisma?.category.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      name: true,
      color: true,
      links: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function createCategory(data: CategoriesType) {
  const user = await getCurrentUser();

  return await prisma?.category.create({
    data: {
      name: data.name,
      color: data.color,
      userId: user?.id || "",
    },
  })
}

export async function deleteCategory (id: string) {
  const user = await getCurrentUser();

  return await prisma?.category.delete({
    where: {
      id: id,
      userId: user?.id,
    },
  })
}
