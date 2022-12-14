import React from 'react'

import GameScreen from './views/GameScreen'
import VideoController from './views/VideoController'
import {useAsyncFinish} from './util/hooks'
import {gameInit} from './game/GameLogic'
import ButtonBar from "./dialogs/ButtonBar"

import './App.scss'

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


