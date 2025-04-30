"use server";

import prisma from "@/lib/prisma";

export async function saveUserOnServer({
  uid,
  email,
  name,
}: {
  uid: string;
  email: string | null;
  name: string | null;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { firebaseId: uid },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          firebaseId: uid,
          email: email!,
          name: name ?? "",
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar/verificar usuário:", error);
    return { success: false, error: "Erro interno" };
  }
}
