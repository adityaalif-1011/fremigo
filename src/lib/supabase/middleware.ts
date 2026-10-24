import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

async function resolveRole(supabase: SupabaseClient, user: User, path: string) {
  // 1) Fast path: role from JWT metadata (app_metadata is server-set and
  //    cannot be edited by the client, so it is trusted). No DB hit.
  const metaRole =
    typeof user.app_metadata?.role === 'string'
      ? user.app_metadata.role
      : typeof user.user_metadata?.role === 'string'
        ? user.user_metadata.role
        : undefined

  if (metaRole && metaRole.trim() !== '') {
    console.log('ROLE CHECK: source=metadata', user.id, metaRole, path)
    return metaRole.toLowerCase().trim()
  }

  // 2) Fallback: read from the profiles table (single row, try/catch).
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) throw error

    const role = profile?.role
    console.log('ROLE CHECK: source=profiles', user.id, role, path)
    return role?.toLowerCase().trim()
  } catch (err) {
    console.log('ROLE CHECK: profiles fetch FAILED', user.id, path, err)
    return undefined
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const protectedRoutes = ['/checkout', '/riwayat', '/account', '/admin']

  if (!user && protectedRoutes.some(p => path.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const isAdminRoute = path === '/admin' || path.startsWith('/admin/')

  if (user && isAdminRoute) {
    const role = await resolveRole(supabase, user, path)

    console.log('ROLE CHECK:', user.id, role, path)

    // ONLY redirect away from /admin when the role is NOT admin.
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  if (user && path === '/login') {
    const role = await resolveRole(supabase, user, path)

    console.log('ROLE CHECK:', user.id, role, path)

    const url = request.nextUrl.clone()
    url.pathname = role === 'admin' ? '/admin' : '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
