import React, { useRef } from 'react'
import styled from 'styled-components'

import AgoraRTC from "agora-rtc-sdk-ng";
import { useAsync } from '../util/hooks';
import { addTrack } from '../game/GameLogic'

async function initializeVideo(ref) {
    if (!ref.current) return

    console.log("Initializing Video ")
    const client = await AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    const appId = "73c22632975c4133b8de33f67f89b84b"
    await client.join(appId, "test", "00673c22632975c4133b8de33f67f89b84bIADn8Pqf+jjUjqwZgF05z9f+b3GF9Ow7esJaJvNEykmADQx+f9gAAAAAEACpE93IoXQEYAEAAQChdARg")

    const microTrack = await AgoraRTC.createMicrophoneAudioTrack()
    const videoTrack = await AgoraRTC.createCameraVideoTrack()

    const trackContainer = document.createElement('div')
    ref.current.appendChild(trackContainer)
    trackContainer.id = "foobar"
    trackContainer.style.width = "320px";
    trackContainer.style.height = "240px";
    trackContainer.style.background = "#777777"
    videoTrack.play(trackContainer)

    const videoElement = trackContainer.getElementsByClassName('agora_video_player')[0]
    console.log('PlayInDiv: Playing in video element: ', videoElement)

    addTrack([videoElement, videoTrack, microTrack])
    console.log("Initializing Video finished")
    return "Yeah!!"
}

const VideoBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: none;
`

export default function VideoController() {
    // AgoraRTC.setLogLevel(2)

    const videoContainerRef = useRef()
    const [result, loading, error] = useAsync(initializeVideo, [videoContainerRef])


    return (
        <>
            <div>
                {`${loading ? "Loading..." : "Loaded: "} result: ${result} error: ${error}`}
            </div>
            <VideoBox ref={videoContainerRef} id="videobox" />
        </>
    )
}