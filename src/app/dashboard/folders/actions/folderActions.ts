"use server";

import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getFolders(searchTerm?: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return [];
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
            status: "ACCEPTED",
          },
        },
      },
    ],
  };

  if (searchTerm && searchTerm.trim() !== "") {
    whereClause.AND = {
      name: {
        contains: searchTerm.trim(),
        mode: "insensitive",
      },
    };
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
        },
      },
      links: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
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

export async function getFolderDetails(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const folder = await prisma.folder.findFirst({
    where: {
      id: id,
      OR: [
        { userId: currentUser.id },
        { sharedWith: { some: { userId: currentUser.id, status: "ACCEPTED" } } },
      ],
    },
    select: {
      id: true,
      name: true,
      user: {
        select: { name: true },
      },
    },
  });

  return folder;
}

export async function findUserByEmail(email: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Não autenticado.");

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

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { userId: true },
  });

  if (folder?.userId !== currentUser.id) {
    throw new Error("Permissão negada.");
  }

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

export async function inviteUserToFolder(folderId: string, targetUserId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) throw new Error("Não autenticado.");

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { userId: true },
  });

  if (folder?.userId !== currentUser.id) {
    throw new Error("Permissão negada para convidar para esta pasta.");
  }
  
  if (currentUser.id === targetUserId) {
    throw new Error("Você não pode convidar você mesmo.");
  }

  const newInvitation = await prisma.folderAccess.create({
    data: {
      folderId: folderId,
      userId: targetUserId,
    },
  });

  return newInvitation;
}

export async function removeFolderAccess(accessId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Não autenticado.");

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

export async function getPendingInvitations() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  return await prisma.folderAccess.findMany({
    where: {
      userId: currentUser.id,
      status: 'PENDING',
    },
    include: {
      folder: { 
        select: {
          name: true,
          user: { 
            select: { name: true }
          }
        }
      }
    }
  });
}

export async function acceptInvitation(accessId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) throw new Error("Não autenticado.");

  return await prisma.folderAccess.update({
    where: {
      id: accessId,
      userId: currentUser.id,
    },
    data: {
      status: 'ACCEPTED',
    }
  });
}

export async function declineInvitation(accessId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) throw new Error("Não autenticado.");

  return await prisma.folderAccess.delete({
    where: {
      id: accessId,
      userId: currentUser.id,
    },
  });
}