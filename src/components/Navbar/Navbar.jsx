import React from 'react';
import {
	Navbar,
	MobileNav,
	Typography,
	Button,
	IconButton,
} from '@material-tailwind/react';
import { BsGlobeEuropeAfrica } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function NavBar() {
	const [openNav, setOpenNav] = React.useState(false);

	React.useEffect(() => {
		window.addEventListener(
			'resize',
			() => window.innerWidth >= 960 && setOpenNav(false)
		);
	}, []);

	return (
		<>
			<Navbar className="sticky inset-0 z-50 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className="flex justify-start items-center gap-2 mr-4 cursor-pointer text-base py-1.5 pr-1.5 font-semibold w-fit border-r-2 text-gray-900">
						<div className="w-full h-10 relative flex justify-end items-center">
							<Typography className="font-card text-xl font-black w-full text-right">
								LTHI
							</Typography>
							<div className="absolute w-10 h-full bg-blue-400 top-1/2 -translate-y-1/2 -left-12" />
						</div>
					</Link>
					<div className="flex items-center gap-4">
						<Button variant="text" size="lg" className="hidden lg:inline-block">
							<span>Sign In</span>
						</Button>
						<IconButton
							variant="text"
							className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
							ripple={false}
							onClick={() => setOpenNav(!openNav)}>
							{openNav ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									className="h-6 w-6"
									viewBox="0 0 24 24"
									stroke="#1c1c1c"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									stroke="#1c1c1c"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</IconButton>
					</div>
				</div>
				<MobileNav open={openNav}>
					<Button variant="gradient" size="sm" fullWidth className="mb-2">
						<span>Sign In</span>
					</Button>
				</MobileNav>
			</Navbar>
		</>
	);
}
