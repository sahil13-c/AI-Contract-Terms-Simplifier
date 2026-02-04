import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes
    const protectedPaths = ['/dashboard', '/analysis', '/documents'];
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    // Auth routes
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if accessing auth routes while logged in
    if (isAuthPath && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/analysis/:path*',
        '/documents/:path*',
        '/login',
        '/signup',
    ],
};
