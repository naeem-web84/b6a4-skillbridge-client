// app/actions/auth.actions.ts
'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env";

const AUTH_URL = env.AUTH_URL;

export async function logoutServer() {
  try {
    const cookieStore = await cookies();
    
    // Call better-auth logout endpoint
    const response = await fetch(`${AUTH_URL}/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    // Clear cookies manually (just in case)
    cookieStore.getAll().forEach(cookie => {
      cookieStore.delete(cookie.name);
    });

  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always redirect to login
    redirect("/login");
  }
}