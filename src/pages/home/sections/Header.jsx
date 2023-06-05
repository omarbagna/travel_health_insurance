import { Typography } from '@material-tailwind/react';
import React from 'react';

const Header = () => {
	return (
		<div className="relative w-full h-full flex flex-col gap-5 justify-center items-start  px-10 lg:pl-10">
			<Typography
				variant="h1"
				className="text-5xl md:text-7xl font-title font-semibold w-full text-center lg:text-left z-20 text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-blue-gray-400">
				Lagos Travel Health Insurance
			</Typography>
			<Typography
				variant="h1"
				className="text-lg md:text-xl font-body font-thin w-full lg:w-2/3 text-center lg:text-left z-20 text-blue-gray-700">
				We understand the importance of being financially prepared when
				travelling and we help you get the most out of your money while still
				ensuring that you are adequately covered in case of any unexpected
				medical emergency or illness while travelling.
			</Typography>
		</div>
	);
};

export default Header;
