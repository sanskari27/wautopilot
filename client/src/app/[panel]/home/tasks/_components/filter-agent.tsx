import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials } from '@/lib/utils';
import AuthService from '@/services/auth.service';
import { Agent } from '@/types/agent';
import Link from 'next/link';

export async function FilterAgent({
	selectedAgent,
	agents,
}: {
	selectedAgent: string;
	agents: Agent[];
}) {
	const { isAgent } = (await AuthService.userDetails())!;

	const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
	const endDate = new Date();

	// const router = useRouter();
	// const agents = useAgents();
	// const [selectedAgent, setSelected] = useState<string>('me');

	// useEffect(() => {
	// 	const url = new URL((window as any).location);
	// 	setSelected(url.searchParams.get('agent') || 'me');
	// }, []);

	// function setSelectedAgent(text: string) {
	// 	setSelected(text);
	// 	const url = new URL((window as any).location);
	// 	url.searchParams.set('agent', text);
	// 	router.push(url.toString());
	// }

	return (
		<div className='border border-dashed border-gray-700 p-2 rounded-full'>
			<div className='gap-4 flex-wrap flex'>
				<Show>
					<Show.When condition={!isAgent}>
						<Link
							href={{
								query: { agent: 'me', start: startDate.toISOString(), end: endDate.toISOString() },
							}}
						>
							<Badge
								className={cn(
									'rounded-full cursor-pointer',
									selectedAgent === 'me' ? 'bg-green-500' : 'bg-gray-300',
									selectedAgent === 'me' ? 'text-white' : 'text-black'
								)}
							>
								<Avatar className='h-6 w-6 -ml-1 mr-2 font-medium'>
									<AvatarFallback>Me</AvatarFallback>
								</Avatar>
								<span className='font-medium'>Me</span>
							</Badge>
						</Link>
					</Show.When>
				</Show>
				<Each
					items={agents}
					render={(item) => (
						<Link
							href={{
								query: {
									agent: item.id,
									start: startDate.toISOString(),
									end: endDate.toISOString(),
								},
							}}
							key={item.id}
						>
							<Badge
								className={cn(
									'rounded-full cursor-pointer',
									selectedAgent === item.id ? 'bg-green-500' : 'bg-gray-300',
									selectedAgent === item.id ? 'text-white' : 'text-black'
								)}
							>
								<Avatar className='h-6 w-6 -ml-1 mr-2 font-medium'>
									<AvatarFallback>{getInitials(item.name) || 'NA'}</AvatarFallback>
								</Avatar>
								<span className='font-medium'>{item.name}</span>
							</Badge>
						</Link>
					)}
				/>
			</div>
		</div>
	);
}
