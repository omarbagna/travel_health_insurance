import { Typography } from '@material-tailwind/react';
import React from 'react';

const Header = () => {
	return (
		<div className="relative w-full h-full flex flex-col gap-5 justify-center items-center  pl-10">
			<Typography
				variant="h1"
				className="text-7xl font-title font-semibold w-full text-left z-20 text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-blue-gray-400">
				Lagos Travel Health Insurance
			</Typography>
			<Typography
				variant="h1"
				className="text-2xl font-body font-thin w-full text-left z-20 text-blue-gray-700">
				Get the most affordable travel health insurance starting from as low as{' '}
				<mark className="px-2 text-white bg-blue-600 rounded">$60.00</mark>
			</Typography>
		</div>
	);
};

export default Header;
