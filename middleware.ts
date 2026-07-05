import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // 1. จัดการ Session
  const response = await updateSession(request);

  // 2. ตรวจสอบสิทธิ์สำหรับ Protected Routes
  const { pathname } = request.nextUrl;
  
  // ถ้าพยายามเข้าถึง /transactions (Dashboard) ให้เช็ค Auth
  if (pathname.startsWith('/transactions')) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};