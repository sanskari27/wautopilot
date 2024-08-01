import React from 'react';

export function GridBackground({ children }: { children: React.ReactNode }) {
	return (
		<div className='bg-black bg-grid-white/[0.2] relative flex min-h-screen w-screen flex-col items-center justify-between'>
			{/* Radial gradient for the container to give a faded look */}
			<div className='absolute pointer-events-none inset-0 flex items-center justify-center bg-oil-black'></div>
			{children}
		</div>
	);
}
