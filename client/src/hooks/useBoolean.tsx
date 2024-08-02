import { useState } from 'react';

export default function useBoolean(defaultValue = false) {
	const [value, setValue] = useState(defaultValue);

	const on = () => setValue(true);
	const off = () => setValue(false);
	const toggle = () => setValue((prev) => !prev);

	return { value, on, off, toggle };
}
