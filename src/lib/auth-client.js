import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://bajardor-3qvim7w9b-alpha-381c.vercel.app"
});

export const { useSession, signIn, signUp, signOut, updateUser } = authClient;