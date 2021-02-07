import React, { useState } from 'react'
import styled from 'styled-components'
import { ErrorBoundary } from 'react-error-boundary'

import TextView from './TextView'
import PartyView from './PartyView'
import PlayerView from './PlayerView'
import LocationView from './LocationView'
import Fonts from './Fonts'
import { useFullscreen, useOrbitcontrols, useOverlayImage, useOverlayText } from '../game/GameLogic'

import mainImg from '../assets/images/main.png'

function ErrorComponent() {
  return <></>
}

const GamescreenBox = styled.div`
  width: 640px;
  height: 400px;
`
const BackgroundImgBox = styled.div`
  width: 640px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
`
const FullscreenBox = styled.div`
  background-color: black;
  width: 640px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
`
const PlayerViewBox = styled.div`
  background-color: black;
  width: 222px;
  height: 176px;
  position: absolute;
  left: 34px;
  top: 30px;
  cursor: crosshair;
`
const ImageOverlayBox = styled.div`
  background-color: transparent;
  width: 222px;
  height: 176px;
  position: absolute;
  left: 34px;
  top: 30px;
`
const TextOverlayBox = styled(PlayerViewBox)`
  background-color: transparent;
  font-family: arial;
  font-size: 10px;
  color: white;
`
const LocationViewBox = styled.div`
  background-color: black;
  width: 222px;
  height: 24px;
  position: absolute;
  left: 34px;
  top: 206px;
`
const TextViewBox = styled.div`
  background-color: white;
  width: 264px;
  height: 198px;
  position: absolute;
  left: 340px;
  top: 30px;
}}
`
const FullscreenTextViewBox = styled.div`
  // background-color: rgb(1,1,1,0.2);
  background-color: transparent;
  color: white;
  width: 264px;
  height: 198px;
  position: absolute;
  left: 340px;
  top: 30px;
}}
`
const PartyViewBox = styled.div`
  background-color: transparent;
  color: transparent;
  width: 596px;
  height: 120px;
  position: absolute;
  left: 22px;
  top: 262px;
}}
`
function Conditional({ render, children, otherwise }) {
  if (render) {
    return children
  }
  return otherwise
}

function LoadScreen() {
  return <div>Loading Skara Brae...</div>
}


function OverlayTextView() {
  const overlayText = useOverlayText()
  return <>{overlayText}</>
}

function OverlayImageView() {
  const overlayImageUrl = useOverlayImage()
  if (overlayImageUrl) return <img src={overlayImageUrl} width="100%" height="100%" alt="" style={{ imageRendering: "crisp-edges" }} />
  return <></>
}

export default function GameScreen() {
  const [loaded, setIsLoaded] = useState(false)
  const fullscreen = useFullscreen()

  if (fullscreen) {
    return (
      <GamescreenBox id='gamescreen'>
        <Fonts />
        <FullscreenBox>
          <PlayerView />
        </FullscreenBox>
        <FullscreenTextViewBox id='textview'>
          <TextView />
        </FullscreenTextViewBox>
      </GamescreenBox>
    )
  }

  return (
    <GamescreenBox id='gamescreen'>
      <Fonts />

      <BackgroundImgBox>
        <img
          src={mainImg}
          style={{ width: 640, height: 400, imageRendering: "crisp-edges" }}
          alt='BT1 main screen'
          // style={loaded ? {} : { display: 'none' }}
          onLoad={() => setIsLoaded(true)}
        />
      </BackgroundImgBox>

      <Conditional render={loaded} otherwise={<LoadScreen />}>
        <PlayerViewBox id='3dview'>
          <ErrorBoundary FallbackComponent={ErrorComponent}>
            <PlayerView />
          </ErrorBoundary>
        </PlayerViewBox>
        <TextOverlayBox id='3doverlay'><OverlayTextView /></TextOverlayBox>
        <ImageOverlayBox><OverlayImageView /></ImageOverlayBox>

        <LocationViewBox id='locationview'>
          <LocationView />
        </LocationViewBox>

        <TextViewBox id='textview'>
          <TextView />
        </TextViewBox>

        <PartyViewBox>
          <PartyView />
        </PartyViewBox>
      </Conditional>
    </GamescreenBox>
  )
}
