var sessionId="";
var targetWord="";
var curWord = "";
var curWordList="";
var guessLetter="";
var bingoLetterArray = new Array(26); 
var firstAskForWord = true;
//tell the server to start game
function startGame() {
    $("#startButton").hide();
    $("#giveButton").show();
    $.ajax({
        url: "https://strikingly-hangman.herokuapp.com/game/on",
        type: "POST",
        contentType:"application/json",
        data:JSON.stringify({
            "playerId": "maldaba3@gmail.com",
            "action" : "startGame"
        }),
        //set callback function
        success:  hanldeCommonResult,
        //hanlde error 
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.responseText);
        }
       
    });
}

function giveMeAWord() {
    $("#actionButton").show();
    firstAskForWord = true;
    $.ajax({
        url: "https://strikingly-hangman.herokuapp.com/game/on",
        type: "POST",
        contentType:"application/json",
        data:JSON.stringify({
            "sessionId": sessionId,
            "action" : "nextWord"
        }),
        //set callback function
        success:  hanldeCommonResult,
        //hanlde error 
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.responseText);
        }
       
    });
}

function makeAGuess() {
    guessLetter = guessLetter.toUpperCase();
    $.ajax({
        url: "https://strikingly-hangman.herokuapp.com/game/on",
        type: "POST",
        contentType:"application/json",
        data:JSON.stringify({
            "sessionId": sessionId,
            "action" : "guessWord",
            "guess" : guessLetter,
        }),
        //set callback function
        success:  hanldeResultAfterOneGuess,
        //hanlde error 
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.responseText);
        }
    });
    
}

function getResult() {
    $.ajax({
        url: "https://strikingly-hangman.herokuapp.com/game/on",
        type: "POST",
        contentType:"application/json",
        data:JSON.stringify({
            "sessionId": sessionId,
            "action" : "getResult",
        }),
        //set callback function
        success:  hanldeCommonResult,
        //hanlde error 
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.responseText);
        }
    });
}

function summitResult() {
    $.ajax({
        url: "https://strikingly-hangman.herokuapp.com/game/on",
        type: "POST",
        contentType:"application/json",
        data:JSON.stringify({
            "sessionId": sessionId,
            "action" : "submitResult",
        }),
        //set callback function
        success:  hanldeCommonResult,
        //hanlde error 
        error: function() {
            aler(this.responseText);
        }
    });
}

//handle result for common reponse(formart display area)
function hanldeCommonResult(result){
    var str="";
    str+="{\n"
    $.each(result,function(k, v){
        str+= "     \"";
        str+=k;
        if (k != "data") {
            //stroe session ID
            if (k == "sessionId") {
                sessionId = v;
            }
            str+="\": \"";
            str+=v;
            str+="\"\n";
        } else {
            str += ":   {\n";
            $.each(v, function(k1, v1){
                //response contains word
                if (k1 == "word") {
                    if(firstAskForWord) {
                        //initialize bingo letter list
                        //find word list according to target word length when we firstly get that word
                        //find high frequence letter in that word array
                        for (var i = 0; i < bingoLetterArray.length; i++) {
                            bingoLetterArray[i] = -1;
                        }
                        targetWord = v1;
                        curWordList = getWordListByLength(targetWord.length);
                        guessLetter = getHighFrequenceLetter(curWordList, bingoLetterArray);
                        firstAskForWord = false;
                    } else {
                        curWord = v1;
                    }

                }  
                str+="         ";
                str+=k1;
                str+=": \"";
                str+=v1;
                str+="\"\n";
            });
            str+="      }\n"
        }
    });
    str+="}"
    $("#result").val(str);
} 

// handle result after one guess
function hanldeResultAfterOneGuess(result) {
    hanldeCommonResult(result);
    //still need to guess
    if (curWord.indexOf("*") >= 0 ) {
        //if cur word is different from previous word, it means that the guess is correct. If same, the guess is wrong
        if (curWord != targetWord) {
            //right guess, find the last guess letter postion, update word list
            for (var i = 0; i < curWord.length; i++) {
                if (curWord.charAt(i) != targetWord.charAt(i)) {
                    bingoLetterArray.push(i);
                    console.log(curWordList);
                    console.log(guessLetter);
                    curWordList = getWordListByLetter(i, guessLetter, curWordList);
                    console.log(curWordList);
                }
            }
            targetWord =  curWord;
        } else {
            console.log(curWordList);
            //wrong guess, delete those words contain wrong letter in word list
            curWordList = deleteFromWordListByLetter(guessLetter, bingoLetterArray, curWordList);
            console.log(curWordList);
        }
        // find letter to be guess and guess again
        guessLetter = getHighFrequenceLetter(curWordList, bingoLetterArray);
        makeAGuess();
    } else {
        alert("You can start a new word!")
    }
}