'use server'

import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function getFolders() {
  const user = await getCurrentUser();
  return await prisma.folder.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      name: true,
      isSecret: true,
      links: {
        select: {
          id: true,
          title: true,
        }
      }
    }
  });
}

export async function createFolder(name: string, isSecret: boolean) {
  const user = await getCurrentUser();

  return await prisma.folder.create({
    data: {
      name,
      isSecret,
      userId: user?.id || "",
    },
  });
}

export async function deleteFolder(id: string) {
  const user = await getCurrentUser();

  return await prisma.folder.deleteMany({
    where: {
      id,
      userId: user?.id,
    },
  });
}

export async function getFolderName(id: string) {
  const User = await getCurrentUser();

  return await prisma.folder.findFirst({
    where: {
      id,
      userId: User?.id,
    },
    select: {
      name: true,
    }
  });
}