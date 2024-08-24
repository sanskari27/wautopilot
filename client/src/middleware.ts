import AuthService from '@/services/auth.service';
import type { NextRequest } from 'next/server';

const Paths = {
	Dashboard: '/home/dashboard',
	Tasks: '/home/tasks',
	Agents: '/home/agents',
	Broadcast: '/campaigns/broadcast',
	ButtonReport: '/campaigns/button-report',
	Chatbot: '/campaigns/chatbot',
	ChatbotFlow: '/campaigns/chatbot-flow',
	Recurring: '/campaigns/recurring',
	Report: '/campaigns/report',
	Templates: '/campaigns/templates',
	WhatsappFlow: '/campaigns/whatsapp-flow',
	Phonebook: '/audience/phonebook',
	Media: '/audience/media',
	Contacts: '/audience/contacts',
	Admin: '/home/admin',
	Coupons: '/home/coupons',
	Extras: '/home/extras',
};

export async function middleware(request: NextRequest) {
	const { authenticated: isAuthenticated } = await AuthService.isAuthenticated();

	const pathname = request.nextUrl.pathname;
	const roleBasedPath = '/panel';

	if (pathname.startsWith('/auth')) {
		if (isAuthenticated) {
			const callback = request.nextUrl.searchParams.get('callback');
			return Response.redirect(new URL(callback || `${roleBasedPath}/home/dashboard`, request.url));
		} else {
			return;
		}
	}

	if (pathname.startsWith(roleBasedPath)) {
		if (!isAuthenticated) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		}

		const { permissions, isMaster } = (await AuthService.userDetails())!;

		if (
			pathname.startsWith(`${roleBasedPath}${Paths.Chatbot}/create`) &&
			!permissions.chatbot.create
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (pathname.startsWith(`${roleBasedPath}${Paths.Chatbot}/`) && !permissions.chatbot.update) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.ChatbotFlow}/new`) &&
			!permissions.chatbot_flow.create
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.ChatbotFlow}/`) &&
			!permissions.chatbot_flow.update
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.Broadcast}`) &&
			!permissions.broadcast.create
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (pathname.startsWith(`${roleBasedPath}${Paths.Report}`) && !permissions.broadcast.report) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.Recurring}/create`) &&
			!permissions.recurring.create
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.Recurring}/`) &&
			!permissions.recurring.update
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.Templates}/create`) &&
			!permissions.template.create
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (
			pathname.startsWith(`${roleBasedPath}${Paths.Templates}/`) &&
			!permissions.template.update
		) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}

		if (pathname.startsWith(`${roleBasedPath}${Paths.ButtonReport}`) && !permissions.buttons.read) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (pathname.startsWith(`${roleBasedPath}${Paths.Admin}`) && !isMaster) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (pathname.startsWith(`${roleBasedPath}${Paths.Coupons}`) && !isMaster) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
		if (pathname.startsWith(`${roleBasedPath}${Paths.Extras}`) && !isMaster) {
			return Response.redirect(new URL(`/permission-denied`, request.url));
		}
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
