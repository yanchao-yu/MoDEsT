import * as React from 'react';
import { useState, useEffect } from 'react';
import useClipboard from 'react-use-clipboard';
import { Link, useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import Modal from '../components/Modal';
import BugReport from '../components/BugReport';
import { generateID } from '../utils';
import Webcam from "react-webcam";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {JsonViewer} from "@textea/json-viewer";

export default function TemplatePreview() {
  const template = useParams();
  const {
    botId,
    title,
    description,
    embedCode,
    developmentPlatform,
    botName,
    botIntro,
    botIcon,
    serverURL,
    consentNote,
    userInputObj,
    userinputKey,
    sysoutputKey,
    enableBugReport,
    enableFeedback,
    enableVoice,
    webcamId,
    feedbackLink,
    displayContent,
  } = JSON.parse(window.localStorage.getItem('obj'));
  function descriptionMarkup() {
    return { __html: description };
  }

  function consentMarkup() {
    return { __html: consentNote };
  }

  function displayAreaMarkup() {
    return { __html: displayContent };
  }

  function botIframe() {
    return { __html: embedCode };
  }

  const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: "user"
  };

  const [start, setStart] = useState(false);
  const [chats, updateChats] = useState([
    { text: botIntro === '' ? 'Hello' : botIntro, speaker: 'bot' },
  ]);
  const [showBot, toggleBot] = useState(true);

  const [isCopied, setCopied] = useClipboard(
    `${import.meta.env.VITE_BASE_URL}/demo/${template.template}/${botId}`
  );

  const [showBugModal, setShowBugModal] = useState(false);

  const [dialogue_log, setDialogueLog] = useState({});

  const getDialogueLog = (log) => {
    setDialogueLog(log);
  }

  const handleBugReport = () => {
    setShowBugModal(true);
  };


  const [session_id, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(generateID());
  }, []);

  const webcamRef = React.useRef(null);
  const WebcamCapture = async () => {
    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();},
        [webcamRef]
    );
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(dialogue_log)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = botName+"_log_"+ Date.now()+".json";

    link.click();
  };

  return (
    <React.Fragment>
      {showBugModal ? (
        <Modal
          close={() => setShowBugModal(false)}
          title="🐛 Bug Report"
          description="Please use this form to report individual bugs you find e.g. strange, unexpected responses, error messages etc. Please submit a separate form for each bug you find"
        >
          <BugReport session_id={session_id} />
        </Modal>
      ) : null}
      <div className="container">
        <Link className="nav-link" to={`/templates/${template.template}/setup`}>
          &#8592; Back to setup
        </Link>
        <h1 className="title">3. Ready!</h1>
        <h3 className="sub-title">Test and share your experiment</h3>
        <div className="preview-container">
          <div style={{ textAlign: 'center' }}>
            <h2>{title}</h2>
            <p style={{ marginTop: 5 }}>
              <div
                  dangerouslySetInnerHTML={descriptionMarkup()}
              />
            </p>
            <p style={{ marginTop: 10 }}>
              <strong style={{ color: 'red' }}>
                CONSENT: Please read the consent below before you continue
              </strong>
            </p>
            <div className="input-div">
              <input
                id="consent"
                type="checkbox"
                onChange={(e) => setStart(e.target.checked)}
              />{' '}
              <div
                  dangerouslySetInnerHTML={consentMarkup()}
              />

              {/*<label htmlFor="consent">*/}
              {/*  <small style={{ fontSize: 14 }}>dangerouslySetInnerHTML={consentMarkup()}</small></label>*/}
            </div>
          </div>
          <div className="divider"></div>
          {start ? (
            <div
              className="preview"
              style={{
                position: 'relative',
                // flexDirection:
                //   template.template === 'chat-content-webcam' ? 'row-reverse' : 'row',
              }}
            >
              {template.template === 'chat-content-background' &&
              developmentPlatform !== '' ? (
                <button
                  className="button slategrey"
                  style={{ position: 'absolute', bottom: -40, right: 20 }}
                  onClick={() => toggleBot(!showBot)}
                >
                  {showBot ? 'X' : '+'}
                </button>
              ) : null}
              {template.template !== 'chat-only' ? (
                <div>
                <div
                  className={`display-area ${
                      template.template !== 'chat-only' ? 'full-width' : ''
                  }`}
                  dangerouslySetInnerHTML={displayAreaMarkup()}
                  />

                  {template.template == 'chat-content-webcam' ? (
                    <div>
                      <Webcam
                        audio={false}
                        height="100%"
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={{deviceId: {webcamId}}}
                      />
                    </div>
                  ): null}
                </div>
              ) : null}


              {developmentPlatform === 'custom-server' ? (
                <div
                  className={
                    template.template === 'chat-content-background'
                      ? 'bot-area floating'
                      : 'bot-area'
                  }
                >
                {showBot ? (
                    <div>
                      {template.template === 'chat-only' ?
                      <Tabs>
                        <TabList>
                          <Tab>Chat Window</Tab>
                          <Tab>Json Log</Tab>
                        </TabList>

                        <TabPanel>
                          <ChatWindow
                              title={botName}
                              botIcon={botIcon}
                              serverURL={serverURL}
                              session_id={session_id}
                              userInputObj={userInputObj}
                              userinputKey={userinputKey}
                              sysoutputKey={sysoutputKey}
                              chats={[]}
                              enableVoice={enableVoice}
                              updateChats={updateChats}
                              getDialogueLog={getDialogueLog}
                              width={template.template === 'chat-only' ? 730 : 350}
                          />
                        </TabPanel>
                        <TabPanel>
                          <div style={{"border-style": "thick double #32a1ce", "width":730}}>
                            <JsonViewer  style={{ height: "60vh" , width:730}}
                                         value={dialogue_log}
                                         theme={"dark"}
                            />
                            <div style={{"text-align": "center"}}>
                              <button type="button" onClick={exportData}>
                                Export Dialogue Log
                              </button>
                            </div>
                          </div>
                        </TabPanel>
                      </Tabs>
                      :
                      <ChatWindow
                        title={botName}
                        botIcon={botIcon}
                        serverURL={serverURL}
                        session_id={session_id}
                        userInputObj={userInputObj}
                        userinputKey={userinputKey}
                        sysoutputKey={sysoutputKey}
                        chats={[
                          { text: botIntro === '' ? 'Hello' : botIntro, speaker: 'bot' },
                        ]}
                        enableVoice={enableVoice}
                        updateChats={updateChats}
                        width={template.template === 'chat-only' ? 730 : 350}
                      />}
                    </div>
                ) : null}
                </div>
              ) : (
                <div
                  className={`bot-area ${
                    template.template === 'chat-only'
                      ? 'full-iframe'
                      : template.template === 'chat-content-background'
                      ? 'bot-area floating'
                      : ''
                  }`}
                  dangerouslySetInnerHTML={showBot ? botIframe() : null}
                />
              )}
            </div>
          ) : (
            <p className="text-center">"Read and agree the consent first"</p>
          )}
          {start ? (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {enableBugReport ? (
                <button
                  onClick={handleBugReport}
                  className="button bug-report-btn"
                >
                  🐛 Bug Report
                </button>
              ) : null}
              {enableFeedback ? (
                <a
                  href={feedbackLink}
                  target="_blank"
                  className="button feedback-btn"
                  style={{ marginLeft: 10 }}
                >
                  Share Overall Feedback 🙂
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
        {start ? (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <input
              className="share-input"
              placeholder={`${import.meta.env.VITE_BASE_URL}/demo/${template.template}/${botId}`}
              disabled
            />{' '}
            <button className="share-button" onClick={setCopied}>
              {isCopied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
