import { cn } from '@/lib/utils';

export default function StatsTemplate({
	label,
	value,
	className,
}: {
	label: string;
	value: string;
	className: string;
}) {
	return (
		<div
			className={cn(
				'h-[200px] aspect-square rounded-3xl shadow-lg drop-shadow-sm flex flex-col items-center justify-center whitespace-pre',
				className
			)}
		>
			<h2 className='font-bold text-base whitespace-pre text-wrap'>{label}</h2>
			<h3 className='font-bold text-2xl'>{value}</h3>
		</div>
	);
}
