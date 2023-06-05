import { Route, Routes, useLocation } from 'react-router-dom';
import { Ecard, Form, Home } from './pages';
import NavBar from './components/Navbar/Navbar';

function App() {
	const location = useLocation();

	return (
		<div className="w-screen h-screen flex flex-col items-center overflow-y-auto overflow-x-hidden">
			<NavBar />
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="/application" element={<Form />} />
				<Route path="/e-card" element={<Ecard />} />
			</Routes>
		</div>
	);
}

export default App;
