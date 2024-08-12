import { cn } from '@/lib/utils';
import { Separator } from './separator';

export default function AbsoluteCenter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('relative my-2 flex items-center', className)}>
			<Separator className='flex-1 bg-gray-400' />
			<span className='px-2'>{children}</span>
			<Separator className='flex-1 bg-gray-400' />
		</div>
	);
}
