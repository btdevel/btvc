import React from 'react'
import GameScreen from './pages/GameScreen'
import VideoController from './pages/VideoController'
import { useAsyncFinish } from './util/hooks'
import { init } from './game/GameConfig'
import configfile from './game_config.yaml'


export default function App () {
  const loaded = useAsyncFinish(init, [configfile])

  if (!loaded) return <div>Loading...</div>

  return (
    <>
      <GameScreen />
      <VideoController />
    </>
  )
}
