"use server";

import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { createLinkSchema } from "@/lib/validators/link";
import type { Link as LinkType } from '@/types/typesLinks';

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
    orderBy: {
      createdAt: "desc",
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
    orderBy: {
      createdAt: "desc",
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

interface GetPublicLinksOptions {
  page?: number;
  limit?: number;
}

interface GetPublicLinksResult {
  links: LinkType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getPublicLinks(
  options: GetPublicLinksOptions = {}
): Promise<GetPublicLinksResult> {
  const { page = 1, limit = 10 } = options; 

  try {
    const whereClause = {
      isPublic: true,
    };

    const totalCount = await prisma.link.count({ where: whereClause });
    const linksData = await prisma.link.findMany({
      where: whereClause,
      include: {
        user: { 
          select: {
            id: true, 
            name: true,
          },
        },
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    
    const formattedLinks = linksData.map(link => ({
      ...link,
      description: link.description ?? null,
      folderId: link.folderId ?? null,
      categoryId: link.categoryId ?? null,
      folder: link.folderId ? { id: link.folderId, name: '', isSecret: false } : null,
      user: link.user ? { name: link.user.name } : null, 
      createdAt: link.createdAt, 
    })) as LinkType[];


    return {
      links: formattedLinks,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Erro ao buscar links públicos:", error);
    return { links: [], totalCount: 0, totalPages: 1, currentPage: 1 };
  }
}