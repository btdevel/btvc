import React, { useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { ErrorBoundary } from 'react-error-boundary'
import Scene from '../3d/Scene'
import mainImg from '../assets/images/main.png'
import TextView from './TextView'
import PartyView from './PartyView'
import LocationView from './LocationView'
import Fonts from './Fonts'
import styled from 'styled-components'
import { OrbitControls } from 'drei'
import { useStore } from '../game/GameLogic'
import { onKeyEvent } from '../game/KeyMap'

function ErrorComponent () {
  return <></>
}

const GamescreenBox = styled.div`
  width: 640px;
  height: 480px;
`
const BackgroundImgBox = styled.div`
  width: 640px;
  height: 480px;
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
function Conditional ({ render, children, otherwise }) {
  if (render) {
    return children
  }
  return otherwise
}

function LoadScreen () {
  return <div>Loading Skara Brae...</div>
}

document.addEventListener('keydown', onKeyEvent, false)

export default function GameScreen () {
  const [loaded, setIsLoaded] = useState(false)
  const overlayText = useStore(state => state.overlayText)

  if (1 === -1) {
    return (
      <GamescreenBox id='gamescreen'>
        <Canvas>
          <Scene />
          <OrbitControls />
        </Canvas>
      </GamescreenBox>
    )
  }

  return (
    <GamescreenBox id='gamescreen'>
      <Fonts />

      <BackgroundImgBox>
        <img
          src={mainImg}
          style={{ width: 640, height: 400 }}
          alt='BT1 main screen'
          style={loaded ? {} : { display: 'none' }}
          onLoad={() => setIsLoaded(true)}
        />
      </BackgroundImgBox>

      <Conditional render={loaded} otherwise={<LoadScreen />}>
        <PlayerViewBox id='3dview'>
          <ErrorBoundary FallbackComponent={ErrorComponent}>
            <Canvas>
              <Scene />
            </Canvas>
          </ErrorBoundary>
        </PlayerViewBox>
        <TextOverlayBox id='3doverlay'>{overlayText}</TextOverlayBox>

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
