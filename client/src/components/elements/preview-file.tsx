import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Progress } from '../ui/progress';

export default function PreviewFile({
	data,
	progress = -1,
}: {
	data: {
		url: string;
		type: string;
	} | null;
	progress?: number;
}) {
	if (!data) {
		return (
			<div className='w-full h-full flex flex-col justify-center'>
				<p className='animate-pulse text-center'>loading...</p>
				<Progress className={cn('mt-1', progress === -1 && 'hidden')} value={progress} />
			</div>
		);
	}

	if (data.type === 'image') {
		return (
			<Image
				src={data.url}
				className='aspect-square rounded-lg'
				alt={''}
				width={400}
				height={400}
			/>
		);
	} else if (data.type === 'video') {
		return (
			<div>
				<video
					style={{ borderRadius: '0.75rem', aspectRatio: 1 / 1 }}
					controls
					autoPlay={false}
					muted
				>
					<source src={data.url} type='video/mp4' />
				</video>
			</div>
		);
	} else if (data.type === 'PDF') {
		return (
			<div className='h-[300px]'>
				<embed
					src={data.url + '#toolbar=0&navpanes=0&scrollbar=0'}
					type='application/pdf'
					width='100%'
					height='100%'
					style={{ borderRadius: '0.75rem', aspectRatio: 1 / 1 }}
				/>
			</div>
		);
	} else if (data.type.includes('audio')) {
		return (
			<div className='w-full h-full flex flex-col justify-center'>
				<audio style={{ borderRadius: '0.75rem', width: '100%' }} controls autoPlay={false} muted>
					<source src={data.url} type={data.type} />
				</audio>
			</div>
		);
	}
	return (
		<p className='text-destructive w-full py-8 h-full inline-flex items-center justify-center'>
			No Preview Available
		</p>
	);
}
