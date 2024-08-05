export default function PageLayout({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={`flex flex-col h-[calc(100vh-60px)] w-full ${className}`}>{children}</div>;
}
