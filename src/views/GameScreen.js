import React, {useRef} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import styled from 'styled-components'

import TextView from './TextView'
import PartyRoasterView from './PartyRoasterView'
import PartyView from './PartyView'
import LocationTextView from './LocationTextView'
import GameControls from '../controls/GameControls'
import {useFullscreen, useOverlayImage, useOverlayText} from '../game/GameLogic'

import mainImg from '../assets/images/main.png'

function ErrorComponent() {
  return <></>
}

const GameScreenBox = styled.div`
  width: 640px;
  height: 400px;
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
  width: var(--game-scale-percent);
  height: var(--game-scale-percent);
  left: var(--game-shift-percent);
  top:  var(--game-shift-percent);
  position: absolute;
  cursor: all-scroll;
  transform: scale(calc(1.0/var(--game-scale)));
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
  const fullscreen = useFullscreen()
  const gameScreenRef = useRef()
  const partyViewRef = useRef()

  if (fullscreen) {
    return (
      <GameScreenBox id='game-screen' ref={gameScreenRef}>
        <FullscreenBox ref={partyViewRef}>
          <PartyViewBox id='3d-view'>
            <ErrorBoundary FallbackComponent={ErrorComponent}>
              <PartyView id='party-view' />
            </ErrorBoundary>
          </PartyViewBox>
          <FullscreenTextViewBox id='text-view'>
            <TextView/>
          </FullscreenTextViewBox>
        </FullscreenBox>
        <GameControls screenRef={gameScreenRef} partyViewRef={partyViewRef}/>
      </GameScreenBox>
    )
  }

  return (
    <GameScreenBox id='game-screen' ref={gameScreenRef}>

      <BackgroundImageBox id='background-image'>
        <img
          src={mainImg}
          style={{width: 640, height: 400, imageRendering: "pixelated"}}
          alt='BT1 main screen'
        />
      </BackgroundImageBox>

      <PartyViewGroupBox id='party-view' ref={partyViewRef}>
        <PartyViewBox id='3d-view' >
          <ErrorBoundary FallbackComponent={ErrorComponent}>
            <PartyView id='party-view'/>
          </ErrorBoundary>
        </PartyViewBox>
        <ImageOverlayBox id='3d-image-overlay'>
          <OverlayImageView/>
        </ImageOverlayBox>
        <TextOverlayBox id='3d-text-overlay'>
          <OverlayTextView/>
        </TextOverlayBox>
      </PartyViewGroupBox>

      <LocationTextBox id='location-view'>
        <LocationTextView/>
      </LocationTextBox>

      <TextViewBox id='text-view'>
        <TextView/>
      </TextViewBox>

      <PartyRoasterBox id='party-roaster'>
        <PartyRoasterView/>
      </PartyRoasterBox>

      <GameControls screenRef={gameScreenRef} partyViewRef={partyViewRef}/>
    </GameScreenBox>
  )
}
