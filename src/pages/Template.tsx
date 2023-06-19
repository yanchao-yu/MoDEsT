import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import SetupForm from '../components/SetupForm';
import Darkmode from 'drkmd-js'

export default function Template() {
  const { template } = useParams();
  const darkmode = new Darkmode()
    darkmode.toggle()
    darkmode.attach()

  function renderLayout(template: string) {
    switch (template) {
      case 'chat-only':
        return <ChatOnly />;
      case 'chat-content-background':
        return <ChatContentBg />;
      case 'chat-content-left':
        return <ChatContentL />;
      case 'chat-content-webcam':
        return <ChatContentWebcam />;
      default:
        return <NoMatchingLayout />;
    }
  }

  return (
    <div className="container">
      <Link className="nav-link" to="/templates">
        &#8592; Back to layouts
      </Link>
      <h1 className="title">2. Setup template</h1>
      {renderLayout(template)}
    </div>
  );
}

function ChatOnly() {
  return (
    <div>
      <h3 className="sub-title">Chat Only</h3>
      <SetupForm display_area={false} webcam={false} />
    </div>
  );
}

function ChatContentBg() {
  return (
    <div>
      <h3 className="sub-title">Chat with Content (Background)</h3>
      <SetupForm display_area={true} webcam={false}/>
    </div>
  );
}

function ChatContentL() {
  return (
    <div>
      <h3 className="sub-title">Chat with Content (Left)</h3>
      <SetupForm display_area={true} webcam={false}/>
    </div>
  );
}

function ChatContentWebcam() {
  return (
    <div>
      <h3 className="sub-title">Chat with WebCamera</h3>
      <SetupForm display_area={false} webcam={true}/>
    </div>
  );
}

function NoMatchingLayout() {
  return <h3 className="sub-title">No matching layout!</h3>;
}
