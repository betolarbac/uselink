"use server";

import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { createLinkSchema } from "@/lib/validators/link";

export async function createLink(input: unknown) {
  const data = createLinkSchema.parse(input);
  const user = await getCurrentUser();

  const cleanData = {
    ...data,
    folderId: data.folderId?.trim() || undefined,
    categoryId: data.categoryId?.trim() || undefined,
    customSlug: data.customSlug?.trim() || undefined,
    userId: user?.id || "",
  };

  return await prisma.link.create({
    data: cleanData,
  });
}

export async function getLinks() {
  const user = await getCurrentUser();

  return await prisma.link.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      folder: true,
      category: true,
    },
  });
}

export async function getLinksByFolderId(folderId: string) {
  const user = await getCurrentUser();

  return await prisma.link.findMany({
    where: {
      userId: user?.id,
      folderId,
    },
    include: {
      folder: true,
      category: true,
    },
  });
}

export async function updateLink(id: string, input: unknown) {
  const data = createLinkSchema.parse(input);
  const user = await getCurrentUser();

  const cleanData = {
    ...data,
    folderId: data.folderId?.trim() || undefined,
    categoryId: data.categoryId?.trim() || undefined,
    customSlug: data.customSlug?.trim() || undefined,
  }

  return await prisma.link.updateMany({
    where: {
      id,
      userId: user?.id,
    },
    data: cleanData,
  })
}

export async function deleteLink(id: string) {
  const user = await getCurrentUser();

  return await prisma.link.deleteMany({
    where: {
      id,
      userId: user?.id,
    },
  });
}
