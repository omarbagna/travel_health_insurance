import { Button, Typography } from '@material-tailwind/react';
import { differenceInDays, format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
	BsCalendarDate,
	BsCalendarDateFill,
	BsGlobeEuropeAfrica,
} from 'react-icons/bs';
import { RiPassportLine } from 'react-icons/ri';
import { MdDateRange } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Ecard = () => {
	const [applicationData, setApplicationData] = useState(null);

	useEffect(() => {
		const data = window.localStorage.getItem('applicationData');
		if (data !== null) setApplicationData(JSON.parse(data));
	}, []);

	return (
		<div className="w-full h-full flex flex-col justify-start gap-20 items-center mt-20 z-20">
			<span className="relative flex justify-center items-end gap-1">
				<Typography
					variant="h2"
					className="font-title font-semibold text-6xl lg:text-7xl text-gray-900 flex justify-center items-end gap-1">
					My e-Card
				</Typography>
				<div className="w-4 h-4 mb-6 bg-blue-400" />
				<div className="absolute bottom-0 right-6 w-2/3 h-2 bg-blue-400" />
			</span>

			{applicationData && (
				<div className="flex flex-wrap justify-center items-center gap-5">
					{applicationData?.insured_person?.map((person, index) => (
						<div
							key={index}
							className="w-5/6 md:w-[34rem] rounded-sm shadow-xl bg-white/50 backdrop-blur-sm mx-auto">
							<div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden">
								<Typography className="font-card md:col-span-2 text-lg w-full text-left">
									{person?.first_name}{' '}
									<span className="text-blue-400">{person?.last_name}</span>
								</Typography>
								<div className="w-full h-6 relative flex justify-end items-center">
									<Typography className="font-card text-xl font-black w-full text-right">
										LTHI
									</Typography>
									<div className="absolute w-10 h-full bg-blue-400 top-1/2 -translate-y-1/2 -right-12" />
								</div>

								<div className="col-span-2 md:col-span-3 w-full h-[2px] bg-gray-900" />

								<div className="w-full flex justify-start items-center">
									<div className="flex flex-col justify-center items-start gap-1">
										<span className="flex justify-start items-center gap-1">
											<BsCalendarDate className="text-lg text-blue-400" />
											<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
												Date of Birth
											</Typography>
										</span>
										<Typography className="capitalize font-body font-normal ml-5">
											{format(new Date(person?.dob), 'dd MMM yyyy')}
										</Typography>
									</div>
								</div>

								<div className="w-full flex justify-start items-center">
									<div className="flex flex-col justify-center items-start gap-1">
										<span className="flex justify-start items-center gap-1">
											<BsGlobeEuropeAfrica className="text-lg text-blue-400" />
											<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
												Country of Residence
											</Typography>
										</span>
										<Typography className="capitalize font-body font-normal ml-5">
											{person?.country}
										</Typography>
									</div>
								</div>

								<div className="w-full flex justify-start items-center">
									<div className="flex flex-col justify-center items-start gap-1">
										<span className="flex justify-start items-center gap-1">
											<RiPassportLine className="text-lg text-blue-400" />
											<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
												Passport Number
											</Typography>
										</span>
										<Typography className="capitalize font-body font-normal ml-5">
											{person?.passport_number}
										</Typography>
									</div>
								</div>

								<div className="w-full flex justify-start items-center">
									<div className="flex flex-col justify-center items-start gap-1">
										<span className="flex justify-start items-center gap-1">
											<MdDateRange className="text-lg text-blue-400" />
											<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
												Coverage Period
											</Typography>
										</span>
										<Typography className="capitalize font-body font-normal ml-5">
											{differenceInDays(
												new Date(person?.departure_date),
												new Date(person?.arrival_date)
											)}{' '}
											days
										</Typography>
									</div>
								</div>

								<div className="w-full flex justify-start items-center">
									<div className="flex flex-col justify-center items-start gap-1">
										<span className="flex justify-start items-center gap-1">
											<BsCalendarDate className="text-lg text-blue-400" />
											<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
												Insurance Start
											</Typography>
										</span>
										<Typography className="capitalize font-body font-normal ml-5">
											{format(new Date(person?.arrival_date), 'dd MMM yyyy')}
										</Typography>
									</div>
								</div>

								<div className="w-full flex justify-start items-center">
									<div className="flex flex-col justify-center items-start gap-1">
										<span className="flex justify-start items-center gap-1">
											<BsCalendarDateFill className="text-lg text-blue-400" />
											<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
												Insurance end
											</Typography>
										</span>
										<Typography className="capitalize font-body font-normal ml-5">
											{format(new Date(person?.departure_date), 'dd MMM yyyy')}
										</Typography>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<Link to="/">
				<Button size="lg" className="w-fit mt-8" type="button">
					Back to homepage
				</Button>
			</Link>
		</div>
	);
};

export default Ecard;
