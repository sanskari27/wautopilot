import { redirect } from 'next/navigation';

export default function Home() {
	redirect('/auth/login');
}

//TODO 1: status: 'DRAFT' | 'PUBLISHED'
//TODO 2: only draft flow can be editing
//TODO 3: to publish a draft, confirmation dialog is required 
