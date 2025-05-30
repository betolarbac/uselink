import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/dashboard',
];

const publicRoutes = [
  '/auth/login',
  '/auth/register',
];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  const sessionToken = request.cookies.get('session-token')?.value;
  
  if (isProtectedRoute && !sessionToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  if (publicRoutes.includes(path) && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};