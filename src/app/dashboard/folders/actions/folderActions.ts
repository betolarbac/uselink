'use server'

import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getFolders(searchTerm?: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return []; // Retorna array vazio se não houver usuário
  }

  const whereClause: Prisma.FolderWhereInput = {
    OR: [
      {
        userId: user.id,
      },
      {
        sharedWith: {
          some: {
            userId: user.id,
          }
        }
      }
    ]
  }

  if (searchTerm && searchTerm.trim() !== "") {
   whereClause.AND = {
    name: {
      contains: searchTerm.trim(),
      mode: "insensitive",
    }
   }
  }

  return await prisma.folder.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      isSecret: true,
      userId: true,
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      links: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: {
      name: "asc"
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

export async function findUserByEmail(email: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Não autenticado.");

  // Prevenir que o usuário se encontre
  if (currentUser.email === email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user;
}

export async function getSharedUsersForFolder(folderId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Não autenticado.");

  // Verifica se o usuário atual é o dono da pasta para poder ver os compartilhamentos
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { userId: true },
  });

  if (folder?.userId !== currentUser.id) {
    throw new Error("Permissão negada.");
  }

  // Busca os registros de acesso e inclui os dados do usuário associado
  return await prisma.folderAccess.findMany({
    where: { folderId: folderId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function shareFolderWithUser(folderId: string, targetUserId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Não autenticado.");

  // Verifica se o usuário atual é o dono da pasta
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { userId: true },
  });

  if (folder?.userId !== currentUser.id) {
    throw new Error("Permissão negada para compartilhar esta pasta.");
  }
  
  if (currentUser.id === targetUserId) {
    throw new Error("Você não pode compartilhar uma pasta com você mesmo.");
  }

  // Cria o registro de acesso
  const newAccess = await prisma.folderAccess.create({
    data: {
      folderId: folderId,
      userId: targetUserId,
    },
  });

  // Revalidar o path da página de pastas pode ser útil se a UI do outro usuário precisar ser atualizada
  // revalidatePath('/dashboard/folders'); // Opcional

  return newAccess;
}

/**
 * Remove o acesso de um usuário a uma pasta.
 */
export async function removeFolderAccess(accessId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Não autenticado.");

  // Busca o registro de acesso para garantir que o usuário atual é o dono da pasta associada
  const access = await prisma.folderAccess.findUnique({
    where: { id: accessId },
    include: {
      folder: {
        select: { userId: true },
      },
    },
  });

  if (!access || access.folder.userId !== currentUser.id) {
    throw new Error("Permissão negada para remover este acesso.");
  }

  return await prisma.folderAccess.delete({
    where: { id: accessId },
  });
}