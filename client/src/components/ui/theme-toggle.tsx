'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';

export function ThemeToggle({ hideText }: { hideText?: boolean }) {
	const { theme, setTheme } = useTheme();

	const handleClick = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	if (hideText) {
		return (
			<Button variant='ghost' size='icon' onClick={handleClick}>
				<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<span className='sr-only'>Toggle theme</span>
			</Button>
		);
	}

	return (
		<div onClick={handleClick} className='inline-flex justify-start items-center gap-2'>
			<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span>Toggle theme</span>
		</div>
	);
}
