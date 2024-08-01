'use client';

import React from 'react';
import { CgRemove } from 'react-icons/cg';
import Each from '../containers/each';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

const ReminderInputDialog = ({
	reminders: _reminders,
	children,
	onConfirm,
}: {
	onConfirm: (reminders: { reminder_type: string; before: number; before_type: string }[]) => void;
	children: React.ReactNode;
	reminders: {
		reminder_type: string;
		before: number;
		before_type: string;
	}[];
}) => {
	const [reminders, setReminders] = React.useState<
		{
			reminder_type: string;
			before: number;
			before_type: string;
		}[]
	>(_reminders);
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const addBlankReminder = () => {
		setReminders((prev) => [
			...prev,
			{
				reminder_type: 'email',
				before: 15,
				before_type: 'minutes',
			},
		]);
	};

	const removeReminder = (index: number) => {
		setReminders((prev) => prev.filter((_, i) => i !== index));
	};

	const handleClose = () => {
		buttonRef.current?.click();
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.stopPropagation();
		e.preventDefault();
		onConfirm(reminders);
		handleClose();
	};

	return (
		<Dialog
			onOpenChange={() => {
				setReminders(_reminders);
			}}
		>
			<DialogTrigger asChild ref={buttonRef}>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reminders</DialogTitle>
				</DialogHeader>
				<Button onClick={addBlankReminder}>Add</Button>
				<form method='POST' onSubmit={handleSubmit}>
					<div className='max-h-[350px] overflow-y-scroll mb-4'>
						<Each
							items={reminders}
							render={(reminder, index) => {
								return (
									<>
										<div className='flex flex-col w-full gap-2 px-2 py-2'>
											<div className='flex-1 flex gap-2'>
												<Select
													onValueChange={(value) => {
														setReminders((prev) => {
															prev[index].reminder_type = value;
															return [...prev];
														});
													}}
													defaultValue={reminder.reminder_type}
													required
													value={reminder.reminder_type}
												>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select one!' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='email'>Email</SelectItem>
														<SelectItem value='whatsapp'>WhatsApp</SelectItem>
													</SelectContent>
												</Select>
												<Button
													onClick={(e) => {
														e.preventDefault();
														removeReminder(index);
													}}
													variant={'destructive'}
												>
													<CgRemove />
												</Button>
											</div>
											<div className='flex gap-2 '>
												<Input
													value={reminder.before.toString() ?? ''}
													onChange={(e) => {
														if (isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 0) {
															setReminders((prev) => {
																prev[index].before = 0;
																return [...prev];
															});
															return;
														}
														setReminders((prev) => {
															prev[index].before = parseInt(e.target.value);
															return [...prev];
														});
													}}
													type='number'
													placeholder='Enter the time'
													minLength={1}
													required
												/>
												<Select
													onValueChange={(value) => {
														setReminders((prev) => {
															prev[index].before_type = value;
															return [...prev];
														});
													}}
													value={reminder.before_type}
													defaultValue={reminder.reminder_type}
													required
												>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Select one!' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='minutes'>Minutes</SelectItem>
														<SelectItem value='hours'>Hours</SelectItem>
														<SelectItem value='days'>Days</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<Separator />
									</>
								);
							}}
						/>
					</div>
					<DialogFooter>
						<Button type='reset' onClick={handleClose} variant={'outline'}>
							Cancel
						</Button>
						<Button type='submit'>Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ReminderInputDialog;
