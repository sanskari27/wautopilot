import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export default function ProfileHover({
	name,
	email,
	children,
}: {
	name: string;
	email: string;
	children?: React.ReactNode;
}) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				{children || <Button variant='link'>{name}</Button>}
			</HoverCardTrigger>
			<HoverCardContent className='w-fit'>
				<div className='flex justify-between space-x-2'>
					<Avatar>
						<AvatarImage src='/profile.png' />
						<AvatarFallback>P</AvatarFallback>
					</Avatar>
					<div>
						<h4 className='text-sm font-semibold'>{name}</h4>
						<a href={`mailto:${email}`} className='text-sm'>
							{email}
						</a>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
