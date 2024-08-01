'use client';

import { LogOut } from 'lucide-react';

import AuthService from '@/services/auth.service';
import { Button } from '../ui/button';

export function LogoutButton({ as = 'div' }: { as?: 'button' | 'div' }) {
	async function handleClick() {
		const success = await AuthService.logout();
		if (success) {
			window.location.href = '/';
		}
	}

	if (as === 'button') {
		return (
			<Button variant='ghost' onClick={handleClick}>
				<LogOut className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all  mr-2' />
				<span>Logout</span>
			</Button>
		);
	}

	return (
		<div onClick={handleClick} className='inline-flex justify-start items-center gap-2'>
			<LogOut className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
			<span>Logout</span>
		</div>
	);
}
