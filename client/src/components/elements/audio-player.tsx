'use client';
import useAudio from '@/hooks/useAudio';
import { CirclePause, CirclePlay } from 'lucide-react';
import Show from '../containers/show';
import { Button } from '../ui/button';

export default function AudioPlayer({ src }: { src: string }) {
	const [playing, toggle] = useAudio(src);

	return (
		<Button size={'icon'} className='w-8 h-8' onClick={toggle}>
			<Show>
				<Show.When condition={playing}>
					<CirclePause size={16} strokeWidth={2.25} />
				</Show.When>
				<Show.Else>
					<CirclePlay size={16} strokeWidth={2.25} />
				</Show.Else>
			</Show>
		</Button>
	);
}
