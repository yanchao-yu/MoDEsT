import * as React from 'react';
import Webcam from "react-webcam";

export default function WebCamera({ deviceId }: {deviceId: string}) {
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();},
        [webcamRef]
    );

    return (
        <div>
            <Webcam
                audio={false}
                height={360}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                videoConstraints={{deviceId: deviceId}}
            />
            <button onClick={capture}>Capture photo</button>
        </div>
    );
}