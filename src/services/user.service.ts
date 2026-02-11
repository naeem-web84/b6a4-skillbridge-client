import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export const userService = {
    getSession: async function () {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const session = await res.json();

            if(session === null){
                return {data: null, error: {message: "Session is missing", status: 401}};
            }
            return {data: session, error: null};
        }
        catch (error) { 
            return {
                data: null,
                error: {message: "Something went wrong", status: 500, error: error}
            };
        }
    }
};