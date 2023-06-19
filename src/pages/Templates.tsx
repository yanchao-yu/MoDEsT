import * as React from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import ChatOnly from '../svgs/chat-only.svg';
import ChatBg from '../svgs/chat-bg.svg';
import ChatLeft from '../svgs/chat-left.svg';
import ChatRight from '../svgs/chat-right.svg';
import Darkmode from 'drkmd-js';

export default function Templates() {
  const match = useRouteMatch();
  const history = useHistory();
  const darkmode = new Darkmode()
  darkmode.toggle()
  darkmode.attach()

  const handleTemplateSelect = (e) => {
    history.push(`${match.url}/${e.currentTarget.value}/setup`);
  };

  return (
    <div className="container">
      <Link className="nav-link" to="/">
        &#8592; Back home
      </Link>
      <h1 className="title">1. Choose Layout</h1>
      <h3 className="sub-title">
        Select the template that matches your desired layout
      </h3>
      <div className="templates">
        <div className="template">
          <button type="button" value="chat-only" onClick={handleTemplateSelect}
                  className="primary round outline">
            Chat Only
            <img src={ChatOnly} width="100%" alt="Chat Only Template" />
          </button>
        </div>
        <div className="template">
          <button type="button" value="chat-content-background" onClick={handleTemplateSelect}
                  className="primary round outline">
            Chat with content (background)
            <img
                src={ChatBg}
                width="100%"
                alt="Chat with content (background) Template"
            /></button>
        </div>
        <div className="template">
          <button type="button" value="chat-content-left" onClick={handleTemplateSelect}
                  className="primary round outline">
            Chat with Content
            <img
                src={ChatLeft}
                width="100%"
                alt="Chat with content (left) Template"
            />
          </button>
        </div>
        <div className="template">
          <button type="button" value="chat-content-webcam" onClick={handleTemplateSelect}
                  className="primary round outline">
            Chat with Live WebCam
            <img
                src={ChatRight}
                width="100%"
                alt="Chat with WebCam Template"
            />
          </button>
        </div>
      </div>
      <div className="templates"></div>
    </div>
  );
}
