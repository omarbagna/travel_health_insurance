import Form from './sections/Form';
import Header from './sections/Header';

const Home = () => {
	return (
		<div className="my-20 w-full h-full flex flex-col lg:flex-row justify-center items-center">
			<Header />
			<Form />
		</div>
	);
};

export default Home;
