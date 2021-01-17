import React, { useRef } from 'react'
import styled from 'styled-components'

import { initializeVideo } from '../game/Video'
import { useAsync } from '../util/hooks';


const VideoBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: none;
`

export default function VideoController() {
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