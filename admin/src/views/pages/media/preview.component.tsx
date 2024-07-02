import { AspectRatio, Image, Progress, Text } from '@chakra-ui/react';

export default function Preview({
	data,
	progress,
}: {
	data: {
		url: string;
		type: string;
	} | null;
	progress: number;
}) {
	if (!data) {
		return (
			<>
				<Text textAlign={'center'} className='animate-pulse'>
					loading...
				</Text>
				<Progress
					mt={'0.25rem'}
					isIndeterminate={progress === -1}
					value={progress}
					size='xs'
					colorScheme='green'
					rounded={'lg'}
				/>
			</>
		);
	}

	if (data.type === 'image') {
		return <Image src={data.url} aspectRatio={'1/1'} borderRadius='lg' />;
	} else if (data.type === 'video') {
		return (
			<AspectRatio ratio={1 / 1} width={'100%'} height={'100%'}>
				<video style={{ borderRadius: '0.75rem' }} controls autoPlay={false} muted>
					<source src={data.url} type='video/mp4' />
				</video>
			</AspectRatio>
		);
	} else if (data.type === 'PDF') {
		return (
			<AspectRatio ratio={1 / 1} width={'100%'} height={'100%'}>
				<embed
					src={data.url + '#toolbar=0&navpanes=0&scrollbar=0'}
					type='application/pdf'
					width='100%'
					height='calc(100vh - 90px)'
				/>
			</AspectRatio>
		);
	} else if (data.type.includes('audio')) {
		return (
			<AspectRatio ratio={1 / 1}>
				<audio style={{ borderRadius: '0.75rem' }} controls autoPlay={false} muted>
					<source src={data.url} type={data.type} />
				</audio>
			</AspectRatio>
		);
	}
	return (
		<Text textAlign={'center'} color={'red.500'} my={'2rem'}>
			No Preview Available
		</Text>
	);
}
