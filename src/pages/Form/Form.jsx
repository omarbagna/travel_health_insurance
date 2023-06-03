import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import DefaultInput from '../../components/Input/DefaultInput';
import SelectInput from '../../components/Input/SelectInput';
import { format, formatDistance } from 'date-fns';
import { countries } from '../../data/countriesData';
import {
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
		name: 'postal / zip code',
		key: 'postal_zip',
	},
	{ name: 'city', key: 'city' },
	{ name: 'state', key: 'state' },
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

const Form = () => {
	const [formStep, setFormStep] = useState(1);
	const [applicantType, setApplicantType] = useState('other');
	const [cardNumber, setCardNumber] = useState('');
	const [basicData, setBasicData] = useState(null);

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
		formState: { isValid, isDirty },
		handleSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			start_date: '',
			end_date: '',
			country: '',
			insured_person: [
				{
					first_name: '',
					last_name: '',
					address: '',
					postal_zip: '',
					city: '',
					state: '',
				},
			],

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
			setValue(
				`applicant[${0}].address`,
				watch(`insured_person[${0}].address`),
				{ shouldValidate: true }
			);
			setValue(
				`applicant[${0}].postal_zip`,
				watch(`insured_person[${0}].postal_zip`),
				{ shouldValidate: true }
			);
			setValue(
				`applicant[${0}].country`,
				watch(`insured_person[${0}].country`),
				{ shouldValidate: true }
			);
			setValue(`applicant[${0}].city`, watch(`insured_person[${0}].city`), {
				shouldValidate: true,
			});
			setValue(`applicant[${0}].state`, watch(`insured_person[${0}].state`), {
				shouldValidate: true,
			});
		}
		if (applicantType === 'other') {
			setValue(`applicant[${0}].first_name`, '');
			setValue(`applicant[${0}].last_name`, '');
			setValue(`applicant[${0}].address`, '');
			setValue(`applicant[${0}].postal_zip`, '');
			setValue(`applicant[${0}].country`, '');
			setValue(`applicant[${0}].city`, '');
			setValue(`applicant[${0}].state`, '');
		}
	}, [setValue, applicantType]);

	useEffect(() => {
		if (basicData) {
			reset({
				start_date: basicData.start_date,
				end_date: basicData.end_date,
				country: basicData.country,
				insured_person: [
					{
						first_name: '',
						last_name: '',
						address: '',
						postal_zip: '',
						city: '',
						state: '',
					},
				],

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

	const submitForm = (data) => {
		window.alert(JSON.stringify(data, null, 2));
		goToNext();
	};

	return (
		<div className="w-full h-full flex flex-col justify-start items-center mt-20">
			<div className="w-2/3 rounded-lg shadow-2xl bg-white/60 backdrop-blur-md mx-auto">
				<div className="px-16 py-10">
					<form onSubmit={handleSubmit(submitForm)}>
						{formStep < MAX_STEPS && (
							<p>
								Step {formStep} of {MAX_STEPS}
							</p>
						)}

						{formStep === 1 && (
							<>
								<section className="flex flex-col gap-10">
									<span className="glyphicon glyphicon-">
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
									{fields.map((inputField, index) => (
										<div
											key={inputField.id}
											className="relative w-full h-full flex flex-col gap-10 justify-center items-center rounded-md shadow-inner border-2-lg bg-gray-50/10 p-4 py-10">
											<div className="w-full flex justify-center items-center gap-5">
												<Controller
													name={`insured_person[${index}].first_name`}
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
													name={`insured_person[${index}].last_name`}
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

											<Controller
												name={`insured_person[${index}].address`}
												control={control}
												//rules={{ required: 'Please enter address' }}
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
														//required
													/>
												)}
											/>

											<div className="w-full flex justify-center items-center gap-5">
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

												<Controller
													name={`insured_person[${index}].postal_zip`}
													control={control}
													rules={{ required: 'Please enter postal address' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Postal / Zip Code"
															type="text"
															required
														/>
													)}
												/>
											</div>

											<div className="w-full flex justify-center items-center gap-5">
												<Controller
													name={`insured_person[${index}].city`}
													control={control}
													rules={{ required: 'Please enter city' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="City"
															type="text"
															required
														/>
													)}
												/>

												<Controller
													name={`insured_person[${index}].state`}
													control={control}
													//rules={{ required: 'Please enter state' }}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<DefaultInput
															{...field}
															ref={ref}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="State"
															type="text"
															//required
														/>
													)}
												/>
											</div>

											{watch('insured_person')?.length > 1 ? (
												<div
													onClick={() => remove(index)}
													className="group absolute bottom-0 right-0 flex justify-center items-center transition-all duration-150 ease-in rounded-b-md h-5 lg:h-6  md:hover:h-8 w-full bg-red-400 hover:shadow-lg hover:shadow-red-400/50 hover:bg-red-500 cursor-pointer">
													<Typography
														variant="paragraph"
														color="white"
														className="transition-all duration-150 ease-in tracking-widest group-hover:tracking-normal text-center text-sm uppercase">
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
									<span className="flex justify-between items-center">
										<Typography
											variant="h2"
											className="font-title font-medium text-4xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
											Applicant
										</Typography>
										<Controller
											name="applicant_type"
											control={control}
											render={({ field: { onChange, ref, ...field } }) => (
												<FormControl
													{...field}
													ref={ref}
													onChange={(value) => {
														onChange(value);
														setApplicantType(value.target.value);
													}}
													name="applicant_type">
													<List className="flex-row px-0 shadow-inner rounded-lg">
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
													</List>
												</FormControl>
											)}
										/>
									</span>
									<div className="relative w-full h-full flex flex-col gap-10 justify-center items-center rounded-md shadow-inner border-2 bg-gray-50/10 p-4 py-10">
										<div className="w-full flex justify-center items-center gap-5">
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

										<div className="w-full flex justify-center items-center gap-5">
											<Controller
												name={`applicant[${0}].dob`}
												defaultValue={''}
												control={control}
												rules={{ required: 'Date is required.' }}
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
														type="date"
														max={format(new Date(), 'yyyy-MM-dd')}
														required
													/>
												)}
											/>
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
										</div>

										<Controller
											name={`applicant[${0}].email`}
											defaultValue={''}
											control={control}
											rules={{ required: 'Please enter address' }}
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
											name={`applicant[${0}].address`}
											defaultValue={
												watch('applicant_type') === 'self'
													? watch(`insured_person[0].address`)
													: ''
											}
											control={control}
											//rules={{ required: 'Please enter address' }}
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
													//required
												/>
											)}
										/>

										<div className="w-full flex justify-center items-center gap-5">
											<Controller
												control={control}
												name={`applicant[${0}].country`}
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

											<Controller
												name={`applicant[${0}].postal_zip`}
												defaultValue={
													watch('applicant_type') === 'self'
														? watch(`insured_person[0].postal_zip`)
														: ''
												}
												control={control}
												rules={{ required: 'Please enter postal address' }}
												render={({
													field: { ref, ...field },
													fieldState: { error, invalid },
												}) => (
													<DefaultInput
														{...field}
														ref={ref}
														error={invalid}
														helpertext={invalid ? error.message : null}
														label="Postal / Zip Code"
														type="text"
														required
													/>
												)}
											/>
										</div>

										<div className="w-full flex justify-center items-center gap-5">
											<Controller
												name={`applicant[${0}].city`}
												defaultValue={
													watch('applicant_type') === 'self'
														? watch(`insured_person[0].city`)
														: ''
												}
												control={control}
												rules={{ required: 'Please enter city' }}
												render={({
													field: { ref, ...field },
													fieldState: { error, invalid },
												}) => (
													<DefaultInput
														{...field}
														ref={ref}
														error={invalid}
														helpertext={invalid ? error.message : null}
														label="City"
														type="text"
														required
													/>
												)}
											/>

											<Controller
												name={`applicant[${0}].state`}
												defaultValue={
													watch('applicant_type') === 'self'
														? watch(`insured_person[0].state`)
														: ''
												}
												control={control}
												//rules={{ required: 'Please enter state' }}
												render={({
													field: { ref, ...field },
													fieldState: { error, invalid },
												}) => (
													<DefaultInput
														{...field}
														ref={ref}
														error={invalid}
														helpertext={invalid ? error.message : null}
														label="State"
														type="text"
														//required
													/>
												)}
											/>
										</div>
									</div>
								</section>
							</>
						)}

						{formStep === 2 && (
							<section className="flex flex-col gap-10">
								<div className="w-full flex justify-between items-center">
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
												{formatDistance(
													new Date(watch('end_date')),
													new Date(watch('start_date'))
												)}
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
											<div
												key={index}
												className="w-full grid grid-cols-2 gap-3 rounded-md p-3 shadow-md bg-white/50">
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
										))}
									</div>

									<div className="w-full flex flex-col justify-center items-start gap-6 rounded-md bg-blue-gray-100/10 shadow-inner p-3">
										<Typography variant="h4" className="text-blue-300">
											Applicant Details
										</Typography>
										<div className="w-full grid grid-cols-2 gap-3">
											{REVIEW_DATA.map(({ name, key }, index) => (
												<div key={index}>
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
										<Typography className="text-lg">
											{Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(60)}{' '}
											per insured person x {watch('insured_person').length}
										</Typography>
									</div>

									<div className="flex flex-col justify-center items-start gap-1">
										<Typography className="capitalize font-normal text-sm text-gray-700 border-b-2 border-blue-400">
											Total
										</Typography>
										<Typography className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
											{Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(60 * watch('insured_person').length)}
										</Typography>
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
