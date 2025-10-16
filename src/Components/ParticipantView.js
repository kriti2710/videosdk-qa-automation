import { useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";

function ParticipantView(props) {
  const micRef = useRef(null);
  const {micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <VideoPlayer
          participantId={props.participantId} // Required
          type="video"
          containerStyle={{
            height: "300px",
            width: "300px",
          }}
          className="h-full"
          classNameVideo="h-full"
          videoStyle={{}}
        />
      )}
    </div>
  );
}

export default ParticipantView;