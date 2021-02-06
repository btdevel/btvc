import React from 'react'
import GameScreen from './pages/GameScreen'
import VideoController from './pages/VideoController'
import { useAsyncFinish } from './util/hooks'
import { gameInit } from './game/GameLogic'

export default function App () {
  const finished = useAsyncFinish(gameInit)
  if (!finished) return <div>Loading...</div>


  return (
    <>
      <GameScreen />
      <VideoController />
    </>
  )
}
