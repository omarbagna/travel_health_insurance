import { Typography } from '@material-tailwind/react';
import React from 'react';

const Header = () => {
	return (
		<div className="lg:overflow-hidden relative w-full h-full flex flex-col gap-5 justify-start lg:justify-center items-start  px-10 lg:pl-10">
			<span className="w-fit relative">
				<Typography
					variant="h1"
					className="font-title font-semibold text-4xl md:text-7xl w-full text-center lg:text-left z-20 text-gray-900 flex justify-center items-end gap-1">
					Lagos Travel Health Insurance
				</Typography>
				<div className="absolute top-1/2 -translate-y-1/2 -left-24 w-20 h-24 lg:h-36 mb-6 bg-blue-400 rounded-sm" />
				<div className="absolute top-1/2 -translate-y-1/2 -right-24 w-20 h-24 block lg:hidden mb-6 bg-blue-400 rounded-sm" />
			</span>

			<Typography
				variant="h1"
				className="text-lg md:text-xl font-body font-light w-full text-center lg:text-left z-20 text-blue-gray-700">
				We understand the importance of being financially prepared when
				travelling and we help you get the most out of your money while still
				ensuring that you are adequately covered in case of any unexpected
				medical emergency or illness while travelling.
			</Typography>
		</div>
	);
};

export default Header;
