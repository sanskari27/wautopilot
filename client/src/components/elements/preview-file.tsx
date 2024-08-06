export default function PreviewFile({
	data,
}: {
	data: {
		url: string;
		type: string;
	} | null;
}) {
	if (!data) {
		return (
			<>
				<p className='animate-pulse text-center'>loading...</p>
			</>
		);
	}

	if (data.type === 'image') {
		return <img src={data.url} className='aspect-square rounded-lg' alt={''} />;
	} else if (data.type === 'video') {
		return (
			<div>
				<video style={{ borderRadius: '0.75rem' }} controls autoPlay={false} muted>
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
				/>
			</div>
		);
	} else if (data.type.includes('audio')) {
		return (
			<div>
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
