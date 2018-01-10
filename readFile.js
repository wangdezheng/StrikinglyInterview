var dictionary = new Array(26);

function readFile() {
    var lines;
    var selectedFile = document.getElementById("files").files[0];

    var reader = new FileReader();
    reader.readAsText(selectedFile);

    for (var i = 0; i < dictionary.length; i++) {
        dictionary[i] = new Array();
    }

    //read file and put them in dictionary sorted by length
    reader.onload = function () {
        lines = this.result
        lines = lines.split('\n');
        for (var i = 0; i < lines.length; i++) {
            dictionary[lines[i].length].push(lines[i]);
        }
    };
}

function getWordListByLength(len) {
    return dictionary[len];
}


function getHighFrequenceLetter(wordList, bingoLetterArray) {
    //create letter array, array[i] represents how many times that letter appear in wordList, i is the (letter's ASCII - A's ASCII)
    var letterArray = new Array(26);
    //initialize
    for (var i = 0; i < letterArray.length; i++) {
        letterArray[i] = 0;
    }
    for (var i = 0; i < wordList.length; i++) {
        for (var j = 0; j < wordList[i].length; j++) {
            //only count those letters that have not been guessed
            if ($.inArray(j, bingoLetterArray) == -1) {
                var char = wordList[i][j];
                letterArray[char.charCodeAt()-65]++;
            }
        }
    }

    //find the highest frequence letter index
    var temp = 0;
    var index = 0;
    for (var i = 0; i < letterArray.length; i++) {
        if (letterArray[i] > temp) {
            temp = letterArray[i];
            index = i;
        }
    }
    //convert ASCII to letter and return
    return String.fromCharCode(index + 65);  
}

//after receive response from server, find thoese words that match word in response
function getWordListByLetter(pos, letter, wordList) {
    var result = new Array();
    for (var i = 0; i < wordList.length; i++) {
        if (wordList[i][pos] == letter) {
            result.push(wordList[i]);
        }
    }
    return result;
}

//after receive response from server, delete those words that are not in word list based on letter
function deleteFromWordListByLetter(letter, bingoLetterArray, wordList) {
    var result = new Array();
    for (var i = 0; i < wordList.length; i++) {
        for (var j = 0; j < wordList[i].length; j++) {
            //determine if remaining letters contains the letter that not satisfy the word
            //iterate each letter in each word, determine if they contains letter that not satisfy the word
            //if contains, not add this word to new word list, if not, add this word to new word list
            if ($.inArray(j, bingoLetterArray) == -1) {
                if (wordList[i][j] == letter) {
                    break;
                }
            }
            if (j == wordList[i].length - 1) {
                result.push(wordList[i]);
            }
        }

    }
    return result;
}