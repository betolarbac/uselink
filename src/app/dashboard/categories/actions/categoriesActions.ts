"use server"
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function getCategories() {
  const user = await getCurrentUser();

  return await prisma?.category.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      name: true,
      links: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function createCategory(name: string) {
  const user = await getCurrentUser();

  return await prisma?.category.create({
    data: {
      name: name,
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
