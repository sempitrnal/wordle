import Nav from "./Wordle/Nav";
import Wordle from "./Wordle/Wordle";

function App() {
	return (
		<div className="flex flex-col items-center justify-between w-screen overflow-hidden">
			<Nav />
			<Wordle />
		</div>
	);
}

export default App;
