import * as React from 'react';
import {useRef, useEffect, useState, useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatWindowInterface } from '../interfaces';
import Bot from '../svgs/bot.svg';
import { postData } from '../utils/';
import classNames from "classnames";
import 'regenerator-runtime/runtime'
import Speech from "speak-tts";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import { DataContext } from '../app/store';
import xtype from 'xtypejs'

import { conversations } from '../chats';

export default function ChatWindow({
  title,
  botIcon = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
  serverURL,
  session_id,
  userInputObj,
  userinputKey,
  sysoutputKey,
  enableVoice,
  getDialogueLog,
  width = 300,
  height = 400,
}: ChatWindowInterface) {

    const [isListening, setListening] = useState(false);
    const [botResponse, setBotResponse] = useState('');
    const {chats, updateChats }= useContext(DataContext)

  // const appId = '8b12e1fc-7544-46bb-a619-10a9cc77dc2d';
  // const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
  // SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

    const clearContext = () =>{
        updateChats(conversations);
    }

    const {finalTranscript, resetTranscript } = useSpeechRecognition();
    useEffect(() => {
        if (finalTranscript !== '') {
            updateChats([...chats, { text: finalTranscript, speaker: 'user' }]);
            if (getDialogueLog) {getDialogueLog(chats);}
            query(finalTranscript);
            // alanaQuery(finalTranscript);
            // Create a fresh transcript to avoid the same transcript being appended multiple times
            resetTranscript();
        }
    }, [finalTranscript, resetTranscript]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-GB',
        });
    };
    const switchBtn = () => {
        setListening(isListening => !isListening);

        if (isListening) {
            SpeechRecognition.stopListening();
        }
        else {
            listenContinuously();
        }
    }

  var btnClass = classNames({
    'is-mic-button': true,
    'is-listening': isListening,
  });

  // Text-to-Speech function
  const speech = new Speech();
  speech.init({
        volume: 0.5,
        lang: "en-GB",
        rate: 1,
        pitch: 1,
        'voice':'Google UK English Female',
        'splitSentences': true,
      })
      .then((data: any) => {
        console.log("Speech is ready", data);
      })
      .catch((e: any) => {
        console.error("An error occured while initializing : ", e);
      });

  if (!speech.hasBrowserSupport()){
    alert("Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !");
  }

  const speak = (utt: string) => {
    speech.speak({
          text: utt,
          queue: false,
          listeners: {
            onstart: () => {
              console.log("Start utterance");
            },
            onend: () => {
              console.log("End utterance");
            },
            onresume: () => {
              console.log("Resume utterance");
            },
            onboundary: event => {
              console.log(
                  event.name +
                  " boundary reached after " +
                  event.elapsedTime +
                  " milliseconds."
              );
            }
          }
        })
        .then((data: any) => {
          console.log("Success !", data);
        })
        .catch((e: any) => {
          console.error("An error occurred :", e);
        });
  }

    function query(user_input: string) {
        let shallow = Object.assign({}, userInputObj);
        shallow["session_id"] = session_id
        shallow["user_id"] = uuidv4()
        shallow["speaker"] = 'user'
        shallow[userinputKey] = user_input
        console.log('query_object: ' + JSON.stringify(shallow))
        updateChats([...chats, {text: user_input, speaker: 'user'}]);
        if (getDialogueLog) {
            getDialogueLog(chats);
        }
        postData(serverURL || `${import.meta.env.VITE_SERVER_URL}/v1`, shallow)
            .then(async (data) => {
                const response = getResponse(data);
                setBotResponse(response);
            })
            .catch((err) => console.log(err));
    }

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
        const user_input = e.currentTarget.value
        query(user_input);
        e.currentTarget.value = '';
    }
  };

  const getResponse = (data: any) => {
      const data_type = xtype(data)
      if (data_type === 'single_elem_array' || data_type === 'multi_elem_array'){
          return data.map((item: any, index: number ) => {
              const keys = sysoutputKey.split('.');

              let temp_data = Object.assign({}, item);
              let response = "";
              keys.forEach(
                  function (k: any) {
                      temp_data = temp_data[k]
                      const tmp_data_type = xtype(temp_data)
                      if (tmp_data_type === "multi_char_string" || tmp_data_type === 'empty_string' || tmp_data_type === "whitespace" || tmp_data_type === "multi_elem_array") {
                          response = temp_data
                      }
                  });
              return response;
          });
      }
      else if ( data_type ===  "single_prop_object" || data_type === 'multi_prop_object'){
          const keys = sysoutputKey.split('.');
          let temp_data = Object.assign({}, data);
          let response = "";
          keys.forEach(
                  function(k: any){
                      temp_data = temp_data[k]
                      const tmp_data_type = xtype(temp_data)
                      if ( tmp_data_type ===  "multi_char_string" || tmp_data_type === 'empty_string' || tmp_data_type === "whitespace"){
                          response = temp_data
                      }
                  });

          alert(JSON.stringify(response))
          alert(response)
          return response;
      }
  };

  useEffect(() => {
    if (botResponse) {
      updateChats([...chats, { text: '...', speaker: 'bot' }]);
      if (getDialogueLog) {getDialogueLog(chats);}
      setTimeout(() => {
        updateChats([...chats, { text: botResponse, speaker: 'bot' }]);
        if (getDialogueLog) {getDialogueLog(chats);}
        if (enableVoice) {speak(botResponse)}
      }, 1000);
    }
  }, [botResponse]);


  console.log({chats});
  // START -> Autoscroll Chats Window
  const AutoScrollConversations = () => {
    const containerRef = useRef();
    useEffect(() => containerRef.current.scrollIntoView());
    return <div style={{ width: "85%" }} ref={containerRef} />;
  };

  // Autoscroll Chats Window -> END!
  return (
    <div className="chat-container" style={{ width }}>
      <div className="bot-information text-center">
        <h3>
          <img src={Bot} width={20} /> {title}
        </h3>
      </div>
      <div id="chat-window" style={{ height }}>
        {chats?.map((item, index) => (
          <div
            key={index}
            style={{
              borderRadius: 20,
              margin: '5px 15px',
              textAlign: 'left',
              position: 'relative',
              alignSelf: item.speaker === 'bot' ? 'start' : 'end',
            }}
          >
            <span style={{ display: 'inline-block', marginRight: 5 }}>
              {item.speaker === 'bot' ? (
                <img
                  src={
                    botIcon === ''
                      ? 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
                      : botIcon
                  }
                  width={25}
                />
              ) : null}
            </span>
            <span
              style={{
                background: item.speaker === 'bot' ? 'aliceblue' : '#f2f2f1',
                padding: 8,
                display: 'inline-block',
                maxWidth: 220,
                borderRadius:
                  item.speaker === 'bot'
                    ? '2px 12px 12px 12px'
                    : '12px 2px 12px 12px',
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
        <AutoScrollConversations />
      </div>
      <div className="chat-box-container">
        <input
          className="chat-box"
          placeholder="Type your message"
          onKeyPress={handleKeyPress}
        />
        {enableVoice ? (<button onClick={switchBtn}>🎙️</button>) : null}
      </div>
    </div>
  );
}