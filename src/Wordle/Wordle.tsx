import React, { useEffect, useState } from "react";
import Row from "./Row";

import words5 from "./words5.json";
import words55 from "./words-4.json";
import { keyboard } from "./keys";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
function Wordle(): JSX.Element {
	const words = words5.map((e) => e.word);

	const row = Array.from(Array(6).keys());
	const col = Array.from(Array(5).keys());

	//word to be guessed
	const [word, setWord] = useState(
		words[Math.floor(Math.random() * words.length)]
	);
	// keys
	const [keys, setKeys] = useState(keyboard);
	// col array
	const [arr, setArr] = useState<string[]>(col.map((e) => ""));

	// row array
	const [rowArray, setRowArray] = useState<string[][]>(row.map((e, i) => arr));

	// if guessed set this to true
	const [win, setWin] = useState<boolean>(false);

	const [lose, setLose] = useState<boolean>(false);

	// enter pressed, animation starts, disable event for performance purposes
	const [processing, setProcessing] = useState<boolean>(false);

	//current row of the guessing shit
	const [currentRow, setCurrentRow] = useState<number>(0);

	// current index in the current row
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	// current row guess array
	const [guessArray, setGuessArray] = useState<string[]>(col.map((e) => ""));

	// results array
	const [results, setResults] = useState<string[][]>([
		[],
		[],
		[],
		[],
		[],
		[],
		[],
	]);

	//if enter pressed error handler
	const [error, setError] = useState<string>("");
	// ambowt
	let findDuplicates = (arr: any[], letter: string) =>
		arr.filter((item, index) => arr.indexOf(item) !== index && item === letter);
	let existing = (arr: string[], letter: string, index: number) => {
		let res = false;

		for (let i = 0; i < index; i++) {
			if (arr[i] === letter) res = true;
		}
		return res;
	};

	const enter = () => {
		// console.log(words.includes(guessArray.join("")));

		if (guessArray.every((e) => e !== "")) {
			if (words.includes(guessArray.join(""))) {
				setProcessing(true);

				let oten: string[] = guessArray.map((e, ind) => {
					if (word.includes(e)) {
						if (findDuplicates(guessArray, e)[0] === e) {
							if (
								(existing(guessArray, e, ind) &&
									word.charAt(ind) !== e &&
									findDuplicates(word.split(""), e)[0] !== e) ||
								(!existing(guessArray, e, ind) &&
									word.charAt(ind) !== e &&
									findDuplicates(word.split(""), e)[0] === e) ||
								(!existing(guessArray, e, ind) &&
									word.charAt(ind) !== e &&
									findDuplicates(word.split(""), e)[0] !== e)
							) {
								return "sayop";
							} else if (
								(existing(guessArray, e, ind) && word.charAt(ind) === e) ||
								(!existing(guessArray, e, ind) && word.charAt(ind) === e)
							) {
								return "korek";
							} else return "sayop_place";
						} else if (word.charAt(ind) === e) return "korek";
						else return "sayop_place";
					} else return "sayop";
				});
				if (oten.every((e) => e === "korek")) {
					setTimeout(() => {
						setWin(true);
					}, 2700);
				} else if (
					oten.every((e) => e !== "korek") &&
					currentRow === row.length - 1
				) {
					setTimeout(() => {
						setLose(true);
					}, 2700);
				} else {
					setTimeout(() => {
						setProcessing(false);
					}, 2300);
				}
				let newobj = results.map((e, i) => {
					if (i === currentRow) {
						return oten;
					} else return e;
				});
				setResults(newobj);
				let keyObj = keys.map((arr) =>
					arr.map((e) => {
						if (guessArray.includes(e.key)) {
							return {
								...e,
								result: oten[guessArray.findIndex((key) => key === e.key)],
							};
						} else return e;
					})
				);

				setTimeout(() => {
					setKeys(keyObj);
				}, 2300);

				// console.log(oten.every((e) => e === "korek"));

				setCurrentRow(currentRow + 1);
				setCurrentIndex(0);
				setGuessArray(col.map((e) => ""));
			} else {
				setError("not_in_list");
				setTimeout(() => {
					setError("");
				}, 300);
			}
		} else {
			setError("not_enough");
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
		<div className="flex flex-col justify-between h-max gap-7">
			{/* <div className="">word: {word}</div> */}
			<AnimatePresence>
				{(win || lose) && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { delay: 0.2, ease: "easeInOut", duration: 0.5 },
						}}
						onClick={() => {
							win ? setWin(false) : setLose(false);
						}}
						exit={{ opacity: 0 }}
						className="fixed top-0 left-0 bg-[#0000006a] w-screen h-screen z-50 flex justify-center items-center"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.4 }}
							animate={{
								opacity: 1,
								scale: 1,
								transition: {
									delay: 0.2,
									scale: { type: "spring", damping: 20, stiffness: 120 },
								},
							}}
							exit={{
								opacity: 0,
								scale: 0.4,
								transition: {
									scale: { duration: 0.65 },
								},
							}}
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="w-[40rem] mx-10 h-[30rem] p-10 flex flex-col justify-center items-center  rounded-lg bg-white relative"
						>
							<div
								onClick={() => {
									win ? setWin(false) : setLose(false);
								}}
								className="absolute top-5 right-5 text-4xl cursor-pointer hover:text-[#333] transition"
							>
								<IoClose />
							</div>
							<div className="text-5xl ">
								{win ? "You won!!!" : lose ? "Better luck next toime :(" : ""}
							</div>
							{lose && (
								<div className="mt-8 text-2xl">
									The word was{" "}
									<span className="font-black uppercase">{word}</span> bogo
								</div>
							)}
							{lose && <div className="mt-10">👎👎👎👎👎👎 noob</div>}
							<div className="mt-10">
								refresh to start a new game kay kapoy pag code yawa
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20, x: "-50%" }}
						animate={{
							y: -30,
							x: "-50%",
							opacity: 1,
							transition: { y: { duration: 0.5 }, opacity: { duration: 0.2 } },
						}}
						exit={{
							opacity: 0,
							y: -20,
							transition: { delay: 1, y: { duration: 0.5 } },
						}}
						className="absolute left-[50%] translate-x-[-50%] px-5 py-4 flex justify-center items-center z-50 bg-[#333] text-white rounded-lg shadow-lg text-sm font-extrabold"
					>
						<p>
							{error === "not_in_list" ? "Not in list!" : "Not enough letters!"}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
			<div className="flex items-center flex-col gap-[.35rem] mt-8">
				{row.map((e, i) => {
					return (
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
					);
				})}
			</div>
			<div className="">
				{keys.map((e, i) => {
					return (
						<div
							key={i}
							className="flex gap-[.35rem] mb-2 justify-center items-center"
						>
							{e.map((e, i) => (
								<div
									onClick={() => {
										if (processing) {
										} else {
											if (e.key !== "enter" && e.key !== "⌫") {
												add(e);
											} else if (e.key === "⌫") {
												backspace();
											} else if (e.key === "enter") {
												enter();
											}
										}
									}}
									key={i}
									className={` h-[3rem] lg:h-[3.5rem] uppercase  ${
										e.key === "⌫"
											? "text-2xl "
											: "text-[.7rem] lg:text-[.9rem] font-extrabold"
									} rounded-md ${
										e.key === "enter"
											? "lg:w-[4.5rem] w-[3.75rem] text-[.75rem]"
											: e.key === "⌫"
											? "lg:w-16 w-[3.25rem]"
											: "w-8 lg:w-11"
									}  flex justify-center items-center	 cursor-pointer ${
										e.result
											? e.result === "sayop"
												? "bg-[#787C7E] text-white"
												: e.result === "sayop_place"
												? "bg-[#CAB458] text-white"
												: "bg-[#6BAA64] text-white"
											: "bg-[#D4D6DA]"
									} transition`}
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
}

export default Wordle;
