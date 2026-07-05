import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const requestCookies = request.cookies;
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return requestCookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          const cookieOptions = cookie.options as Parameters<
            typeof response.cookies.set
          >[2];
          response.cookies.set(cookie.name, cookie.value, cookieOptions);
        });
      },
    },
  });

  await supabase.auth.getSession();
  return response;
}
