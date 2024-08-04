import { Button } from '@/components/ui/button';
import { ContactRound } from 'lucide-react';
import Link from 'next/link';

export function AddContact() {
	return (
		<Link href={`?contact=new`}>
			<Button size={'sm'} className='bg-teal-600 hover:bg-teal-700'>
				<ContactRound className='w-4 h-4 mr-2' />
				Add Contact
			</Button>
		</Link>
	);
}
