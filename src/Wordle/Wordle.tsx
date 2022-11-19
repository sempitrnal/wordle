import React, { useEffect, useState } from "react";
import Row from "./Row";
import dic from "./dic.json";
import { keys } from "./keys";
const Wordle = () => {
	const words = Object.keys(dic).filter((e) => e.length === 5);

	const row = Array.from(Array(6).keys());
	const col = Array.from(Array(5).keys());

	//word to be guessed
	const [word, setWord] = useState(
		words[Math.floor(Math.random() * words.length)]
	);

	// col array
	const [arr, setArr] = useState<string[]>(col.map((e) => ""));

	// row array
	const [rowArray, setRowArray] = useState<string[][]>(row.map((e, i) => arr));

	// if guessed set this to true
	const [win, setWin] = useState<boolean>(false);

	// enter pressed, animation starts, disable event for performance purposes
	const [processing, setProcessing] = useState<boolean>(false);

	//current row of the guessing shit
	const [currentRow, setCurrentRow] = useState<number>(0);

	// current index in the current row
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	// current row guess array
	const [guessArray, setGuessArray] = useState<string[]>(col.map((e) => ""));

	// results array
	const [results, setResults] = useState<string[][]>([[], [], [], [], [], []]);

	//if enter pressed error handler
	const [error, setError] = useState<string>("");

	const enter = () => {
		if (words.includes(guessArray.join(""))) {
			if (guessArray.every((e) => e !== "")) {
				setProcessing(true);
				setTimeout(() => {
					setProcessing(false);
				}, 2500);
				let oten: string[] = guessArray.map((e, ind) => {
					if (word.includes(e)) {
						if (word.charAt(ind) === e) return "korek";
						else return "sayop_place";
					} else return "sayop";
				});
				let newobj = results.map((e, i) => {
					if (i === currentRow) {
						return oten;
					} else return e;
				});
				setResults(newobj);
				if (oten.every((e) => e === "korek")) setWin(true);
				setCurrentRow(currentRow + 1);
				setCurrentIndex(0);
				setGuessArray(col.map((e) => ""));
			}
		} else {
			setError("not_in_list");
			setTimeout(() => {
				setError("");
			}, 300);
		}
	};
	const backspace = () => {
		setGuessArray((prev) =>
			prev.map((elem, i) => {
				if (currentIndex - 1 === i) return "";
				else {
					return elem;
				}
			})
		);
		if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
	};
	const add = (e: any) => {
		if (currentIndex < 5) {
			if (guessArray.every((e) => e !== "")) {
			} else {
				setGuessArray((prev) =>
					prev.map((elem, i) => {
						if (currentIndex === i) return e.key;
						else {
							if (elem !== "") return elem;
							else return "";
						}
					})
				);
			}
			setCurrentIndex(currentIndex + 1);
		}
	};
	useEffect(() => {
		const easd = (e: KeyboardEvent) => {
			var charCode = e.keyCode;
			const enterPress = charCode === 13;
			const backspacePress = charCode === 8;
			if (
				(charCode > 64 && charCode < 91) ||
				(charCode > 96 && charCode < 123) ||
				charCode === 8 ||
				charCode === 13
			)
				if (backspacePress) {
					backspace();
				} else if (enterPress) {
					enter();
				} else {
					add(e);
				}
		};
		if (win) {
		} else if (!processing) {
			document.addEventListener("keydown", easd);
		}

		return () => document.removeEventListener("keydown", easd);
	}, [guessArray, processing]);
	const fun = () => {
		let newObj = rowArray.map((e, i) => {
			if (i === currentRow) {
				return guessArray;
			} else return e;
		});

		setRowArray(newObj);
	};
	useEffect(() => {
		fun();
	}, [guessArray]);
	return (
		<div className="flex flex-col h-[70vh] lg:h-[83vh] justify-between gap-16">
			{/* <div className="">word: {word}</div> */}
			<div className="flex items-center flex-col gap-[.35rem] mt-8">
				{row.map((e, i) => (
					<Row
						error={error}
						win={win}
						setWin={setWin}
						word={word}
						rowkey={i}
						key={i}
						arr={rowArray[i]}
						results={results}
						currRow={currentRow}
						guessArr={guessArray}
					/>
				))}
			</div>
			<div className=" ">
				{keys.map((e) => {
					return (
						<div className="flex gap-1 mb-2 justify-center items-center">
							{e.map((e, i) => (
								<div
									onClick={() => {
										if (e.key !== "enter" && e.key !== "⌫") {
											add(e);
										} else if (e.key === "⌫") {
											backspace();
										} else if (e.key === "enter") {
											enter();
										}
									}}
									key={i}
									className={`text-black h-[3rem] lg:h-[3.5rem] uppercase  ${
										e.key === "⌫"
											? "text-2xl "
											: "text-[.7rem] lg:text-[.9rem] font-extrabold"
									} rounded-md ${
										e.key === "enter"
											? "w-[4.5rem] text-[.75rem]"
											: e.key === "⌫"
											? "w-16"
											: "w-8 lg:w-11"
									} bg-[#D4D6DA] flex justify-center items-center	 cursor-pointer hover:bg-[#bec1c6]  transition`}
								>
									{e.key}
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Wordle;
