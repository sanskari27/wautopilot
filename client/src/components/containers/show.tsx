import React, { FC, ReactNode } from 'react';

interface ShowProps {
	children: ReactNode;
}

interface WhenProps {
	condition: boolean;
	children: ReactNode;
}

interface ElseProps {
	children: ReactNode;
}

const Show: FC<ShowProps> & { When: FC<WhenProps>; Else: FC<ElseProps> } = ({ children }) => {
	let elseChild: ReactNode = null;

	for (const child of React.Children.toArray(children)) {
		if (React.isValidElement(child)) {
			if (child.type === When && (child.props as WhenProps).condition) {
				return child;
			}
			if (child.type === Else) {
				elseChild = child;
			}
		}
	}

	return <>{elseChild}</>;
};

const When: FC<WhenProps> = ({ children }) => <>{children}</>;
const Else: FC<ElseProps> = ({ children }) => <>{children}</>;

Show.When = When;
Show.Else = Else;

export default Show;
