'use client';

export default function Loading() {
	return (
		<div
			className='w-screen h-screen absolute left-0 top-0 right-0 bottom-0 flex justify-center items-center  backdrop-blur-sm bg-black/50 z-[9999]'
			onClick={(e) => e.stopPropagation()}
		>
			<div className='absolute left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full shadow-[inset_0px_0px_30px_30px_#FFFFFF]'></div>
			<div className='container-anim'></div>

			<svg width='0' height='0' className='svg'>
				<defs>
					<filter id='uib-jelly-ooze'>
						<feGaussianBlur in='SourceGraphic' stdDeviation='5' result='blur' />
						<feColorMatrix
							in='blur'
							mode='matrix'
							values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
							result='ooze'
						/>
						<feBlend in='SourceGraphic' in2='ooze' />
					</filter>
				</defs>
			</svg>
		</div>
	);
}
