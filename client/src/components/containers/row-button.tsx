import { useRouter } from "next/navigation";
import { TableRow } from "../ui/table";

export function RowButton({ href, children }: { href: string; children: React.ReactNode }) {
	const router = useRouter();

	function handleClick() {
		router.push(href);
	}

	return (
		<TableRow onClick={handleClick} className='cursor-pointer'>
			{children}
		</TableRow>
	);
}
