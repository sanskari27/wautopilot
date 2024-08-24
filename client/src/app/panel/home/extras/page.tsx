import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FAQPage from './_components/FAQ';
import TestimonialsPage from './_components/Testimonials';

export default async function ExtrasPage() {
	return (
		<div className='w-full p-4'>
			<Tabs defaultValue='faq' className='w-full'>
				<TabsList>
					<TabsTrigger value='faq'>FAQ</TabsTrigger>
					<TabsTrigger value='testimonials'>Testimonials</TabsTrigger>
				</TabsList>
				<TabsContent value='faq'>
					<FAQPage />
				</TabsContent>
				<TabsContent value='testimonials'>
					<TestimonialsPage />
				</TabsContent>
			</Tabs>
		</div>
	);
}
