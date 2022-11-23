import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from "react";

type Hello = {
	children: React.ReactNode;
};
interface IWordleContext {
	minimized: boolean;
	setMinimized: Dispatch<SetStateAction<boolean>>;
}
const WordleContext = createContext<IWordleContext>({} as IWordleContext);
export default function StateContext({ children }: Hello) {
	const [minimized, setMinimized] = useState(false);
	<WordleContext.Provider
		value={{
			minimized,
			setMinimized,
		}}
	>
		{children}
	</WordleContext.Provider>;
}

export const useStateContext = () => useContext(WordleContext);
