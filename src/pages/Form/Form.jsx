import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import DefaultInput from '../../components/Input/DefaultInput';
import SelectInput from '../../components/Input/SelectInput';
import { format, differenceInDays } from 'date-fns';
import { countries } from '../../data/countriesData';
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Button,
	Checkbox,
	List,
	ListItem,
	ListItemPrefix,
	Radio,
	Typography,
} from '@material-tailwind/react';
import { FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { BiCreditCardFront, BiTime } from 'react-icons/bi';
import { BsGlobeEuropeAfrica } from 'react-icons/bs';
import { RiSecurePaymentLine } from 'react-icons/ri';

const MAX_STEPS = 3;

const REVIEW_DATA = [
	{
		name: 'first name',
		key: 'first_name',
	},
	{
		name: 'last name',
		key: 'last_name',
	},
	{
		name: 'passport number',
		key: 'passport_number',
	},
	{
		name: 'Date of Birth',
		key: 'dob',
	},
	{
		name: 'email',
		key: 'email',
	},
	{
		name: 'telephone',
		key: 'telephone',
	},
	{
		name: 'address',
		key: 'address',
	},
	{
		name: 'country',
		key: 'country',
	},
	{
		name: 'company name',
		key: 'company_name',
	},
	{
		name: 'company address',
		key: 'company_address',
	},
	{
		name: 'company phone number',
		key: 'company_telephone',
	},
	{
		name: 'company email',
		key: 'company_email',
	},

	{
		name: 'emergency contact first name',
		key: 'emergency_contact_first_name',
	},
	{
		name: 'emergency contact last name',
		key: 'emergency_contact_last_name',
	},
	{
		name: 'emergency contact address',
		key: 'emergency_contact_address',
	},
	{
		name: 'emergency contact country',
		key: 'emergency_contact_country',
	},
	{
		name: 'emergency contact phone number',
		key: 'emergency_contact_telephone',
	},
	{
		name: 'arrival date in nigeria',
		key: 'arrival_date',
	},
	{
		name: 'departure date from nigeria',
		key: 'departure_date',
	},
	{ name: 'address in nigeria', key: 'address_nigeria' },
	{
		name: 'emergency contact in nigeria first name',
		key: 'emergency_contact_nigeria_first_name',
	},
	{
		name: 'emergency contact in nigeria last name',
		key: 'emergency_contact_nigeria_last_name',
	},
	{
		name: 'emergency contact in nigeria phone number',
		key: 'emergency_contact_nigeria_telephone',
	},
	{
		name: 'Pre-existing Medical Conditions',
		key: 'existing_conditions',
	},
	{
		name: 'allergies',
		key: 'allergies',
	},
];

function formatCardNumber(value) {
	const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
	const matches = val.match(/\d{4,16}/g);
	const match = (matches && matches[0]) || '';
	const parts = [];

	for (let i = 0, len = match.length; i < len; i += 4) {
		parts.push(match.substring(i, i + 4));
	}

	if (parts.length) {
		return parts.join(' ');
	} else {
		return value;
	}
}

function Icon({ id, open }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`${
				id === open ? 'rotate-180' : ''
			} h-5 w-5 transition-transform`}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	);
}

const Form = () => {
	const [formStep, setFormStep] = useState(1);
	const [applicantType, setApplicantType] = useState('other');
	const [cardNumber, setCardNumber] = useState('');
	const [basicData, setBasicData] = useState(null);
	const [open, setOpen] = useState(1);

	useEffect(() => {
		const data = window.localStorage.getItem('basicData');
		if (data !== null) setBasicData(JSON.parse(data));
	}, []);

	const goToNext = () => {
		setFormStep((prev) => prev + 1);
	};
	const goToPrevious = () => {
		setFormStep((prev) => prev - 1);
	};

	const {
		watch,
		control,
		setValue,
		reset,
		formState: { isValid },
		handleSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			start_date: '',
			end_date: '',
			country: '',
			insured_person: [{}],

			applicant_type: 'other',
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'insured_person',
		rules: { maxLength: 5 },
	});

	useEffect(() => {
		if (applicantType === 'self') {
			setValue(
				`applicant[${0}].first_name`,
				watch(`insured_person[${0}].first_name`),
				{ shouldValidate: true }
			);
			setValue(
				`applicant[${0}].last_name`,
				watch(`insured_person[${0}].last_name`),
				{ shouldValidate: true }
			);
			setValue(`applicant[${0}].email`, watch(`insured_person[${0}].email`), {
				shouldValidate: true,
			});
			setValue(
				`applicant[${0}].telephone`,
				watch(`insured_person[${0}].telephone`),
				{ shouldValidate: true }
			);
		}
		if (applicantType === 'other' || applicantType === 'company') {
			setValue(`applicant[${0}].first_name`, '');
			setValue(`applicant[${0}].last_name`, '');
			setValue(`applicant[${0}].telephone`, '');
			setValue(`applicant[${0}].email`, '');
		}
	}, [setValue, applicantType]);

	useEffect(() => {
		if (basicData) {
			reset({
				start_date: basicData.start_date,
				end_date: basicData.end_date,
				country: basicData.country,
				insured_person: [{}],

				applicant_type: 'other',
			});
		}
	}, [reset, basicData]);

	const renderButton = () => {
		if (formStep > 3) {
			return null;
		} else if (formStep === 3) {
			return (
				<div className="w-full flex flex-col gap-1 justify-center items-center mt-8">
					<Button type="submit" size="lg" className="w-full">
						Pay Now
					</Button>
					<Typography
						variant="small"
						color="gray"
						className="mt-2 flex items-center justify-center gap-2 font-normal opacity-60">
						<RiSecurePaymentLine className="-mt-0.5 h-4 w-4" /> Payments are
						secure and encrypted
					</Typography>
				</div>
			);
		} else if (formStep === 2) {
			return (
				<div className="w-full flex justify-center items-center gap-5 mt-8">
					<Button
						size="lg"
						className="w-full"
						onClick={goToPrevious}
						color="cyan"
						variant="outlined"
						type="button">
						Back
					</Button>
					<Button
						size="lg"
						className="w-full"
						disabled={!isValid}
						onClick={goToNext}
						type="button">
						{' '}
						Proceed to Payment
					</Button>
				</div>
			);
		} else if (formStep === 1) {
			return (
				<Button
					size="lg"
					className="w-full mt-8"
					disabled={!isValid}
					onClick={goToNext}
					type="button">
					Next
				</Button>
			);
		} else {
			return (
				<div className="w-full flex justify-center items-center gap-5 mt-8">
					<Button
						size="lg"
						className="w-full"
						onClick={goToPrevious}
						color="cyan"
						variant="outlined"
						type="button">
						Back
					</Button>
					<Button
						size="lg"
						className="w-full"
						disabled={!isValid}
						onClick={goToNext}
						type="button">
						Next
					</Button>
				</div>
			);
		}
	};

	const handleOpen = (value) => {
		setOpen(open === value ? 0 : value);
	};
	const customAnimation = {
		mount: { scale: 1 },
		unmount: { scale: 0.9 },
	};

	const submitForm = (data) => {
		window.alert(JSON.stringify(data, null, 2));
		goToNext();
	};

	return (
		<div className="w-full h-full flex flex-col justify-start items-center mt-20">
			<div className="w-5/6 md:w-2/3 rounded-lg shadow-2xl bg-white/60 backdrop-blur-md mx-auto">
				<div className="px-8 py-10">
					<form onSubmit={handleSubmit(submitForm)}>
						{formStep < MAX_STEPS && (
							<p>
								Step {formStep} of {MAX_STEPS}
							</p>
						)}

						{formStep === 1 && (
							<>
								<section className="flex flex-col gap-10">
									<div className="w-full flex flex-wrap-reverse gap-3 justify-between items-center">
										<span className="">
											<Typography
												variant="h2"
												className="font-title font-medium text-4xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
												Insured Person
											</Typography>
											<Typography
												variant="paragraph"
												className="text-sm text-gray-500">
												You can add up to 5 people
											</Typography>
										</span>
										<div className="w-fit flex justify-center items-center gap-5 p-3 rounded-md shadow-md">
											<div className="flex flex-col justify-center items-start gap-2">
												<span className="flex justify-start items-center gap-1">
													<BiTime className="text-lg text-gray-700" />
													<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
														Duration
													</Typography>
												</span>
												<Typography>
													{basicData &&
														differenceInDays(
															new Date(basicData.end_date),
															new Date(basicData.start_date)
														)}{' '}
													Days
												</Typography>
											</div>
											<div className="flex flex-col justify-center items-start gap-2">
												<span className="flex justify-start items-center gap-1">
													<BsGlobeEuropeAfrica className="text-lg text-gray-700" />
													<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
														Country of Residence
													</Typography>
												</span>
												<Typography>{watch('country')} </Typography>
											</div>
										</div>
									</div>
									{fields.map((inputField, index) => (
										<div
											key={inputField.id}
											className="relative w-full h-full flex flex-col gap-5 justify-center items-center rounded-md shadow-inner border-2-lg bg-gray-50/10 p-4 py-10">
											<div className="w-full h-fit p-2 gap-10 flex flex-col justify-start items-start rounded-md shadow-sm bg-blue-gray-100/30">
												<Typography
													variant="h4"
													className="w-full text-left font-title font-medium text-xl text-blue-400">
													Personal Information
												</Typography>
												<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
													<Controller
														name={`insured_person[${index}].first_name`}
														control={control}
														defaultValue={''}
														rules={{ required: 'Please enter first name' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="First Name"
																type="text"
																required
															/>
														)}
													/>
													<Controller
														name={`insured_person[${index}].last_name`}
														control={control}
														defaultValue={''}
														rules={{ required: 'Please enter last name' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Last Name"
																type="text"
																required
															/>
														)}
													/>
												</div>

												<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
													<Controller
														name={`insured_person[${index}].dob`}
														control={control}
														defaultValue={''}
														rules={{ required: 'Please specify date of birth' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Date of Birth"
																max={format(new Date(), 'yyyy-MM-dd')}
																type="date"
																required
															/>
														)}
													/>

													<Controller
														control={control}
														name={`insured_person[${index}].country`}
														defaultValue={watch('country')}
														rules={{ required: 'Please select country' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<SelectInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Country of Residence *"
																options={countries}
																required
															/>
														)}
													/>
												</div>

												<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
													<Controller
														name={`insured_person[${index}].passport_number`}
														control={control}
														defaultValue={''}
														rules={{ required: 'Please enter passport number' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Passport Number"
																type="text"
																required
															/>
														)}
													/>
												</div>
											</div>
											<div className="w-full h-fit p-2 gap-10 flex flex-col justify-start items-start rounded-md shadow-sm bg-blue-gray-100/30">
												<Typography
													variant="h4"
													className="w-full text-left font-title font-medium text-xl text-blue-400">
													Contact Information
												</Typography>
												<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
													<Controller
														name={`insured_person[${index}].email`}
														control={control}
														defaultValue={''}
														rules={{ required: 'Please enter email' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Email"
																type="email"
																required
															/>
														)}
													/>
													<Controller
														name={`insured_person[${index}].telephone`}
														control={control}
														rules={{
															required: 'Please enter telephone number',
														}}
														defaultValue={''}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Phone Number"
																type="tel"
																required
															/>
														)}
													/>
												</div>

												<Controller
													name={`insured_person[${index}].address`}
													control={control}
													defaultValue={''}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Address in Home Country"
															type="text"
														/>
													)}
												/>

												<div className="w-full h-fit p-2 gap-10 flex flex-col justify-start items-start rounded-md shadow-sm bg-red-100/30">
													<Typography
														variant="h4"
														className="w-full text-left text-lg ">
														<mark className="p-2 font-title font-medium rounded-md bg-red-300 text-white">
															Emergency Contact Information
														</mark>
													</Typography>
													<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
														<Controller
															name={`insured_person[${index}].emergency_contact_first_name`}
															control={control}
															defaultValue={''}
															rules={{ required: 'Please enter first name' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="First Name"
																	type="text"
																	required
																/>
															)}
														/>
														<Controller
															name={`insured_person[${index}].emergency_contact_last_name`}
															control={control}
															defaultValue={''}
															rules={{ required: 'Please enter last name' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Last Name"
																	type="text"
																	required
																/>
															)}
														/>
													</div>

													<Controller
														name={`insured_person[${index}].emergency_contact_address`}
														control={control}
														defaultValue={''}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Address"
																type="text"
															/>
														)}
													/>

													<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
														<Controller
															control={control}
															name={`insured_person[${index}].emergency_contact_country`}
															defaultValue={watch('country')}
															rules={{ required: 'Please select country' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<SelectInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Country"
																	options={countries}
																	required
																/>
															)}
														/>

														<Controller
															name={`insured_person[${index}].emergency_contact_telephone`}
															control={control}
															defaultValue={''}
															rules={{ required: 'Please enter phone number' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Phone Number"
																	type="tel"
																	required
																/>
															)}
														/>
													</div>
												</div>
											</div>
											<div className="w-full h-fit p-2 gap-10 flex flex-col justify-start items-start rounded-md shadow-sm bg-blue-gray-100/30">
												<Typography
													variant="h4"
													className="w-full text-left font-title font-medium text-xl text-blue-400">
													Travel Information
												</Typography>
												<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
													<Controller
														name={`insured_person[${index}].arrival_date`}
														control={control}
														defaultValue={watch('start_date')}
														//rules={{ required: 'Date is required.' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Arrival date in Nigeria"
																type="date"
																labelProps={{ style: { color: '#617D8B' } }}
																disabled
																//required
															/>
														)}
													/>
													<Controller
														name={`insured_person[${index}].departure_date`}
														control={control}
														defaultValue={watch('end_date')}
														//rules={{ required: 'Date is required.' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Departure date from Nigeria"
																type="date"
																/*
																min={watch(
																	`insured_person[${index}].arrival_date`
																)}
																max={format(
																	add(
																		new Date(
																			watch(
																				`insured_person[${index}].arrival_date`
																			)
																		),
																		{
																			days: 90,
																		}
																	),
																	'yyyy-MM-dd'
																)}
																*/
																labelProps={{ style: { color: '#617D8B' } }}
																disabled
																//required
															/>
														)}
													/>
												</div>

												<Controller
													name={`insured_person[${index}].address_nigeria`}
													control={control}
													defaultValue={''}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Address in Nigeria"
															type="text"
														/>
													)}
												/>

												<div className="w-full h-fit p-2 gap-10 flex flex-col justify-start items-start rounded-md shadow-sm bg-red-100/30">
													<Typography
														variant="h4"
														className="w-full text-left text-lg ">
														<mark className="p-2 font-title font-medium rounded-md bg-red-300 text-white">
															Emergency Contact in Nigeria
														</mark>
													</Typography>
													<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
														<Controller
															name={`insured_person[${index}].emergency_contact_nigeria_first_name`}
															control={control}
															defaultValue={''}
															rules={{ required: 'Please enter first name' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="First Name"
																	type="text"
																	required
																/>
															)}
														/>
														<Controller
															name={`insured_person[${index}].emergency_contact_nigeria_last_name`}
															control={control}
															defaultValue={''}
															rules={{ required: 'Please enter last name' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Last Name"
																	type="text"
																	required
																/>
															)}
														/>
													</div>

													<Controller
														name={`insured_person[${index}].emergency_contact_nigeria_telephone`}
														control={control}
														defaultValue={''}
														rules={{ required: 'Please enter phone number' }}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Phone Number"
																type="tel"
																required
															/>
														)}
													/>
												</div>
											</div>
											<div className="w-full h-fit p-2 gap-10 flex flex-col justify-start items-start rounded-md shadow-sm bg-blue-gray-100/30">
												<Typography
													variant="h4"
													className="w-full text-left font-title font-medium text-xl text-blue-400">
													Health Information
												</Typography>
												<div className="w-full grid grid-cols-1 gap-5">
													<Controller
														name={`insured_person[${index}].existing_conditions`}
														control={control}
														defaultValue={''}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Pre-existing Medical Conditions"
																type="text-area"
															/>
														)}
													/>
													<Controller
														name={`insured_person[${index}].allergies`}
														control={control}
														defaultValue={''}
														render={({
															field: { ref, ...field },
															fieldState: { error, invalid },
														}) => (
															<DefaultInput
																{...field}
																ref={ref}
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Allergies"
																type="text-area"
															/>
														)}
													/>
												</div>
											</div>

											{watch('insured_person')?.length > 1 ? (
												<div
													onClick={() => remove(index)}
													className="group absolute bottom-0 right-0 flex justify-center items-center transition-all duration-150 ease-in rounded-b-md h-5 lg:h-6  md:hover:h-8 w-full bg-red-400 hover:shadow-lg hover:shadow-red-400/50 hover:bg-red-500 cursor-pointer">
													<Typography
														variant="paragraph"
														color="white"
														className="transition-all duration-150 ease-in tracking-wider group-hover:tracking-widest text-center text-sm font-bold uppercase">
														remove
													</Typography>
												</div>
											) : null}
										</div>
									))}

									{watch('insured_person')?.length !== 5 ? (
										<div className="w-full flex justify-end items-start">
											<Button
												type="button"
												variant="text"
												size="lg"
												className="bg-cyan-100/20"
												onClick={() =>
													append({
														first_name: '',
														last_name: '',
														country: watch('country'),
														address: '',
														postal_zip: '',
														city: '',
														state: '',
													})
												}
												color="cyan">
												add new
											</Button>
										</div>
									) : null}
								</section>

								<section className="flex flex-col gap-10 mt-20">
									<span className="flex flex-wrap xl:flex-nowrap justify-between items-center gap-2 xl:gap-20">
										<Typography
											variant="h2"
											className="font-title font-medium text-4xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
											Applicant
										</Typography>
										<div className="w-full">
											<Controller
												name="applicant_type"
												control={control}
												render={({ field: { onChange, ref, ...field } }) => (
													<FormControl
														{...field}
														ref={ref}
														className="w-full"
														onChange={(value) => {
															onChange(value);
															setApplicantType(value.target.value);
														}}
														name="applicant_type">
														<List className="flex-row flex-wrap lg:flex-nowrap px-0 shadow-inner rounded-lg w-full">
															<ListItem className="p-0">
																<label
																	htmlFor="self"
																	className="px-3 py-2 flex items-center w-full cursor-pointer">
																	<ListItemPrefix className="mr-3">
																		<Radio
																			name="applicant_type"
																			id="self"
																			ripple={false}
																			value="self"
																			className="hover:before:opacity-0"
																			containerProps={{
																				className: 'p-0',
																			}}
																		/>
																	</ListItemPrefix>
																	<Typography
																		color="blue-gray"
																		className="font-medium">
																		Self
																	</Typography>
																</label>
															</ListItem>
															<ListItem className="p-0">
																<label
																	htmlFor="other"
																	className="px-3 py-2 flex items-center w-full cursor-pointer">
																	<ListItemPrefix className="mr-3">
																		<Radio
																			name="applicant_type"
																			id="other"
																			defaultChecked
																			value="other"
																			ripple={false}
																			className="hover:before:opacity-0"
																			containerProps={{
																				className: 'p-0',
																			}}
																		/>
																	</ListItemPrefix>
																	<Typography
																		color="blue-gray"
																		className="font-medium">
																		Other
																	</Typography>
																</label>
															</ListItem>
															<ListItem className="p-0">
																<label
																	htmlFor="company"
																	className="px-3 py-2 flex items-center w-full cursor-pointer">
																	<ListItemPrefix className="mr-3">
																		<Radio
																			name="applicant_type"
																			id="company"
																			value="company"
																			ripple={false}
																			className="hover:before:opacity-0"
																			containerProps={{
																				className: 'p-0',
																			}}
																		/>
																	</ListItemPrefix>
																	<Typography
																		color="blue-gray"
																		className="font-medium">
																		Company
																	</Typography>
																</label>
															</ListItem>
														</List>
													</FormControl>
												)}
											/>
										</div>
									</span>
									{watch('applicant_type') === 'self' ||
									watch('applicant_type') === 'other' ? (
										<div className="relative w-full h-full flex flex-col gap-10 justify-center items-center rounded-md shadow-inner border-2 bg-gray-50/10 p-4 py-10">
											<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
												<Controller
													name={`applicant[${0}].first_name`}
													defaultValue={
														watch('applicant_type') === 'self'
															? watch(`insured_person[0].first_name`)
															: ''
													}
													control={control}
													rules={{ required: 'Please enter first name' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="First Name"
															type="text"
															required
														/>
													)}
												/>
												<Controller
													name={`applicant[${0}].last_name`}
													defaultValue={
														watch('applicant_type') === 'self'
															? watch(`insured_person[0].last_name`)
															: ''
													}
													control={control}
													rules={{ required: 'Please enter last name' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Last Name"
															type="text"
															required
														/>
													)}
												/>
											</div>

											<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
												<Controller
													name={`applicant[${0}].telephone`}
													defaultValue={''}
													control={control}
													rules={{ required: 'Please enter phone number' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Phone number"
															type="tel"
															required
														/>
													)}
												/>
												<Controller
													name={`applicant[${0}].email`}
													defaultValue={''}
													control={control}
													rules={{ required: 'Please enter email address' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Email"
															type="email"
															required
														/>
													)}
												/>
											</div>
										</div>
									) : (
										<div className="relative w-full h-full flex flex-col gap-10 justify-center items-center rounded-md shadow-inner border-2 bg-gray-50/10 p-4 py-10">
											<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
												<Controller
													name={`applicant[${0}].company_name`}
													defaultValue={''}
													control={control}
													rules={{ required: 'Please enter company name' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Company Name"
															type="text"
															required
														/>
													)}
												/>
												<Controller
													name={`applicant[${0}].company_address`}
													defaultValue={''}
													control={control}
													rules={{ required: 'Please enter company address' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Company address"
															type="text"
															required
														/>
													)}
												/>
											</div>

											<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
												<Controller
													name={`applicant[${0}].company_telephone`}
													defaultValue={''}
													control={control}
													rules={{
														required: 'Please enter company phone number',
													}}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Company Phone number"
															type="tel"
															required
														/>
													)}
												/>
												<Controller
													name={`applicant[${0}].company_email`}
													defaultValue={''}
													control={control}
													rules={{ required: 'Please enter company email' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Company Email"
															type="email"
															required
														/>
													)}
												/>
											</div>
										</div>
									)}
								</section>
							</>
						)}

						{formStep === 2 && (
							<section className="flex flex-col gap-10">
								<div className="w-full flex flex-wrap-reverse gap-3 justify-between items-center">
									<Typography
										variant="h2"
										className="font-title font-medium text-4xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
										Review and Accept Terms
									</Typography>

									<div className="w-fit flex justify-center items-center gap-5 p-3 rounded-md shadow-md">
										<div className="flex flex-col justify-center items-start gap-2">
											<span className="flex justify-start items-center gap-1">
												<BiTime className="text-lg text-gray-700" />
												<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
													Duration
												</Typography>
											</span>
											<Typography>
												{basicData &&
													differenceInDays(
														new Date(basicData.end_date),
														new Date(basicData.start_date)
													)}{' '}
												Days
											</Typography>
										</div>
										<div className="flex flex-col justify-center items-start gap-2">
											<span className="flex justify-start items-center gap-1">
												<BsGlobeEuropeAfrica className="text-lg text-gray-700" />
												<Typography className="capitalize font-normal text-xs text-gray-700 border-b-2 border-blue-400">
													Country of Residence
												</Typography>
											</span>
											<Typography>{watch('country')} </Typography>
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-8">
									<div className="w-full flex flex-col justify-center items-start gap-6 rounded-md bg-blue-gray-100/10 shadow-inner p-3">
										<Typography variant="h4" className="text-blue-400">
											Insured Person Details
										</Typography>

										{watch(`insured_person`).map((person, index) => (
											<Accordion
												animate={customAnimation}
												key={index}
												icon={<Icon id={index + 1} open={open} />}
												open={open === index + 1}
												className="border border-blue-gray-100 px-4 rounded-lg mb-2">
												<AccordionHeader
													onClick={() => handleOpen(index + 1)}
													className={`border-b-0 transition-colors font-semibold font-title text-base ${
														open === index + 1
															? 'text-blue-500 hover:!text-blue-700'
															: ''
													}`}>
													Person {index + 1}
												</AccordionHeader>
												<AccordionBody className="text-base font-normal pt-0">
													<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 rounded-md p-3 shadow-sm bg-white/50">
														{REVIEW_DATA.map(({ name, key }, index) => (
															<div
																className={person[key] ? 'block' : 'hidden'}
																key={index}>
																<Typography
																	variant="paragraph"
																	className="capitalize font-normal text-xs text-gray-500">
																	{name}
																</Typography>
																<Typography
																	variant="h6"
																	className="font-medium text-lg">
																	{person[key]}
																</Typography>
															</div>
														))}
													</div>
												</AccordionBody>
											</Accordion>
										))}
									</div>

									<div className="w-full flex flex-col justify-center items-start gap-6 rounded-md bg-blue-gray-100/10 shadow-inner p-3">
										<Typography variant="h4" className="text-blue-300">
											Applicant Details
										</Typography>
										<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
											{REVIEW_DATA.map(({ name, key }, index) => (
												<div
													key={index}
													className={
														watch(`applicant[${0}].${key}`) ? 'block' : 'hidden'
													}>
													<Typography
														variant="paragraph"
														className="capitalize font-normal text-xs text-gray-500">
														{name}
													</Typography>
													<Typography
														variant="h6"
														className="font-medium text-lg">
														{watch(`applicant[${0}].${key}`)}
													</Typography>
												</div>
											))}
										</div>
									</div>
								</div>

								<div className="block ">
									<Controller
										control={control}
										name={'terms_and_conditions'}
										rules={{ required: 'Please accept terms and conditions' }}
										render={({
											field: { ref, ...field },
											fieldState: { error, invalid },
										}) => (
											<>
												<FormControlLabel
													control={
														<Checkbox
															{...field}
															ref={ref}
															color="blue"
															checked={watch(`terms_and_conditions`)}
														/>
													}
													label={'I accept the terms and conditions'}
												/>
												<FormHelperText error>
													{invalid ? error.message : null}
												</FormHelperText>
											</>
										)}
									/>
								</div>

								<div className="w-full flex items-center justify-between gap-5 p-3 rounded-md shadow-md">
									<div className="flex flex-col justify-center items-start gap-1">
										<Typography className="capitalize font-normal text-sm text-gray-700 border-b-2 border-blue-400">
											Basic Plan
										</Typography>
										{basicData &&
										differenceInDays(
											new Date(basicData.end_date),
											new Date(basicData.start_date)
										) <= '30' ? (
											<Typography className="text-lg">
												{Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(45)}{' '}
												per insured person x {watch('insured_person').length}
											</Typography>
										) : (
											<Typography className="text-lg">
												{Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(80)}{' '}
												per insured person x {watch('insured_person').length}
											</Typography>
										)}
									</div>

									<div className="flex flex-col justify-center items-start gap-1">
										<Typography className="capitalize font-normal text-sm text-gray-700 border-b-2 border-blue-400">
											Total
										</Typography>
										{basicData &&
										differenceInDays(
											new Date(basicData.end_date),
											new Date(basicData.start_date)
										) <= '30' ? (
											<Typography className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
												{Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(45 * watch('insured_person').length)}
											</Typography>
										) : (
											<Typography className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
												{Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(80 * watch('insured_person').length)}
											</Typography>
										)}
									</div>
								</div>
							</section>
						)}

						{formStep === 3 && (
							<section className="flex flex-col gap-10">
								<Typography
									variant="h2"
									className="font-title font-medium text-4xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
									Payment Details
								</Typography>
								<div className="w-full flex flex-col justify-center items-center gap-3">
									<Controller
										name="card_number"
										defaultValue={''}
										control={control}
										rules={{ required: 'Card number is required.' }}
										render={({
											field: { ref, ...field },
											fieldState: { error, invalid },
										}) => (
											<DefaultInput
												{...field}
												ref={ref}
												error={invalid}
												helpertext={invalid ? error.message : null}
												required
												label="Card Number"
												maxLength={19}
												value={formatCardNumber(cardNumber)}
												onChange={(event) => setCardNumber(event.target.value)}
												icon={
													<BiCreditCardFront className="h-5 w-5 text-blue-gray-300" />
												}
											/>
										)}
									/>
									<div className="w-full my-4 flex items-center gap-4">
										<Controller
											name="expiry_month"
											defaultValue={''}
											control={control}
											rules={{ required: 'Card expiry is required.' }}
											render={({
												field: { ref, ...field },
												fieldState: { error, invalid },
											}) => (
												<DefaultInput
													{...field}
													ref={ref}
													error={invalid}
													helpertext={invalid ? error.message : null}
													required
													label="Expires"
													type="month"
													containerProps={{ className: 'min-w-[72px]' }}
												/>
											)}
										/>

										<Controller
											name="card_cvc"
											defaultValue={''}
											control={control}
											rules={{ required: 'Card CVC is required.' }}
											render={({
												field: { ref, ...field },
												fieldState: { error, invalid },
											}) => (
												<DefaultInput
													{...field}
													ref={ref}
													error={invalid}
													helpertext={invalid ? error.message : null}
													required
													label="CVC"
													type="text"
													maxLength={4}
													containerProps={{ className: 'min-w-[72px]' }}
												/>
											)}
										/>
									</div>
									<Controller
										name="card_holder_name"
										defaultValue={''}
										control={control}
										rules={{ required: 'Card holder name is required.' }}
										render={({
											field: { ref, ...field },
											fieldState: { error, invalid },
										}) => (
											<DefaultInput
												{...field}
												ref={ref}
												error={invalid}
												helpertext={invalid ? error.message : null}
												required
												label="Holder Name"
											/>
										)}
									/>
								</div>
							</section>
						)}

						{renderButton()}
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
