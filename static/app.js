const wordGuessForm = $("#word-guess-form");
const guessedWordInput = $("#guessed-word")

let guessedWord

$(document).ready(function(){
    wordGuessForm.submit(async function(evt){
        evt.preventDefault();
    
        guessedWord = guessedWordInput.val();
        // console.log(guessedWord);

        await axios.post("/guess", {guessedWord: guessedWord})

        // clear input field after submission
        guessedWordInput.val('');
    
    })
})


