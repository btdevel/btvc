import React, {useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import styled from 'styled-components'

import Fonts from './Fonts'
import TextView from './TextView'
import PartyRoasterView from './PartyRoasterView'
import PartyView from './PartyView'
import LocationTextView from './LocationTextView'
import {useFullscreen, useOverlayImage, useOverlayText} from '../game/GameLogic'

import mainImg from '../assets/images/main.png'

function ErrorComponent() {
  return <></>
}

const GameScreenBox = styled.div`
  width: 640px;
  height: 400px;
  // The following does not work with the threejs camera (displaces it; we'd need a correction for that too...)
  //transform: translate(-50%, -50%) scale(2) translate(50%, 50%) ;  
`
const BackgroundImageBox = styled.div`
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
const PartyViewGroupBox = styled.div`
  background-color: black;
  width: 222px;
  height: 176px;
  position: absolute;
  left: 34px;
  top: 30px;
`
const PartyViewBox = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: all-scroll;
`
const ImageOverlayBox = styled(PartyViewBox)`
  background-color: transparent;
`
const TextOverlayBox = styled(ImageOverlayBox)`
  font-family: arial;
  font-size: 10px;
  color: white;
`
const LocationTextBox = styled.div`
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
`
const FullscreenTextViewBox = styled.div`
  background-color: transparent;
  color: white;
  width: 264px;
  height: 198px;
  position: absolute;
  left: 340px;
  top: 30px;
`
const PartyRoasterBox = styled.div`
  background-color: transparent;
  color: transparent;
  width: 596px;
  height: 120px;
  position: absolute;
  left: 22px;
  top: 262px;
`

function Conditional({render, children, otherwise}) {
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
  if (overlayImageUrl) return <img src={overlayImageUrl} width="100%" height="100%" alt=""
                                   style={{imageRendering: "crisp-edges"}}/>
  return <></>
}

export default function GameScreen() {
  const [loaded, setIsLoaded] = useState(false)
  const fullscreen = useFullscreen()

  if (fullscreen) {
    return (
      <GameScreenBox id='game-screen'>
        <Fonts/>
        <FullscreenBox>
          <PartyView id='party-view'/>
        </FullscreenBox>
        <FullscreenTextViewBox id='text-view'>
          <TextView/>
        </FullscreenTextViewBox>
      </GameScreenBox>
    )
  }

  return (
    <GameScreenBox id='game-screen'>
      <Fonts/>

      <BackgroundImageBox id='background-image'>
        <img
          src={mainImg}
          style={{width: 640, height: 400, imageRendering: "crisp-edges"}}
          alt='BT1 main screen'
          // style={loaded ? {} : { display: 'none' }}
          onLoad={() => setIsLoaded(true)}
        />
      </BackgroundImageBox>

      <Conditional render={loaded} otherwise={<LoadScreen/>}>
        <div id='party-view'>
          <PartyViewBox id='3d-view'>
            <ErrorBoundary FallbackComponent={ErrorComponent}>
              <PartyView/>
            </ErrorBoundary>
          </PartyViewBox>
          <ImageOverlayBox id='3d-image-overlay'>
            <OverlayImageView/>
          </ImageOverlayBox>
          <TextOverlayBox id='3d-text-overlay'>
            <OverlayTextView/>
          </TextOverlayBox>
        </div>

        <LocationTextBox id='location-view'>
          <LocationTextView/>
        </LocationTextBox>

        <TextViewBox id='text-view'>
          <TextView/>
        </TextViewBox>

        <PartyRoasterBox id='party-roaster'>
          <PartyRoasterView/>
        </PartyRoasterBox>
      </Conditional>
    </GameScreenBox>
  )
}
