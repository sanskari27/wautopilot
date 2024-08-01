import AuthService from '@/services/auth.service';
import { redirect } from 'next/navigation';

export default async function LogoutPage() {
	await AuthService.logout();
	redirect('/auth/login');
}
