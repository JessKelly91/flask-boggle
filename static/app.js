// DOM objects we'll need to access and update
const $wordGuessForm = $("#word-guess-form");
const $guessedWordInput = $("#guessed-word");
const $body = $("body");
const $msg = $("#check-word-msg");
const $score = $("#score-int");
const $timer = $("#countdown");
const $start = $("#start");
const $highscore = ("#highscore");



class BoggleGame {

    constructor(){
        $wordGuessForm.on("submit", this.handleWordGuess.bind(this));
        $start.on("click", this.startGame.bind(this));
                
        this.startedGame = false;
        this.gameOver = false;

        this.score = 0;
        this.correctWords = [];

        this.gameDuration = 60;
        this.timer = null;
        
    }

    //reset all msgs/scores/correct words found
    resetGame(){
        this.startedGame = false;
        this.gameOver = false;
        this.score = 0;
        this.correctWords = [];
        this.gameDuration = 60;
        clearInterval(this.timer);
        this.updateTimer(this.gameDuration);
        $msg.text("");
        this.updateScore();

    }

    //show timer on screen
    updateTimer(secondsRemaining){
        $timer.text(`${secondsRemaining} seconds`);
    }

    //start the timer
    startGame(){
        //reset before new game
        this.resetGame();

        this.startedGame = true;
        this.score = 0;
        this.updateTimer(this.gameDuration);

        this.timer = setInterval( () => this.updateTimer(--this.gameDuration), 1000);

        setTimeout( () => {
            clearInterval(this.timer);
            this.endGame();
        }, this.gameDuration * 1000)
    }

    //handle ending of game after timer expires
    endGame(){
        let msg = `Time has expired, your final score is ${this.score}!`
        $msg.text(`${msg}`);
        this.gameOver = true;

        this.postScore();
    }

    //show score on screen
    updateScore(){
        $score.text(`${this.score}`);
    }

    //send current and highscore to flask
    async postScore(){
        const currScore = this.score;
        let msg = "";

        const response = await axios.post("/stats", { currentScore: currScore } );

        if(response.data.brokeRecord){
            msg = `New high score of ${currScore}`
            $msg.text(`${msg}`);
        }
        else{
            msg = `Final score: ${currScore}`
            $msg.text(`${msg}`);
        }

    }

    //handle submission of word
    //show if valid or not + update score
    async handleWordGuess(evt){
        evt.preventDefault();
        const $guessedWord = $guessedWordInput.val();
        let msg = "";

        //check if timer is not zero
        if(this.gameOver){
            alert("The game is over. You cannot submit more guesses.")
            return;
        }

        //check if start button has been pressed
        if(!this.startedGame){
            alert("Please press start to begin.")
            return;
        }

        //check if valid-word + update score
        else if(this.startedGame){
            const response = await axios.get("/guess", {params: {guessedWord: $guessedWord}} );

            if(response.data.result === "ok" && this.correctWords.includes($guessedWord)){
                msg = "You already found that word. Try again!"
            }
            else if(response.data.result === "ok" && !this.correctWords.includes($guessedWord)){
                msg = "Congrats you found a word on the board!";
                this.correctWords.push($guessedWord);
                this.score += $guessedWord.length;
            }
            else if(response.data.result === "not-word"){
                msg = "That guess is not a valid word. Try again!";
            }
            else if(response.data.result === "not-on-board"){
                msg = "That word is not on the board. Try again!";
            }

        }


        $msg.text(`${msg}`);
        this.updateScore();

        // clear input field after submission
        $guessedWordInput.val('');

    }

}

new BoggleGame();

