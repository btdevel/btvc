import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'

import {useVideoConfig} from "../game/GameLogic"
import {setVideoElementRef, startVideoClient, stopVideoClient} from '../game/Video'
import noise from "../assets/videos/noise.mp4"
import {invokeOnGesture} from "../util/event";

const VideoBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: none;
`

export default function VideoController() {
  const videoContainerRef = useRef()
  const noiseVideoRef = useRef()
  const videoConfig = useVideoConfig()

  useEffect(() => {
    setVideoElementRef(videoContainerRef)
    return () => {setVideoElementRef(null)}
  }, [videoContainerRef])

  useEffect(() => {
    if( videoConfig.enabled ) {
      console.log('Starting video client with config: ', videoConfig)
      startVideoClient(videoConfig)
      return () => {
        console.log('Stopping video client.')
        stopVideoClient()
      }
    }
  }, [videoConfig])

  useEffect(()=> {
    // Chrome e.g. won't autoplay a hidden video otherwise
    return invokeOnGesture(() => noiseVideoRef.current?.play())
  }, [noiseVideoRef])

  return (
    <>
      <VideoBox ref={videoContainerRef} id="videobox"/>
      <VideoBox id='noisebox'>
        <video id="video" ref={noiseVideoRef} loop playsInline autoPlay muted controls>
          <source src={noise} type='video/mp4;'/>
        </video>
      </VideoBox>
    </>
  )
}