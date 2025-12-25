import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that require authentication
    const protectedPaths = [
        '/activities',
        '/devoir',
        '/annual-program',
        '/time-slots',
        '/absences',
        '/points',
        '/report',
        '/messages',
        '/profile',
        '/students',
        '/invoices',
        '/policy',
        '/', // Root redirect
    ];

    // Auth paths
    const authPaths = ['/login'];

    const isProtectedPath = protectedPaths.some(path =>
        pathname === path || (path !== '/' && pathname.startsWith(path))
    );

    const isAuthPath = authPaths.some(path => pathname.startsWith(path));

    // If user is not authenticated and tries to access protected path
    if (!token && isProtectedPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If user is authenticated and tries to access login
    if (token && isAuthPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/activities'; // Default dashboard page
        return NextResponse.redirect(url);
    }

    // If user is authenticated and hits root, redirect to activities
    if (token && pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/activities';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
