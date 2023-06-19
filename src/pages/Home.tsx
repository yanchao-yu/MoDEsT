import * as React from 'react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
// import { conversations } from '../chats';
import { generateID } from '../utils';
import Darkmode from 'drkmd-js';
import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";
import { ChangeEvent, useState } from 'react';
import { DataContext } from '../app/store'


export default function Home() {
  // const [chats, updateChats] = useState(conversations);
  const darkmode = new Darkmode()
  darkmode.toggle()
  darkmode.attach()
  const [files, setFiles] = useState<File[]>();

    const dataCtx =React.useContext(DataContext)
    const { setData, data } = dataCtx;
    console.log({files})
    // Initialize once (at the start of your app).
    const uploader = Uploader({
        apiKey: "free" // Get production API keys from Upload.io
    });

    // Configuration options: https://upload.io/uploader#customize
    const options = { multi: true };

    const onCompleteSuccess = (files: any) => {
        if (files.length) {
            const filesObject: File[] = [];
            const reader = new FileReader();

            files.map((file : any) => {
                const fileExt = file.originalFile.mime.split('/')[1];
                console.log('File extension is '+fileExt);
                filesObject.push(file.originalFile.file);
                reader.readAsText(file.originalFile.file);
            })
            reader.onload = function(event : any) {
                const text = event.target.result;
                const lines = text.split('\n');
                setData(lines);
              };
            setFiles(filesObject);
        }
    }

  return (
    <div>
      <div className="container text-center landing-hero">
      <h1>
        Demonstrate your experiments with a suitable layout for your audience
      </h1>
      <p style={{ margin: '10px 0' }}>
        Create, customize and share your experiments with an easy-to-use and
        interactive interface
      </p>
      <Link className="button" to="/templates">
        Get started
      </Link>
      <span style={{marginLeft: '10px'}}>
        <Link className="button" to="/logplayback">
          Log Playback
        </Link>
      </span>
      <div className="divider" />
      <ChatWindow
        title="DemoBot"
        session_id={generateID()}
        // chats={chats}
        // updateChats={updateChats}
        width={"60%"}
        height={350}
      />
    </div>
  </div> 
  );
}
