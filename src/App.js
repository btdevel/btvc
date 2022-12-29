import React, {useEffect, useState} from 'react'

import GameScreen from './views/GameScreen'
import VideoController from './views/VideoController'
import {useAsyncFinish} from './util/hooks'
import {gameInit} from './game/GameLogic'
import ButtonBar from "./dialogs/ButtonBar"

import './App.scss'
import styled, {createGlobalStyle} from 'styled-components'

import titleImg from './assets/images/title.png'
import {invokeOnGesture} from './util/event'

const MediaScale = createGlobalStyle`
  {
    :root { --game-scale-default: 0.5; }
  }
  @media screen and (min-width:480px) {
    :root { --game-scale-default: 0.75; }
  }
  @media screen and (min-width:640px) {
    :root { --game-scale-default: 1.0; }
  }
  @media screen and (min-width:960px) {
    :root { --game-scale-default: 1.5; }
  }
  @media screen and (min-width:1280px) {
    :root { --game-scale-default: 2.0; }
  }
`
const ScaledDiv = styled.div`
  --game-scale: ${props => props.scale ? props.scale : "var(--game-scale-default)"};
  --game-scale-percent: calc(var(--game-scale) * 100%);
  --game-shift-percent: calc(-50% * (var(--game-scale) - 1.0));
  transform:  translate(-50%, -50%) scale(var(--game-scale)) translate(50%, 50%) ;
`

function HidableDiv({show, children}) {
  const vis =  show ? "visible" : "hidden"
  return (<div style={{visibility: vis}}>{children}</div>)
}
const BackgroundImageBox = styled.div`
  width: 640px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
`


export default function App() {
  const finished = useAsyncFinish(gameInit)

  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{
    setTimeout(()=>setLoaded(true), 4000)
    invokeOnGesture(() => setLoaded(true))
  }, [])

  if (!finished) return <div>Loading...</div>
  const scale = 0; // currently set to automatic

  return (
    <ScaledDiv scale={scale}>
      <HidableDiv show={!loaded}>
        <BackgroundImageBox id='background-image'>
          <img
            src={titleImg}
            style={{width: 640, height: 400, imageRendering: "pixelated"}}
            alt='BT1 main screen'
          />
        </BackgroundImageBox>

      </HidableDiv>
      <HidableDiv show={loaded}>
        <MediaScale/>
        <GameScreen/>
        <VideoController/>
        {loaded && <ButtonBar initialShow={"help"}/>}
      </HidableDiv>
    </ScaledDiv>
  );
}


