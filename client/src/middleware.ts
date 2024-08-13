import AuthService from '@/services/auth.service';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const {
		authenticated: isAuthenticated,
		admin,
		agent,
		master,
	} = await AuthService.isAuthenticated();

	const pathname = request.nextUrl.pathname;
	const subpath = master ? '/master/home' : admin ? '/admin/home' : agent ? '/agent/home' : '';

	if (pathname.startsWith('/auth')) {
		if (isAuthenticated) {
			const callback = request.nextUrl.searchParams.get('callback');
			return Response.redirect(new URL(callback || `${subpath}/dashboard`, request.url));
		}
	}

	if (pathname.startsWith('/admin')) {
		if (!isAuthenticated) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		}
		if (!admin) {
			return Response.redirect(new URL(`${subpath}/dashboard`, request.url));
		}
	} else if (pathname.startsWith('/master')) {
		if (!isAuthenticated) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		}
		if (!master) {
			return Response.redirect(new URL(`${subpath}/dashboard`, request.url));
		}
	} else if (pathname.startsWith('/agent')) {
		if (!isAuthenticated) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		}
		if (!agent) {
			return Response.redirect(new URL(`${subpath}/dashboard`, request.url));
		}
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
