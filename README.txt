1. This zip contains five files.
2. wordList.txt contains all the words in my dictionary
3. Strikingly.html is responsible for display user interface, include load file component, start game button, give a word button, guess button, get result button and submit result button.
4. Strikingly.js is responsible for sending requests to server and handle response from server.it contain
s following functions:
	startGame(): set request to server to start game
	giveMeAWord(): set request to server to get a new word
	makeAGuess(): guess a letter and send it to server
	getResult(): set request to server to get current result
	summitResult(): et request to server to submit current result
	hanldeCommonResult(): handle common response from server after call startGame(), giveMeAWord(), getResult(), summitResult()
	hanldeResultAfterOneGuess(result): hanldle response from server after after call makeAGuess()

5. readFile.js is responsible for reading word list from input word.txt, it contain
s following functions: 
	readFile() : read file from word.txt and store them in my own dictionary
	getWordListByLength(len): get word list according to word length
	getHighFrequenceLetter(wordList, bingoLetterArray): get most highest frequency letter (not include letter in bingoLetterArray)
	getWordListByLetter(pos, letter, wordList): after receive response from server, find those words that match word in response according to letter position, letter, cur word list
	 deleteFromWordListByLetter(letter, bingoLetterArray, wordList): after receive response from server, delete those words that are not in word list based on letter(not include letter in bingoLetterArray)

