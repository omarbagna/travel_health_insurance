import { Controller, useForm } from 'react-hook-form';
import DefaultInput from '../../../components/Input/DefaultInput';
import SelectInput from '../../../components/Input/SelectInput';
import { add, format } from 'date-fns';
import { countries } from '../../../data/countriesData';
import { Button, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const Form = () => {
	const navigate = useNavigate();
	const {
		watch,
		control,
		formState: { isValid },
		handleSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			start_date: format(new Date(), 'yyyy-MM-dd'),
			end_date: format(add(new Date(), { days: 90 }), 'yyyy-MM-dd'),
			country: '',
		},
	});

	const submitForm = (data) => {
		window.localStorage.setItem('basicData', JSON.stringify(data));
		navigate('/application');
	};

	return (
		<div className="w-full h-full flex flex-col justify-center items-center mt-20 z-20">
			<div className="w-2/3 rounded-lg shadow-2xl bg-white/80 backdrop-blur-sm mx-auto">
				<div className="px-8 py-10">
					<form onSubmit={handleSubmit(submitForm)}>
						<section className="w-full flex flex-col gap-10">
							<Typography
								variant="h2"
								className="font-title font-medium text-4xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-blue-400">
								{' '}
								Get insured today!
							</Typography>
							<div className="flex flex-col justify-start items-start gap-2">
								<div className="w-full flex flex-wrap md:flex-nowrap justify-center items-center gap-4">
									<Controller
										name="start_date"
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
												label="Arrival date in Nigeria"
												type="date"
												min={format(new Date(), 'yyyy-MM-dd')}
												required
											/>
										)}
									/>
									<Controller
										name="end_date"
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
												label="Departure date from Nigeria"
												type="date"
												min={watch('start_date')}
												max={format(
													add(new Date(watch('start_date')), { days: 90 }),
													'yyyy-MM-dd'
												)}
												required
											/>
										)}
									/>
								</div>

								<Typography
									variant="small"
									className="font-body font-light text-xs text-gray-500">
									<strong>NB:</strong> Arrival to departure dates must be within
									90 days
								</Typography>
							</div>

							<Controller
								control={control}
								name="country"
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

							<Button
								size="lg"
								className="w-full"
								disabled={!isValid}
								type="submit">
								Get Started
							</Button>
						</section>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
