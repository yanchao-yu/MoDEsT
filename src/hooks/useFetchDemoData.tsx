import { useState, useEffect } from 'react';
import { fetchData } from '../utils/';
import { BotConfig } from '../interfaces';

export default function useFetchDemoData(botId: string) {
  const [loading, setLoading] = useState(true);
  const [botData, setBotData] = useState([]);
  const [activeBot, setActiveBot] = useState<BotConfig>();

  useEffect(() => {

    console.log('botId: ' + botId)

    const getBotData = async () => {
      const data = await fetchData(`${import.meta.env.VITE_SERVER_URL}/v1/demo/?id=${botId}`);
      // console.log('data: ' + JSON.stringify(data))
      setBotData(data);
    };
    getBotData();
  }, []);

  useEffect(() => {

    console.log('botData: ' + JSON.stringify(botData))
    console.log('botData length: ' + botData.length)

    if (botData['botId'] === botId) {
      const obj = {
        title: botData['title'],
        description: botData['description'],
        embedCode: botData['embedCode'],
        developmentPlatform: botData['developmentPlatform'],
        botName: botData['botName'],
        botIntro: botData['botIntro'],
        botIcon: botData['botIcon'],
        userinputKey: botData['userinputKey'],
        sysoutputKey: botData['sysoutputKey'],
        userInputObj: botData['userInputObj'],
        consentNote: botData['consentNote'],
        enableBugReport: botData['enableBugReport'],
        enableFeedback: botData['enableFeedback'],
        feedbackLink: botData['feedbackLink'],
        displayContent: botData['displayContent'],
        serverURL: botData['serverURL'],
        webcamId: botData['webcamId'],
        enableVoice: botData['enableVoice'],
      };
      console.log('ActiveBot obj: ' + JSON.stringify(obj))
      setActiveBot(obj);

      setLoading(false);


    // if (botData.length > 0) {
    //   for (let data of botData) {
    //     console.log('data: ' + JSON.stringify(data))
    //     if (data['botId'] === botId) {
    //       const obj = {
    //         title: data['title'],
    //         description: data['description'],
    //         embedCode: data['embedCode'],
    //         developmentPlatform: data['developmentPlatform'],
    //         botName: data['botName'],
    //         botIntro: data['botIntro'],
    //         botIcon: data['botIcon'],
    //         consentNote: data['consentNote'],
    //         enableBugReport: data['enableBugReport'],
    //         enableFeedback: data['enableFeedback'],
    //         feedbackLink: data['feedbackLink'],
    //         displayContent: data['displayContent'],
    //         serverURL: data['serverURL'],
    //         webcamId: data['webcamId'],
    //         enableVoice: data['enableVoice'],
    //       };
    //       console.log('ActiveBot obj: ' + JSON.stringify(obj))
    //       setActiveBot(obj);
    //
    //       setLoading(false);
    //     }
    //   }
    }
  }, [botData]);

  return { loading, activeBot };
}
