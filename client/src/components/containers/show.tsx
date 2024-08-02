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

interface ShowIfProps extends WhenProps {}

const ShowIf: FC<ShowIfProps> = ({ condition, children }) => {
	if (!condition) return null;
	return <>{children}</>;
};

const Show: FC<ShowProps> & {
	When: FC<WhenProps>;
	Else: FC<ElseProps>;
	ShowIf: FC<ShowIfProps>;
} = ({ children }) => {
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
Show.ShowIf = ShowIf;

export default Show;
