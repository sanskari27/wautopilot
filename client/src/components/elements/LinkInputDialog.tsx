'use client';

import React, { forwardRef } from 'react';
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
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export type LinkInputHandle = {
	setLink(links: string[]): void;
};

type LinkInputProps = {
	children: React.ReactNode;
	onConfirm: (links: string[]) => void;
	links: string[];
};

const LinkInputDialog = forwardRef<LinkInputHandle, LinkInputProps>(
	({ children, onConfirm, links: _links }, ref) => {
		const [links, setLinks] = React.useState<string[]>(_links);

		const buttonRef = React.useRef<HTMLButtonElement>(null);

		const addBlankLink = () => {
			setLinks((prev) => [...prev, '']);
		};

		const removeLink = (index: number) => {
			setLinks((prev) => prev.filter((_, i) => i !== index));
		};

		const handleLinkChange = (index: number, value: string) => {
			setLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
		};

		const handleClose = () => {
			buttonRef.current?.click();
		};

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.stopPropagation();
			e.preventDefault();
			onConfirm(links);
			handleClose();
		};
		return (
			<Dialog onOpenChange={()=>{
				setLinks(_links);
			}}>
				<DialogTrigger asChild ref={buttonRef}>
					{children}
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Links</DialogTitle>
					</DialogHeader>
					<Button onClick={addBlankLink}>Add link</Button>
					<form method='POST' onSubmit={handleSubmit}>
						<ScrollArea className='max-h-[400px]'>
							<Each
								items={links}
								render={(link, index) => {
									return (
										<>
											<div className='flex w-full gap-2'>
												<div className='flex-1'>
													<Input
														type='url'
														placeholder='Enter the link'
														value={link}
														onChange={(e) => handleLinkChange(index, e.target.value)}
														pattern='http(s)?://.*'
														required
													/>
												</div>
												<Button onClick={() => removeLink(index)} variant={'outline'}>
													X
												</Button>
											</div>
											<Separator className='my-2' />
										</>
									);
								}}
							/>
						</ScrollArea>
						<DialogFooter>
							<Button type='reset' onClick={handleClose}>
								Cancel
							</Button>
							<Button type='submit'>Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		);
	}
);

LinkInputDialog.displayName = 'LinkInputDialog';

export default LinkInputDialog;
