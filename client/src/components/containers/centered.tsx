import { cn } from '@/lib/utils';

export default function Centered({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('flex flex-col items-center justify-center h-full w-full', className)}>
			{children}
		</div>
	);
}
