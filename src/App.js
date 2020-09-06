import React, { useState, useEffect } from 'react'
import GameScreen from './pages/GameScreen'
import { gameState } from './game/GameLogic'
import configfile from './game_config.yaml'

let startHour = 12
// let startX = 25 // Guild
// let startY = 15
// let startDir = 0

// let startX = 25 // Guild (better)
// let startY = 14
// let startDir = 3

// let startX = 2 // City gate
// let startY = 14
// let startDir = 1

// let startX = 3
// let startY = 14
// let startDir = 0

let startX = 19 // South
let startY = 25
let startDir = 1

gameState.init(startHour, startX, startY, startDir)
// gameState.pause()
// gameState.showMap()
gameState.toggleFullscreen()

async function init(configfile, finished) {
  console.log('config', configfile);
  const response = await fetch(configfile)
  const body = await response.text()
  console.log(body);


  let startHour = 12
  // let startX = 25 // Guild
  // let startY = 15
  // let startDir = 0
  
  // let startX = 25 // Guild (better)
  // let startY = 14
  // let startDir = 3
  
  // let startX = 2 // City gate
  // let startY = 14
  // let startDir = 1
  
  // let startX = 3
  // let startY = 14
  // let startDir = 0
  
  let startX = 19 // South
  let startY = 25
  let startDir = 1
  
  gameState.init(startHour, startX, startY, startDir)
  // gameState.pause()
  // gameState.showMap()
  gameState.toggleFullscreen()
  finished()
}

export default function App () {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { 
    init(configfile, () => setLoaded(true))
  }, [setLoaded])

  if (!loaded) return <div>Loading...</div>

  return (
    <GameScreen />
  )
}
