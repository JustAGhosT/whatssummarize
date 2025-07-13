import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Read theme from cookie, default to 'light'
  const theme = request.cookies.get('theme')?.value || 'light';

  // Create the response once
  const response = NextResponse.next();

  // Set the theme header
  response.headers.set('x-theme', theme);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
