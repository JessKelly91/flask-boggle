from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Things to do BEFORE each test"""
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS']=['dont-show-debug-toolbar']
    
    def tearDown(self):
        """Things to do AFTER each test"""

    def test_home_page(self):
        """Checks home HTML and session info"""
        with self.client:
            resp = self.client.get('/')
            html = resp.get_data(as_text = True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<button id="start">Start</button>' ,html)
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('num_plays'))
    
    def test_valid_word(self):
        """tests a valid word submission"""
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] =  [["T", "E", "S", "T", "T"],
                                    ["T", "E", "S", "T", "T"],
                                    ["T", "E", "S", "T", "T"],
                                    ["T", "E", "S", "T", "T"],
                                    ["T", "E", "S", "T", "T"]]
            resp = self.client.get('/guess?guessedWord=test')
            
            self.assertEqual(resp.json['result'], 'ok')
    
    def test_invalid_word(self):
        """tests invalid word on board submission"""
        self.client.get('/')
        resp = self.client.get('/guess?guessedWord=wrong')

        self.assertEqual(resp.json['result'], 'not-on-board')

    def test_jibberish(self):
        """tests an non-english word guess"""
        self.client.get('/')
        resp = self.client.get('/guess?guessedWord=asldkfjsdoifm')

        self.assertEqual(resp.json['result'], 'not-word')