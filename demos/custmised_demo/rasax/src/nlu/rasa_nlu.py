class RasaIntent():
    """ Represents the SPRING intent."""

    def __init__(self):
        self.type = None
        self.confidence = None
        self.entities = []
        self.ranking = None

    def __str__(self):
        return str(self.__dict__)


class RasaNLU():
    """ Sends SPRING intent returned by SPRING Rasa to the Reception bot.
    """

    def __init__(self):
        pass

    @staticmethod
    def process_user_sentence(rasa_data):
        """ Processes user sentence.
        Arguments:
            rasa_data [dict] -- Object with Mercury NLU annotations.
        Returns:
            intent [SPRINGIntent] -- Intent recognized by SPRING Rasa.
        """
        print('request_data: {}'.format(rasa_data))
        intent = RasaIntent()

        if not rasa_data:
            intent.type = 'EMPTY'
            return intent
        else:
            intent_info = rasa_data.get("intent")
            intent.type = intent_info.get('name')
            intent.confidence = intent_info.get("confidence")
            entities = {item.get('entity'): item.get('value') for item in rasa_data.get("entities")}
            intent.entities = entities
            intent.ranking = rasa_data.get("intent_ranking")
            return intent
