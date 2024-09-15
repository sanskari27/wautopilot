'use client';
import Each from '@/components/containers/each';
import AbsoluteCenter from '@/components/ui/absolute-center';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { parseToSeconds, randomString } from '@/lib/utils';
import { useState } from 'react';
import { AddButton, ListButtons } from '../_components/buttons';

export type ListMessageProps = {
	onListMessageAdded: (details: {
		header: string;
		body: string;
		footer: string;
		sections: {
			title: string;
			buttons: {
				id: string;
				text: string;
			}[];
		}[];
		delay: number;
	}) => void;
	children: React.ReactNode;
};

const ListMessage = ({ onListMessageAdded, children }: ListMessageProps) => {
	const [header, setHeader] = useState('');
	const [body, setBody] = useState('');
	const [footer, setFooter] = useState('');
	const [delay, setDelay] = useState(0);
	const [delayType, setDelayType] = useState<'sec' | 'min' | 'hour'>('sec');
	const [sections, setSections] = useState<
		{
			title: string;
			buttons: {
				id: string;
				text: string;
			}[];
		}[]
	>([]); // [header, body, footer

	const handleSave = () => {
		if (!body || !sections.length) return;
		onListMessageAdded({ header, body, footer, sections, delay: parseToSeconds(delay, delayType) });
	};

	const removeButton = (sectionIndex: number, buttonIndex: number) => {
		const newSections = [...sections];
		newSections[sectionIndex].buttons.splice(buttonIndex, 1);
		setSections(newSections);
	};

	function addButtonToSection(sectionIndex: number, buttonText: string): void {
		if (!buttonText) return;
		const newSections = [...sections];
		if (!newSections[sectionIndex].buttons) {
			newSections[sectionIndex].buttons = [];
		}
		newSections[sectionIndex].buttons.push({
			id: randomString(),
			text: buttonText,
		});
		setSections(newSections);
	}

	function RenderButtons({
		sectionIndex,
		buttons,
	}: {
		sectionIndex: number;
		buttons: {
			id: string;
			text: string;
		}[];
	}) {
		return (
			<>
				<ListButtons
					buttons={buttons}
					onRemove={(id, index) => removeButton(sectionIndex, index)}
				/>
				<AddButton
					isDisabled={buttons.length >= 3}
					onSubmit={(data) => {
						addButtonToSection(sectionIndex, data.text);
					}}
				/>
			</>
		);
	}

	function RenderSections() {
		return (
			<Each
				items={sections}
				render={(section, sectionIndex) => (
					<>
						<AbsoluteCenter>Section : {section.title}</AbsoluteCenter>

						<RenderButtons sectionIndex={sectionIndex} buttons={section.buttons} />
					</>
				)}
			/>
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>List Message</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] grid gap-2 overflow-y-auto px-0'>
					<div>
						<p className='text-sm mt-2'>Enter Header Text</p>
						<Input
							placeholder={'Enter your header text here.'}
							value={header}
							onChange={(e) => setHeader(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Body Text</p>
						<Textarea
							className='w-full h-[100px] resize-none !ring-0'
							placeholder={'Enter your body text here.'}
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
					</div>
					<div>
						<p className='text-sm mt-2'>Enter Footer Text</p>
						<Input
							placeholder={'Enter your footer text here.'}
							value={footer}
							onChange={(e) => setFooter(e.target.value)}
						/>
					</div>
					<AbsoluteCenter>Menu Sections</AbsoluteCenter>
					<RenderSections />

					<Separator className='bg-gray-400' />

					<AddButton
						placeholder={'Create a new section. \nex. Menu 1'}
						onSubmit={(data) => {
							setSections([...sections, { title: data.text, buttons: [] }]);
						}}
					/>
				</div>

				<Separator />
				<DialogFooter>
					<div className='inline-flex items-center gap-2 mr-auto'>
						<p className='text-sm'>Send after</p>
						<Input
							className='w-20'
							placeholder={'Enter delay in seconds'}
							value={delay.toString()}
							onChange={(e) => setDelay(Number(e.target.value))}
						/>
						<Select
							value={delayType}
							onValueChange={(val: 'sec' | 'min' | 'hour') => setDelayType(val)}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select one' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value='sec'>Seconds</SelectItem>
									<SelectItem value='min'>Minutes</SelectItem>
									<SelectItem value='hour'>Hours</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<DialogClose asChild>
						<Button type='submit' disabled={sections.length === 0} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

ListMessage.displayName = 'ListMessage';

export default ListMessage;
