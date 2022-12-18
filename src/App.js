import React from 'react'

import GameScreen from './views/GameScreen'
import VideoController from './views/VideoController'
import {useAsyncFinish} from './util/hooks'
import {gameInit} from './game/GameLogic'
import ButtonBar from "./dialogs/ButtonBar"

import './assets/styles/inline-font-c64.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/bootstrap-custom.css'

export default function App() {
  const finished = useAsyncFinish(gameInit)
  if (!finished) return <div>Loading...</div>

  return (
    <>
      <GameScreen/>
      <VideoController/>
      <ButtonBar initialShow={"settings"}/>
    </>
  );
}


