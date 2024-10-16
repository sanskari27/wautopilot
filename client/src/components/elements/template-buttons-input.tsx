import Each from '../containers/each';
import Show from '../containers/show';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function TemplateButtonInput({
	buttons,
	setButtons,
}: {
	buttons: string[][];
	setButtons: (buttons: string[][]) => void;
}) {
	return (
		<Each
			items={buttons}
			render={(item, buttonIndex) => (
				<div>
					<div className='text-center'>Button number {buttonIndex + 1}</div>
					<Show.ShowIf condition={buttons[buttonIndex].length == 0}>
						<div className='text-center text-destructive'>Not required for reply back buttons</div>
					</Show.ShowIf>
					<Each
						items={buttons[buttonIndex]}
						render={(_, buttonVariableIndex) => (
							<div className='flex flex-col'>
								<Label>
									Variable value {buttonIndex + 1}
									<span className='ml-[0.2rem] text-red-800'>*</span>
								</Label>
								<div className='flex gap-3 flex-col md:flex-row'>
									<div className='flex-1'>
										<Input
											placeholder='Value'
											value={buttons[buttonIndex][buttonVariableIndex]}
											onChange={(e) =>
												setButtons(
													buttons.map((button, i) => {
														if (i == buttonIndex) {
															return button.map((variable, j) => {
																if (j == buttonVariableIndex) {
																	return e.target.value;
																} else {
																	return variable;
																}
															});
														} else {
															return button;
														}
													})
												)
											}
										/>
									</div>
								</div>
							</div>
						)}
					/>
				</div>
			)}
		/>
	);
}
