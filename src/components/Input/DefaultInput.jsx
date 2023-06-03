import { Input, Textarea, Typography } from '@material-tailwind/react';
import React from 'react';

const DefaultInput = React.forwardRef((props, ref) => {
	const { onChange, name, type, rules, helpertext, error } = props;

	return (
		<>
			{type === 'text-area' ? (
				<div className="flex flex-col gap-1 w-full justify-start items-start">
					<Textarea
						{...rules}
						{...props}
						ref={ref}
						name={name}
						error={error}
						onChange={onChange}
						variant="static"
						size="lg"
						//fullWidth
					/>
					{error && (
						<Typography className="text-xs text-red-400">
							{helpertext}
						</Typography>
					)}
				</div>
			) : (
				<div className="flex flex-col gap-1 w-full justify-start items-start">
					<Input
						{...rules}
						{...props}
						ref={ref}
						name={name}
						type={type}
						error={error}
						onChange={onChange}
						variant="static"
						size="md"
						//fullWidth
					/>
					{error && (
						<Typography className="text-xs text-red-400">
							{helpertext}
						</Typography>
					)}
				</div>
			)}
		</>
	);
});

export default DefaultInput;
