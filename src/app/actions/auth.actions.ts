 'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env";

const AUTH_URL = env.AUTH_URL;

export async function logoutServer() {
  try {
    const cookieStore = await cookies();
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
 
    cookieStore.getAll().forEach(cookie => {
      cookieStore.delete(cookie.name);
    });

  } catch (error) {
    console.error("Logout error:", error);
  } finally { 
    redirect("/login");
  }
}