import ReportDataTable from './data-table';

export default async function Report() {
	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<ReportDataTable />
		</div>
	);
}
