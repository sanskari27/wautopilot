'use client'

import Loading from '@/components/elements/loading';
import { usePhonebookStore } from '@/stores/phonebook-store';
import { useEffect } from 'react';
import { DataTable } from './_components/data-table';

export default function Phonebook({
	searchParams,
}: {
	searchParams: {
		tags: string[];
		page: string;
		limit: string;
		[key: string]: string | string[];
	};
}) {
	const { records, totalRecords, isLoading, fetchPhonebook } = usePhonebookStore();

	useEffect(() => {
		fetchPhonebook(searchParams);
	}, [searchParams, fetchPhonebook]);

	return <>{isLoading ? <Loading /> : <DataTable records={records} maxRecord={totalRecords} />}</>;
}
