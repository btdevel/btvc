import React from 'react'
import GameScreen from './pages/GameScreen'
import VideoController from './pages/VideoController'
import { useAsync } from './util/hooks'
import configFile from './game_config.yaml'
import { loadConfig } from './game/GameConfig'
import { gameState } from './game/GameLogic'
import { initVideo } from './game/Video'


export default function App () {
  const [config, loading, error] = useAsync(loadConfig, [configFile])
  if (loading) return <div>Loading...</div>

  gameState.init(config)
  initVideo(config)

  return (
    <>
      <GameScreen />
      <VideoController />
    </>
  )
}
