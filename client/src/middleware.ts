import AuthService from '@/services/auth.service';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const {
		authenticated: isAuthenticated,
		admin,
		agent,
		master,
	} = await AuthService.isAuthenticated();

	console.log('middleware', isAuthenticated, admin, agent, master);

	const pathname = request.nextUrl.pathname;

	if (pathname.startsWith('/dashboard')) {
		if (!admin && !agent) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		}
	}
	if (pathname.startsWith('/auth')) {
		if (isAuthenticated) {
			const callback = request.nextUrl.searchParams.get('callback');
			if (admin || agent) {
				return Response.redirect(new URL(callback || '/dashboard', request.url));
			} else if (master) {
				return Response.redirect(new URL(callback || '/admin/dashboard', request.url));
			}
		}
	}
	if (pathname.startsWith('/admin')) {
		if (!isAuthenticated) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		} else if (!admin) {
			return Response.redirect(new URL(`/dashboard`, request.url));
		}
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
