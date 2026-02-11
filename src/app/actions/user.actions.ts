'use server';

import { cookies } from "next/headers";
import { env } from "@/env";
import { Roles } from "@/constants/role";

const AUTH_URL = env.AUTH_URL;
 
export async function getSessionServer() {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const session = await res.json();

    if (session === null) {
      return { 
        data: null, 
        error: { message: "Session is missing", status: 401 } 
      };
    }

    return { 
      data: session, 
      error: null 
    };
  } catch (error: any) {
    console.error('Server action error getting session:', error);
    return {
      data: null,
      error: { 
        message: "Something went wrong", 
        status: 500, 
        error: error 
      }
    };
  }
}

 
export async function getUserRoleServer(): Promise<string | null> {
  try {
    const sessionResult = await getSessionServer();
    
    if (sessionResult.error || !sessionResult.data) {
      return null;
    }

    return sessionResult.data.user?.role || null;
  } catch (error) {
    console.error('Server action error getting user role:', error);
    return null;
  }
}
 
export async function hasRole(role: string): Promise<boolean> {
  try {
    const userRole = await getUserRoleServer();
    return userRole === role;
  } catch (error) {
    return false;
  }
}

 
export async function hasTutorAccess(): Promise<boolean> {
  try {
    const userRole = await getUserRoleServer();
    return userRole === Roles.tutor || userRole === Roles.admin;
  } catch (error) {
    return false;
  }
}

 
export async function isAdmin(): Promise<boolean> {
  try {
    const userRole = await getUserRoleServer();
    return userRole === Roles.admin;
  } catch (error) {
    return false;
  }
}
 
export async function isTutor(): Promise<boolean> {
  try {
    const userRole = await getUserRoleServer();
    return userRole === Roles.tutor;
  } catch (error) {
    return false;
  }
}
 
export async function isStudent(): Promise<boolean> {
  try {
    const userRole = await getUserRoleServer();
    return userRole === Roles.student;
  } catch (error) {
    return false;
  }
}
 
export async function getUserInfo() {
  try {
    const sessionResult = await getSessionServer();
    
    if (sessionResult.error || !sessionResult.data) {
      return {
        authenticated: false,
        user: null,
        role: null,
        error: sessionResult.error
      };
    }

    const user = sessionResult.data.user;
    const role = user?.role || null;
    
    return {
      authenticated: true,
      user,
      role,
      isTutor: role === Roles.tutor,
      isAdmin: role === Roles.admin,
      isStudent: role === Roles.student,
      error: null
    };
  } catch (error) {
    return {
      authenticated: false,
      user: null,
      role: null,
      error: { message: "Failed to get user info", status: 500 }
    };
  }
}
 
export async function getUserId(): Promise<string | null> {
  try {
    const sessionResult = await getSessionServer();
    
    if (sessionResult.error || !sessionResult.data) {
      return null;
    }

    return sessionResult.data.user?.id || null;
  } catch (error) {
    return null;
  }
}
 
export async function isAuthenticated(): Promise<boolean> {
  try {
    const sessionResult = await getSessionServer();
    return !sessionResult.error && !!sessionResult.data;
  } catch (error) {
    return false;
  }
}
 
export async function getUserProfile() {
  try {
    const sessionResult = await getSessionServer();
    
    if (sessionResult.error || !sessionResult.data) {
      return null;
    }

    const user = sessionResult.data.user;
    return {
      name: user?.name,
      email: user?.email,
      image: user?.image,
      role: user?.role,
      id: user?.id
    };
  } catch (error) {
    return null;
  }
}