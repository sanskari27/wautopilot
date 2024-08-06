'use client';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';

export default function ExpiryCountdown({ timeLeft }: { timeLeft: number }) {
	const [_timeLeft, setTimeLeft] = useState(timeLeft);

	useEffect(() => {
		setTimeLeft(timeLeft);
	}, [timeLeft]);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const formatTime = (time: number) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
	};

	return (
		<>
			{_timeLeft <= 0 ? (
				<Badge variant={'destructive'}>Expired</Badge>
			) : (
				<Badge>Expires In :- {formatTime(_timeLeft)} </Badge>
			)}
		</>
	);
}
