import json
import random
from nlu.rasa_nlu import RasaNLU
import traceback
from argparse import ArgumentParser
from typing import Tuple, Any
import logging

from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

BOT_NAME = "DEMO_BOT"
logger = logging.getLogger(BOT_NAME)
NLU_CONF_THRESHOLD = 0.70
ASR_CONFIDENCE = 0.02
ADVERTISEMENT_PROBABILITY = 0.3
RAPPORT_TURN_THRESHOLD = 3
MULTITURN_TURN_THRESHOLD = 1

ASR_RESPONSES = [
    'I am not sure I heard you right. Could you repeat that please?',
    'I am sorry I got distracted. Could you repeat that please?'
]


def is_low_confidence_asr(asr_hyps):
    if not asr_hyps:
        return False
    low_confidence = asr_hyps[0]['confidence'] < ASR_CONFIDENCE
    return low_confidence


class Bot(Resource):
    def __init__(self):
        self.config = ""
        self._nlu = RasaNLU()

    def get(self):
        pass

    def get_nlu(self, user_sentence: str):
        import requests
        r = requests.post("http://localhost:7002/model/parse", data=json.dumps({"text": user_sentence}))
        logger.info('nlu results: {}'.format(r.json()))
        if r.status_code == 200:
            return self._nlu.process_user_sentence(r.json())
        return None

    @cross_origin(origin='localhost', headers=['Content- Type', 'Authorization'])
    def post(self):
        try:
            request_data = request.get_json(force=True)
            user_sentence = request_data.get("text")
            intent = self.get_nlu(user_sentence)

            if intent.confidence and intent.confidence <= NLU_CONF_THRESHOLD:
                _response = {"response": random.choice(ASR_RESPONSES)}
                return {"response": random.choice(ASR_RESPONSES)}

            if intent.type == "greeting":
                return {"response": "Hello, how are you today?" }
            elif intent.type == "movie_recommendation":
                return {"response": "Oh yes I can help recommend a movie to you" }
            elif intent.type == "greeting_acknowledgement":
                return {"response": "Great!" }
            elif intent.type == "goodbye":
                return {"response": "Talk to you later" }
            elif intent.type == "appreciation":
                return {"response": "Awww! thanks for the kind word" }
            else:
                  return {"response": "Can you say that again?" }

        except Exception:
            exc_message = traceback.format_exc(chain=False)
            logger.critical(exc_message)
            return {"traceback": exc_message}, 500, {'Content-Type': 'application/json'}

    @staticmethod
    def _check_bot_locked(request_data: dict) -> Tuple[Any, Any]:
        last_state = request_data.get("current_state.last_state")
        if last_state:
            bot_states = last_state.get("state.bot_states")
            logger.info('======????========> bot_states: {}'.format(bot_states))
            if bot_states:
                quiz_bot_state = bot_states.get('quiz_bot')
                if quiz_bot_state:
                    return quiz_bot_state.get('lock_requested', False), quiz_bot_state.get('bot_attributes', {})
        return False, None


api.add_resource(Bot, "/")

if __name__ == "__main__":
    argp = ArgumentParser()
    argp.add_argument('-p', '--port', type=int, default=7117)
    argp.add_argument('-l', '--logfile', type=str, default=BOT_NAME + '.log')
    argp.add_argument('-cv', '--console-verbosity', default='debug', help='Console logging verbosity')
    argp.add_argument('-fv', '--file-verbosity', default='debug', help='File logging verbosity')
    args = argp.parse_args()
    app.run(host="0.0.0.0", port=args.port, threaded=True)