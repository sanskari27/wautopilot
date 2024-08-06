'use client';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/badge';

export default function ExpiryCountdown({ timeLeft }: { timeLeft: number }) {
	const [_timeLeft, setTimeLeft] = useState(timeLeft);
	const intervalRef = useRef<any>();

	useEffect(() => {
		setTimeLeft(timeLeft);
	}, [timeLeft]);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(intervalRef.current);
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
