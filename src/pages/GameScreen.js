import React from 'react'
import { Canvas } from 'react-three-fiber'
import { ErrorBoundary } from 'react-error-boundary'
import Scene from '../3d/Scene'
import mainImg from '../assets/images/main.png'
import TextView from './TextView'
import PartyView from './PartyView'
import LocationView from './LocationView'
import Fonts from './Fonts'
import styled from 'styled-components'

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

export default function GameScreen () {
  return (
    <GamescreenBox id='gamescreen'>
      <Fonts />

      <BackgroundImgBox>
        <img
          src={mainImg}
          style={{ width: 640, height: 400 }}
          alt='BT1 main screen'
        />
      </BackgroundImgBox>

      <PlayerViewBox id='3dview'>
        <ErrorBoundary FallbackComponent={ErrorComponent}>
          <Canvas>
            <Scene />
          </Canvas>
        </ErrorBoundary>
      </PlayerViewBox>

      <LocationViewBox id='locationview'>
        <LocationView />
      </LocationViewBox>

      <TextViewBox id='textview'>
        <TextView />
      </TextViewBox>

      <PartyViewBox>
        <PartyView />
      </PartyViewBox>
    </GamescreenBox>
  )
}
