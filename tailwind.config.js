const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				title: ['Prompt', 'sans-serif'],
				body: ['Roboto', 'sans-serif'],
			},
		},
	},
	plugins: [],
});
