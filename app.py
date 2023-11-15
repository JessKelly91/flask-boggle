from flask import Flask, redirect, request, flash, session, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "boggle-secret-key"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension

@app.route('/')
def home_page():
    """render the home html"""

    boggle_game = Boggle()

    new_board = boggle_game.make_board()
    session['board'] = new_board

    return render_template("home.html", board = new_board)

@app.route('/guess', methods=["GET"])
def handle_guess():
    #retrieve board from session
    board = session['board']

    #get guessed word from request data
    guessed_word = request.args['guessedWord']

    words = Boggle()

    result = words.check_valid_word(board, guessed_word)

    return jsonify({'result' : result})

@app.route('/stats', methods=["POST"])
def store_stats():
    """receive stats from JS request and store"""
    score = request.json["currentScore"]
    highscore = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)

    session['num_plays'] = num_plays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord = score > highscore)