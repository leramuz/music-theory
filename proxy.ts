import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './app/i18n/routing';

const intlMiddleware = createMiddleware(routing);

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.slice('Basic '.length);
  const decoded = atob(base64Credentials);
  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) {
    return false;
  }

  const user = decoded.slice(0, colonIndex);
  const password = decoded.slice(colonIndex + 1);

  const validUser = process.env.BASIC_AUTH_USER;
  const validPassword = process.env.BASIC_AUTH_PASSWORD;

  if (!validUser || !validPassword) {
    return false;
  }

  return user === validUser && password === validPassword;
}

export default function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development' && !isAuthenticated(request)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected"',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
