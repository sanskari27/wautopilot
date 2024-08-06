import { cn, getFileSize } from '@/lib/utils';
import { DashboardService } from '@/services/dashboard.service';
import { notFound } from 'next/navigation';
import { ConversationOverview, MessagesOverview, WalletBalance } from './stats';
import StatsTemplate from './statsTemplate';

export default async function DashboardPage() {
	const dashboardData = await DashboardService.getDashboardData();
	if (!dashboardData) {
		notFound();
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<h1 className='font-bold text-2xl'>Dashboard</h1>
			<div className='flex gap-4 flex-col md:flex-row'>
				<div className='w-full bg-muted h-[400px] p-4 rounded-3xl shadow-lg'>
					<ConversationOverview data={dashboardData.conversations} />
				</div>
				<div className='flex flex-col gap-4'>
					<div className='flex gap-4'>
						<WalletBalance />
						<StatsTemplate
							label={'Number Health'}
							value={dashboardData.health}
							className={cn(
								dashboardData.health === 'RED' && 'bg-red-200',
								dashboardData.health === 'YELLOW' && 'bg-yellow-200',
								dashboardData.health === 'GREEN' && 'bg-green-200'
							)}
						/>
					</div>
					<div className='flex gap-4'>
						<StatsTemplate
							label={'Pending Messages'}
							value={dashboardData.pendingToday}
							className='bg-rose-200'
						/>
						<StatsTemplate
							label={'Media Storage'}
							value={getFileSize(dashboardData.mediaSize)}
							className='bg-orange-200'
						/>
					</div>
				</div>
			</div>
			<div className='flex flex-col md:flex-row-reverse gap-4'>
				<div className='w-full bg-muted h-[400px] p-4 rounded-3xl shadow-lg'>
					<MessagesOverview data={dashboardData.messages} />
				</div>
				<div className='flex flex-col gap-4'>
					<div className='flex gap-4'>
						<StatsTemplate
							label='Phonebook / Contacts'
							value={`${dashboardData.phoneRecords}/${dashboardData.contacts}`}
							className='bg-yellow-200'
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
