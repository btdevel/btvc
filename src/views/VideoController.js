import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'

import {useVideoConfig} from "../game/GameLogic"
import {setVideoElementRef, startVideoClient, stopVideoClient} from '../game/Video'
import noise from "../assets/videos/noise.mp4"

const VideoBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: none;
`

export default function VideoController() {
  const videoContainerRef = useRef()
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

  return (
    <>
      <VideoBox ref={videoContainerRef} id="videobox"/>
      <VideoBox id='noisebox'>
        <video id="video" loop playsInline autoPlay>
          <source src={noise} type='video/mp4;'/>
        </video>
      </VideoBox>
    </>
  )
}