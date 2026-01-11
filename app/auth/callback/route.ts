import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check role to redirect appropriately
            const { data: { user } } = await supabase.auth.getUser()

            if (next.includes('/update-password')) {
                return NextResponse.redirect(`${origin}${next}`)
            }

            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

                if (profile?.role === 'admin') {
                    // If user was logging in and was supposed to go to /admin, good.
                    // If they were just logging in generically, send to /admin.
                    return NextResponse.redirect(`${origin}/admin`)
                } else {
                    // specific logic for client vs other roles
                    return NextResponse.redirect(`${origin}/dashboard`)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
