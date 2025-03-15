import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const createClient = async (url, apiKey) => {
    const cookieStore = (await cookies());
    return createServerClient(url, apiKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                }
                catch { }
            },
        },
    });
};
