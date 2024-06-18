/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					dark: '#0B826F',
					light: '#62FFB4',
				},
				accent: '#FFFFFF',
			},
		},
	},
	plugins: [],
}