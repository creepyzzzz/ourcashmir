import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // console.log('Refreshing session for:', request.nextUrl.pathname)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // console.error('Supabase environment variables are missing!')
        return supabaseResponse
    }

    try {
        const {
            data: { user },
            error
        } = await supabase.auth.getUser()

        // if (error) {
        //     console.error('Supabase getUser error:', error.message)
        // }

        if (
            !user &&
            !request.nextUrl.pathname.startsWith('/login') &&
            !request.nextUrl.pathname.startsWith('/auth') &&
            request.nextUrl.pathname !== '/'
        ) {
            // no user, potentially redirect
            // const url = request.nextUrl.clone()
            // url.pathname = '/login'
            // return NextResponse.redirect(url)
        }

        // Role based protection logic can go here or in specific layouts
        // For now, we just ensure session data is refreshed

        return supabaseResponse
    } catch (e) {
        // console.error('Supabase auth unexpected error in proxy:', e)
        return supabaseResponse
    }
}
