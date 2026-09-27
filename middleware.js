import { next } from '@vercel/functions';
import { verifyToken, getCookie, COOKIE } from './lib/session.js';

// Tout le site est protégé, sauf la page de connexion et son API.
export const config = {
  matcher: ['/((?!login\\.html|api/login|favicon\\.ico).*)'],
};

export default async function middleware(request) {
  const session = await verifyToken(getCookie(request, COOKIE));
  if (session) return next();
  return Response.redirect(new URL('/login.html', request.url), 302);
}
