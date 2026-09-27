import { verifyToken, getCookie, COOKIE } from './lib/session.js';

// Tout le site est protégé, sauf la page de connexion et son API.
export const config = {
  matcher: ['/((?!login\\.html|api/login|favicon\\.ico).*)'],
};

function toLogin(request) {
  return new Response(null, {
    status: 302,
    headers: { location: new URL('/login.html', request.url).toString(), 'cache-control': 'no-store' },
  });
}

export default async function middleware(request) {
  try {
    const session = await verifyToken(getCookie(request, COOKIE));
    // En-tête standard Vercel : laisse passer la requête vers la page demandée.
    if (session) return new Response(null, { headers: { 'x-middleware-next': '1' } });
  } catch (e) {
    console.error('auth middleware', e);
  }
  return toLogin(request);
}
