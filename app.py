from flask import Flask, redirect, request, flash, session, render_template
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "boggle-secret-key"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension

boggle_game = Boggle()

@app.route('/')
def home_page():
    """render the home html"""

    board = boggle_game.make_board()
    session['board'] = board

    return render_template("home.html", board = board)

@app.route('/guess', methods=["POST"])
def handle_guess():
    #retrieve board from session
    board = session['board']

    #get guessed word from request data
    guessed_word = request.form.get('guessedWord')

    message = boggle_game.check_valid_word(board, guessed_word)

    flash(message)

    return redirect("/")