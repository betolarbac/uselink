"use server";

import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import prisma from "../prisma";
import { cookies } from "next/headers";

const SESSION_DURATION = 7 * 24 * 60 * 60;

type SessionUser = {
  uid: string;
};

export async function createSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "session-token",
    value: user.uid,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

async function removeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session-token");
}

export async function registerWithEmail(
  email: string,
  password: string,
  name: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const firebaseUser = userCredential.user;

  await prisma.user.create({
    data: {
      firebaseId: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
    },
  });

  await createSessionCookie(firebaseUser);

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}

export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUser = userCredential.user;

  await createSessionCookie(firebaseUser);

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}

export async function logout() {
  await signOut(auth);
  await removeSessionCookie();
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token");

  if (!sessionToken) {
    return null;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { firebaseId: sessionToken.value },
    });

    return user;
  } catch (error) {
    console.error("Erro ao verificar usuário atual:", error);
    return null;
  }
}
