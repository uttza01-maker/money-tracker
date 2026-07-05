import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // อัปเดตคุกกี้ใน request เพื่อให้ middleware ถัดไปอ่านค่าได้ถูกต้อง
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // สร้าง response ใหม่โดยส่งคุกกี้ที่อัปเดตแล้วไปด้วย
          response = NextResponse.next({
            request,
          })
          
          // ใส่คุกกี้ลงใน response เพื่อส่งกลับไปที่ Browser
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // การป้องกัน Protected Routes
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/transactions'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ป้องกัน User ที่ Login แล้วไม่ให้กลับไปหน้า Login
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}